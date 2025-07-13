.PHONY: help dev build test clean docker-up docker-down deploy

# デフォルトターゲット
help:
	@echo "Available commands:"
	@echo "  dev          - Start development server"
	@echo "  build        - Build the application"
	@echo "  test         - Run tests"
	@echo "  lint         - Run linting"
	@echo "  docker-up    - Start Docker containers"
	@echo "  docker-down  - Stop Docker containers"
	@echo "  deploy-staging - Deploy to staging"
	@echo "  deploy-prod  - Deploy to production"

# 開発環境の起動
dev:
	npm run dev

# ビルド
build:
	npm run build

# テスト実行
test:
	npm run test

# リンティング
lint:
	npm run lint

# 型チェック
type-check:
	npm run type-check

# Docker開発環境起動
docker-up:
	docker compose up -d

# Docker環境停止
docker-down:
	docker compose down

# Docker本番環境起動
docker-prod:
	docker compose -f docker-compose.prod.yml up -d

# データベースマイグレーション
db-migrate:
	npm run db:migrate

# データベースシード
db-seed:
	npm run db:seed

# ステージング環境デプロイ
deploy-staging:
	@echo "Deploying to staging..."
	git push origin develop

# 本番環境デプロイ
deploy-prod:
	@echo "Deploying to production..."
	git push origin main

# クリーンアップ
clean:
	docker system prune -f
	npm run docker:down
	rm -rf .next
	rm -rf node_modules

# 依存関係のインストール
install:
	npm ci

# セキュリティスキャン
security-scan:
	npm audit
	docker run --rm -v $(PWD):/app aquasec/trivy fs /app
