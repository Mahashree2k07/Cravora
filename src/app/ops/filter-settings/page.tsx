"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { OpsShell } from "@/components/ops/OpsShell";
import { PencilIcon, TrashIcon } from "@/components/ops/OpsIcons";
import { OpsConfirmModal } from "@/components/ops/OpsConfirmModal";
import {
  SortableHeader,
  nextSortState,
  sortRows,
  type SortState,
} from "@/components/ops/OpsTableSort";

type FilterOption = {
  slug: string;
  label: string;
  enabled: boolean;
  displayOrder: number;
  createdAt?: string;
  itemCount?: number;
};

type FilterConfig = {
  cuisine: FilterOption[];
  courses: FilterOption[];
  spice: FilterOption[];
  moods: FilterOption[];
  dietary: FilterOption[];
};

type CategoryKey = keyof FilterConfig;

const CATEGORY_META: {
  key: CategoryKey;
  title: string;
  description: string;
  placeholder: string;
}[] = [
  {
    key: "cuisine",
    title: "All Cuisine Regions",
    description: "Manage cuisine regions shown to customers",
    placeholder: "e.g. Coastal Indian",
  },
  {
    key: "courses",
    title: "All Courses",
    description: "Manage food courses shown to customers",
    placeholder: "e.g. Soup",
  },
  {
    key: "spice",
    title: "All Spice Levels",
    description: "Manage spice levels shown to customers",
    placeholder: "e.g. Level 6 Fiery",
  },
  {
    key: "moods",
    title: "All Moods",
    description: "Manage food moods shown to customers",
    placeholder: "e.g. Smoky",
  },
  {
    key: "dietary",
    title: "All Dietary Tags",
    description: "Manage dietary tags shown to customers",
    placeholder: "e.g. High Protein",
  },
];

