import {EasyPost} from "@/easypost";
import SlackClient from '@/slack'
import {EasyPostWebhook} from "@/easypost/WebhookResponse";

export interface constructorProps {
    kv: KVNamespace
    easypostAPIKey: string
    slackApiKey: string
}

export interface handleTrackingWebhookProps {
    easyPostWebhook: EasyPostWebhook
}

export interface bionicBobTrackingKV {
    name: string
    tracking: string
    carrier: string
    added: Date
    isDeleted: boolean
    estDeliveryDate?: string
    status?: string
    url?: string
}

const SlackTrackingChannelId = "C0326RUSSKB";

export class TrackingService {

    private ep: EasyPost;
    private kv: KVNamespace;
    private slack: SlackClient;


    constructor({kv, easypostAPIKey, slackApiKey}: constructorProps) {
        this.kv = kv;
        this.ep = new EasyPost(easypostAPIKey);
        this.slack = SlackClient(slackApiKey);
    }

    handleTrackingWebhook({easyPostWebhook: r}: handleTrackingWebhookProps) {
        const action = r.description;
        const trackingCode = r.result.tracking_code;
        const status = r.result.status;
        const estDeliveryDate = r.result.est_delivery_date;
        const trackingUrl = r.result.public_url;

        const msgParts = [
            `Action: ${action}`,
            `- Tracking Number: ${trackingCode}`,
            `- Status: ${status}`,
            `- Est Delivery: ${estDeliveryDate}`,
            `- Tracking: ${trackingUrl}`
        ];

        const msg = msgParts.join('\n')

        const res = this.slack.chat.postMessage({channel: SlackTrackingChannelId, text: msg})
        if (!res.ok) {
            console.log(`Error sending slack message responding to easypost webhook. ${res.error}`)
        }
    }

    addTracking() {

    }

    hideTracking() {

    }

    async listTracking(options: { includeDeleted?: boolean } = {}): Promise<bionicBobTrackingKV[]> {
        const res = await this.ep.Tracker.list()
        const kvList = await this.kv.list<bionicBobTrackingKV>();

        const rows = kvList.keys.filter(value => options.includeDeleted || !value.metadata.isDeleted);
        return rows.map(k => {
            const trackers = res.trackers.filter(value => value.tracking_code == k.name);
            if (trackers.length == 0 || !trackers[0]) {
                console.log(`ERROR: Tracker not found for kv entry ${k.name}`);
                return;
            }
            const t = trackers[0];
            const a = {
                estDeliveryDate: t.est_delivery_date,
                status: t.status,
                url: t.public_url
            }
            return Object.assign(k.metadata, a);
        }).filter(Boolean)
    }


}