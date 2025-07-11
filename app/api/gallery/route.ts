import { type NextRequest, NextResponse } from "next/server"

// ギャラリーコンテンツのCRUD API
export async function GET(request: NextRequest) {
  // 実際の実装では、データベースからギャラリーコンテンツを取得
  const mockGalleryItems = [
    {
      id: 1,
      title: "雑談配信の思い出",
      description: "楽しい雑談配信のスクリーンショット",
      fileUrl: "/uploads/image1.jpg",
      fileType: "image/jpeg",
      viewCount: 45,
      createdAt: "2025-01-08",
    },
    {
      id: 2,
      title: "歌枠ハイライト",
      description: "お気に入りの歌を歌った時の動画",
      fileUrl: "/uploads/video1.mp4",
      fileType: "video/mp4",
      viewCount: 123,
      createdAt: "2025-01-07",
    },
  ]

  return NextResponse.json({
    success: true,
    data: mockGalleryItems,
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    // 実際の実装では、ファイルをストレージに保存し、
    // データベースにメタデータを保存する

    const mockResponse = {
      id: Date.now(),
      title,
      description,
      fileUrl: `/uploads/${file.name}`,
      fileType: file.type,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: mockResponse,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 400 })
  }
}
