import OnshapeApi, {buildDWMVEPath, GetOptionsWVM, PartIden, WVM} from '@/OnshapeAPI';
import {Counter, CounterRequestBody} from "@/service/durableCounter";

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
        console.log("Onshape Webhook Data", JSON.stringify(data, null, 4))

        if (data.event == "onshape.model.lifecycle.changed") {
            const Onshape = new OnshapeApi({
                accessKey: env.ONSHAPE_ACCESS_KEY,
                secretKey: env.ONSHAPE_SECRET_KEY,
                debug: false
            });
            let tabMetadata = await Onshape.GetElementMetadata(data.documentId, WVM.W, data.workspaceId, data.elementId);

            if (tabMetadata.mimeType != "onshape/partstudio") {
                console.log(`Unhandled Change (not a part studio): ${JSON.stringify(tabMetadata, null, 4)}`);
                return new Response("")
            }


            const prefix = tabMetadata.properties.filter(p => p.propertyId == PropertyIdTitle1)[0].value
            if (prefix == null || prefix.length <= 0) {
                console.log("Prefix is not set in Title 1 property. Not assigning part numbers");
                return new Response("")
            }

            const startingNumberProp = tabMetadata.properties.filter(p => p.propertyId == PropertyIdTitle2)[0].value;
            let startingNumber = 1;
            if (startingNumberProp !== null && startingNumberProp.length > 0) {
                let res = parseInt(startingNumberProp)
                if (isNaN(res)) {
                    console.log("startingNumber is not a number in Title 2 property. Starting at part number 1");
                } else {
                    startingNumber = res;
                }
            }

            // we'll use this as our standard to get Durable Object IDs rather than inventing something new
            const wvmData: GetOptionsWVM = {
                resource: "id", // chosen as we are generating an id, could be any string
                d: data.documentId,
                w: data.workspaceId,
                e: data.elementId
            }

            // this durable object is unique for this document/workspace/tab
            const durableObjectId = env.COUNTER.idFromName(buildDWMVEPath(wvmData));
            const durableObjectStub = env.COUNTER.get(durableObjectId);

            const requestBody: CounterRequestBody = {
                wvmData,
                env,
                prefix,
                startingNumber
            };

            await durableObjectStub.fetch("http://bionicbob/updatePartNumbers", {
                method: "POST",
                body: JSON.stringify(requestBody),
            });

        }
    } catch (e) {
        console.log("ERROR:", e); // If we don't send a response onshape will deregister our webhook
    }

    return new Response("")
};