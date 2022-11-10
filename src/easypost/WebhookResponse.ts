import {Tracker} from "@/easypost/TrackerCreateResponse";

export interface PreviousAttributes {
    status: string;
}

export interface EasyPostWebhook {
    description: string; //tracker.updated or tracker.created
    mode: string;
    previous_attributes: PreviousAttributes;
    created_at: Date;
    pending_urls: string[];
    completed_urls: any[];
    updated_at: Date;
    id: string;
    user_id: string;
    status: string;
    object: string;
    result: Tracker;
}