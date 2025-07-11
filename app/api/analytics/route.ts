import { type NextRequest, NextResponse } from "next/server"

interface AnalyticsData {
  overview: {
    totalStreams: number
    totalHearts: number
    totalSpoons: number
    totalListeners: number
    averageRank: number
    bestRank: number
    totalStreamTime: string
    growthRate: number
  }
  trends: {
    daily: Array<{
      date: string
      hearts: number
      spoons: number
      listeners: number
      rank: number
    }>
    weekly: Array<{
      week: string
      hearts: number
      spoons: number
      listeners: number
      streams: number
    }>
    monthly: Array<{
      month: string
      hearts: number
      spoons: number
      listeners: number
      streams: number
    }>
  }
  topListeners: Array<{
    name: string
    totalHearts: number
    totalSpoons: number
    appearances: number
  }>
  performance: {
    bestPerformingTimes: Array<{
      time: string
      avgHearts: number
      avgListeners: number
    }>
    streamTypes: Array<{
      type: string
      count: number
      avgHearts: number
      avgSpoons: number
    }>
  }
}

// サンプル分析データ生成
const generateAnalyticsData = (): AnalyticsData => {
  const dailyData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    hearts: Math.floor(Math.random() * 500) + 200,
    spoons: Math.floor(Math.random() * 50) + 10,
    listeners: Math.floor(Math.random() * 100) + 30,
    rank: Math.floor(Math.random() * 50) + 1,
  }))

  const weeklyData = Array.from({ length: 12 }, (_, i) => ({
    week: `第${i + 1}週`,
    hearts: Math.floor(Math.random() * 2000) + 1000,
    spoons: Math.floor(Math.random() * 200) + 100,
    listeners: Math.floor(Math.random() * 400) + 200,
    streams: Math.floor(Math.random() * 7) + 3,
  }))

  const monthlyData = Array.from({ length: 6 }, (_, i) => ({
    month: `${i + 1}月`,
    hearts: Math.floor(Math.random() * 8000) + 4000,
    spoons: Math.floor(Math.random() * 800) + 400,
    listeners: Math.floor(Math.random() * 1500) + 800,
    streams: Math.floor(Math.random() * 25) + 15,
  }))

  return {
    overview: {
      totalStreams: 156,
      totalHearts: 45620,
      totalSpoons: 2340,
      totalListeners: 8950,
      averageRank: 18,
      bestRank: 3,
      totalStreamTime: "312時間45分",
      growthRate: 15.8,
    },
    trends: {
      daily: dailyData,
      weekly: weeklyData,
      monthly: monthlyData,
    },
    topListeners: [
      { name: "リスナーA", totalHearts: 2450, totalSpoons: 120, appearances: 45 },
      { name: "リスナーB", totalHearts: 1890, totalSpoons: 95, appearances: 38 },
      { name: "リスナーC", totalHearts: 1650, totalSpoons: 78, appearances: 42 },
      { name: "リスナーD", totalHearts: 1420, totalSpoons: 65, appearances: 35 },
      { name: "リスナーE", totalHearts: 1280, totalSpoons: 58, appearances: 31 },
    ],
    performance: {
      bestPerformingTimes: [
        { time: "19:00-21:00", avgHearts: 450, avgListeners: 89 },
        { time: "21:00-23:00", avgHearts: 380, avgListeners: 76 },
        { time: "15:00-17:00", avgHearts: 320, avgListeners: 65 },
      ],
      streamTypes: [
        { type: "雑談", count: 70, avgHearts: 320, avgSpoons: 18 },
        { type: "歌枠", count: 47, avgHearts: 480, avgSpoons: 35 },
        { type: "ゲーム", count: 23, avgHearts: 280, avgSpoons: 12 },
        { type: "朝活", count: 16, avgHearts: 180, avgSpoons: 8 },
      ],
    },
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30d" // 7d, 30d, 3m, 6m
    const metric = searchParams.get("metric") || "hearts" // hearts, spoons, listeners, rank

    // 分析データ生成（実際の実装ではデータベースから取得）
    const analyticsData = generateAnalyticsData()

    return NextResponse.json({
      success: true,
      data: analyticsData,
      period,
      metric,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json({ error: "分析データの取得に失敗しました" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (action === "export") {
      // データエクスポート処理のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return NextResponse.json({
        success: true,
        downloadUrl: "/exports/analytics-" + Date.now() + ".csv",
        message: "データのエクスポートが完了しました",
      })
    }

    if (action === "save_custom_report") {
      // カスタムレポート保存処理のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return NextResponse.json({
        success: true,
        reportId: "report_" + Date.now(),
        message: "カスタムレポートが保存されました",
      })
    }

    return NextResponse.json({ error: "無効なアクションです" }, { status: 400 })
  } catch (error) {
    console.error("Analytics action error:", error)
    return NextResponse.json({ error: "処理に失敗しました" }, { status: 500 })
  }
}
