"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, File, ImageIcon, Video, Music, CheckCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FileUploadProps {
  onUpload?: (files: File[]) => void
  onUploadComplete?: (results: UploadResult[]) => void
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
  multiple?: boolean
  className?: string
}

interface UploadResult {
  file: File
  url: string
  status: "success" | "error"
  error?: string
}

interface FileWithPreview extends File {
  preview?: string
  progress?: number
  status?: "uploading" | "success" | "error"
  error?: string
}

export function FileUpload({
  onUpload,
  onUploadComplete,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    "video/*": [".mp4", ".webm", ".ogg"],
    "audio/*": [".mp3", ".wav", ".ogg"],
  },
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = true,
  className = "",
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => {
        const fileWithPreview = Object.assign(file, {
          preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
          progress: 0,
          status: "uploading" as const,
        })
        return fileWithPreview
      })

      setFiles((prev) => [...prev, ...newFiles])
      setIsUploading(true)

      if (onUpload) {
        onUpload(acceptedFiles)
      }

      // ファイルアップロード処理のシミュレーション
      const results: UploadResult[] = []

      for (const file of newFiles) {
        try {
          // プログレス更新のシミュレーション
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise((resolve) => setTimeout(resolve, 100))
            setFiles((prev) => prev.map((f) => (f === file ? { ...f, progress } : f)))
          }

          // アップロード完了
          const result: UploadResult = {
            file,
            url: `/uploads/${Date.now()}-${file.name}`,
            status: "success",
          }
          results.push(result)

          setFiles((prev) => prev.map((f) => (f === file ? { ...f, status: "success" } : f)))
        } catch (error) {
          const result: UploadResult = {
            file,
            url: "",
            status: "error",
            error: "アップロードに失敗しました",
          }
          results.push(result)

          setFiles((prev) =>
            prev.map((f) => (f === file ? { ...f, status: "error", error: "アップロードに失敗しました" } : f)),
          )
        }
      }

      setIsUploading(false)

      if (onUploadComplete) {
        onUploadComplete(results)
      }
    },
    [onUpload, onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    multiple,
  })

  const removeFile = (fileToRemove: FileWithPreview) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove))
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-6 h-6" />
    if (file.type.startsWith("video/")) return <Video className="w-6 h-6" />
    if (file.type.startsWith("audio/")) return <Music className="w-6 h-6" />
    return <File className="w-6 h-6" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ドロップゾーン */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-purple-500 bg-purple-500/10"
            : "border-gray-600 hover:border-purple-500 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-2">
              {isDragActive ? "ファイルをドロップしてください" : "ファイルをドロップまたはクリック"}
            </h3>
            <p className="text-gray-400 mb-4">
              画像、動画、音声ファイルをアップロード（最大{maxFiles}ファイル、{formatFileSize(maxSize)}まで）
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              ファイルを選択
            </Button>
          </div>
        </div>
      </div>

      {/* アップロードされたファイル一覧 */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* ファイルプレビュー/アイコン */}
                      <div className="flex-shrink-0">
                        {file.preview ? (
                          <img
                            src={file.preview || "/placeholder.svg"}
                            alt={file.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                            {getFileIcon(file)}
                          </div>
                        )}
                      </div>

                      {/* ファイル情報 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{file.name}</p>
                        <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>

                        {/* プログレスバー */}
                        {file.status === "uploading" && (
                          <div className="mt-2">
                            <Progress value={file.progress || 0} className="h-2" />
                            <p className="text-xs text-gray-400 mt-1">{file.progress || 0}% アップロード中...</p>
                          </div>
                        )}

                        {/* エラーメッセージ */}
                        {file.status === "error" && file.error && (
                          <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {file.error}
                          </p>
                        )}
                      </div>

                      {/* ステータスアイコン */}
                      <div className="flex-shrink-0 flex items-center gap-2">
                        {file.status === "success" && <CheckCircle className="w-5 h-5 text-green-400" />}
                        {file.status === "error" && <AlertCircle className="w-5 h-5 text-red-400" />}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file)}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* アップロード状態 */}
      {isUploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-purple-400">
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            <span>アップロード中...</span>
          </div>
        </div>
      )}
    </div>
  )
}
