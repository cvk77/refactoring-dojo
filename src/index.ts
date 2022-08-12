import { partition } from "ramda";

export const transactionTypes = [
  { label: "Credits", name: "Credit" },
  { label: "Debits", name: "Debit" },
  { label: "Return debit", name: "ReturnDebit" },
  { label: "Credit standing order", name: "CreditStandingOrder" },
  { label: "Other transaction types", name: "Other" }
] as const;

export const buildFilterQuery = (filterArray: string[], initialQuery = "") => {
  let localQuery = initialQuery;
  filterArray.forEach((filter) => {
    localQuery = initialQuery.concat(filter, "||");
  });
  return localQuery.slice(0, -2);
};

export const generateFilterQuery = (
  transactionTypesFilters?: string[],
  associationsFilters?: string[]
) => {
  let query = "";
  if (transactionTypesFilters?.length) {
    query = query.concat(
      'type="',
      buildFilterQuery(transactionTypesFilters, query),
      '"&&'
    );
  }
  if (associationsFilters?.length) {
    query = query.concat(
      'statementLineStatus="',
      buildFilterQuery(associationsFilters, query),
      '"&&'
    );
  }
  return query.slice(0, -2);
};

export const getSearchQuery = (query: Record<string, any>) => {
  const transactionTypesFilterKeys: string[] = transactionTypes.map(
    (transactionType) => transactionType.name
  );
  const filters = partition(
    (key) => transactionTypesFilterKeys.includes(key),
    Object.keys(query)
  );
  return generateFilterQuery(...filters);
};
