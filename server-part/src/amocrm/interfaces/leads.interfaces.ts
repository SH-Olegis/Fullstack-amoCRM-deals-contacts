interface Link {
    href: string;
}

interface Links {
    self: Link;
    next: Link;
    first: Link;
    prev: Link;
}

interface EmbeddedLead {
    id: number;
    name: string;
    price: number;
    responsible_user_id: number;
    group_id: number;
    status_id: number;
    pipeline_id: number;
    loss_reason_id: null;
    source_id: null;
    created_by: number;
    updated_by: number;
    created_at: number;
    updated_at: number;
    closed_at: number;
    closest_task_at: null;
    is_deleted: boolean;
    custom_fields_values: null;
    score: null;
    account_id: number;
    _links: Links;
    _embedded: {
        tags: any[];
        companies: any[];
    };
}

interface Embedded {
    leads: EmbeddedLead[];
}

export interface LeadsResponse {
    _page: number;
    _links: Links;
    _embedded: Embedded;
}

export interface ClientResponse {
    status: string;
    responsible: string;
}
