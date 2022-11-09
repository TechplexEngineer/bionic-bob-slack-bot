import qs from 'qs';
import shlex from 'shlex';
import SlackClient from '../slack'

const usage = [
    "Manage package tracking",
    "",
    "Usage:",
    "- `/track <trackingNumber> <carrier>` Add a new package to be tracked and updates sent to the #tracking channel",
    "- `/track help` Print this help message",
    "- `/track list` Get a list of packages being tracked",
].join("\n");

const createEasyPostTracker = async function (token, trackingNumber, carrier) {
    const body = {
        tracker: {
            tracking_code: trackingNumber,
            carrier: carrier
        }
    }

    return await fetch("https://api.easypost.com/v2/trackers", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            Authorization: "Basic " + btoa(token),
            "Content-Type": "application/json"
        },
    });
};

const SlackTrackingChannelId = "C0326RUSSKB";

interface EasyPostTracker {
    tracking_code: string
    status: string
    status_detail: string
    est_delivery_date: string
    public_url: string
}

interface EasyPostTrackersResponse {
    trackers: EasyPostTracker[]
}

const handleListTrackers = async (token) => {
    const response = await fetch("https://api.easypost.com/v2/trackers", {
        method: "GET",
        headers: {
            Authorization: "Basic " + btoa(token),
            "Content-Type": "application/json"
        },
    });

    const trackers = await response.json<EasyPostTrackersResponse>();

    const msg = ["*Trackers:*"];
    for (const t of trackers.trackers) {
        msg.push(`• Status: ${t.status} - Estimated delivery: ${t.est_delivery_date?t.est_delivery_date:"Unknown"} - <${t.public_url}|${t.tracking_code}>`);
    }
    return new Response(msg.join("\n"))
}

export default async (request: Request, env: Bindings) => {

    const Slack = SlackClient(env.SLACK_BOT_TOKEN);

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
        return handleListTrackers(env.EASYPOST_API_KEY)
    }

    if (args.length !== 2) {
        return new Response("Three args are required. Received: " + JSON.stringify(args))
    }

    const trackingNumber = args[0];
    const carrier = args[1];

    const response = await createEasyPostTracker(env.EASYPOST_API_KEY, trackingNumber, carrier);
    const respBody = await response.json();

    console.log("body", JSON.stringify(respBody, null, 4))

    if (respBody.hasOwnProperty('error')) {
        return new Response(`Error creating tracker:\n${JSON.stringify(respBody, null, 4)}`)
    }
    const msg = `Tracker Created for ${trackingNumber} via ${carrier}\n- Status: ${respBody.status}\n- Tracking URL: ${respBody.public_url}`;

    Slack.chat.postMessage({channel: slackChannelId, text: msg})

    return new Response("Success");

};