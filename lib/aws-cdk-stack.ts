import * as cdk from "aws-cdk-lib"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as s3 from "aws-cdk-lib/aws-s3"
import * as cloudfront from "aws-cdk-lib/aws-cloudfront"
import * as origins from "aws-cdk-lib/aws-cloudfront-origins"
import * as rds from "aws-cdk-lib/aws-rds"
import * as ec2 from "aws-cdk-lib/aws-ec2"
import * as stepfunctions from "aws-cdk-lib/aws-stepfunctions"
import * as sfnTasks from "aws-cdk-lib/aws-stepfunctions-tasks"
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager"
import * as elasticache from "aws-cdk-lib/aws-elasticache"
import type { Construct } from "constructs"

export class SpoonAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // VPC作成
    const vpc = new ec2.Vpc(this, "SpoonAppVPC", {
      maxAzs: 2,
      natGateways: 1,
    })

    // S3バケット（静的ファイル用）
    const staticBucket = new s3.Bucket(this, "StaticFilesBucket", {
      bucketName: `spoon-app-static-${this.account}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.POST, s3.HttpMethods.PUT],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    })

    // S3バケット（アップロードファイル用）
    const uploadBucket = new s3.Bucket(this, "UploadFilesBucket", {
      bucketName: `spoon-app-uploads-${this.account}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.POST, s3.HttpMethods.PUT],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    })

    // RDS Aurora Serverless
    const dbSecret = new secretsmanager.Secret(this, "DatabaseSecret", {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "postgres" }),
        generateStringKey: "password",
        excludeCharacters: '"@/\\',
      },
    })

    const database = new rds.ServerlessCluster(this, "Database", {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_13_7,
      }),
      vpc,
      credentials: rds.Credentials.fromSecret(dbSecret),
      defaultDatabaseName: "spoonapp",
      scaling: {
        autoPause: cdk.Duration.minutes(10),
        minCapacity: rds.AuroraCapacityUnit.ACU_2,
        maxCapacity: rds.AuroraCapacityUnit.ACU_16,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    // ElastiCache Redis
    const redisSubnetGroup = new elasticache.CfnSubnetGroup(this, "RedisSubnetGroup", {
      description: "Subnet group for Redis",
      subnetIds: vpc.privateSubnets.map((subnet) => subnet.subnetId),
    })

    const redisSecurityGroup = new ec2.SecurityGroup(this, "RedisSecurityGroup", {
      vpc,
      description: "Security group for Redis",
    })

    const redis = new elasticache.CfnCacheCluster(this, "RedisCluster", {
      cacheNodeType: "cache.t3.micro",
      engine: "redis",
      numCacheNodes: 1,
      cacheSubnetGroupName: redisSubnetGroup.ref,
      vpcSecurityGroupIds: [redisSecurityGroup.securityGroupId],
    })

    // Lambda Layer（共通ライブラリ用）
    const commonLayer = new lambda.LayerVersion(this, "CommonLayer", {
      code: lambda.Code.fromAsset("lambda-layers/common"),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      description: "Common utilities and dependencies",
    })

    // Lambda関数（API用）
    const apiLambda = new lambda.Function(this, "ApiLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda/api"),
      layers: [commonLayer],
      environment: {
        DATABASE_SECRET_ARN: dbSecret.secretArn,
        REDIS_ENDPOINT: redis.attrRedisEndpointAddress,
        UPLOAD_BUCKET: uploadBucket.bucketName,
        STATIC_BUCKET: staticBucket.bucketName,
      },
      vpc,
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
    })

    // Lambda関数（OCR処理用）
    const ocrLambda = new lambda.Function(this, "OCRLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda/ocr"),
      layers: [commonLayer],
      environment: {
        DATABASE_SECRET_ARN: dbSecret.secretArn,
        OPENAI_API_KEY_SECRET_ARN: "arn:aws:secretsmanager:region:account:secret:openai-api-key",
      },
      vpc,
      timeout: cdk.Duration.minutes(5),
      memorySize: 1024,
    })

    // Lambda関数（統計処理用）
    const analyticsLambda = new lambda.Function(this, "AnalyticsLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda/analytics"),
      layers: [commonLayer],
      environment: {
        DATABASE_SECRET_ARN: dbSecret.secretArn,
        REDIS_ENDPOINT: redis.attrRedisEndpointAddress,
      },
      vpc,
      timeout: cdk.Duration.minutes(15),
      memorySize: 2048,
    })

    // Step Functions（バッチ処理用）
    const processStreamDataTask = new sfnTasks.LambdaInvoke(this, "ProcessStreamDataTask", {
      lambdaFunction: analyticsLambda,
      outputPath: "$.Payload",
    })

    const generateReportsTask = new sfnTasks.LambdaInvoke(this, "GenerateReportsTask", {
      lambdaFunction: analyticsLambda,
      inputPath: "$.reportConfig",
      outputPath: "$.Payload",
    })

    const batchProcessingWorkflow = new stepfunctions.StateMachine(this, "BatchProcessingWorkflow", {
      definition: processStreamDataTask.next(generateReportsTask),
      timeout: cdk.Duration.hours(1),
    })

    // API Gateway
    const api = new apigateway.RestApi(this, "SpoonAppAPI", {
      restApiName: "Spoon App API",
      description: "API for Spoon streaming support app",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key"],
      },
    })

    // API Gateway統合
    const apiIntegration = new apigateway.LambdaIntegration(apiLambda)
    const ocrIntegration = new apigateway.LambdaIntegration(ocrLambda)

    // APIルート設定
    const v1 = api.root.addResource("v1")

    // 認証
    const auth = v1.addResource("auth")
    auth.addResource("login").addMethod("POST", apiIntegration)

    // ユーザー
    const users = v1.addResource("users")
    users.addResource("profile").addMethod("GET", apiIntegration)
    users.addResource("profile").addMethod("PUT", apiIntegration)

    // ギャラリー
    const gallery = v1.addResource("gallery")
    gallery.addMethod("GET", apiIntegration)
    gallery.addMethod("POST", apiIntegration)
    const galleryItem = gallery.addResource("{id}")
    galleryItem.addMethod("GET", apiIntegration)
    galleryItem.addMethod("PUT", apiIntegration)
    galleryItem.addMethod("DELETE", apiIntegration)

    // 配信リザルト
    const streamResults = v1.addResource("stream-results")
    streamResults.addMethod("GET", apiIntegration)
    streamResults.addMethod("POST", apiIntegration)
    streamResults.addResource("ocr").addMethod("POST", ocrIntegration)

    // イベント
    const events = v1.addResource("events")
    events.addMethod("GET", apiIntegration)
    events.addMethod("POST", apiIntegration)

    // 統計
    const analytics = v1.addResource("analytics")
    analytics.addResource("stats").addMethod("GET", apiIntegration)

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(staticBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        "/api/*": {
          origin: new origins.RestApiOrigin(api),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        },
        "/uploads/*": {
          origin: new origins.S3Origin(uploadBucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    })

    // IAM権限設定
    dbSecret.grantRead(apiLambda)
    dbSecret.grantRead(ocrLambda)
    dbSecret.grantRead(analyticsLambda)

    uploadBucket.grantReadWrite(apiLambda)
    uploadBucket.grantReadWrite(ocrLambda)
    staticBucket.grantRead(apiLambda)

    database.connections.allowDefaultPortFrom(apiLambda)
    database.connections.allowDefaultPortFrom(ocrLambda)
    database.connections.allowDefaultPortFrom(analyticsLambda)

    redisSecurityGroup.addIngressRule(
      ec2.Peer.securityGroupId(apiLambda.connections.securityGroups[0].securityGroupId),
      ec2.Port.tcp(6379),
    )

    // 出力
    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: `https://${distribution.distributionDomainName}`,
      description: "CloudFront Distribution URL",
    })

    new cdk.CfnOutput(this, "ApiGatewayURL", {
      value: api.url,
      description: "API Gateway URL",
    })

    new cdk.CfnOutput(this, "StaticBucketName", {
      value: staticBucket.bucketName,
      description: "Static files S3 bucket name",
    })

    new cdk.CfnOutput(this, "UploadBucketName", {
      value: uploadBucket.bucketName,
      description: "Upload files S3 bucket name",
    })
  }
}
