"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Chrome, Facebook, Twitter, Sparkles, Shield, Zap } from "lucide-react"
import { motion } from "framer-motion"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(true)
    // OAuth認証処理のシミュレーション
    setTimeout(() => {
      setIsLoading(false)
      // 実際の実装では認証後にリダイレクト
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* 背景エフェクト */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl text-white">{isLogin ? "おかえりなさい" : "はじめましょう"}</CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                Spoon配信サポートアプリで配信活動をもっと楽しく
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OAuth認証ボタン */}
            <div className="space-y-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                  size="lg"
                  onClick={() => handleOAuthLogin("google")}
                  disabled={isLoading}
                >
                  <Chrome className="w-5 h-5 mr-2" />
                  Googleでログイン
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                  size="lg"
                  onClick={() => handleOAuthLogin("twitter")}
                  disabled={isLoading}
                >
                  <Twitter className="w-5 h-5 mr-2" />X (Twitter)でログイン
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                  size="lg"
                  onClick={() => handleOAuthLogin("facebook")}
                  disabled={isLoading}
                >
                  <Facebook className="w-5 h-5 mr-2" />
                  Facebookでログイン
                </Button>
              </motion.div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/20 px-2 text-gray-400">または</span>
              </div>
            </div>

            {/* メール認証フォーム */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  パスワード
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                />
              </div>
              {!isLogin && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Label htmlFor="confirmPassword" className="text-white">
                    パスワード確認
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                  />
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      処理中...
                    </div>
                  ) : (
                    <>
                      {isLogin ? "ログイン" : "アカウント作成"}
                      <Zap className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>

            <div className="text-center space-y-2">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
              >
                {isLogin ? "アカウントをお持ちでない方はこちら" : "既にアカウントをお持ちの方はこちら"}
              </button>

              {isLogin && (
                <div>
                  <button className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                    パスワードを忘れた方はこちら
                  </button>
                </div>
              )}
            </div>

            {/* セキュリティ情報 */}
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
              <Shield className="w-3 h-3" />
              <span>SSL暗号化により安全に保護されています</span>
            </div>
          </CardContent>
        </Card>

        {/* 特徴紹介 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          <div className="text-white/80">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xs">AI自動解析</p>
          </div>
          <div className="text-white/80">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xs">安全・安心</p>
          </div>
          <div className="text-white/80">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xs">高速処理</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
