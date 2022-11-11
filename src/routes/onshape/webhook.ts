import OnshapeApi, {PartIden, WVM} from '@/OnshapeAPI';

export interface OnshapeWebhookResponse {
    appElementSessionId: string;
    documentId: string;
    documentType: number; //0 edited part studio
    jsonType: string; //document edited part studio
    elementId: string;
    event: string;
    messageId: string;
    timestamp: Date;
    webhookId: string;
    workspaceId: string;
}

// Webhook Setup Body
// {
//     "documentId": "379504e45fb763e03b5089af",
//     "events":
//     [
//         "onshape.model.lifecycle.changed",
//         "onshape.model.translation.complete",
//         "onshape.model.lifecycle.metadata",
//         "onshape.model.lifecycle.createversion",
//         "onshape.model.lifecycle.createworkspace",
//         "onshape.model.lifecycle.createelement",
//         "onshape.model.lifecycle.deleteelement",
//         "onshape.document.lifecycle.statechange",
//         "onshape.model.lifecycle.changed.externalreferences",
//         "onshape.document.lifecycle.created",
//         "onshape.revision.created",
//         "onshape.comment.create",
//         "onshape.comment.update",
//         "onshape.comment.delete"
//     ],
//     "options":
//     {
//         "collapseEvents": true
//     },
//     "url": "https://bionic-bob.techplex.workers.dev/webhook/onshape"
// }

//propertyId for Part Name = 57f3fb8efa3416c06701d60d
export const PropertyIdName = "57f3fb8efa3416c06701d60d"
//propertyId for Part Number = 57f3fb8efa3416c06701d60f
export const PropertyIdPartNumber = "57f3fb8efa3416c06701d60f"
export const PropertyIdTitle1 = "57f3fb8efa3416c06701d616"
export const PropertyIdTitle2 = "57f3fb8efa3416c06701d617"
export const PropertyIdTitle3 = "57f3fb8efa3416c06701d618"


export default async (request: Request, env: Bindings) => {
    try {
        const data = await request.json<OnshapeWebhookResponse>()
        console.log("Onshape Webhook Data", data)

        if (data.event == "onshape.model.lifecycle.changed") {
            const Onshape = new OnshapeApi({
                accessKey: env.ONSHAPE_ACCESS_KEY,
                secretKey: env.ONSHAPE_SECRET_KEY,
                debug: false
            });
            let res = await Onshape.GetElementMetadata(data.documentId, WVM.W, data.workspaceId, data.elementId);
            const prefix = res.properties.filter(p => p.propertyId == PropertyIdTitle1)[0].value
            if (res.mimeType != "onshape/partstudio") {
                console.log(`Unhandled Change: ${res}`);
                return new Response("")
            }
            let parts = await Onshape.GetParts(data.documentId, WVM.W, data.workspaceId, data.elementId)
            console.log("parts", parts);

            let count = 1;

            for (const part of parts) {


                // if (part.partNumber !== null) continue;
                // let partMetadata = await Onshape.GetPartMetadata(data.documentId, WVM.W, data.workspaceId, data.elementId, PartIden.P, part.partId)
                // console.log(`${part.name} - ${part.partNumber} -- ${JSON.stringify(partMetadata, null, 4)}`);

                const generated = `${prefix}-${count++}`
                const properties: { propertyId: string, value: string }[] = [
                    {
                        propertyId: PropertyIdName,
                        value: generated
                    },
                    {
                        propertyId: PropertyIdPartNumber,
                        value: generated
                    }
                ]
                await Onshape.SetPartMetadata(data.documentId, WVM.W, data.workspaceId, data.elementId, PartIden.P, part.partId, properties)
            }

            //
        }
    } catch (e) {
        console.log("ERROR:", e); // If we don't send a response onshape will deregister our webhook
    }

    return new Response("")
};