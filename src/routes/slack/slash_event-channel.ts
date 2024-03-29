import qs from 'qs';
import shlex from 'shlex';
import SlackClient from '../../slack'

const usage = "/event-channel add reactions #2022-summer-heat https://frc4909.slack.com/archives/C091KSAKY/p1654467657881409";

export interface SlackMessage {
    channel: string;
    timestamp: number;
}

export function parseUrl(slackUrl: string): SlackMessage {
    const parts = slackUrl.split("/")
    return {
        channel: parts[parts.length - 2],
        timestamp: parseInt(parts[parts.length - 1].substring(1)) / 1000000
    }
}

export function GetUsersFromReactions(reactions: { name: string, users: string[], count: number }[]) {
    function onlyUnique<T>(value: T, index: number, self: Array<T>) {
        return self.indexOf(value) === index;
    }

    return reactions.reduce((prev: string[], curr, idx) => {
        return prev.concat(curr.users)
    }, []).filter(onlyUnique)
}

export function getChannel(channels: { name: string, [key: string]: any }[], channel: string) {
    return channels.filter((c) => {
        return c.name == channel;
    })
}

//destChannel can be either #channelName or channelId
export async function AddReactionsToChannel(Slack, linkedMessage: SlackMessage, destChannel: string, allowThrow = false): Promise<Response> {
    // 1. join even if already in channel
    console.log(`Join Channel - ${linkedMessage.channel}`);
    console.log(await Slack.conversations.join({channel: linkedMessage.channel}));

    // 2. retrieve message - optional
    // 3. get reactions to message
    console.log(`Get reactions - ${linkedMessage.channel}:${linkedMessage.timestamp}`);
    let reactions = await Slack.reactions.get({
        channel: linkedMessage.channel,
        timestamp: linkedMessage.timestamp
    });
    const usersToInvite = GetUsersFromReactions(reactions.message.reactions);
    console.log("users", usersToInvite);

    let chanId = destChannel;
    if (destChannel.startsWith("#")) {
        // 3a. Convert channel name to channel id
        console.log(`List Channels`);
        let channels = await Slack.conversations.list({
            exclude_archived: true,
            // types: "public_channel,private_channel" //scope needed = groups:read
        });
        console.log("channels", channels.channels.length);
        chanId = getChannel(channels.channels, destChannel.replace("#", ""))[0].id;
    }

    console.log(`Channel: ${destChannel} ChanID ${chanId}`);

    //3b. Join dest channel
    try {
        console.log("join dest channel", await Slack.conversations.join({channel: chanId}));
    } catch (e) {
        if (e.message == "method_not_supported_for_channel_type" && allowThrow)
            if (e.message !== "already_in_channel") {
                return new Response(`ERROR: ${e.message}`);
            }
    }

    // 4. add each user to channel
    try {
        await Slack.conversations.invite({
            channel: chanId,
            users: usersToInvite.join(",")
        });
    } catch (e) {
        if (e.message !== "already_in_channel") {
            console.log(`Unable to send invites: ${e.message}`);
            return new Response(`ERROR: ${e.message}`);
        }
    }

    return new Response(`Adding Users ${usersToInvite.length} who have reacted to the parent post to the channel ${destChannel}`);
}

// /event-channel add reactions #2022-summer-heat https://frc4909.slack.com/archives/C091KSAKY/p1654467657881409
export default async (request: Request, env: Bindings) => {

    const Slack = SlackClient(env.SLACK_BOT_TOKEN);

    const body = await request.text();
    const params = qs.parse(body);
    const text = params['text'];
    if (typeof text !== 'string') {
        return new Response("Expected text to be a string, got: " + typeof text)
    }

    const args = shlex.split(text.trim());

    if (args.length !== 4) {
        return new Response("Four args are required. Received: " + JSON.stringify(args))
    }

    const command = args[0];
    const trigger = args[1];
    const channel = args[2];
    const link = args[3];

    console.log("/event-channel", args);

    switch (command) {
        case "add":

            switch (trigger) {
                case "reactions":

                    const linkedMessage = parseUrl(link);
                    return await AddReactionsToChannel(Slack, linkedMessage, channel)
                default:
                    return new Response(`ERROR: ${usage}`);
            }
        default:
            return new Response(`ERROR: ${usage}`);
    }


    // parsed = parser.parse_args(args)
    // console.log(parsed);
    // program.parse(args, { from: 'user' }); // from:user means first arg is not program name
    return new Response(`ERROR: ${usage}`);
};
