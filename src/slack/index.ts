import merge from "lodash.merge";

export const METHODS: { [key: string]: { token: boolean } } = {
    "im.open": { token: true },
    "auth.test": { token: true },
    "team.info": { token: true },
    "team.billing.info": { token: true },
    "users.list": { token: true },
    "users.info": { token: true },
    "users.identity": { token: true },
    "users.profile.get": { token: true },
    "users.conversations": { token: true },
    "usergroups.list": { token: true },
    "dialog.open": { token: true },
    "groups.list": { token: true },
    "groups.info": { token: true },
    "oauth.access": { token: false },
    "oauth.v2.access": { token: false },
    "conversations.list": { token: true },
    "conversations.join": { token: true },
    "conversations.open": { token: true },
    "conversations.replies": { token: true },
    "conversations.info": { token: true },
    "conversations.invite": { token: true },
    "channels.list": { token: true },
    "channels.info": { token: true },
    "apps.uninstall": { token: true },
    "chat.update": { token: true },
    "chat.postMessage": { token: true },
    "chat.postEphemeral": { token: true },
    "views.publish": { token: true },
    "views.open": { token: true },
    "views.push": { token: true },
    "views.update": { token: true },
    "reactions.add": { token: true },
    "reactions.get": { token: true },
    "reactions.list": { token: true },
    "reactions.remove": { token: true },
};

interface MyFormData {
    [key: string]: string;
}

export const getSlackAPIURL = (method: string) =>
    `https://slack.com/api/${method}`;

export const addTokenToFormData = (
    botAccessToken: string,
    formData: MyFormData
) => {
    return Object.assign({}, formData, { token: botAccessToken });
};

