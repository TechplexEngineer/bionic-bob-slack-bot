import {Router} from 'itty-router';


// routes
import index from './routes/home'
import slashEventChannel, {AddReactionsToChannel, SlackMessage} from './routes/slash_event-channel';
import slashTrack from './routes/slash_track';
import webhookEasyPost from './routes/webhook_easypost';
import eventsHandler from './routes/events';
import interactive from './routes/interactive';
import {trackingGet, trackingAddPost, trackingDeletePost} from './routes/web/tracking';

const router = Router();

router.get("/", index);
router.post("/interactive", interactive);
router.post("/command/event-channel", slashEventChannel);
router.post("/command/track", slashTrack);
router.post("/webhook/track", webhookEasyPost);
router.post("/events", eventsHandler);

router.get("/tracking", trackingGet)
router.post("/tracking/add", trackingAddPost)
router.delete("/tracking/delete", trackingDeletePost)

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).
Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all("*", () => new Response("404, not found!", {status: 404}));

const worker: ExportedHandler<Bindings> = {fetch: router.handle};

export default worker;
