export interface TrackingLocation {
    object: string;
    city?: any;
    state?: any;
    country: string;
    zip?: any;
}

export interface TrackingDetail {
    object: string;
    message: string;
    description: string;
    status: string;
    status_detail: string;
    datetime: Date;
    source: string;
    carrier_code: string;
    tracking_location: TrackingLocation;
}

export interface Fee {
    object: string;
    type: string;
    amount: string;
    charged: boolean;
    refunded: boolean;
}

export interface OriginTrackingLocation {
    object: string;
    city?: any;
    state?: any;
    country: string;
    zip?: any;
}

export interface CarrierDetail {
    object: string;
    service: string;
    container_type?: any;
    est_delivery_date_local?: any;
    est_delivery_time_local?: any;
    origin_location: string;
    origin_tracking_location: OriginTrackingLocation;
    destination_location: string;
    destination_tracking_location?: any;
    guaranteed_delivery_date?: any;
    alternate_identifier?: any;
    initial_delivery_attempt?: any;
}

export interface Tracker {
    id: string;
    object: string;
    mode: string;
    tracking_code: string;
    status: string;
    status_detail: string;
    created_at: Date;
    updated_at: Date;
    signed_by?: any;
    weight?: any;
    est_delivery_date?: any;
    shipment_id?: any;
    carrier: string;
    tracking_details: TrackingDetail[];
    fees?: Fee[];
    carrier_detail: CarrierDetail;
    public_url: string;
    finalized?: boolean;
    is_return?: boolean;
}

export type EasyPostErrorResponse = {
    error: {
        code: string //"TRACKER.CREATE.ERROR",
        message: string //"A duplicate request is currently in-flight",
        errors: any[]
    }
}

export type EasyPostTrackerCreateResponse = Tracker | EasyPostErrorResponse