export const dotStringToObj = (str: string, value: any) => {
    const obj: any = {};
    str.split(".").reduce((acc, v, i, arr) => {
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

interface okObj {
    ok: boolean; // true if the call completed without error
    error?: string; // error message
}

export const slackAPIRequest = (
    method: string,
    botAccessToken: string
): ((formData: MyFormData) => Promise<okObj>) => {
    return async (formData: MyFormData = {}) => {
        if (!botAccessToken && METHODS[method].token && !formData["token"]) {
            throw new Error(
                `@sagi.io/workers-slack: Neither botAccessToken nor formData.token were provided. method: ${method}.`
            );
        }
        const url = getSlackAPIURL(method);

        const formDataWithToken = botAccessToken
            ? addTokenToFormData(botAccessToken, formData)
            : formData;

        const body = getBodyFromFormData(formDataWithToken);

        const headers = { "content-type": "application/x-www-form-urlencoded" };
        const options = { method: "POST", body, headers };

        const postMsgRes = await fetch(url, options);
        const postMsgResObj: okObj = await postMsgRes.json();

        const { ok } = postMsgResObj;

        if (!ok) {
            console.log(postMsgResObj);
            const { error } = postMsgResObj;
            throw new Error(error);
        }

        return postMsgResObj;
    };
};

export interface SlackAPIMethods {
    im: {
        // Opens or resumes a direct message or multi-person direct message.
        // alias for conversations.open
        // https://api.slack.com/methods/conversations.open
        open({ }: {
            channel?: string; //Resume a conversation by supplying an im or mpim's ID. Or provide the users field instead.
            prevent_creation?: boolean; //Do not create a direct message or multi-person direct message. This is used to see if there is an existing dm or mpdm.
            return_im?: boolean; //Boolean, indicates you want the full IM channel definition in the response.
            users?: string; //Comma separated lists of users. If only one user is included, this creates a 1:1 DM. The ordering of the users is preserved whenever a multi-person direct message is returned. Supply a channel when not supplying users.
        }): Promise<okObj>;
    };
    auth: {
        // https://api.slack.com/methods/auth.test
        test(): Promise<okObj>;
    };
    team: {
        info(): Promise<okObj>;
        billing: {
            info(): Promise<okObj>;
        };
    };
    users: {
        list(): Promise<okObj>;
        info(options: { user: string, include_locale?: boolean }): Promise<okObj & {
            user: {
                id: string
                team_id: string
                name: string
                deleted: boolean
                color: string
                real_name: string
                tz: string
                tz_label: string
                tz_offset: number
                profile: {
                    avatar_hash: string
                    status_text: string
                    status_emoji: string
                    real_name: string
                    display_name: string
                    real_name_normalized: string
                    display_name_normalized: string
                    email: string
                    image_original: string
                    image_24: string
                    image_32: string
                    image_48: string
                    image_72: string
                    image_192: string
                    image_512: string
                    team: string
                }
                is_admin: boolean
                is_owner: boolean
                is_primary_owner: boolean
                is_restricted: boolean
                is_ultra_restricted: boolean
                is_bot: boolean
                updated: number
                is_app_user: boolean
                has_2fa: boolean
            }
        }
        >;
        identity(): Promise<{ user: { name: string, id: string }, team: { id: string } } & okObj>;
        profile: {
            get(): Promise<okObj>;
        };
        conversations(): Promise<okObj>;
    };
    usergroups: {
        list(): Promise<okObj>;
    };
    dialog: {
        open(): Promise<okObj>;
    };
    groups: {
        list(): Promise<okObj>;
        info(): Promise<okObj>;
    };
    oauth: {
        // Exchanges a temporary OAuth verifier code for an access token.
        access(o: {
            // Issued when you created your application
            client_id?: string;
            // Issued when you created your application.
            client_secret?: string;
            // The code param returned via the OAuth callback.
            code?: string;
            // This must match the originally submitted URI (if one was sent).
            recirect_uri?: string;
            // Request the user to add your app only to a single channel. Only valid with a legacy workspace app.
            single_channel?: boolean;
        }): Promise<okObj>;
        v2: {
            access(): Promise<okObj>;
        };
    };
    conversations: {
        list(): Promise<okObj>;
        join(): Promise<okObj>;
        // Opens or resumes a direct message or multi-person direct message.
        // alias for conversations.open
        // https://api.slack.com/methods/conversations.open
        open({ }: {
            channel?: string; //Resume a conversation by supplying an im or mpim's ID. Or provide the users field instead.
            prevent_creation?: boolean; //Do not create a direct message or multi-person direct message. This is used to see if there is an existing dm or mpdm.
            return_im?: boolean; //Boolean, indicates you want the full IM channel definition in the response.
            users?: string; //Comma separated lists of users. If only one user is included, this creates a 1:1 DM. The ordering of the users is preserved whenever a multi-person direct message is returned. Supply a channel when not supplying users.
        }): Promise<okObj & { channel: { id: string } }>;
        replies(): Promise<okObj>;
        info(): Promise<okObj>;
        invite(): Promise<okObj>;
    };
    channels: {
        list(): Promise<okObj>;
        info(): Promise<okObj>;
    };
    apps: {
        uninstall(): Promise<okObj>;
    };
    chat: {
        update(): Promise<okObj>;

        // Sends a message to a channel.
        // https://api.slack.com/methods/chat.postMessage
        postMessage({ }: {
            channel: string;
            // At least one of attachments or blocks or text is required
            attachments?: string;
            blocks?: string;
            text?: string;

            // other optional properties
        }): Promise<okObj & {
            ts: string;
            channel: string; //channel id
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
            };
        }>;
        postEphemeral(): Promise<okObj>;
    };
    views: {
        // Publish a static view for a User.
        // https://api.slack.com/methods/views.publish
        publish(o: {
            // id of the user you want publish a view to.
            user_id: string,
            // A view payload. This must be a JSON-encoded string.
            // see: https://api.slack.com/reference/surfaces/views
            view: string
        }): Promise<okObj>;
        // Open a view for a user.
        // https://api.slack.com/methods/views.open
        open(
            options: {
                // A view object. This must be a JSON-encoded string.
                // see https://api.slack.com/reference/surfaces/views
                view: string;
            } & (
                    | {
                        // Exchange a trigger to post to the user.
                        trigger_id: string;
                    }
                    | {
                        // Exchange an interactivity pointer to post to the user.
                        interactivity_pointer: string;
                    }
                )
        ): Promise<okObj>;
        push(): Promise<okObj>;

        // Update an existing view.
        // https://api.slack.com/methods/views.update
        update(
            options: {
                // A view object. This must be a JSON-encoded string.
                // see https://api.slack.com/reference/surfaces/views
                view: string;
                // A string that represents view state to protect against possible race conditions.
                hash?: string;
            } & (
                    | {
                        // A unique identifier of the view set by the developer. Must be unique for all views on a team. Max length of 255 characters. Either view_id or external_id is required.
                        external_id: string;
                    }
                    | {
                        // A unique identifier of the view to be updated. Either view_id or external_id is required.
                        view_id: string;
                    }
                )
        ): Promise<okObj>;
    };
    reactions: {
        add(): Promise<okObj>;
        get(options: {
            channel?: string,
            file?: string,
            file_comment?: string,
            full?: boolean,
            timestamp?: string,
        }): Promise<{
            message: {
                type: string
                text: string
                user: string
                ts: string
                team: string
                reactions: Array<{
                    name: string
                    users: Array<string>
                    count: number
                }>
                permalink: string
            }
            channel: string
        } & okObj>;
        list(): Promise<okObj>;
        remove(): Promise<okObj>;
    };
}

export const SlackREST = (botAccessToken?: string) => {
    {
        const methodsObjArr: any = Object.keys(METHODS).map((method) => {
            const methodAPIRequest = slackAPIRequest(method, botAccessToken || "");
            return dotStringToObj(method, methodAPIRequest);
        });

        //@ts-ignore
        const SlackAPI: SlackAPIMethods = merge(...methodsObjArr);

        return SlackAPI;
    }
};

//name SlackREST
export default function (botAccessToken: string) {
    return SlackREST(botAccessToken);
}
