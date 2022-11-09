import SlackClient from '../slack'

const SlackTrackingChannelId = "C0326RUSSKB";

export default async (request: Request, env: Bindings) => {

	const r = await request.json();

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

	const Slack = SlackClient(env.SLACK_BOT_TOKEN);
	Slack.chat.postMessage({channel: SlackTrackingChannelId, text: msg})

	return new Response("");
};