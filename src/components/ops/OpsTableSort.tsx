"use client";

export type SortDirection = "asc" | "desc";

export type SortState<K extends string> = {
  key: K;
  direction: SortDirection;
} | null;

export function nextSortState<K extends string>(
  current: SortState<K>,
  key: K
): SortState<K> {
  if (current?.key === key) {
    return {
      key,
      direction: current.direction === "asc" ? "desc" : "asc",
    };
  }
  return { key, direction: "asc" };
}

export function sortRows<T, K extends string>(
  rows: T[],
  sort: SortState<K>,
  getters: Record<K, (row: T) => string | number | boolean | null | undefined>
): T[] {
  if (!sort) return rows;
  const getter = getters[sort.key];
  if (!getter) return rows;

  const copy = [...rows];
  copy.sort((a, b) => {
    const va = getter(a);
    const vb = getter(b);

    let cmp = 0;
    if (typeof va === "number" && typeof vb === "number") {
      cmp = va - vb;
    } else if (typeof va === "boolean" && typeof vb === "boolean") {
      cmp = Number(va) - Number(vb);
    } else {
      cmp = String(va ?? "").localeCompare(String(vb ?? ""), undefined, {
        numeric: true,
        sensitivity: "base",
      });
    }

    return sort.direction === "asc" ? cmp : -cmp;
  });

  return copy;
}

type SortableHeaderProps<K extends string> = {
  label: string;
  sortKey: K;
  sort: SortState<K>;
  onSort: (key: K) => void;
};

export function SortableHeader<K extends string>({
  label,
  sortKey,
  sort,
  onSort,
}: SortableHeaderProps<K>) {
  const arrow =
    sort?.key === sortKey ? (sort.direction === "asc" ? "↑" : "↓") : "↕";

  return (
    <button
      type="button"
      className="ops-sort-btn"
      onClick={() => onSort(sortKey)}
    >
      <span>{label}</span>
      <span className="ops-sort-arrow" aria-hidden="true">
        {arrow}
      </span>
    </button>
  );
}
