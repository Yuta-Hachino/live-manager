import { type NextRequest, NextResponse } from "next/server"

interface Subscription {
  id: string
  planId: string
  status: "active" | "cancelled" | "past_due"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

interface Transaction {
  id: string
  amount: number
  currency: string
  status: "completed" | "pending" | "failed"
  description: string
  date: string
  invoiceUrl?: string
}

// サンプルデータ
const sampleSubscription: Subscription = {
  id: "sub_123",
  planId: "premium",
  status: "active",
  currentPeriodStart: "2025-01-01",
  currentPeriodEnd: "2025-02-01",
  cancelAtPeriodEnd: false,
}

const sampleTransactions: Transaction[] = [
  {
    id: "txn_001",
    amount: 980,
    currency: "JPY",
    status: "completed",
    description: "プレミアムプラン - 月額",
    date: "2025-01-01",
    invoiceUrl: "/invoices/txn_001.pdf",
  },
  {
    id: "txn_002",
    amount: 980,
    currency: "JPY",
    status: "completed",
    description: "プレミアムプラン - 月額",
    date: "2024-12-01",
    invoiceUrl: "/invoices/txn_002.pdf",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // 'subscription' or 'transactions'

    if (type === "subscription") {
      return NextResponse.json({
        success: true,
        subscription: sampleSubscription,
      })
    }

    if (type === "transactions") {
      return NextResponse.json({
        success: true,
        transactions: sampleTransactions,
        total: sampleTransactions.length,
      })
    }

    return NextResponse.json({
      success: true,
      subscription: sampleSubscription,
      transactions: sampleTransactions,
    })
  } catch (error) {
    console.error("Billing fetch error:", error)
    return NextResponse.json({ error: "課金情報の取得に失敗しました" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, planId } = body

    if (action === "change_plan") {
      if (!planId) {
        return NextResponse.json({ error: "プランIDが必要です" }, { status: 400 })
      }

      // プラン変更処理のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return NextResponse.json({
        success: true,
        message: "プランが変更されました",
        newPlanId: planId,
      })
    }

    if (action === "cancel_subscription") {
      // サブスクリプションキャンセル処理のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return NextResponse.json({
        success: true,
        message: "サブスクリプションがキャンセルされました",
      })
    }

    return NextResponse.json({ error: "無効なアクションです" }, { status: 400 })
  } catch (error) {
    console.error("Billing action error:", error)
    return NextResponse.json({ error: "処理に失敗しました" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentMethodId } = body

    if (!paymentMethodId) {
      return NextResponse.json({ error: "支払い方法IDが必要です" }, { status: 400 })
    }

    // 支払い方法更新処理のシミュレーション
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "支払い方法が更新されました",
    })
  } catch (error) {
    console.error("Payment method update error:", error)
    return NextResponse.json({ error: "支払い方法の更新に失敗しました" }, { status: 500 })
  }
}
