import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // 実際の実装では、データベースからセットリストを取得
  const mockSetlists = [
    {
      id: "1",
      name: "2025年1月の歌枠",
      description: "新年最初の歌枠用セットリスト",
      createdAt: "2025-01-08T10:00:00Z",
      updatedAt: "2025-01-08T10:00:00Z",
    },
    {
      id: "2",
      name: "バラード特集",
      description: "感動的なバラード楽曲を集めたセットリスト",
      createdAt: "2025-01-07T15:30:00Z",
      updatedAt: "2025-01-07T15:30:00Z",
    },
  ]

  return NextResponse.json({
    success: true,
    data: mockSetlists,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    // 実際の実装では、データベースに新しいセットリストを作成
    const newSetlist = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: newSetlist,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create setlist" }, { status: 400 })
  }
}
