# マルチステージビルド
FROM node:24-alpine AS base

# 依存関係のインストール
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# 開発用の依存関係も含める
FROM base AS deps-dev
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ビルドステージ
FROM base AS builder
WORKDIR /app
COPY --from=deps-dev /app/node_modules ./node_modules
COPY . .

# Next.js テレメトリを無効化
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# 本番実行ステージ
FROM base AS production
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# 自動的に出力トレースを活用してイメージサイズを削減
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# アップロードディレクトリを作成
RUN mkdir -p /app/uploads && chown nextjs:nodejs /app/uploads

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

# 開発用ステージ
FROM base AS development
WORKDIR /app

COPY --from=deps-dev /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
