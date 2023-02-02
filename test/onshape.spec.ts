import {buildDWMVEPath, DeleteOpts} from "@/OnshapeAPI";


test("Webhook buildDWMVEPath", () => {
    const opts: DeleteOpts = {
        resource: "webhooks",
        subresource: "abc-webhookId-123",
        body: ""
    }

    let answer = buildDWMVEPath(opts as any)
    expect(answer).toEqual("/api/v5/webhooks/abc-webhookId-123")
})