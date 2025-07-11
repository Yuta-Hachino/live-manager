#!/bin/bash

# AWS SSM Parameter Store にシークレット値を設定するスクリプト

STAGE=${1:-dev}

echo "Setting up AWS SSM parameters for stage: $STAGE"

# データベース接続文字列
aws ssm put-parameter \
  --name "/spoon-app/$STAGE/database-url" \
  --value "postgresql://username:password@your-aurora-endpoint:5432/spoonapp" \
  --type "SecureString" \
  --overwrite

# Redis接続文字列
aws ssm put-parameter \
  --name "/spoon-app/$STAGE/redis-url" \
  --value "redis://your-elasticache-endpoint:6379" \
  --type "SecureString" \
  --overwrite

# OpenAI API キー
aws ssm put-parameter \
  --name "/spoon-app/$STAGE/openai-api-key" \
  --value "sk-your-openai-api-key" \
  --type "SecureString" \
  --overwrite

# Stripe シークレットキー
aws ssm put-parameter \
  --name "/spoon-app/$STAGE/stripe-secret-key" \
  --value "sk_test_your-stripe-secret-key" \
  --type "SecureString" \
  --overwrite

# JWT シークレット
aws ssm put-parameter \
  --name "/spoon-app/$STAGE/jwt-secret" \
  --value "your-jwt-secret-key" \
  --type "SecureString" \
  --overwrite

echo "✅ AWS SSM parameters setup completed for stage: $STAGE"
