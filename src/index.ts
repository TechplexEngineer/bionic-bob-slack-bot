
import { Router } from 'itty-router';
import qs from 'qs';
import SlackClient from './slack'

import Channel_picker_modal from "@/channel_picker_modal";

// routes
import index from './routes/home'
import slashEventChannel, {AddReactionsToChannel, SlackMessage} from './routes/slash_event-channel';
import slashTrack from './routes/slash_track';
import webhookEasyPost from './routes/webhook_easypost';
import eventsHandler from './routes/events';


const router = Router();

router.get("/", index);
router.post("/interactive", async (req: Request, env: Bindings) => {
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

  const p = JSON.parse(payloadStr)


  if (p.callback_id == "reactions_to_channel") {
    const Slack = SlackClient(env.SLACK_BOT_TOKEN);

    await Slack.views.open({
      trigger_id: p.trigger_id,
      view: Channel_picker_modal
    });
    return new Response();

    // const linkedMessage:SlackMessage = {
    //   channel: p.
    // }
    // return await AddReactionsToChannel(Slack, )
  }


  return new Response("{}");
});
router.post("/command/event-channel", slashEventChannel);
router.post("/command/track", slashTrack);
router.post("/webhook/track", webhookEasyPost);
router.post("/events", eventsHandler);

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).
Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all("*", () => new Response("404, not found!", { status: 404 }));

const worker: ExportedHandler<Bindings> = { fetch: router.handle };

export default worker;
