import shlex from 'shlex';
import OnshapeApi, {buildDWMVEPath, GetOptionsWVM} from "@/OnshapeAPI";
import {CounterRequestBody, ResetRequestBody} from "@/service/durableCounter";

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
    "- `/number help` Print this help message",
    "- `/number list` Get a list of documents with automatic part naming",
    "- `/number add <onshape_url>` add a new document to automatically number parts",
    "- `/number remove <onshape_url>` stop watching document for new parts",
    "- `/number reset <onshape_url>` reset counter, new parts start at 1",
    "",
    "This will update each part's Name and Part Number when any new part is created, only if a prefix is set in the Part Studio's Title1 property.",
    "The Name and Part Number will default to <prefix>-<number>. The prefix comes from the Part Studio's Title1 property.",
    "The starting number can be set in the Title2 property."
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
        const msg = "*Webhooks*:\n" + webhooks.items.map(w => {
            return "• " + w.description
        }).join("\n")
        // console.log("webhooks", JSON.stringify(webhooks, null, 4));
        return new Response(msg)
    }

    if (args[0].toLowerCase() == "add" && args.length == 2) {
        const documentIdOrUrl = args[1];
        let documentId = documentIdOrUrl;
        if (documentIdOrUrl.startsWith("http")) {
            const m = documentIdOrUrl.match('cad\.onshape\.com\/documents\/(?<documentId>[^\/]+)\/');
            if (m) {
                documentId = m.groups.documentId
            }
        }
        await Onshape.CreateWebhook(documentId, {
            "documentId": documentId,
            "description": `Webhook for https://cad.onshape.com/documents/${documentId}`,
            // name was not persisted
            "data": JSON.stringify({
                documentId
            }),
            "events": [
                "onshape.model.lifecycle.changed",
                // "onshape.model.translation.complete",
                // "onshape.model.lifecycle.metadata",
                // "onshape.model.lifecycle.createversion",
                // "onshape.model.lifecycle.createworkspace",
                // "onshape.model.lifecycle.createelement",
                // "onshape.model.lifecycle.deleteelement",
                // "onshape.document.lifecycle.statechange",
                // "onshape.model.lifecycle.changed.externalreferences",
                // "onshape.document.lifecycle.created",
                // "onshape.revision.created",
                // "onshape.comment.create",
                // "onshape.comment.update",
                // "onshape.comment.delete"
            ],
            "options": {
                "collapseEvents": true
            },
            "url": "https://bionic-bob.techplex.workers.dev/webhook/onshape"
        }); //@todo check error
        return new Response("Webhook Created");
    }

    if (args[0].toLowerCase() == "remove" && args.length == 2) {
        const documentIdOrUrl = args[1];
        let documentId = documentIdOrUrl;
        if (documentIdOrUrl.startsWith("http")) {
            const m = documentIdOrUrl.match('cad\.onshape\.com\/documents\/(?<documentId>[^\/]+)\/');
            if (m) {
                documentId = m.groups.documentId
            }
        }
        //get webhook id to delete
        let webhookId = null;
        const webhooks = await Onshape.GetWebhooks();
        for (const webhook of webhooks.items) {
            const data = JSON.parse(webhook.data ?? "{}")
            if (data.documentId == documentId) {
                webhookId = webhook.id;
                break
            }
        }
        if (webhookId == null) {
            return new Response(`Unable to find active webhook for document ${documentId}`);
        }
        await Onshape.DeleteWebhook(webhookId); //@todo check error
        return new Response("Webhook removed");
    }

    if (args[0].toLowerCase() == "reset" && args.length == 2) {

        const m = args[1].match('cad\.onshape\.com\/documents\/(?<documentId>[^\/]+)\/w\/(?<workspaceId>[^\/]+)\/e\/(?<elementId>[^\/]+)');
        if (!m) {
            return new Response("Expected onshape url as second arg")
        }

        // we'll use this as our standard to get Durable Object IDs rather than inventing something new
        const wvmData: GetOptionsWVM = {
            resource: "id", // chosen as we are generating an id, could be any string
            d: m.groups.documentId,
            w: m.groups.workspaceId,
            e: m.groups.elementId
        }

        // this durable object is unique for this document/workspace/tab
        const durableObjectId = env.COUNTER.idFromName(buildDWMVEPath(wvmData));
        const durableObjectStub = env.COUNTER.get(durableObjectId);

        const requestBody: ResetRequestBody = {
            startingNumber: 1 //@todo pull from document
        };

        await durableObjectStub.fetch("http://bionicbob/resetCount", {
            method: "POST",
            body: JSON.stringify(requestBody),
        });
        return new Response(`Starting count set to ${requestBody.startingNumber}`);
    }

    return new Response(usage);
}