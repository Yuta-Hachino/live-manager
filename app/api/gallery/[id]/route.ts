import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const itemId = params.id

    // 実際の実装では、データベースのギャラリーアイテムを更新
    return NextResponse.json({
      success: true,
      data: { id: itemId, ...body },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update gallery item" }, { status: 400 })
  }
}
