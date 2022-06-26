import qs from 'qs';

const apiUrl = 'https://slack.com/api';

export const views_publish = (SLACK_BOT_TOKEN: string, body: string): Promise<Response> => {
	return fetch(`${apiUrl}/views.publish`, {
		headers: {
			'Authorization': 'Bearer ' + SLACK_BOT_TOKEN,
			'Content-Type': 'application/json; charset=utf-8',
		},
		method: "POST",
		body: body
	});
}

export const conversations_join = (SLACK_BOT_TOKEN:string, channel:string): Promise<Response> => {
	const args = {
		channel: channel
	};

	return fetch(`${apiUrl}/views.publish`, {
	  "headers": {
	    'Authorization': 'Bearer ' + SLACK_BOT_TOKEN,
	  },
	  "body": qs.stringify(args),
	  "method": "POST"
	});
}