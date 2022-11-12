import OnshapeApi, {GetOptionsWVM, PartIden, WVM} from "@/OnshapeAPI";
import {PropertyIdName, PropertyIdPartNumber, PropertyIdTitle3} from "@/routes/onshape/webhook";

export interface CounterRequestBody {
    wvmData: GetOptionsWVM,
    env: Bindings,
    prefix: string,
    startingNumber: number,
}

export class Counter implements DurableObject {
    private readonly storageKey = "latestIndex";

    // Store this.state for later access
    constructor(private readonly state: DurableObjectState) {
    }

    async fetch(request: Request) {
        console.log("durableCounter");
        // parse the request url
        const {pathname} = new URL(request.url);
        if (pathname == "/updatePartNumbers") {
            let data = await request.json<CounterRequestBody>()

            const Onshape = new OnshapeApi({
                accessKey: data.env.ONSHAPE_ACCESS_KEY,
                secretKey: data.env.ONSHAPE_SECRET_KEY,
                debug: false
            });

            let parts = await Onshape.GetParts(data.wvmData.d, WVM.W, data.wvmData.w, data.wvmData.e);
            // console.log("parts", parts);

            await this.state.blockConcurrencyWhile(async () => {
                let count = (await this.state.storage.get<number>(this.storageKey)) ?? data.startingNumber;
                const startingCount = count;

                for (const part of parts) {

                    if (part.partNumber !== null) continue;

                    const generated = `${data.prefix}-${count++}`
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
                    await Onshape.SetPartMetadata(data.wvmData.d, WVM.W, data.wvmData.w, data.wvmData.e, PartIden.P, part.partId, properties)
                }
                // only update the persisted counter when we have actually made a change to a part
                if (startingCount != count) {
                    console.log(`Updating PropertyIdTitle3 starting:${startingCount} ending:${count} newParts:${count - startingCount}`);
                    await this.state.storage.put(this.storageKey, count);
                }
            })


        }

        return new Response("")
        // // Get the current count, defaulting to 0
        // let value = (await this.state.storage.get<number>("count")) ?? 0;
        //
        // const {pathname} = new URL(request.url);
        // let emoji = "➡️";
        // if (pathname === "/increment") {
        //     // Increment, then store the new value
        //     await this.state.storage.put("count", ++value);
        //     emoji = "⬆️";
        // } else if (pathname === "/decrement") {
        //     // Decrement, then store the new value
        //     await this.state.storage.put("count", --value);
        //     emoji = "⬇️";
        // } else if (pathname !== "/") {
        //     // If no route matched, return 404 response
        //     return new Response("😢 Not Found", {status: 404});
        // }
        //
        // // Return response containing new value, potentially after incrementing/decrementing
        // return new Response(`${emoji} ${value}`);
    }
}
