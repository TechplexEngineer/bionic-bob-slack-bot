import qs from 'qs';
import shlex from 'shlex';

const usage = "/track <trackingNumber> <carrier>";

const createEasyPostTracker = async function(trackingNumber, carrier) {
	const body = {
		tracker: {
			tracking_code: trackingNumber,
			carrier: carrier
		}
	}

	return await fetch("https://api.easypost.com/v2/trackers", {
		body: JSON.stringify(body),
		headers: {
		Authorization: "Basic JEVBU1lQT1NUX0FQSV9LRVk6",
			"Content-Type": "application/json"
		},
		method: "POST"
	});
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

	const args = shlex.split(text.trim());

	if (args.length !== 2) {
		return new Response("Three args are required. Received: " + JSON.stringify(args))
	}

	const trackingNumber = args[0];
	const carrier = args[1];

	const response = await createEasyPostTracker(trackingNumber, carrier);
	const body = await response.json();

	return new Response(`Tracker Created for ${trackingNumber} via ${carrier}\n- Status: ${body.status}\n- Tracking URL: ${public_url}`)

};