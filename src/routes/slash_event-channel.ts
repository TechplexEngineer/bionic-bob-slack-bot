import qs from 'qs';
import shlex from 'shlex';
import { program } from 'commander';

program
	.command("add <based-on> <to-channel>")
	.description('add users to a channel based on reactions')
	.action(addAction);

// /event-channel add reactions #2022-summer-heat
export default async (request: Request) => {

	const body = await request.text();
	const params = qs.parse(body);
	const text = params['text'];
	if (typeof text !== 'string') {
		return new Response("Expected text to be a string, got: " + typeof text)
	}

	const args = shlex.split(text.trim());

	console.log(args)
	program.parse(args, { from: 'user' }); // from:user means first arg is not program name
	return new Response("Response")
};

async function addAction(basedOn:string, toChannel:string) {
	console.log("basedOn", basedOn, "toChannel", toChannel);

}