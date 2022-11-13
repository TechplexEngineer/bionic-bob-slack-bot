import shlex from 'shlex';
import OnshapeApi from "@/OnshapeAPI";

export interface SlackSlashCommand {
    token: string;
    team_id: string;
    team_domain: string;
    channel_id: string;
    channel_name: string;
    user_id: string;
    user_name: string;
    command: string;
    text: string;
    api_app_id: string;
    is_enterprise_install: boolean;
    response_url: string;
    trigger_id: string;
}

const usage = [
    "Manage automatic part number assignment",
    "",
    "Usage:",
    "- `/number <onshape_url>` add a new document to automatically number parts",
    "- `/number help` Print this help message",
    "- `/number list` Get a list of documents with automatic part naming",
].join("\n");

export default async (request: Request, env: Bindings) => {
    const Onshape = new OnshapeApi({
        accessKey: env.ONSHAPE_ACCESS_KEY,
        secretKey: env.ONSHAPE_SECRET_KEY,
        debug: false
    });

    const data: SlackSlashCommand = Object.fromEntries(await request.formData()) as any;

    const args = shlex.split(data.text.trim());

    if (args.length == 0 || ['h', 'help'].includes(args[0].toLowerCase())) {
        return new Response(usage);
    }
    if (args[0].toLowerCase() == "list") {
        const webhooks = await Onshape.GetWebhooks();
        console.log("webhooks", webhooks);
        return new Response("")
    }

    return new Response("")
}