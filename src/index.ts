
import { Router } from 'itty-router';
import qs from 'qs';
import SlackClient from './slack'

import Channel_picker_modal, {ErrorModal} from "@/channel_picker_modal";

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
            return new Response({response_action: 'update'})
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
