
import { Router } from 'itty-router';
import qs from 'qs';

// routes
import index from './routes/home'
import slashEventChannel from './routes/slash_event-channel';
import slashTrack from './routes/slash_track';
import eventsHandler from './routes/events';


const router = Router();

router.get("/", index);
router.get("/interactive", async (req: Request) => {
  return new Response("");
});
router.post("/command/event-channel", slashEventChannel);
router.post("/command/track", slashTrack);
router.post("/events", eventsHandler);

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).
Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all("*", () => new Response("404, not found!", { status: 404 }));

const worker: ExportedHandler<Bindings> = { fetch: router.handle };

export default worker;
