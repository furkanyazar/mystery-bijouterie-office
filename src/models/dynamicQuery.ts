export default interface DynamicQuery {
  sort?: Sort[];
  filter?: Filter;
}

export interface Sort {
  field: string;
  dir: "asc" | "desc";
}

export interface Filter {
  field: string;
  operator: "eq" | "neq" | "lt" | "lte" | "gt" | "gte" | "isnull" | "isnotnull" | "startswith" | "endswith" | "contains" | "doesnotcontain";
  value?: string;
  logic?: "and" | "or";
  filters?: Filter[];
}
