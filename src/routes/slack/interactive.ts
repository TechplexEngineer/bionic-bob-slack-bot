import qs from 'qs';
import SlackClient from '@/slack'

import Channel_picker_modal, {ErrorModal} from "@/slack/blocks/channel_picker_modal";
import {AddReactionsToChannel, GetUsersFromReactions, SlackMessage} from "@/routes/slack/slash_event-channel";
import { SlackTrackingChannelId } from '@/service/tracking_service';

export default async (req: Request, env: Bindings) => {
    const reqBody = await req.text()
    const params = qs.parse(reqBody);
    const payloadStr = params?.payload
    if (typeof payloadStr === 'undefined') {
        console.log("Payload is missing from request. Got " + reqBody)
        return new Response("");
    }
    if (Array.isArray(payloadStr)) {
        console.log("Payload is sent multiple times in request. Got " + reqBody)
        return new Response("");
    }
    if (typeof payloadStr !== 'string') {
        console.log("Payload is not a string. Got " + reqBody)
        return new Response("");
    }

    const Slack = SlackClient(env.SLACK_BOT_TOKEN);

    const p = JSON.parse(payloadStr)
    console.log("Raw Payload", p);

    switch (p?.type) {
        case "view_submission": // submitted a modal
            if (p.view.callback_id == "channel_picker_modal") {
                const selectedChannels = p.view.state.values.block.selected_channels.selected_conversations;
                const metadata = p.view.private_metadata;
                if (metadata.length < 5) {
                    console.log("private_metadata is missing. Need the message (via private_metadata) to determine reactions");
                    return new Response();
                }
                const linkedMessage: SlackMessage = JSON.parse(metadata)

                try {
                    for (const selectedChannel of selectedChannels) {
                        await AddReactionsToChannel(Slack, linkedMessage, selectedChannel, true)
                    }
                } catch (e) {
                    if (e.message == "method_not_supported_for_channel_type") {
                        await Slack.views.update({
                            view_id: p.view.id,
                            view: JSON.stringify(ErrorModal),
                        });
                        return new Response(JSON.stringify({response_action: 'update'}))
                    }
                }
            }


            return new Response();
        case "message_action":  // performed action on message ie. shortcut
            if (p.callback_id == "reactions_to_channel") {

                const linkedMessage: SlackMessage = {
                    channel: p.channel.id,
                    timestamp: p.message_ts
                }

                const clone = Object.assign({}, Channel_picker_modal)
                clone.private_metadata = JSON.stringify(linkedMessage)

                await Slack.views.open({
                    trigger_id: p.trigger_id,
                    view: JSON.stringify(clone)
                });
                return new Response();
            }
            if (p.callback_id == "msg_reactions") {
                let reactions = await Slack.reactions.get({
                    channel: p.channel.id,
                    timestamp: p.message_ts
                });
                const userWhoReacted = GetUsersFromReactions(reactions.message.reactions);
                const usersNames = [];
                for (const userId of userWhoReacted) {
                    const u = await Slack.users.info({ user: userId });
                    usersNames.push(u.user.profile.real_name);
                }

                const msg = usersNames.sort().join(`\n`)

                // const res = await Slack.chat.postMessage({ channel: p. , text: msg })
                // if (!res.ok) {
                //     console.log(`Error sending slack message responding to easypost webhook. ${res.error}`)
                // }
                return new Response(); //success response

            }
    }
    return new Response("{}");
}