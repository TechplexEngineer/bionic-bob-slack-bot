
Option 1:

```ts
let res = await SlackREST(env.SLACK_BOT_TOKEN).views.publish(args);
console.log(res);
```

Option 2:
```ts
await slackAPIRequest("views.publish", env.SLACK_BOT_TOKEN)(args)
```


Option 3:
```ts
const viewsPublish = slackAPIRequest("views.publish", env.SLACK_BOT_TOKEN)
let res = await viewsPublish(args)
console.log(res);
```
