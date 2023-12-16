interface Link {
    href: string;
}

interface Links {
    self: Link;
}

interface Rights {
    view: string;
    edit: string;
    add: string;
    delete: string;
    export: string;
}

interface EntityRights {
    entity_type: string;
    pipeline_id: number;
    status_id: number;
    rights: Rights;
}

interface UserRights {
    leads: Rights;
    contacts: Rights;
    companies: Rights;
    tasks: Rights;
    mail_access: boolean;
    catalog_access: boolean;
    status_rights: EntityRights[];
    is_admin: boolean;
    is_free: boolean;
    is_active: boolean;
    group_id: null;
    role_id: null;
}

interface Role {
    id: number;
    name: string;
    _links: Links;
}

interface Group {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    lang: string;
    rights: UserRights;
    _links: Links;
    _embedded: {
        roles: Role[];
        groups: Group[];
    };
}

interface Embedded {
    users: User[];
}

export interface UsersResponse {
    _total_items: number;
    _page: number;
    _page_count: number;
    _links: Links;
    _embedded: Embedded;
}