export default function OpsFilterSettingsPage() {
  const [config, setConfig] = useState<FilterConfig | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("cuisine");
  const [search, setSearch] = useState("");
  const [newOptionName, setNewOptionName] = useState("");
  const [sort, setSort] = useState<
    SortState<"order" | "label" | "items" | "createdAt" | "enabled">
  >(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<FilterOption | null>(null);
  const [blockedPopup, setBlockedPopup] = useState<string>("");
  const [editingOption, setEditingOption] = useState<FilterOption | null>(null);
  const [editLabel, setEditLabel] = useState("");

  useEffect(() => {
    fetch("/api/ops/filter-settings")
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to load filter settings.");
        return res.json();
      })
      .then((data) => setConfig(data.config))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Load failed.")
      );
  }, []);

  async function persistConfig(
    nextConfig: FilterConfig,
    extra?: {
      newOption?: { category: CategoryKey; name: string };
      deleteOption?: { category: CategoryKey; slug: string };
      renameOption?: {
        category: CategoryKey;
        oldSlug: string;
        newLabel: string;
      };
    }
  ): Promise<boolean> {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/ops/filter-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: nextConfig,
          ...(extra?.newOption ? { newOption: extra.newOption } : {}),
          ...(extra?.deleteOption ? { deleteOption: extra.deleteOption } : {}),
          ...(extra?.renameOption ? { renameOption: extra.renameOption } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to save settings.");
      setConfig(data.config);
      setMessage(
        extra?.deleteOption
          ? "Filter option deleted."
          : extra?.renameOption
            ? "Filter option renamed across menu and customer pages."
            : "Customer filter settings updated."
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  function toggleOption(slug: string) {
    if (!config) return;
    const updatedList = config[activeCategory].map((opt) =>
      opt.slug === slug ? { ...opt, enabled: !opt.enabled } : opt
    );
    const nextConfig = { ...config, [activeCategory]: updatedList };
    setConfig(nextConfig);
    persistConfig(nextConfig);
  }

  async function handleAddOption() {
    if (!config || !newOptionName.trim()) return;
    const clean = newOptionName.trim();

    let slug = clean.toLowerCase().replace(/\s+/g, "_");
    if (activeCategory === "spice") {
      const numericMatch = clean.match(/\d+/);
      if (numericMatch) {
        slug = numericMatch[0];
      } else {
        const maxNum = config.spice.reduce(
          (max, item) => Math.max(max, Number(item.slug) || 0),
          0
        );
        slug = String(maxNum + 1);
      }
    }

    if (config[activeCategory].some((item) => item.slug === slug)) {
      setError(`An option with key "${slug}" already exists.`);
      return;
    }

    const nextList = [
      ...config[activeCategory],
      {
        slug,
        label: clean,
        enabled: true,
        displayOrder: config[activeCategory].length + 1,
        createdAt: new Date().toISOString(),
      },
    ];
    const nextConfig = { ...config, [activeCategory]: nextList };
    setNewOptionName("");
    await persistConfig(nextConfig, {
      newOption: { category: activeCategory, name: clean },
    });
  }

  function requestDeleteOption(opt: FilterOption) {
    if (!config) return;
    const count = opt.itemCount ?? 0;
    if (count > 0) {
      setBlockedPopup(
        `"${opt.label.replace(/_/g, " ")}" is currently used by ${count} ${
          count === 1 ? "dish" : "dishes"
        }.\n\nTurn Customer Visibility off instead, or reassign those dishes before deleting.`
      );
      return;
    }
    setPendingDelete(opt);
  }

  async function confirmDeleteOption() {
    if (!config || !pendingDelete) return;
    const opt = pendingDelete;

    const remaining = config[activeCategory]
      .filter((item) => item.slug !== opt.slug)
      .map((item, idx) => ({ ...item, displayOrder: idx + 1 }));

    const nextConfig = { ...config, [activeCategory]: remaining };
    await persistConfig(nextConfig, {
      deleteOption: { category: activeCategory, slug: opt.slug },
    });
    setPendingDelete(null);
  }

  function openEditModal(opt: FilterOption) {
    setEditingOption(opt);
    setEditLabel(opt.label.replace(/_/g, " "));
  }

  async function handleSaveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!config || !editingOption) return;
    const cleanLabel = editLabel.trim();
    if (!cleanLabel) return;

    const ok = await persistConfig(config, {
      renameOption: {
        category: activeCategory,
        oldSlug: editingOption.slug,
        newLabel: cleanLabel,
      },
    });
    if (ok) {
      setEditingOption(null);
      setEditLabel("");
    }
  }

  const filtered = useMemo(() => {
    const activeList = config ? config[activeCategory] : [];
    const list = activeList.filter(
      (opt) =>
        opt.label.toLowerCase().includes(search.trim().toLowerCase()) ||
        opt.slug.toLowerCase().includes(search.trim().toLowerCase())
    );
    return sortRows(list, sort, {
      order: (o) => o.displayOrder,
      label: (o) => o.label,
      items: (o) => o.itemCount ?? 0,
      createdAt: (o) => (o.createdAt ? new Date(o.createdAt).getTime() : 0),
      enabled: (o) => o.enabled,
    });
  }, [config, activeCategory, search, sort]);

  const activeMeta = CATEGORY_META.find((c) => c.key === activeCategory)!;

  return (
    <OpsShell
      title="Customer Filter Settings"
      subtitle="Manage the filter categories and options displayed on the customer ordering page."
    >
      {error && <div className="ops-alert error">{error}</div>}
      {message && <div className="ops-alert success">{message}</div>}

      <section className="ops-filter-cats">
        {CATEGORY_META.map((cat) => (
          <button
            key={cat.key}
            type="button"
            className={`ops-filter-cat-card${
              activeCategory === cat.key ? " active" : ""
            }`}
            onClick={() => setActiveCategory(cat.key)}
          >
            <strong style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              {cat.title}
            </strong>
            <span style={{ fontSize: 11, color: "#766D63" }}>
              {cat.description}
            </span>
          </button>
        ))}
      </section>

      <section className="ops-panel">
        <div className="ops-panel-top">
          <div className="ops-panel-heading">
            <h2>{activeMeta.title}</h2>
            <p>{activeMeta.description}</p>
          </div>

          <div className="ops-toolbar">
            <input
              type="text"
              className="ops-input"
              placeholder="Search options..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <input
              type="text"
              className="ops-input"
              placeholder={activeMeta.placeholder}
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
            />
            <button
              type="button"
              className="ops-btn"
              disabled={saving || !newOptionName.trim()}
              onClick={handleAddOption}
            >
              + Add Option
            </button>
          </div>
        </div>

        <div className="ops-table-wrap">
          <table className="ops-table" style={{ minWidth: 580 }}>
            <thead>
              <tr>
                <th>
                  <SortableHeader
                    label="Order"
                    sortKey="order"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Filter Option"
                    sortKey="label"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Dishes Using"
                    sortKey="items"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Added On"
                    sortKey="createdAt"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Customer Visibility"
                    sortKey="enabled"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!config ? (
                <tr>
                  <td colSpan={6}>Loading filter options...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>No filter options found.</td>
                </tr>
              ) : (
                filtered.map((opt) => (
                  <tr key={opt.slug}>
                    <td>{opt.displayOrder}</td>
                    <td>
                      <strong style={{ textTransform: "capitalize" }}>
                        {opt.label.replace(/_/g, " ")}
                      </strong>
                      <span className="ops-cell-sub">{opt.slug}</span>
                    </td>
                    <td>
                      {opt.itemCount ?? 0}{" "}
                      {(opt.itemCount ?? 0) === 1 ? "dish" : "dishes"}
                    </td>
                    <td>
                      {opt.createdAt
                        ? new Date(opt.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Built-in"}
                    </td>
                    <td>
                      <label className="ops-toggle">
                        <input
                          type="checkbox"
                          checked={opt.enabled}
                          onChange={() => toggleOption(opt.slug)}
                        />
                        <span className="ops-toggle-slider" />
                      </label>
                    </td>
                    <td>
                      <div className="ops-icon-actions">
                        <button
                          type="button"
                          className="ops-icon-btn"
                          title={`Edit ${opt.label.replace(/_/g, " ")}`}
                          aria-label={`Edit ${opt.label.replace(/_/g, " ")}`}
                          disabled={saving}
                          onClick={() => openEditModal(opt)}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          type="button"
                          className="ops-icon-btn danger"
                          title={
                            (opt.itemCount ?? 0) > 0
                              ? "Cannot delete while used by dishes"
                              : `Delete ${opt.label.replace(/_/g, " ")}`
                          }
                          aria-label={`Delete ${opt.label.replace(/_/g, " ")}`}
                          disabled={saving}
                          onClick={() => requestDeleteOption(opt)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <OpsConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete Filter Option"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.label.replace(
                /_/g,
                " "
              )}" from ${activeMeta.title}?`
            : ""
        }
        confirmLabel="Delete Option"
        variant="danger"
        busy={saving}
        onConfirm={confirmDeleteOption}
        onClose={() => setPendingDelete(null)}
      />

      <OpsConfirmModal
        open={Boolean(blockedPopup)}
        title="Cannot Delete Option"
        message={blockedPopup}
        confirmLabel="OK"
        hideCancel
        onConfirm={() => setBlockedPopup("")}
        onClose={() => setBlockedPopup("")}
      />

      {editingOption && (
        <div className="ops-modal-backdrop">
          <div className="ops-modal" style={{ maxWidth: 460 }}>
            <div className="ops-modal-header">
              <h2>Edit Filter Option</h2>
              <button
                type="button"
                className="ops-modal-close"
                aria-label="Close modal"
                onClick={() => setEditingOption(null)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="ops-field">
                <label htmlFor="filter-edit-label">
                  Option Name<span className="ops-required-star">*</span>
                </label>
                <input
                  id="filter-edit-label"
                  className="ops-input"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder="Enter new option name"
                  required
                />
                <span className="ops-cell-sub" style={{ marginTop: 4 }}>
                  {activeCategory === "spice"
                    ? `Updates the display label for Spice Level ${editingOption.slug} on Menu Management and the customer ordering page.`
                    : `Renames "${editingOption.label.replace(/_/g, " ")}" across ${
                        editingOption.itemCount ?? 0
                      } ${(editingOption.itemCount ?? 0) === 1 ? "dish" : "dishes"}, Menu Management, and the customer ordering page.`}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                <button
                  type="button"
                  className="ops-btn ops-btn-secondary"
                  disabled={saving}
                  onClick={() => setEditingOption(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ops-btn"
                  disabled={saving || !editLabel.trim()}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </OpsShell>
  );
}
