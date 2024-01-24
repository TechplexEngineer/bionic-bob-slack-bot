import {EasyPost} from "@/easypost";
import SlackClient, {SlackAPIMethods} from '@/slack'
import {EasyPostWebhook} from "@/easypost/WebhookResponse";
import {formatTrackingSlackMessage} from "@/routes/slack/slash_track";
import { isEqual as _isEqual } from "lodash";

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
    lastUpdate?: string
}

export const SlackTrackingChannelId = "C0326RUSSKB";

export class TrackingService {

    private ep: EasyPost;
    private kv: KVNamespace;
    public readonly slack: SlackAPIMethods;


    constructor({kv, easypostAPIKey, slackApiKey}: constructorProps) {
        this.kv = kv;
        this.ep = new EasyPost(easypostAPIKey);
        this.slack = SlackClient(slackApiKey);
    }

    async handleTrackingWebhook({easyPostWebhook: r}: handleTrackingWebhookProps) {
        // const action = r.description;
        const trackingCode = r.result.tracking_code;
        const status = r.result.status;
        const estDeliveryDate = r.result.est_delivery_date;
        const trackingUrl = r.result.public_url;
        const latestUpdate = r.result.tracking_details.pop()

        const kvEntry = await this.kv.getWithMetadata<bionicBobTrackingKV>(trackingCode);
        if (kvEntry.metadata == null) {
            console.log(`Tracking code not found in KV ${trackingCode}`);
            return
        }

        if (kvEntry.metadata.isDeleted) {
            console.log(`Tracker for ${trackingCode} is deleted`);
            return
        }

        const data: bionicBobTrackingKV = Object.assign({}, kvEntry.metadata, {
            status: status,
            estDeliveryDate: estDeliveryDate,
            url: trackingUrl,
            lastUpdate: latestUpdate.description
        } as bionicBobTrackingKV);

        if (_isEqual(data, kvEntry.metadata)) {
            console.log(`No change in tracking data for ${trackingCode}`);
            console.log('data', data);
            console.log('kvEntry.metadata', kvEntry.metadata);
            
            
            
            return; // nothing to do got a redundant webhook
        }

        await this.kv.put(trackingCode, JSON.stringify(data), {metadata: data})

        

        const blocks = formatTrackingSlackMessage(data);
        console.log('blocks', blocks);
        

        const res = await this.slack.chat.postMessage({ channel: SlackTrackingChannelId, blocks: JSON.parse(blocks)})
        if (!res.ok) {
            console.log(`Error sending slack message responding to easypost webhook. ${res.error}`)
        }
    }

    async addTracking(opt: { name?: string, tracking: string, carrier: string }): Promise<{ ok: boolean, error?: string, data?: bionicBobTrackingKV }> {
        console.log("addTracking");
        const res = await this.ep.Tracker.create(opt.tracking, opt.carrier)
        if (res.hasOwnProperty("error")) {
            return {
                ok: false,
                error: JSON.stringify(res.error)
            }
        } else {
            console.log("Tracker Created", res);
        }

        const data: bionicBobTrackingKV = {
            name: opt.name,
            tracking: opt.tracking,
            carrier: opt.carrier,
            added: new Date(),
            isDeleted: false,
            status: res.status,
            url: res.public_url,
            estDeliveryDate: res.est_delivery_date
        };
        await this.kv.put(opt.tracking, JSON.stringify(data), {metadata: data});
        console.log("kvCreated");
        return {ok: true, data: data} //@todo can we do better error checking?
    }

    async hideTracking(opt: { tracking: string }): Promise<void> {
        const entryStr = await this.kv.get(opt.tracking)
        let entry: bionicBobTrackingKV = {} as bionicBobTrackingKV;
        if (entryStr !== null) {
            entry = JSON.parse(entryStr)
        }
        entry.isDeleted = true;

        await this.kv.put(opt.tracking, JSON.stringify(entry), {metadata: entry})
        return
    }

    async listTracking(options: { includeDeleted?: boolean } = {}): Promise<bionicBobTrackingKV[]> {
        const res = await this.ep.Tracker.list()
        const kvList = await this.kv.list<bionicBobTrackingKV>();

        const rows = kvList.keys.filter(value => options.includeDeleted || !value.metadata?.isDeleted);
        return rows.map(k => {
            const trackers = res.trackers.filter(value => value.tracking_code == k.name);
            if (trackers.length == 0 || !trackers[0]) {
                console.log(`ERROR: Tracker not found for kv entry ${k.name}`);
                this.kv.delete(k.name);
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