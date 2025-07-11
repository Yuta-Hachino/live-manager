import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, color } = body

    // 実際の実装では、データベースに新しいグループを作成
    const newGroup = {
      id: Date.now().toString(),
      name,
      color,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: newGroup,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create group" }, { status: 400 })
  }
}
