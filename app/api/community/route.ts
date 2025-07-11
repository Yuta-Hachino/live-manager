import { type NextRequest, NextResponse } from "next/server"

interface Post {
  id: string
  userId: string
  username: string
  avatarUrl: string
  content: string
  imageUrl?: string
  likes: number
  comments: number
  shares: number
  createdAt: string
  tags: string[]
}

interface Comment {
  id: string
  postId: string
  userId: string
  username: string
  avatarUrl: string
  content: string
  likes: number
  createdAt: string
}

// サンプル投稿データ
const samplePosts: Post[] = [
  {
    id: "1",
    userId: "user1",
    username: "配信者A",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    content: "今日の配信、たくさんの方に聞いていただけて嬉しかったです！明日も頑張ります✨",
    likes: 23,
    comments: 5,
    shares: 2,
    createdAt: "2025-01-08T10:30:00Z",
    tags: ["配信", "感謝"],
  },
  {
    id: "2",
    userId: "user2",
    username: "配信者B",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    content: "新しい歌を練習中です🎵 リクエストがあればコメントで教えてください！",
    imageUrl: "/placeholder.svg?height=200&width=300",
    likes: 45,
    comments: 12,
    shares: 8,
    createdAt: "2025-01-07T19:15:00Z",
    tags: ["歌枠", "リクエスト"],
  },
]

const sampleComments: Comment[] = [
  {
    id: "1",
    postId: "1",
    userId: "user3",
    username: "リスナーC",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    content: "いつも楽しい配信をありがとうございます！",
    likes: 3,
    createdAt: "2025-01-08T11:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // 'posts' or 'comments'
    const postId = searchParams.get("postId")

    if (type === "comments" && postId) {
      const comments = sampleComments.filter((comment) => comment.postId === postId)
      return NextResponse.json({
        success: true,
        comments,
        total: comments.length,
      })
    }

    return NextResponse.json({
      success: true,
      posts: samplePosts,
      total: samplePosts.length,
    })
  } catch (error) {
    console.error("Community fetch error:", error)
    return NextResponse.json({ error: "コミュニティデータの取得に失敗しました" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, content, postId, imageUrl, tags } = body

    if (!content) {
      return NextResponse.json({ error: "コンテンツが必要です" }, { status: 400 })
    }

    if (type === "comment" && postId) {
      const newComment: Comment = {
        id: Date.now().toString(),
        postId,
        userId: "current_user", // 実際の実装では認証されたユーザーIDを使用
        username: "現在のユーザー",
        avatarUrl: "/placeholder.svg?height=32&width=32",
        content,
        likes: 0,
        createdAt: new Date().toISOString(),
      }

      sampleComments.push(newComment)

      return NextResponse.json({
        success: true,
        comment: newComment,
        message: "コメントが投稿されました",
      })
    }

    // 新しい投稿の作成
    const newPost: Post = {
      id: Date.now().toString(),
      userId: "current_user",
      username: "現在のユーザー",
      avatarUrl: "/placeholder.svg?height=40&width=40",
      content,
      imageUrl,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      tags: tags || [],
    }

    samplePosts.unshift(newPost)

    return NextResponse.json({
      success: true,
      post: newPost,
      message: "投稿が作成されました",
    })
  } catch (error) {
    console.error("Community post error:", error)
    return NextResponse.json({ error: "投稿の作成に失敗しました" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, id, action } = body // action: 'like', 'unlike'

    if (type === "post" && action === "like") {
      const post = samplePosts.find((p) => p.id === id)
      if (post) {
        post.likes += 1
        return NextResponse.json({
          success: true,
          likes: post.likes,
          message: "いいねしました",
        })
      }
    }

    if (type === "comment" && action === "like") {
      const comment = sampleComments.find((c) => c.id === id)
      if (comment) {
        comment.likes += 1
        return NextResponse.json({
          success: true,
          likes: comment.likes,
          message: "いいねしました",
        })
      }
    }

    return NextResponse.json({ error: "対象が見つかりません" }, { status: 404 })
  } catch (error) {
    console.error("Community update error:", error)
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 })
  }
}
