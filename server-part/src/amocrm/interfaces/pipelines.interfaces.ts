interface Link {
    href: string;
}

interface Links {
    self: Link;
}

interface Status {
    id: number;
    name: string;
    sort: number;
    is_editable: boolean;
    pipeline_id: number;
    color: string;
    type: number;
    account_id: number;
    _links: Links;
}

interface Pipeline {
    id: number;
    name: string;
    sort: number;
    is_main: boolean;
    is_unsorted_on: boolean;
    is_archive: boolean;
    account_id: number;
    _links: Links;
    _embedded: {
        statuses: Status[];
    };
}

interface Embedded {
    pipelines: Pipeline[];
}

export interface PipelineResponse {
    _total_items: number;
    _links: Links;
    _embedded: Embedded;
}
