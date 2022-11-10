import merge from 'lodash.merge';

export const METHODS: { [key: string]: { token: boolean } } = {
    'im.open': {token: true},
    'auth.test': {token: true},
    'team.info': {token: true},
    'team.billing.info': {token: true},
    'users.list': {token: true},
    'users.info': {token: true},
    'users.identity': {token: true},
    'users.profile.get': {token: true},
    'users.conversations': {token: true},
    'usergroups.list': {token: true},
    'dialog.open': {token: true},
    'groups.list': {token: true},
    'groups.info': {token: true},
    'oauth.access': {token: false},
    'oauth.v2.access': {token: false},
    'conversations.list': {token: true},
    'conversations.join': {token: true},
    'conversations.open': {token: true},
    'conversations.replies': {token: true},
    'conversations.info': {token: true},
    'conversations.invite': {token: true},
    'channels.list': {token: true},
    'channels.info': {token: true},
    'apps.uninstall': {token: true},
    'chat.update': {token: true},
    'chat.postMessage': {token: true},
    'chat.postEphemeral': {token: true},
    'views.publish': {token: true},
    'views.open': {token: true},
    'views.push': {token: true},
    'views.update': {token: true},
    'reactions.add': {token: true},
    'reactions.get': {token: true},
    'reactions.list': {token: true},
    'reactions.remove': {token: true},
};

interface MyFormData {
    [key: string]: string
}

export const getSlackAPIURL = (method: string) => `https://slack.com/api/${method}`;

export const addTokenToFormData = (botAccessToken: string, formData: MyFormData) => {
    return Object.assign({}, formData, {token: botAccessToken});
}

export const dotStringToObj = (str: string, value: any) => {
    const obj: any = {};
    str.split('.').reduce((acc, v, i, arr) => {
        acc[v] = i + 1 === arr.length ? value : (acc[v] = {});
        return acc[v];
    }, obj);
    return obj;
};

export const getBodyFromFormData = (formData: MyFormData) => {
    const body = new URLSearchParams();
    Object.entries(formData).map(([k, v]) => body.append(k, v));
    return body;
};

type baseResponse<T extends {}> = T & {
    ok: boolean, // true if the call completed without error
    error?: string // error message
}

interface okObj extends baseResponse<{}> {
}

export const slackAPIRequest = (method: string, botAccessToken: string): (formData: MyFormData) => Promise<okObj> => {
    return async (formData: MyFormData = {}) => {
        if (!botAccessToken && METHODS[method].token && !formData['token']) {
            throw new Error(
                `@sagi.io/workers-slack: Neither botAccessToken nor formData.token were provided. method: ${method}.`
            );
        }
        const url = getSlackAPIURL(method);

        const formDataWithToken = botAccessToken
            ? addTokenToFormData(botAccessToken, formData)
            : formData;

        const body = getBodyFromFormData(formDataWithToken);

        const headers = {'content-type': 'application/x-www-form-urlencoded'};
        const options = {method: 'POST', body, headers};

        const postMsgRes = await fetch(url, options);
        const postMsgResObj: okObj = await postMsgRes.json();

        const {ok} = postMsgResObj;

        if (!ok) {
            console.log(postMsgResObj);
            const {error} = postMsgResObj;
            throw new Error(error);
        }

        return postMsgResObj;
    };
}

export interface SlackAPIMethods {
    im: {
        // Opens or resumes a direct message or multi-person direct message.
        // alias for conversations.open
        // https://api.slack.com/methods/conversations.open
        open({}: {
            channel?: string, //Resume a conversation by supplying an im or mpim's ID. Or provide the users field instead.
            prevent_creation?: boolean //Do not create a direct message or multi-person direct message. This is used to see if there is an existing dm or mpdm.
            return_im?: boolean //Boolean, indicates you want the full IM channel definition in the response.
            users?: string //Comma separated lists of users. If only one user is included, this creates a 1:1 DM. The ordering of the users is preserved whenever a multi-person direct message is returned. Supply a channel when not supplying users.
        }): Promise<okObj>
    },
    auth: {
        // https://api.slack.com/methods/auth.test
        test(): Promise<okObj>
    },
    team: {
        info(): Promise<okObj>,
        billing: {
            info(): Promise<okObj>
        }
    },
    users: {
        list(): Promise<okObj>,
        info(): Promise<okObj>,
        identity(): Promise<okObj>,
        profile: {
            get(): Promise<okObj>,
        }
        conversations(): Promise<okObj>
    },
    usergroups: {
        list(): Promise<okObj>
    },
    dialog: {
        open(): Promise<okObj>
    },
    groups: {
        list(): Promise<okObj>,
        info(): Promise<okObj>
    },
    oauth: {
        access(): Promise<okObj>,
        v2: {
            access(): Promise<okObj>
        }
    },
    conversations: {
        list(): Promise<okObj>,
        join(): Promise<okObj>,
        // Opens or resumes a direct message or multi-person direct message.
        // alias for conversations.open
        // https://api.slack.com/methods/conversations.open
        open({}: {
            channel?: string, //Resume a conversation by supplying an im or mpim's ID. Or provide the users field instead.
            prevent_creation?: boolean //Do not create a direct message or multi-person direct message. This is used to see if there is an existing dm or mpdm.
            return_im?: boolean //Boolean, indicates you want the full IM channel definition in the response.
            users?: string //Comma separated lists of users. If only one user is included, this creates a 1:1 DM. The ordering of the users is preserved whenever a multi-person direct message is returned. Supply a channel when not supplying users.
        }): Promise<baseResponse<{ channel: { id: string } }>>
        replies(): Promise<okObj>,
        info(): Promise<okObj>,
        invite(): Promise<okObj>,
    },
    channels: {
        list(): Promise<okObj>,
        info(): Promise<okObj>,
    },
    apps: {
        uninstall(): Promise<okObj>
    },
    chat: {
        update(): Promise<okObj>,

        // Sends a message to a channel.
        // https://api.slack.com/methods/chat.postMessage
        postMessage({}: {
            channel: string,
            // At least one of attachments or blocks or text is required
            attachments?: string,
            blocks?: string,
            text?: string,

            // other optional properties
        }): Promise<baseResponse<{
            ts: string,
            channel: string, //channel id
            message: {
                text: string;
                username: string;
                bot_id: string;
                attachments: {
                    text: string;
                    id: number;
                    fallback: string;
                }[];
                type: string;
                subtype: string;
                ts: string;
            }
        }>>,
        postEphemeral(): Promise<okObj>,
    },
    views: {
        publish(): Promise<okObj>,
        open(): Promise<okObj>,
        push(): Promise<okObj>,
        update(): Promise<okObj>,
    },
    reactions: {
        add(): Promise<okObj>,
        get(): Promise<okObj>,
        list(): Promise<okObj>,
        remove(): Promise<okObj>,
    }
}


//name SlackREST
export default function (botAccessToken: string) {

    const methodsObjArr: any = Object.keys(METHODS).map((method) => {
        const methodAPIRequest = slackAPIRequest(method, botAccessToken || "");
        return dotStringToObj(method, methodAPIRequest);
    });

    //@ts-ignore
    const SlackAPI: SlackAPIMethods = merge(...methodsObjArr);

    return SlackAPI;
};