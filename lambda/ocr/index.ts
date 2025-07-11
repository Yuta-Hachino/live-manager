import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { SecretsManager } from "aws-sdk"
import OpenAI from "openai"

const secretsManager = new SecretsManager()

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }

  try {
    // OpenAI API キーを取得
    const secret = await secretsManager
      .getSecretValue({
        SecretId: process.env.OPENAI_API_KEY_SECRET_ARN!,
      })
      .promise()

    const openaiApiKey = JSON.parse(secret.SecretString!).apiKey
    const openai = new OpenAI({ apiKey: openaiApiKey })

    // マルチパートデータからファイルを抽出（実際の実装では適切なライブラリを使用）
    const imageBase64 = extractImageFromMultipart(event.body!)

    // OpenAI Vision APIを使用してスクリーンショットを解析
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `このSpoon配信のスクリーンショットから以下の情報を抽出してください：
              - 配信タイトル
              - ハート数
              - スプーン数
              - 総リスナー数
              - アクティブリスナー数
              - 最高順位
              - 終了時順位
              - リスナー一覧（名前、ハート数、スプーン数）
              
              JSON形式で返してください。`,
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
      max_tokens: 1000,
    })

    const extractedText = response.choices[0].message.content

    // JSONパースを試行
    let extractedData
    try {
      extractedData = JSON.parse(extractedText || "{}")
    } catch (parseError) {
      // パースに失敗した場合は、テキストから情報を抽出
      extractedData = parseStreamDataFromText(extractedText || "")
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: extractedData,
        confidence: 0.9, // 実際の実装では信頼度を計算
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

function extractImageFromMultipart(body: string): string {
  // 実際の実装では、multipart/form-dataを適切にパース
  // ここではサンプルとして空文字列を返す
  return ""
}

function parseStreamDataFromText(text: string): any {
  // テキストから配信データを抽出するロジック
  return {
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
