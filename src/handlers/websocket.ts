import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk"

const dynamodb = new DynamoDB.DocumentClient()
const CONNECTIONS_TABLE = `spoon-app-connections-${process.env.STAGE}`

export const connectHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId!
  const userId = event.queryStringParameters?.userId

  try {
    // 接続情報をDynamoDBに保存
    await dynamodb
      .put({
        TableName: CONNECTIONS_TABLE,
        Item: {
          connectionId,
          userId,
          connectedAt: new Date().toISOString(),
        },
      })
      .promise()

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Connected" }),
    }
  } catch (error) {
    console.error("Connection error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to connect" }),
    }
  }
}

export const disconnectHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId!

  try {
    // 接続情報をDynamoDBから削除
    await dynamodb
      .delete({
        TableName: CONNECTIONS_TABLE,
        Key: { connectionId },
      })
      .promise()

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Disconnected" }),
    }
  } catch (error) {
    console.error("Disconnection error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to disconnect" }),
    }
  }
}

export const defaultHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId!
  const body = JSON.parse(event.body || "{}")

  try {
    const apiGateway = new ApiGatewayManagementApi({
      endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
    })

    // エコーメッセージを送信
    await apiGateway
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify({
          type: "echo",
          message: body.message || "Hello from WebSocket!",
          timestamp: new Date().toISOString(),
        }),
      })
      .promise()

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message sent" }),
    }
  } catch (error) {
    console.error("Default handler error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send message" }),
    }
  }
}

// 全接続にブロードキャスト
export const broadcastMessage = async (message: any) => {
  try {
    const connections = await dynamodb
      .scan({
        TableName: CONNECTIONS_TABLE,
      })
      .promise()

    const apiGateway = new ApiGatewayManagementApi({
      endpoint: process.env.WEBSOCKET_ENDPOINT,
    })

    const promises = connections.Items?.map(async (connection) => {
      try {
        await apiGateway
          .postToConnection({
            ConnectionId: connection.connectionId,
            Data: JSON.stringify(message),
          })
          .promise()
      } catch (error) {
        // 接続が無効な場合は削除
        if (error.statusCode === 410) {
          await dynamodb
            .delete({
              TableName: CONNECTIONS_TABLE,
              Key: { connectionId: connection.connectionId },
            })
            .promise()
        }
      }
    })

    await Promise.all(promises || [])
  } catch (error) {
    console.error("Broadcast error:", error)
  }
}
