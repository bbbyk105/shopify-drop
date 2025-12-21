export interface TrackingLookupRequest {
  orderNumber: string;
  email: string;
}

export interface TrackingInfo {
  number: string;
  company?: string | null;
  url?: string | null;
}

export interface FulfillmentInfo {
  status: string;
  tracking: TrackingInfo[];
}

export interface TrackingLookupSuccess {
  found: true;
  order: {
    name: string;
    processedAt: string;
    fulfillmentStatus: string;
  };
  fulfillments: FulfillmentInfo[];
}

export interface TrackingLookupNotFound {
  found: false;
}

export type TrackingLookupResponse =
  | TrackingLookupSuccess
  | TrackingLookupNotFound;







