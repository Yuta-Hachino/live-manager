"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Zap,
  Crown,
  Star,
  Gift,
  Check,
  X,
  Receipt,
  Plus,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface Subscription {
  id: string
  name: string
  price: number
  currency: string
  interval: "month" | "year"
  status: "active" | "cancelled" | "past_due"
  currentPeriodStart: string
  currentPeriodEnd: string
  features: string[]
}

interface Transaction {
  id: string
  type: "subscription" | "purchase" | "refund"
  description: string
  amount: number
  currency: string
  status: "completed" | "pending" | "failed"
  date: string
  invoiceUrl?: string
}

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  interval: "month" | "year"
  features: string[]
  popular?: boolean
  current?: boolean
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const { toast } = useToast()

  // サンプルデータ
  useEffect(() => {
    const sampleSubscription: Subscription = {
      id: "sub_123",
      name: "プレミアムプラン",
      price: 980,
      currency: "JPY",
      interval: "month",
      status: "active",
      currentPeriodStart: "2025-01-01",
      currentPeriodEnd: "2025-02-01",
      features: ["無制限配信", "高品質音声", "AI分析機能", "優先サポート", "カスタムテーマ"],
    }

    const sampleTransactions: Transaction[] = [
      {
        id: "txn_001",
        type: "subscription",
        description: "プレミアムプラン - 月額",
        amount: 980,
        currency: "JPY",
        status: "completed",
        date: "2025-01-01",
        invoiceUrl: "#",
      },
      {
        id: "txn_002",
        type: "subscription",
        description: "プレミアムプラン - 月額",
        amount: 980,
        currency: "JPY",
        status: "completed",
        date: "2024-12-01",
        invoiceUrl: "#",
      },
      {
        id: "txn_003",
        type: "purchase",
        description: "追加ストレージ 10GB",
        amount: 500,
        currency: "JPY",
        status: "completed",
        date: "2024-11-15",
        invoiceUrl: "#",
      },
    ]

    const samplePlans: Plan[] = [
      {
        id: "free",
        name: "フリープラン",
        price: 0,
        currency: "JPY",
        interval: "month",
        features: ["月10回まで配信", "基本統計", "コミュニティサポート"],
        current: false,
      },
      {
        id: "premium",
        name: "プレミアムプラン",
        price: 980,
        currency: "JPY",
        interval: "month",
        features: ["無制限配信", "高品質音声", "AI分析機能", "優先サポート", "カスタムテーマ"],
        popular: true,
        current: true,
      },
      {
        id: "pro",
        name: "プロプラン",
        price: 1980,
        currency: "JPY",
        interval: "month",
        features: [
          "プレミアム機能すべて",
          "高度な分析",
          "API アクセス",
          "専用サポート",
          "ホワイトラベル",
          "チーム機能",
        ],
        current: false,
      },
    ]

    setTimeout(() => {
      setSubscription(sampleSubscription)
      setTransactions(sampleTransactions)
      setPlans(samplePlans)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handlePlanChange = async (plan: Plan) => {
    try {
      setIsLoading(true)

      // プラン変更処理のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "プラン変更完了",
        description: `${plan.name}に変更されました`,
      })

      setIsUpgradeDialogOpen(false)
    } catch (error) {
      toast({
        title: "変更エラー",
        description: "プランの変更に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (confirm("本当にサブスクリプションをキャンセルしますか？")) {
      try {
        // キャンセル処理のシミュレーション
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast({
          title: "キャンセル完了",
          description: "サブスクリプションがキャンセルされました",
        })
      } catch (error) {
        toast({
          title: "キャンセルエラー",
          description: "キャンセル処理に失敗しました",
          variant: "destructive",
        })
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
      case "failed":
        return "bg-red-500"
      case "past_due":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "有効"
      case "completed":
        return "完了"
      case "pending":
        return "処理中"
      case "cancelled":
        return "キャンセル"
      case "failed":
        return "失敗"
      case "past_due":
        return "支払い遅延"
      default:
        return "不明"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">課金情報を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">課金管理</h1>
            <p className="text-gray-400">サブスクリプションと支払い履歴を管理</p>
          </div>

          <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                プランを変更
              </Button>
            </DialogTrigger>
          </Dialog>
        </motion.div>

        {/* 現在のサブスクリプション */}
        {subscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-xl">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      現在のプラン
                    </CardTitle>
                    <CardDescription className="text-gray-300">あなたの現在のサブスクリプション</CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(subscription.status)} text-white`}>
                    {getStatusText(subscription.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{subscription.name}</h3>
                    <p className="text-3xl font-bold text-purple-300">
                      {formatPrice(subscription.price, subscription.currency)}
                      <span className="text-lg text-gray-400">/{subscription.interval === "month" ? "月" : "年"}</span>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          プラン変更
                        </Button>
                      </DialogTrigger>
                    </Dialog>

                    <Button
                      variant="outline"
                      onClick={handleCancelSubscription}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                    >
                      <X className="w-4 h-4 mr-2" />
                      キャンセル
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">含まれる機能</h4>
                    <ul className="space-y-2">
                      {subscription.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <Check className="w-4 h-4 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3">請求情報</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">現在の期間:</span>
                        <span className="text-white">
                          {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">次回請求日:</span>
                        <span className="text-white">{formatDate(subscription.currentPeriodEnd)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">請求金額:</span>
                        <span className="text-white">{formatPrice(subscription.price, subscription.currency)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* タブ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="transactions" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-xl border border-white/10">
              <TabsTrigger
                value="transactions"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Receipt className="w-4 h-4" />
                支払い履歴
              </TabsTrigger>
              <TabsTrigger
                value="plans"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Zap className="w-4 h-4" />
                プラン一覧
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <CreditCard className="w-4 h-4" />
                支払い方法
              </TabsTrigger>
            </TabsList>

            {/* 支払い履歴タブ */}
            <TabsContent value="transactions" className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">支払い履歴</CardTitle>
                  <CardDescription className="text-gray-400">過去の取引履歴と請求書</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            {transaction.type === "subscription" ? (
                              <Crown className="w-6 h-6 text-white" />
                            ) : transaction.type === "purchase" ? (
                              <Gift className="w-6 h-6 text-white" />
                            ) : (
                              <DollarSign className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{transaction.description}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(transaction.date)}
                              </span>
                              <Badge className={`${getStatusColor(transaction.status)} text-white text-xs`}>
                                {getStatusText(transaction.status)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-white font-medium">
                              {formatPrice(transaction.amount, transaction.currency)}
                            </p>
                          </div>
                          {transaction.invoiceUrl && (
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* プラン一覧タブ */}
            <TabsContent value="plans" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`bg-black/20 backdrop-blur-xl border-white/10 relative ${
                        plan.popular ? "border-purple-500/50 ring-2 ring-purple-500/20" : ""
                      } ${plan.current ? "bg-purple-500/10" : ""}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-purple-500 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            人気
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="text-center">
                        <CardTitle className="text-white">{plan.name}</CardTitle>
                        <div className="py-4">
                          <p className="text-4xl font-bold text-white">{formatPrice(plan.price, plan.currency)}</p>
                          <p className="text-gray-400">/{plan.interval === "month" ? "月" : "年"}</p>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        <ul className="space-y-3">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-gray-300">
                              <Check className="w-4 h-4 text-green-400" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <Button
                          className={`w-full ${
                            plan.current
                              ? "bg-gray-600 cursor-not-allowed"
                              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          }`}
                          disabled={plan.current}
                          onClick={() => {
                            setSelectedPlan(plan)
                            setIsUpgradeDialogOpen(true)
                          }}
                        >
                          {plan.current ? "現在のプラン" : "このプランを選択"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* 支払い方法タブ */}
            <TabsContent value="payment" className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">支払い方法</CardTitle>
                  <CardDescription className="text-gray-400">登録されている支払い方法を管理</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Visa •••• 4242</h4>
                        <p className="text-sm text-gray-400">有効期限: 12/2027</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      >
                        編集
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                      >
                        削除
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Plus className="w-4 h-4 mr-2" />
                    新しい支払い方法を追加
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* プラン変更ダイアログ */}
        <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
          <DialogContent className="max-w-2xl bg-black/90 backdrop-blur-xl border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>プランを変更</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {plans
                  .filter((plan) => !plan.current)
                  .map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedPlan?.id === plan.id
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-white/20 hover:border-purple-500/50"
                      }`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-white font-medium">{plan.name}</h3>
                          <p className="text-gray-400 text-sm">
                            {formatPrice(plan.price, plan.currency)}/{plan.interval === "month" ? "月" : "年"}
                          </p>
                        </div>
                        <div className="w-4 h-4 border-2 border-white rounded-full flex items-center justify-center">
                          {selectedPlan?.id === plan.id && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsUpgradeDialogOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  キャンセル
                </Button>
                <Button
                  onClick={() => selectedPlan && handlePlanChange(selectedPlan)}
                  disabled={!selectedPlan || isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isLoading ? "変更中..." : "プランを変更"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
