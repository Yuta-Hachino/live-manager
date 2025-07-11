import { type NextRequest, NextResponse } from "next/server"

interface Event {
  id: string
  title: string
  description: string
  type: "challenge" | "contest" | "collaboration" | "milestone"
  status: "upcoming" | "active" | "completed" | "cancelled"
  startDate: string
  endDate: string
  participants: number
  maxParticipants?: number
  rewards: string[]
  rules: string[]
  createdBy: string
  createdAt: string
  tags: string[]
}

// サンプルイベントデータ
const sampleEvents: Event[] = [
  {
    id: "1",
    title: "新年配信チャレンジ",
    description: "新年を記念して、みんなで配信を盛り上げよう！",
    type: "challenge",
    status: "active",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    participants: 45,
    maxParticipants: 100,
    rewards: ["特別バッジ", "プレミアム機能1ヶ月無料"],
    rules: ["期間中に最低5回配信する", "各配信は最低30分以上"],
    createdBy: "運営チーム",
    createdAt: "2024-12-25",
    tags: ["新年", "チャレンジ"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let filteredEvents = sampleEvents

    if (status) {
      filteredEvents = filteredEvents.filter((event) => event.status === status)
    }

    if (type) {
      filteredEvents = filteredEvents.filter((event) => event.type === type)
    }

    return NextResponse.json({
      success: true,
      events: filteredEvents,
      total: filteredEvents.length,
    })
  } catch (error) {
    console.error("Events fetch error:", error)
    return NextResponse.json({ error: "イベントの取得に失敗しました" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // バリデーション
    if (!body.title || !body.description || !body.startDate || !body.endDate) {
      return NextResponse.json({ error: "必須フィールドが不足しています" }, { status: 400 })
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      type: body.type || "challenge",
      status: "upcoming",
      startDate: body.startDate,
      endDate: body.endDate,
      participants: 0,
      maxParticipants: body.maxParticipants,
      rewards: body.rewards || [],
      rules: body.rules || [],
      createdBy: "ユーザー", // 実際の実装では認証されたユーザーIDを使用
      createdAt: new Date().toISOString(),
      tags: body.tags || [],
    }

    // ここで実際のデータベース保存処理を行う
    sampleEvents.push(newEvent)

    return NextResponse.json({
      success: true,
      event: newEvent,
      message: "イベントが作成されました",
    })
  } catch (error) {
    console.error("Event creation error:", error)
    return NextResponse.json({ error: "イベントの作成に失敗しました" }, { status: 500 })
  }
}
