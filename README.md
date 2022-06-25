# Bionic Bob Slack Bot

Slack bot whose goal is to:
- provide helpful links
- answer common questions
- Automate manual processes




This is based on the "Miniflare Example Project" and uses [Cloudflare Workers](https://workers.cloudflare.com/).
[Miniflare](https://github.com/cloudflare/miniflare) is used for for local development, [TypeScript](https://www.typescriptlang.org/), [esbuild](https://github.com/evanw/esbuild) for bundling, and [Jest](https://jestjs.io/) for testing, with [Miniflare's custom Jest environment](https://miniflare.dev/testing/jest).

```shell
# Install dependencies
$ npm install
# Start local development server with live reload
$ npm run dev
# Start remote development server using wrangler
$ npm run dev:remote
# Run tests
$ npm test
# Run type checking
$ npm run types:check
# Deploy using wrangler
$ npm run deploy
```
