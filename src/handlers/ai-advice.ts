import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Pool } from "pg"
import { SSM, EventBridge } from "aws-sdk"
import OpenAI from "openai"

const ssm = new SSM()
const eventBridge = new EventBridge()

let openai: OpenAI
let dbPool: Pool

async function getParameter(name: string): Promise<string> {
  const result = await ssm
    .getParameter({
      Name: `/spoon-app/${process.env.STAGE}/${name}`,
      WithDecryption: true,
    })
    .promise()
  return result.Parameter?.Value || ""
}

async function initializeServices() {
  if (!openai) {
    const openaiApiKey = await getParameter("openai-api-key")
    openai = new OpenAI({ apiKey: openaiApiKey })
  }

  if (!dbPool) {
    const databaseUrl = await getParameter("database-url")
    dbPool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    })
  }
}

export const handler = async (event: any) => {
  try {
    await initializeServices()

    // 全ユーザーの配信データを取得
    const usersResult = await dbPool.query(`
      SELECT u.id, u.name, u.email,
             COUNT(sr.id) as stream_count,
             AVG(sr.hearts) as avg_hearts,
             AVG(sr.spoons) as avg_spoons,
             AVG(sr.total_listeners) as avg_listeners,
             MIN(sr.best_rank) as best_rank
      FROM users u
      LEFT JOIN stream_results sr ON u.id = sr.user_id
      WHERE sr.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY u.id, u.name, u.email
      HAVING COUNT(sr.id) > 0
    `)

    for (const user of usersResult.rows) {
      const advice = await generateAIAdvice(user)

      // アドバイスをデータベースに保存
      await dbPool.query(
        "INSERT INTO ai_advice (user_id, advice_text, advice_type, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)",
        [user.id, advice, "weekly_summary"],
      )

      // リアルタイム通知を送信
      await eventBridge
        .putEvents({
          Entries: [
            {
              Source: "spoon.app",
              DetailType: "User Event",
              Detail: JSON.stringify({
                type: "ai_advice_generated",
                userId: user.id,
                message: "新しいAI配信アドバイスが生成されました",
                advice: advice.substring(0, 100) + "...",
              }),
            },
          ],
        })
        .promise()
    }

    console.log(`Generated AI advice for ${usersResult.rows.length} users`)
  } catch (error) {
    console.error("AI advice generation error:", error)
  }
}

async function generateAIAdvice(userData: any): Promise<string> {
  const prompt = `
配信者データ分析:
- 配信回数: ${userData.stream_count}回/月
- 平均ハート数: ${Math.round(userData.avg_hearts)}
- 平均スプーン数: ${Math.round(userData.avg_spoons)}
- 平均リスナー数: ${Math.round(userData.avg_listeners)}
- 最高順位: ${userData.best_rank}位

このデータを基に、配信者の成長のための具体的で実践的なアドバイスを3つ提供してください。
各アドバイスは以下の形式で：
1. 改善点
2. 具体的な方法
3. 期待される効果

日本語で、親しみやすい口調で回答してください。
`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "あなたはSpoon配信の専門アドバイザーです。配信者の成長を支援する具体的で実践的なアドバイスを提供します。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    })

    return response.choices[0].message.content || "アドバイスの生成に失敗しました。"
  } catch (error) {
    console.error("OpenAI API error:", error)
    return "現在アドバイスを生成できません。しばらく後にお試しください。"
  }
}

// 手動でアドバイス生成を実行するAPI
export const generateAdviceHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await initializeServices()

    const { userId } = JSON.parse(event.body || "{}")

    // 特定ユーザーのデータを取得
    const userResult = await dbPool.query(
      `
      SELECT u.id, u.name, u.email,
             COUNT(sr.id) as stream_count,
             AVG(sr.hearts) as avg_hearts,
             AVG(sr.spoons) as avg_spoons,
             AVG(sr.total_listeners) as avg_listeners,
             MIN(sr.best_rank) as best_rank
      FROM users u
      LEFT JOIN stream_results sr ON u.id = sr.user_id
      WHERE u.id = $1 AND sr.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY u.id, u.name, u.email
    `,
      [userId],
    )

    if (userResult.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found or no recent stream data" }),
      }
    }

    const advice = await generateAIAdvice(userResult.rows[0])

    // アドバイスを保存
    await dbPool.query(
      "INSERT INTO ai_advice (user_id, advice_text, advice_type, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)",
      [userId, advice, "on_demand"],
    )

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        advice,
        generatedAt: new Date().toISOString(),
      }),
    }
  } catch (error) {
    console.error("Generate advice error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate advice" }),
    }
  }
}
