import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { songName, artist, releaseMedia, youtubeUrl, notes, setlistId, order } = body

    // 実際の実装では、データベースに新しいアイテムを作成
    const newItem = {
      id: Date.now().toString(),
      songName,
      artist,
      releaseMedia: releaseMedia || "",
      youtubeUrl: youtubeUrl || "",
      notes: notes || "",
      isCompleted: false,
      order: order || 0,
      setlistId,
    }

    return NextResponse.json({
      success: true,
      data: newItem,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create item" }, { status: 400 })
  }
}
