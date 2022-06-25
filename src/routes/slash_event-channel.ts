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

	// console.log(args)
	// parsed = parser.parse_args(args)
	// console.log(parsed);
	// program.parse(args, { from: 'user' }); // from:user means first arg is not program name
	return new Response("Response")
};

// async function addAction(basedOn:string, toChannel:string) {
// 	console.log("basedOn", basedOn, "toChannel", toChannel);

// }