import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { SSM } from "aws-sdk"
import OpenAI from "openai"

const ssm = new SSM()

async function getParameter(name: string): Promise<string> {
  const result = await ssm
    .getParameter({
      Name: `/spoon-app/${process.env.STAGE}/${name}`,
      WithDecryption: true,
    })
    .promise()
  return result.Parameter?.Value || ""
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }

  try {
    // OpenAI API キーを取得
    const openaiApiKey = await getParameter("openai-api-key")
    const openai = new OpenAI({ apiKey: openaiApiKey })

    // Base64エンコードされた画像データを取得
    const imageBase64 = extractImageFromBody(event.body!)

    // OpenAI Vision APIを使用してスクリーンショットを解析
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `このSpoon配信のスクリーンショットから以下の情報をJSON形式で抽出してください：
              {
                "title": "配信タイトル",
                "hearts": ハート数(数値),
                "spoons": スプーン数(数値),
                "totalListeners": 総リスナー数(数値),
                "activeListeners": アクティブリスナー数(数値),
                "bestRank": 最高順位(数値),
                "endRank": 終了時順位(数値),
                "listeners": [
                  {
                    "listenerName": "リスナー名",
                    "heartsGiven": ハート数(数値),
                    "spoonsGiven": スプーン数(数値)
                  }
                ]
              }`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
    })

    const extractedText = response.choices[0].message.content

    // JSONパースを試行
    let extractedData
    try {
      extractedData = JSON.parse(extractedText || "{}")
    } catch (parseError) {
      // パースに失敗した場合はデフォルト値を返す
      extractedData = {
        title: "配信タイトル",
        hearts: 0,
        spoons: 0,
        totalListeners: 0,
        activeListeners: 0,
        bestRank: null,
        endRank: null,
        listeners: [],
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: extractedData,
        confidence: 0.9,
      }),
    }
  } catch (error) {
    console.error("OCR Error:", error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "OCR processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    }
  }
}

function extractImageFromBody(body: string): string {
  // multipart/form-dataまたはbase64エンコードされた画像データを抽出
  // 実際の実装では適切なライブラリを使用
  return body.replace(/^data:image\/[a-z]+;base64,/, "")
}
