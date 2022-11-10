import SlackClient from '../slack'
import {TrackingService} from "@/service/tracking_service";
import {EasyPostWebhook} from "@/easypost/WebhookResponse";

export default async (request: Request, env: Bindings) => {

    const ts = new TrackingService({
        kv: env.BIONIC_BOB_TRACKING,
        easypostAPIKey: env.EASYPOST_API_KEY,
        slackApiKey: env.SLACK_BOT_TOKEN
    });

    const r = await request.json<EasyPostWebhook>();

    ts.handleTrackingWebhook({easyPostWebhook: r})

    return new Response("");
};
