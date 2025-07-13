import type { EventBridgeEvent } from "aws-lambda"
import { broadcastMessage } from "./websocket"
import logger from '../utils/logger';

export const handler = async (event: EventBridgeEvent<string, any>) => {
  try {
    const { source, "detail-type": detailType, detail } = event

    let notification: any = {}

    switch (detailType) {
      case "Stream Event":
        notification = {
          type: "notification",
          payload: {
            id: Date.now(),
            title: "配信イベント",
            message: `${detail.streamerName}さんが配信を開始しました`,
            category: "stream",
            data: detail,
          },
        }
        break

      case "User Event":
        notification = {
          type: "notification",
          payload: {
            id: Date.now(),
            title: "ユーザーイベント",
            message: detail.message,
            category: "user",
            data: detail,
          },
        }
        break

      default:
        logger.warn(`Unknown event type: ${detailType}`);
        return
    }

    // WebSocketで全ユーザーに通知
    await broadcastMessage(notification)

    logger.info('Notification sent', { notification });
  } catch (error) {
    logger.error('Notification handler error', { error });
  }
}