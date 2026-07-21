import dealerMappingSource from "./data/dealer-aliases.json";

type DealerMappingRow = {
  source: string;
  sourceKey: string;
  canonical: string;
  canonicalKey: string;
};

type DealerMappingSource = {
  sourceWorkbook: string;
  sourceSheet: string;
  sourceHeaders: string[];
  sourceModifiedAt: string;
  sourceRowCount: number;
  mappingCount: number;
  uniqueAliasCount: number;
  canonicalCount: number;
  mappings: DealerMappingRow[];
};

const mappingSource = dealerMappingSource as DealerMappingSource;

export function normalizeDealerLookupKey(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

const canonicalByAlias = new Map<string, string>();
for (const mapping of mappingSource.mappings) {
  canonicalByAlias.set(mapping.sourceKey, mapping.canonical);
}

export function canonicalizeDealerName(value: string): string {
  const original = value.trim();
  if (!original) return original;
  return canonicalByAlias.get(normalizeDealerLookupKey(original)) ?? original;
}

export function isExplicitDealerAlias(value: string): boolean {
  const original = value.trim();
  return original.length > 0 && canonicalByAlias.has(normalizeDealerLookupKey(original));
}

export function getDealerMappingStats(): {
  sourceWorkbook: string;
  sourceSheet: string;
  sourceModifiedAt: string;
  sourceRowCount: number;
  mappingCount: number;
  uniqueAliasCount: number;
  canonicalCount: number;
} {
  return {
    sourceWorkbook: mappingSource.sourceWorkbook,
    sourceSheet: mappingSource.sourceSheet,
    sourceModifiedAt: mappingSource.sourceModifiedAt,
    sourceRowCount: mappingSource.sourceRowCount,
    mappingCount: mappingSource.mappingCount,
    uniqueAliasCount: mappingSource.uniqueAliasCount,
    canonicalCount: mappingSource.canonicalCount,
  };
}
