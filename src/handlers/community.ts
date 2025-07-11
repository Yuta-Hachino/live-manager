import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Pool } from "pg"
import { SSM, EventBridge } from "aws-sdk"

const ssm = new SSM()
const eventBridge = new EventBridge()
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

async function initializeDb() {
  if (!dbPool) {
    const databaseUrl = await getParameter("database-url")
    dbPool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    })
  }
}

// 投稿一覧取得
export const getPostsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await initializeDb()

    const page = Number.parseInt(event.queryStringParameters?.page || "1")
    const limit = Number.parseInt(event.queryStringParameters?.limit || "20")
    const offset = (page - 1) * limit

    const result = await dbPool.query(
      `
      SELECT 
        cp.*,
        u.name as user_name,
        u.avatar_url as user_avatar
      FROM community_posts cp
      JOIN users u ON cp.user_id = u.id
      ORDER BY cp.created_at DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset],
    )

    const countResult = await dbPool.query("SELECT COUNT(*) FROM community_posts")
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
  } catch (error) {
    console.error("Get posts error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get posts" }),
    }
  }
}

// 投稿作成
export const createPostHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await initializeDb()

    const { content, imageUrl } = JSON.parse(event.body || "{}")
    const userId = event.requestContext.authorizer?.userId

    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      }
    }

    const result = await dbPool.query(
      "INSERT INTO community_posts (user_id, content, image_url) VALUES ($1, $2, $3) RETURNING *",
      [userId, content, imageUrl],
    )

    // リアルタイム通知
    await eventBridge
      .putEvents({
        Entries: [
          {
            Source: "spoon.app",
            DetailType: "User Event",
            Detail: JSON.stringify({
              type: "community_post_created",
              userId,
              postId: result.rows[0].id,
              message: "新しいコミュニティ投稿が作成されました",
            }),
          },
        ],
      })
      .promise()

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.rows[0]),
    }
  } catch (error) {
    console.error("Create post error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create post" }),
    }
  }
}

// いいね機能
export const likePostHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await initializeDb()

    const postId = event.pathParameters?.id
    const userId = event.requestContext.authorizer?.userId

    if (!userId || !postId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters" }),
      }
    }

    // いいねの切り替え
    const existingLike = await dbPool.query("SELECT id FROM community_likes WHERE post_id = $1 AND user_id = $2", [
      postId,
      userId,
    ])

    if (existingLike.rows.length > 0) {
      // いいね削除
      await dbPool.query("DELETE FROM community_likes WHERE post_id = $1 AND user_id = $2", [postId, userId])
      await dbPool.query("UPDATE community_posts SET likes_count = likes_count - 1 WHERE id = $1", [postId])
    } else {
      // いいね追加
      await dbPool.query("INSERT INTO community_likes (post_id, user_id) VALUES ($1, $2)", [postId, userId])
      await dbPool.query("UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = $1", [postId])

      // 投稿者に通知
      const postResult = await dbPool.query("SELECT user_id FROM community_posts WHERE id = $1", [postId])
      if (postResult.rows.length > 0) {
        await dbPool.query("SELECT create_notification($1, $2, $3, $4, $5)", [
          postResult.rows[0].user_id,
          "投稿にいいね",
          "あなたの投稿に新しいいいねがつきました",
          "community",
          JSON.stringify({ postId, userId }),
        ])
      }
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true }),
    }
  } catch (error) {
    console.error("Like post error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to like post" }),
    }
  }
}

// コメント追加
export const addCommentHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await initializeDb()

    const postId = event.pathParameters?.id
    const { content } = JSON.parse(event.body || "{}")
    const userId = event.requestContext.authorizer?.userId

    if (!userId || !postId || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters" }),
      }
    }

    const result = await dbPool.query(
      "INSERT INTO community_comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      [postId, userId, content],
    )

    // コメント数を更新
    await dbPool.query("UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = $1", [postId])

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.rows[0]),
    }
  } catch (error) {
    console.error("Add comment error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to add comment" }),
    }
  }
}
