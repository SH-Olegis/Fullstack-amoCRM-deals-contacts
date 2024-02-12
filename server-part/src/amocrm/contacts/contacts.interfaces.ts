export interface CustomFieldValue {
  value: string;
}

export interface CustomField {
  field_name: string;
  values: CustomFieldValue[];
}

export interface Link {
  href: string;
}

export interface SelfLink {
  self: Link;
}

export interface Contact {
  id: number;
  name: string;
  custom_fields_values: CustomField[];
}

export interface EmbeddedContact {
  id: number;
  is_main: boolean;
  _links: SelfLink;
}
