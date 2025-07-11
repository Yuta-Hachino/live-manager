import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Pool } from "pg"
import Redis from "ioredis"
import jwt from "jsonwebtoken"
import { SSM } from "aws-sdk"

const ssm = new SSM()
let dbPool: Pool
let redisClient: Redis

// 設定値をSSMから取得
async function getParameter(name: string): Promise<string> {
  const result = await ssm
    .getParameter({
      Name: `/spoon-app/${process.env.STAGE}/${name}`,
      WithDecryption: true,
    })
    .promise()
  return result.Parameter?.Value || ""
}

async function initializeConnections() {
  if (!dbPool) {
    const databaseUrl = await getParameter("database-url")
    dbPool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    })
  }

  if (!redisClient) {
    const redisUrl = await getParameter("redis-url")
    redisClient = new Redis(redisUrl)
  }
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  }

  try {
    await initializeConnections()

    const { httpMethod, path, pathParameters, queryStringParameters, body, headers: requestHeaders } = event

    // 認証チェック
    const token = requestHeaders.Authorization?.replace("Bearer ", "")
    let userId: string | null = null

    if (token && !path.includes("/auth/")) {
      try {
        const jwtSecret = await getParameter("jwt-secret")
        const decoded = jwt.verify(token, jwtSecret) as any
        userId = decoded.userId
      } catch (error) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: "Unauthorized", message: "Invalid token" }),
        }
      }
    }

    // ルーティング
    const route = `${httpMethod} ${path}`

    switch (route) {
      case "POST /auth/login":
        return await handleLogin(JSON.parse(body || "{}"))

      case "GET /users/profile":
        return await handleGetProfile(userId!)

      case "PUT /users/profile":
        return await handleUpdateProfile(userId!, JSON.parse(body || "{}"))

      case "GET /gallery":
        return await handleGetGallery(userId!, queryStringParameters)

      case "POST /gallery":
        return await handleUploadContent(userId!, body!)

      case "GET /stream-results":
        return await handleGetStreamResults(userId!, queryStringParameters)

      case "POST /stream-results":
        return await handleCreateStreamResult(userId!, JSON.parse(body || "{}"))

      case "GET /events":
        return await handleGetEvents(userId!)

      case "POST /events":
        return await handleCreateEvent(userId!, JSON.parse(body || "{}"))

      case "GET /analytics/stats":
        return await handleGetAnalytics(userId!, queryStringParameters)

      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: "Not Found", message: "Route not found" }),
        }
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    }
  }
}

// 認証処理
async function handleLogin(body: any): Promise<APIGatewayProxyResult> {
  const { email, password, provider, code } = body

  // OAuth認証またはメール/パスワード認証の処理
  // 実際の実装では、各プロバイダーのAPIを呼び出し

  const mockUser = {
    id: "1",
    email: "user@example.com",
    name: "Test User",
    planType: "free",
    status: "active",
  }

  // JWTトークン生成
  const jwtSecret = await getParameter("jwt-secret")
  const token = jwt.sign({ userId: mockUser.id }, jwtSecret, { expiresIn: "24h" })

  // Redisにセッション保存
  await redisClient.setex(`session:${token}`, 86400, JSON.stringify(mockUser))

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      success: true,
      token,
      user: mockUser,
      expiresIn: 86400,
    }),
  }
}

// プロフィール取得
async function handleGetProfile(userId: string): Promise<APIGatewayProxyResult> {
  const result = await dbPool.query("SELECT * FROM users WHERE id = $1", [userId])

  if (result.rows.length === 0) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "User not found" }),
    }
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result.rows[0]),
  }
}

// プロフィール更新
async function handleUpdateProfile(userId: string, body: any): Promise<APIGatewayProxyResult> {
  const { name, avatarUrl } = body

  const result = await dbPool.query(
    "UPDATE users SET name = $1, avatar_url = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
    [name, avatarUrl, userId],
  )

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result.rows[0]),
  }
}

// ギャラリー一覧取得
async function handleGetGallery(userId: string, queryParams: any): Promise<APIGatewayProxyResult> {
  const page = Number.parseInt(queryParams?.page || "1")
  const limit = Number.parseInt(queryParams?.limit || "20")
  const sort = queryParams?.sort || "date"
  const offset = (page - 1) * limit

  let orderBy = "created_at DESC"
  switch (sort) {
    case "title":
      orderBy = "title ASC"
      break
    case "views":
      orderBy = "view_count DESC"
      break
  }

  const result = await dbPool.query(
    `SELECT * FROM gallery_contents WHERE user_id = $1 ORDER BY ${orderBy} LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  )

  const countResult = await dbPool.query("SELECT COUNT(*) FROM gallery_contents WHERE user_id = $1", [userId])
  const total = Number.parseInt(countResult.rows[0].count)

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }),
  }
}

// その他のハンドラー関数（実装省略）
async function handleUploadContent(userId: string, body: string): Promise<APIGatewayProxyResult> {
  // ファイルアップロード処理
  return { statusCode: 201, headers: {}, body: JSON.stringify({ success: true }) }
}

async function handleGetStreamResults(userId: string, queryParams: any): Promise<APIGatewayProxyResult> {
  // 配信リザルト取得処理
  return { statusCode: 200, headers: {}, body: JSON.stringify({ items: [] }) }
}

async function handleCreateStreamResult(userId: string, body: any): Promise<APIGatewayProxyResult> {
  // 配信リザルト作成処理
  return { statusCode: 201, headers: {}, body: JSON.stringify({ success: true }) }
}

async function handleGetEvents(userId: string): Promise<APIGatewayProxyResult> {
  // イベント取得処理
  return { statusCode: 200, headers: {}, body: JSON.stringify({ items: [] }) }
}

async function handleCreateEvent(userId: string, body: any): Promise<APIGatewayProxyResult> {
  // イベント作成処理
  return { statusCode: 201, headers: {}, body: JSON.stringify({ success: true }) }
}

async function handleGetAnalytics(userId: string, queryParams: any): Promise<APIGatewayProxyResult> {
  // 統計データ取得処理
  return { statusCode: 200, headers: {}, body: JSON.stringify({ stats: {} }) }
}
