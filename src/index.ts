
import { Router } from 'itty-router'

// Create a new router
const router = Router();

/*
Our index route, a simple hello world.
*/
router.get("/", () => {
  return new Response("Hello, world! This is the root page of your Worker template.")
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
export { Counter } from "./counter";
export default worker;
