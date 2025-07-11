import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { SecretsManager } from "aws-sdk"
import { Pool } from "pg"
import Redis from "ioredis"

// データベース接続プール
let dbPool: Pool
let redisClient: Redis

const secretsManager = new SecretsManager()

async function getDbConnection() {
  if (!dbPool) {
    const secret = await secretsManager
      .getSecretValue({
        SecretId: process.env.DATABASE_SECRET_ARN!,
      })
      .promise()

    const dbCredentials = JSON.parse(secret.SecretString!)

    dbPool = new Pool({
      host: process.env.DATABASE_HOST,
      port: 5432,
      database: "spoonapp",
      user: dbCredentials.username,
      password: dbCredentials.password,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    })
  }
  return dbPool
}

async function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis({
      host: process.env.REDIS_ENDPOINT,
      port: 6379,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    })
  }
  return redisClient
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  }

  try {
    const { httpMethod, path, pathParameters, queryStringParameters, body } = event
    const db = await getDbConnection()
    const redis = await getRedisClient()

    // ルーティング
    const route = `${httpMethod} ${path}`

    switch (route) {
      case "POST /v1/auth/login":
        return await handleLogin(JSON.parse(body || "{}"), db, redis)

      case "GET /v1/users/profile":
        return await handleGetProfile(event, db, redis)

      case "PUT /v1/users/profile":
        return await handleUpdateProfile(event, JSON.parse(body || "{}"), db)

      case "GET /v1/gallery":
        return await handleGetGallery(queryStringParameters, db)

      case "POST /v1/gallery":
        return await handleUploadContent(event, db)

      case "GET /v1/gallery/{id}":
        return await handleGetGalleryItem(pathParameters?.id!, db)

      case "PUT /v1/gallery/{id}":
        return await handleUpdateGalleryItem(pathParameters?.id!, JSON.parse(body || "{}"), db)

      case "DELETE /v1/gallery/{id}":
        return await handleDeleteGalleryItem(pathParameters?.id!, db)

      case "GET /v1/stream-results":
        return await handleGetStreamResults(queryStringParameters, db)

      case "POST /v1/stream-results":
        return await handleCreateStreamResult(JSON.parse(body || "{}"), db)

      case "GET /v1/events":
        return await handleGetEvents(db)

      case "POST /v1/events":
        return await handleCreateEvent(JSON.parse(body || "{}"), db)

      case "GET /v1/analytics/stats":
        return await handleGetAnalytics(queryStringParameters, db, redis)

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
async function handleLogin(body: any, db: Pool, redis: Redis): Promise<APIGatewayProxyResult> {
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

  // JWTトークン生成（実際の実装では適切なライブラリを使用）
  const token = "mock-jwt-token"

  // Redisにセッション保存
  await redis.setex(`session:${token}`, 3600, JSON.stringify(mockUser))

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      success: true,
      token,
      user: mockUser,
      expiresIn: 3600,
    }),
  }
}

// プロフィール取得
async function handleGetProfile(event: APIGatewayProxyEvent, db: Pool, redis: Redis): Promise<APIGatewayProxyResult> {
  const token = event.headers.Authorization?.replace("Bearer ", "")
  if (!token) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Unauthorized", message: "Token required" }),
    }
  }

  // Redisからセッション取得
  const sessionData = await redis.get(`session:${token}`)
  if (!sessionData) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Unauthorized", message: "Invalid token" }),
    }
  }

  const user = JSON.parse(sessionData)

  // データベースから最新のユーザー情報を取得
  const result = await db.query("SELECT * FROM users WHERE id = $1", [user.id])

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result.rows[0]),
  }
}

// ギャラリー一覧取得
async function handleGetGallery(queryParams: any, db: Pool): Promise<APIGatewayProxyResult> {
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

  const result = await db.query(`SELECT * FROM gallery_contents ORDER BY ${orderBy} LIMIT $1 OFFSET $2`, [
    limit,
    offset,
  ])

  const countResult = await db.query("SELECT COUNT(*) FROM gallery_contents")
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

// その他のハンドラー関数も同様に実装...
async function handleUpdateProfile(event: APIGatewayProxyEvent, body: any, db: Pool): Promise<APIGatewayProxyResult> {
  // 実装省略
  return { statusCode: 200, headers: {}, body: JSON.stringify({ success: true }) }
}

async function handleUploadContent(event: APIGatewayProxyEvent, db: Pool): Promise<APIGatewayProxyResult> {
  // 実装省略
  return { statusCode: 201, headers: {}, body: JSON.stringify({ success: true }) }
}

async function handleGetGalleryItem(id: string, db: Pool): Promise<APIGatewayProxyResult> {
  // 実装省略
  return { statusCode: 200, headers: {}, body: JSON.stringify({ id }) }
}

async function handleUpdateGalleryItem(id: string, body: any, db: Pool): Promise<APIGatewayProxyResult> {
  // 実装省略
  return { statusCode: 200, headers: {}, body: JSON.stringify({ success: true }) }
}

async function handleDeleteGalleryItem(id: string, db: Pool): Promise<APIGatewayProxyResult> {
  // 実装省略
  return { statusCode: 204, headers: {}, body: "" }
}

async function handleGetStreamResults(queryParams: any, db: Pool): Promise<APIGatewayProxyResult> {
  // 実装省略
  return { statusCode: 200, headers: {}, body: JSON.stringify({ items: [] }) }
}

async function handleCreateStreamResult(body: any, db: Pool): Promise<APIGatewayProxyResult> {
  // 実装省略
  return { statusCode: 201, headers: {}, body: JSON.stringify({ success: true }) }
}

async function handleGetEvents(db: Pool): Promise<APIGatewayProxyResult> {
  // 実装省略
  return { statusCode: 200, headers: {}, body: JSON.stringify({ items: [] }) }
}

async function handleCreateEvent(body: any, db: Pool): Promise<APIGatewayProxyResult> {
  // 実装省略
  return { statusCode: 201, headers: {}, body: JSON.stringify({ success: true }) }
}

async function handleGetAnalytics(queryParams: any, db: Pool, redis: Redis): Promise<APIGatewayProxyResult> {
  // 実装省略
  return { statusCode: 200, headers: {}, body: JSON.stringify({ stats: {} }) }
}
