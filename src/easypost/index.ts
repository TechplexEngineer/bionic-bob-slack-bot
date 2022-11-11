import {EasyPostErrorResponse, EasyPostTrackerCreateResponse} from "@/easypost/TrackerCreateResponse";
import {EasyPostTrackerListResponse} from "@/easypost/TrackerListResponse";


class EasyPostTracker {
    private readonly apiKey: string;
    private trackerEndpoint = "https://api.easypost.com/v2/trackers";

    constructor(easyPostApiToken) {
        this.apiKey = easyPostApiToken;
    }

    async create(tracking_code: string, carrier: string): Promise<EasyPostTrackerCreateResponse & EasyPostErrorResponse> {
        const body = {
            tracker: {
                tracking_code: tracking_code,
                carrier: carrier
            }
        }

        const response = await fetch(this.trackerEndpoint, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                Authorization: "Basic " + btoa(this.apiKey),
                "Content-Type": "application/json"
            },
        });
        return await response.json<EasyPostTrackerCreateResponse>();
    }

    async list(): Promise<EasyPostTrackerListResponse> {
        const response = await fetch(this.trackerEndpoint, {
            method: "GET",
            headers: {
                Authorization: "Basic " + btoa(this.apiKey),
                "Content-Type": "application/json"
            },
        });

        return await response.json<EasyPostTrackerListResponse>();
    }
}

export class EasyPost {
    public Tracker: EasyPostTracker;
    private apiKey: string;

    constructor(easyPostApiToken: string) {
        this.apiKey = easyPostApiToken
        this.Tracker = new EasyPostTracker(easyPostApiToken)
    }
}