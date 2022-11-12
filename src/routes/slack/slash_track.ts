import qs from 'qs';
import shlex from 'shlex';
import {bionicBobTrackingKV, TrackingService} from "@/service/tracking_service";

const usage = [
    "Manage package tracking",
    "",
    "Usage:",
    "- `/track <trackingNumber> <carrier> <name>` Add a new package to be tracked and updates sent to the #tracking channel",
    "- `/track help` Print this help message",
    "- `/track list` Get a list of packages being tracked",
].join("\n");


const SlackTrackingChannelId = "C0326RUSSKB";

export const formatTrackingSlackMessage = (t: bionicBobTrackingKV) => {
    let deliveryDate = t.estDeliveryDate;
    if (deliveryDate) {
        deliveryDate = new Date(deliveryDate).toLocaleString('en-us', {
            year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric"
        })
    } else {
        deliveryDate = "Unknown"
    }

    return `• *${t.name}* Status: ${t.status} - Estimated delivery: ${deliveryDate} - <${t.url}|${t.tracking}>`
}


const handleListTrackers = async (ts: TrackingService) => {
    const trackers = await ts.listTracking();

    const msg = ["*Trackers:*"];
    for (const t of trackers) {
        msg.push(formatTrackingSlackMessage(t));
    }
    return new Response(msg.join("\n"))
}

export default async (request: Request, env: Bindings) => {

    const ts = new TrackingService({
        kv: env.BIONIC_BOB_TRACKING,
        easypostAPIKey: env.EASYPOST_API_KEY,
        slackApiKey: env.SLACK_BOT_TOKEN
    });

    // https://api.slack.com/interactivity/slash-commands
    const body = await request.text();
    const params = qs.parse(body);
    const text = params['text']; // text part of command everything after /track
    if (typeof text !== 'string') {
        return new Response("Expected text to be a string, got: " + typeof text)
    }
    const slackChannelId = SlackTrackingChannelId; //params['channel_id']

    const args = shlex.split(text.trim());

    if (args.length == 0 || ["h", "help"].includes(args[0].toLowerCase())) {
        return new Response(usage);
    }

    if (args.length == 1 && args[0].toLowerCase() == 'list') {
        return handleListTrackers(ts)
    }

    if (args.length !== 3) {
        return new Response("Three args are required. Received: " + JSON.stringify(args))
    }

    const tracking = args[0];
    const carrier = args[1];
    const name = args[2];

    const res = await ts.addTracking({name, carrier, tracking})

    if (!res.ok) {
        return new Response(`Error creating tracker:\n${res.error}`)
    }

    const msg = "*Tracker Created*\n" + formatTrackingSlackMessage(res.data)

    await ts.slack.chat.postMessage({channel: slackChannelId, text: msg})

    return new Response("Success: Tracker Created");

};