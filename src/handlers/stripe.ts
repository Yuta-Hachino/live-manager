import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import Stripe from "stripe"
import { Pool } from "pg"
import logger from '../utils/logger';
import { SSM, EventBridge } from "aws-sdk"

const ssm = new SSM()
const eventBridge = new EventBridge()

let stripe: Stripe
let dbPool: Pool

async function getParameter(name: string): Promise<string> {
  const result = await ssm
    .getParameter({
      Name: `/spoon-app/${process.env.STAGE}/${name}`,
      WithDecryption: true,
    })
    .promise()
  return result.Parameter?.Value || ""
}

async function initializeStripe() {
  if (!stripe) {
    const stripeSecretKey = await getParameter("stripe-secret-key")
    stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" })
  }
}

async function initializeDb() {
  if (!dbPool) {
    const databaseUrl = await getParameter("database-url")
    dbPool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    })
  }
}

export const webhookHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await initializeStripe()
    await initializeDb()

    const sig = event.headers["stripe-signature"]
    const webhookSecret = await getParameter("stripe-webhook-secret")

    let stripeEvent: Stripe.Event

    try {
      stripeEvent = stripe.webhooks.constructEvent(event.body!, sig!, webhookSecret)
    } catch (err) {
      logger.error('Webhook signature verification failed', { error: err });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Webhook signature verification failed" }),
      }
    }

    // イベント処理
    switch (stripeEvent.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(stripeEvent.data.object as Stripe.Subscription)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(stripeEvent.data.object as Stripe.Subscription)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(stripeEvent.data.object as Stripe.Subscription)
        break

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(stripeEvent.data.object as Stripe.Invoice)
        break

      case "invoice.payment_failed":
        await handlePaymentFailed(stripeEvent.data.object as Stripe.Invoice)
        break

      default:
        logger.info(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    }
  } catch (error) {
    logger.error('Stripe webhook error', { error });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Webhook processing failed" }),
    }
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const customer = await stripe.customers.retrieve(customerId)

  if (customer.deleted) return

  // ユーザーのプランをプレミアムに更新
  await dbPool.query(
    "UPDATE users SET plan_type = 'premium', stripe_customer_id = $1, stripe_subscription_id = $2 WHERE email = $3",
    [customerId, subscription.id, customer.email],
  )

  // イベント送信
  await eventBridge
    .putEvents({
      Entries: [
        {
          Source: "spoon.app",
          DetailType: "User Event",
          Detail: JSON.stringify({
            type: "subscription_created",
            userId: customer.email,
            subscriptionId: subscription.id,
            message: "プレミアムプランにアップグレードしました！",
          }),
        },
      ],
    })
    .promise()
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // サブスクリプション更新処理
  await dbPool.query("UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE stripe_subscription_id = $1", [
    subscription.id,
  ])
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // ユーザーのプランを無料に戻す
  await dbPool.query(
    "UPDATE users SET plan_type = 'free', stripe_subscription_id = NULL WHERE stripe_subscription_id = $1",
    [subscription.id],
  )

  // イベント送信
  await eventBridge
    .putEvents({
      Entries: [
        {
          Source: "spoon.app",
          DetailType: "User Event",
          Detail: JSON.stringify({
            type: "subscription_cancelled",
            subscriptionId: subscription.id,
            message: "プレミアムプランがキャンセルされました",
          }),
        },
      ],
    })
    .promise()
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // 支払い成功時の処理
  await dbPool.query(
    "INSERT INTO billing_history (user_id, amount, currency, status, stripe_payment_id, billing_date) VALUES ((SELECT id FROM users WHERE stripe_customer_id = $1), $2, $3, 'completed', $4, $5)",
    [invoice.customer, invoice.amount_paid, invoice.currency, invoice.payment_intent, new Date()],
  )
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // 支払い失敗時の処理
  await eventBridge
    .putEvents({
      Entries: [
        {
          Source: "spoon.app",
          DetailType: "User Event",
          Detail: JSON.stringify({
            type: "payment_failed",
            customerId: invoice.customer,
            message: "お支払いに失敗しました。カード情報をご確認ください。",
          }),
        },
      ],
    })
    .promise()
}

// サブスクリプション作成API
export const createSubscription = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await initializeStripe()

    const { customerId, priceId } = JSON.parse(event.body || "{}")

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    })

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as Stripe.Invoice)?.payment_intent?.client_secret,
      }),
    }
  } catch (error) {
    console.error("Create subscription error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create subscription" }),
    }
  }
}
