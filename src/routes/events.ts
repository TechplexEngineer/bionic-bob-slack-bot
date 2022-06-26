import appHomeBlocks from '../app_home_blocks';

export interface IncommingCommon {
	type: string
}

export interface IncommingChallenge extends IncommingCommon {
	token: string
	challenge: string
}


export interface IncommingEventHook extends IncommingCommon {
	token: string
	team_id: string
	api_app_id: string
	event: Event
	event_id: string
	event_time: number
	authorizations: Authorization[]
	is_ext_shared_channel: boolean
}

export interface Event {
	type: string
	user: string
	channel: string
	tab: string
	event_ts: string
}

export interface Authorization {
	enterprise_id: any
	team_id: string
	user_id: string
	is_bot: boolean
	is_enterprise_install: boolean
}

const apiUrl = 'https://slack.com/api';


export default async (request: Request, env: Bindings) => {
	let event: IncommingCommon = await request.json();

	switch (event.type) {
		case "url_verification":
			return new Response((event as IncommingChallenge).challenge);

		case "event_callback":
			// @todo Verify the signing secret

			switch ((event as IncommingEventHook).event.type) {
				case "app_home_opened":
					// const view = JSON.stringify(appHomeBlocks, null, "\t");
					const view = appHomeBlocks;
					const args = {
						// token: env.SLACK_BOT_TOKEN,
						user_id: (event as IncommingEventHook).event.user,
						view: view
					};
					const body = JSON.stringify(args, null, "\t");
					let res = await fetch(`${apiUrl}/views.publish`, {
						headers: {
							'Authorization': 'Bearer ' + env.SLACK_BOT_TOKEN,
							'Content-Type': 'application/json; charset=utf-8',
						},
						method: "POST",
						body: body
					});

					// console.log("Sending:", body);
					// console.log("result:", await res.text());
					return new Response("");

				default:
					new Response(`Error: ${event.type}:${(event as IncommingEventHook).event.type} is unsupported`, { status: 400 })
					break;
			}

		default:
			new Response(`Error: ${event.type} is unsupported`, { status: 400 })
			break;
	}
}
