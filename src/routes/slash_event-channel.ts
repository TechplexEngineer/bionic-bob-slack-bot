import qs from 'qs';
import shlex from 'shlex';
// import { ArgumentParser } from 'argparse';
// import { program } from 'commander';


// program
// 	.command("add <based-on> <to-channel>")
// 	.description('add users to a channel based on reactions')
// 	.action(addAction);

// const parser = new ArgumentParser({
// 	description: 'Argparse example'
// });

// parser.add_argument("echo")

const usage = "/event-channel add reactions #2022-summer-heat";

// /event-channel add reactions #2022-summer-heat
export default async (request: Request) => {

	const body = await request.text();
	const params = qs.parse(body);
	const text = params['text'];
	if (typeof text !== 'string') {
		return new Response("Expected text to be a string, got: " + typeof text)
	}

	const args = shlex.split(text.trim());

	if (args.length !== 3) {
		return new Response("Three args are required. Received: " + JSON.stringify(args))
	}

	const command = args[0];
	const trigger = args[1];
	const channel = args[2];

	console.log("/event-channel", args);
	console.log("params", params);

	switch (command) {
		case "add":
			switch (trigger) {
				case "reactions":
					// 1. join even if already in channel
					// 2. retrieve message - optional
					// 3. get reactions to message
					// 4. add each user to channel
					return new Response(`Adding Users who have reacted to the parent post to the channel ${channel}`);
				default:
					return new Response(`ERROR: ${usage}`);
			}
		default:
			return new Response(`ERROR: ${usage}`);
	}


	// parsed = parser.parse_args(args)
	// console.log(parsed);
	// program.parse(args, { from: 'user' }); // from:user means first arg is not program name
	return new Response(`ERROR: ${usage}`);
};
