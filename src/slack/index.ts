import merge from 'lodash.merge';

export const METHODS: { [key: string]: { token: boolean } } = {
  'im.open': { token: true },
  'auth.test': { token: true },
  'team.info': { token: true },
  'users.list': { token: true },
  'users.info': { token: true },
  'users.identity': { token: true },
  'users.profile.get': { token: true },
  'users.conversations': { token: true },
  'usergroups.list': { token: true },
  'dialog.open': { token: true },
  'groups.list': { token: true },
  'groups.info': { token: true },
  'oauth.access': { token: false },
  'oauth.v2.access': { token: false },
  'conversations.list': { token: true },
  'conversations.join': { token: true },
  'conversations.open': { token: true },
  'conversations.replies': { token: true },
  'conversations.info': { token: true },
  'conversations.invite': { token: true },
  'channels.list': { token: true },
  'channels.info': { token: true },
  'apps.uninstall': { token: true },
  'chat.update': { token: true },
  'chat.postMessage': { token: true },
  'chat.postEphemeral': { token: true },
  'views.publish': { token: true },
  'views.open': { token: true },
  'views.push': { token: true },
  'views.update': { token: true },
  'team.billing.info': { token: true },
  'reactions.add': { token: true },
  'reactions.get': { token: true },
  'reactions.list': { token: true },
  'reactions.remove': { token: true },
};

interface MyFormData { [key: string]: string }

export const getSlackAPIURL = (method: string) => `https://slack.com/api/${method}`;

export const addTokenToFormData = (botAccessToken: string, formData: MyFormData) => {
  return Object.assign({}, formData, { token: botAccessToken });
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

interface okObj {
  ok: string,
  error: string
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

    const headers = { 'content-type': 'application/x-www-form-urlencoded' };
    const options = { method: 'POST', body, headers };

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
}


//name SlackREST
export default function (botAccessToken: string) {

  const methodsObjArr: any = Object.keys(METHODS).map((method) => {
    const methodAPIRequest = slackAPIRequest(method, botAccessToken || "");
    return dotStringToObj(method, methodAPIRequest);
  });

  //@ts-ignore
  const SlackAPI = merge(...methodsObjArr);

  return SlackAPI;
};