
import { Router } from 'itty-router';
import appHomeBlocks from './app_home_blocks';

// Create a new router
const router = Router();

/*
Our index route, a simple hello world.
*/
import index from './routes/home'
router.get("/", index)

import slashEventChannel from './routes/slash_event-channel';
router.post("/command/event-channel", slashEventChannel);

export interface IncommingCommon {
  type: string
}

export interface IncommingChallenge extends IncommingCommon {
  token: string
  challenge: string
}


export interface IncommingEventHook extends IncommingCommon {
  token: string
  team_id: string
  api_app_id: string
  event: Event
  event_id: string
  event_time: number
  authorizations: Authorization[]
  is_ext_shared_channel: boolean
}

export interface Event {
  type: string
  user: string
  channel: string
  tab: string
  event_ts: string
}

export interface Authorization {
  enterprise_id: any
  team_id: string
  user_id: string
  is_bot: boolean
  is_enterprise_install: boolean
}



router.post("/events", async (request: Request) => {
  let event: IncommingCommon = await request.json();

  switch (event.type) {
    case "url_verification":
      return new Response((event as IncommingChallenge).challenge);

    case "event_callback":

      switch ((event as IncommingEventHook).event.type) {
        case "app_home_opened":
          return new Response(appHomeBlocks);

        default:
          new Response(`Error: ${event.type}:${(event as IncommingEventHook).event.type} is unsupported`, { status: 400 })
          break;
      }

    default:
      new Response(`Error: ${event.type} is unsupported`, { status: 400 })
      break;
  }
})

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).
Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all("*", () => new Response("404, not found!", { status: 404 }));


export async function handleRequest(request: Request, env: Bindings) {

  return router.handle(request)
  // // Match route against pattern /:name/*action
  // const url = new URL(request.url);
  // const match = /\/(?<name>[^/]+)(?<action>.*)/.exec(url.pathname);
  // if (!match?.groups) {
  //   // If we didn't specify a name, default to "test"
  //   return Response.redirect(`${url.origin}/test/increment`, 302);
  // }

  // // Forward the request to the named Durable Object...
  // const { COUNTER } = env;
  // const id = COUNTER.idFromName(match.groups.name);
  // const stub = COUNTER.get(id);
  // // ...removing the name prefix from URL
  // url.pathname = match.groups.action;
  // return stub.fetch(url.toString());
}

const worker: ExportedHandler<Bindings> = { fetch: handleRequest };

// Make sure we export the Counter Durable Object class
// export { Counter } from "./counter";
export default worker;
