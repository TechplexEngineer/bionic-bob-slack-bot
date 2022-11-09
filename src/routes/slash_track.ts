import qs from 'qs';
import shlex from 'shlex';
import SlackClient from '../slack'

const usage = "/track <trackingNumber> <carrier>";

const createEasyPostTracker = async function(token, trackingNumber, carrier) {
	const body = {
		tracker: {
			tracking_code: trackingNumber,
			carrier: carrier
		}
	}

	return await fetch("https://api.easypost.com/v2/trackers", {
		body: JSON.stringify(body),
		headers: {
		Authorization: "Basic "+btoa(token),
			"Content-Type": "application/json"
		},
		method: "POST"
	});
};

const SlackTrackingChannelId = "C0326RUSSKB";


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
	const msg=`Tracker Created for ${trackingNumber} via ${carrier}\n- Status: ${respBody.status}\n- Tracking URL: ${respBody.public_url}`;

	Slack.chat.postMessage({channel: slackChannelId, text: msg})

	return new Response("Success");

};