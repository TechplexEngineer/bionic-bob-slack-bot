
import { Router } from 'itty-router';
import qs from 'qs';

// routes
import index from './routes/home'
import slashEventChannel from './routes/slash_event-channel';
import getEventsHandler from './routes/events';








export async function handleRequest(request: Request, env: Bindings) {
  // console.log("Bindings", env);
  // Create a new router
  const router = Router();

  router.get("/", index);
  router.get("/interactive", async (req: Request) => {
    return new Response("");
  });
  router.post("/command/event-channel", slashEventChannel);
  router.post("/events", getEventsHandler(env));

  /*
  This is the last route we define, it will match anything that hasn't hit a route we've defined
  above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).
  Visit any page that doesn't exist (e.g. /foobar) to see it in action.
  */
  router.all("*", () => new Response("404, not found!", { status: 404 }));

  return router.handle(request);
}

const worker: ExportedHandler<Bindings> = { fetch: handleRequest };

export default worker;
