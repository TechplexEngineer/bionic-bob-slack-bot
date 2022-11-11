import appHomeBlocks from '../app_home_blocks';
import SlackClient from '../slack'

export interface IncomingCommon {
    type: string
}

export interface IncomingChallenge extends IncomingCommon {
    token: string
    challenge: string
}

export interface IncomingEventHook extends IncomingCommon {
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


export default async (request: Request, env: Bindings) => {
    let event: IncomingCommon = await request.json();

    switch (event.type) {
        case "url_verification":
            return new Response((event as IncomingChallenge).challenge);

        case "event_callback":
            // @todo Verify the signing secret https://glitch.com/edit/#!/apphome-demo-note?path=verifySignature.js%3A1%3A0

            switch ((event as IncomingEventHook).event.type) {
                case "app_home_opened":

                    const Slack = SlackClient(env.SLACK_BOT_TOKEN)

                    await Slack.views.publish({
                        user_id: (event as IncomingEventHook).event.user,
                        view: JSON.stringify(appHomeBlocks)
                    })

                    return new Response("");

                default:
                    new Response(`Error: ${event.type}:${(event as IncomingEventHook).event.type} is unsupported`, {status: 400})
                    break;
            }
            break;
        default:
            new Response(`Error: ${event.type} is unsupported`, {status: 400})
            break;
    }
}
