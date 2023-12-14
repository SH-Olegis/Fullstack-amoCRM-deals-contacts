export interface CustomFieldValue {
    value: string;
    enum_id: number;
    enum_code: string;
}

export interface CustomField {
    field_id: number;
    field_name: string;
    field_code: string;
    field_type: string;
    values: CustomFieldValue[];
}

export interface Link {
    href: string;
}

export interface SelfLink {
    self: Link;
}

export interface EmbeddedLead {
    id: number;
    _links: SelfLink;
}

export interface EmbeddedCompany {
    id: number;
    _links: SelfLink;
}

export interface EmbeddedData {
    tags: any[];
    leads: EmbeddedLead[];
    companies: EmbeddedCompany[];
}

export interface Contact {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    responsible_user_id: number;
    group_id: number;
    created_by: number;
    updated_by: number;
    created_at: number;
    updated_at: number;
    closest_task_at: null | string;
    is_deleted: boolean;
    is_unsorted: boolean;
    custom_fields_values: CustomField[];
    account_id: number;
    _links: SelfLink;
    _embedded: EmbeddedData;
}
