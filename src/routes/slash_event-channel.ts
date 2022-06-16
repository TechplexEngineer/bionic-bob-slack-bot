import qs from 'qs';
import shlex from 'shlex';

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
	return new Response("Response")
};