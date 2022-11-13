import {Router} from 'itty-router';


// routes
import home from './routes/home'
import slashEventChannel from './routes/slack/slash_event-channel';
import slashTrack from './routes/slack/slash_track';
import slashNumber from './routes/slack/slash_number';
import webhookEasyPost from './routes/webhook_easypost';
import eventsHandler from './routes/slack/events';
import interactive from './routes/slack/interactive';
import {trackingGet, trackingAddPost, trackingDeletePost} from './routes/web/tracking';
import webhookOnshape from '@/routes/onshape/webhook'

const router = Router();

router.get("/", home);

// Slack
router.post("/interactive", interactive);
router.post("/events", eventsHandler);

// slack slash commands
router.post("/command/event-channel", slashEventChannel);
router.post("/command/track", slashTrack);
router.post("/command/number", slashNumber);

//easy post webhook
router.post("/webhook/track", webhookEasyPost);

//web interface
router.get("/tracking", trackingGet)
router.post("/tracking/add", trackingAddPost)
router.delete("/tracking/delete", trackingDeletePost)

// Onshape
router.post("/webhook/onshape", webhookOnshape);
router.post("/command/onshape", async (request: Request, env: Bindings) => {
    // future slack slash command
    return new Response("")
});

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).
Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all("*", () => new Response("404, not found!", {status: 404}));

const worker: ExportedHandler<Bindings> = {fetch: router.handle};

export {Counter} from "@/service/durableCounter";
export default worker;
