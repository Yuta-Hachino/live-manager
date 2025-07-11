import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "ファイルが見つかりません" }, { status: 400 })
    }

    // ファイルサイズチェック (5MB制限)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "ファイルサイズが大きすぎます (最大5MB)" }, { status: 400 })
    }

    // ファイルタイプチェック
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "audio/mpeg"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "サポートされていないファイル形式です" }, { status: 400 })
    }

    // ここで実際のファイルアップロード処理を行う
    // 例: AWS S3, Cloudinary, Vercel Blob など

    // シミュレーション用の遅延
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const fileUrl = `/uploads/${Date.now()}-${file.name}`

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "ファイルアップロードAPI",
    supportedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "audio/mpeg"],
    maxSize: "5MB",
  })
}
