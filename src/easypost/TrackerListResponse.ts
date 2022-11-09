import {Tracker} from "@/easypost/TrackerCreateResponse";

export interface EasyPostTrackerListResponse {
    trackers: Tracker[];
    has_more: boolean;
}



