"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { OpsShell } from "@/components/ops/OpsShell";
import { OpsSelect } from "@/components/ops/OpsSelect";
import { PencilIcon, TrashIcon } from "@/components/ops/OpsIcons";
import { OpsConfirmModal } from "@/components/ops/OpsConfirmModal";
import {
  SortableHeader,
  nextSortState,
  sortRows,
  type SortState,
} from "@/components/ops/OpsTableSort";

type MenuItemRow = {
  id: string;
  name: string;
  description: string | null;
  course: string | null;
  cuisineRegion: string | null;
  spiceLevel: number | null;
  retailPriceInr: number | null;
  retailPriceUsd: number | null;
  isSignature: boolean;
  isAvailable: boolean;
  imageUrl: string | null;
  moodTags: string[];
  dietaryCompatible: string[];
};

type MenuStats = {
  total: number;
  available: number;
  unavailable: number;
};

type MenuFormState = {
  name: string;
  description: string;
  course: string;
  cuisineRegion: string;
  spiceLevel: string;
  retailPriceInr: string;
  imageUrl: string;
  moodTags: string[];
  dietaryCompatible: string[];
  isAvailable: boolean;
  isSignature: boolean;
};

const EMPTY_FORM: MenuFormState = {
  name: "",
  description: "",
  course: "",
  cuisineRegion: "",
  spiceLevel: "2",
  retailPriceInr: "",
  imageUrl: "",
  moodTags: [],
  dietaryCompatible: [],
  isAvailable: true,
  isSignature: false,
};

const DEFAULT_SPICE_OPTIONS = [
  { value: "", label: "Select spice level" },
  { value: "0", label: "0 - No spice" },
  { value: "1", label: "1 - Mild" },
  { value: "2", label: "2 - Light-Medium" },
  { value: "3", label: "3 - Medium" },
  { value: "4", label: "4 - Hot" },
  { value: "5", label: "5 - Extra Hot" },
];

function formatTagLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function OpsMenuPage() {
  const [items, setItems] = useState<MenuItemRow[]>([]);
  const [stats, setStats] = useState<MenuStats>({
    total: 0,
    available: 0,
    unavailable: 0,
  });
  const [courses, setCourses] = useState<string[]>([]);
  const [cuisineRegions, setCuisineRegions] = useState<string[]>([]);
  const [moodTagOptions, setMoodTagOptions] = useState<string[]>([]);
  const [dietaryTagOptions, setDietaryTagOptions] = useState<string[]>([]);
  const [spiceOptions, setSpiceOptions] = useState(DEFAULT_SPICE_OPTIONS);
  const [tagLabels, setTagLabels] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sort, setSort] = useState<
    SortState<"item" | "course" | "price" | "status">
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MenuFormState>(EMPTY_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingDeleteItem, setPendingDeleteItem] =
    useState<MenuItemRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [menuRes, filterRes] = await Promise.all([
        fetch("/api/ops/menu"),
        fetch("/api/ops/filter-settings"),
      ]);
      if (!menuRes.ok) throw new Error("Unable to load menu items.");
      const data = await menuRes.json();
      setItems(data.items ?? []);
      if (data.stats) setStats(data.stats);
      setCourses(data.taxonomies?.courses ?? []);
      setCuisineRegions(data.taxonomies?.cuisineRegions ?? []);
      setMoodTagOptions(data.taxonomies?.moodTags ?? []);
      setDietaryTagOptions(data.taxonomies?.dietaryTags ?? []);

      if (filterRes.ok) {
        const filterData = await filterRes.json();
        const cfg = filterData.config as
          | Record<string, { slug: string; label: string }[] | undefined>
          | undefined;
        if (cfg) {
          const nextLabels: Record<string, string> = {};
          for (const key of ["cuisine", "courses", "moods", "dietary"]) {
            for (const entry of cfg[key] ?? []) {
              nextLabels[entry.slug] = entry.label;
            }
          }
          setTagLabels(nextLabels);
        }
        const spiceList = filterData.config?.spice as
          | { slug: string; label: string }[]
          | undefined;
        if (spiceList && spiceList.length > 0) {
          setSpiceOptions([
            { value: "", label: "Select spice level" },
            ...spiceList.map((s) => ({
              value: s.slug,
              label: s.label,
            })),
          ]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load menu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = items.filter((item) => {
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.course ?? "").toLowerCase().includes(q) ||
        (item.cuisineRegion ?? "").toLowerCase().includes(q);
      const matchesCourse =
        courseFilter === "all" || item.course === courseFilter;
      const matchesAvail =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" ? item.isAvailable : !item.isAvailable);
      return matchesSearch && matchesCourse && matchesAvail;
    });
    return sortRows(list, sort, {
      item: (i) => i.name,
      course: (i) => i.course ?? "",
      price: (i) => i.retailPriceInr ?? i.retailPriceUsd ?? 0,
      status: (i) => (i.isAvailable ? "available" : "unavailable"),
    });
  }, [items, search, courseFilter, availabilityFilter, sort]);

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSelectedFile(null);
    setPreviewUrl("");
    setModalError("");
    setModalOpen(true);
  }

  function openEditModal(item: MenuItemRow) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description ?? "",
      course: item.course ?? "",
      cuisineRegion: item.cuisineRegion ?? "",
      spiceLevel: item.spiceLevel === null ? "" : String(item.spiceLevel),
      retailPriceInr:
        item.retailPriceInr === null ? "" : String(item.retailPriceInr),
      imageUrl: item.imageUrl ?? "",
      moodTags: item.moodTags ?? [],
      dietaryCompatible: item.dietaryCompatible ?? [],
      isAvailable: item.isAvailable,
      isSignature: item.isSignature,
    });
    setSelectedFile(null);
    setPreviewUrl(item.imageUrl ?? "");
    setModalError("");
    setModalOpen(true);
  }

  function toggleTag(field: "moodTags" | "dietaryCompatible", tag: string) {
    setForm((prev) => {
      const exists = prev[field].includes(tag);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((t) => t !== tag)
          : [...prev[field], tag],
      };
    });
  }

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(file: File | null) {
    setSelectedFile(file);
    if (!file) {
      setPreviewUrl(form.imageUrl || "");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setModalError("");

    if (!form.name.trim()) {
      setModalError("Please enter an item name.");
      return;
    }
    if (!form.description.trim()) {
      setModalError("Please enter a description.");
      return;
    }
    if (!form.course.trim()) {
      setModalError("Please select a course.");
      return;
    }
    if (!form.cuisineRegion.trim()) {
      setModalError("Please select a cuisine region.");
      return;
    }
    if (form.retailPriceInr === "" || Number(form.retailPriceInr) <= 0) {
      setModalError("Please enter a valid INR price.");
      return;
    }
    if (form.spiceLevel === "") {
      setModalError("Please select a spice level.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      let resolvedImageUrl = form.imageUrl.trim() || null;

      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        const uploadRes = await fetch("/api/ops/menu/upload", {
          method: "POST",
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadJson.message || "Unable to upload food image.");
        }
        resolvedImageUrl = uploadJson.imageUrl;
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        course: form.course.trim(),
        cuisineRegion: form.cuisineRegion.trim() || null,
        spiceLevel: form.spiceLevel === "" ? null : Number(form.spiceLevel),
        retailPriceInr:
          form.retailPriceInr === "" ? null : Number(form.retailPriceInr),
        imageUrl: resolvedImageUrl,
        moodTags: form.moodTags,
        dietaryCompatible: form.dietaryCompatible,
        isAvailable: form.isAvailable,
        isSignature: form.isSignature,
      };

      const url = editingId ? `/api/ops/menu/${editingId}` : "/api/ops/menu";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to save menu item.");

      setModalOpen(false);
      setMessage(editingId ? "Menu item updated." : "Menu item added.");
      await loadMenu();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Failed to save item.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability(item: MenuItemRow) {
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/ops/menu/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });
      if (!res.ok) throw new Error("Unable to update availability.");
      await loadMenu();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    }
  }

  async function confirmDeleteItem() {
    if (!pendingDeleteItem) return;
    const item = pendingDeleteItem;
    setDeleting(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/ops/menu/${item.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Unable to delete menu item.");
      setMessage(`Deleted "${item.name}".`);
      setPendingDeleteItem(null);
      await loadMenu();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <OpsShell
      title="Menu Management"
      subtitle="Manage your restaurant menu, items and availability."
    >
      {error && <div className="ops-alert error">{error}</div>}
      {message && <div className="ops-alert success">{message}</div>}

      <section className="ops-stats-grid ops-stats-grid-3">
        <div className="ops-stat-card">
          <p>Total Menu Items</p>
          <h2>{stats.total}</h2>
          <span>Items in your menu</span>
        </div>
        <div className="ops-stat-card">
          <p>Available Items</p>
          <h2>{stats.available}</h2>
          <span>Currently available</span>
        </div>
        <div className="ops-stat-card">
          <p>Unavailable Items</p>
          <h2>{stats.unavailable}</h2>
          <span>Currently unavailable</span>
        </div>
      </section>

      <section className="ops-panel">
        <div className="ops-panel-top">
          <div className="ops-panel-heading">
            <h2>All Menu Items</h2>
            <p>View, add and manage your restaurant menu.</p>
          </div>

          <div className="ops-toolbar">
            <input
              type="text"
              className="ops-input"
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <OpsSelect
              ariaLabel="Filter by course"
              value={courseFilter}
              onChange={setCourseFilter}
              minWidth={145}
              options={[
                { value: "all", label: "All Courses" },
                ...courses.map((c) => ({
                  value: c,
                  label: tagLabels[c] || formatTagLabel(c),
                })),
              ]}
            />

            <OpsSelect
              ariaLabel="Filter by availability"
              value={availabilityFilter}
              onChange={setAvailabilityFilter}
              minWidth={130}
              options={[
                { value: "all", label: "All Status" },
                { value: "available", label: "Available" },
                { value: "unavailable", label: "Unavailable" },
              ]}
            />

            <button type="button" className="ops-btn" onClick={openCreateModal}>
              + Add Menu Item
            </button>
          </div>
        </div>

        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>
                  <SortableHeader
                    label="Item"
                    sortKey="item"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Course"
                    sortKey="course"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Price (INR)"
                    sortKey="price"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Status"
                    sortKey="status"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>Loading menu items...</td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5}>No menu items found.</td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      {item.cuisineRegion && (
                        <span className="ops-cell-sub">
                          {tagLabels[item.cuisineRegion] ||
                            item.cuisineRegion.replace(/_/g, " ")}
                        </span>
                      )}
                    </td>
                    <td style={{ textTransform: "capitalize" }}>
                      {item.course
                        ? tagLabels[item.course] || item.course.replace(/_/g, " ")
                        : "—"}
                    </td>
                    <td>
                      {item.retailPriceInr !== null ? `₹${item.retailPriceInr}` : "—"}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => toggleAvailability(item)}
                        className={`ops-badge ${
                          item.isAvailable ? "available" : "unavailable"
                        }`}
                        style={{ border: "none", cursor: "pointer" }}
                        title="Click to toggle availability"
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </button>
                    </td>
                    <td>
                      <div className="ops-icon-actions">
                        <button
                          type="button"
                          className="ops-icon-btn"
                          title={`Edit ${item.name}`}
                          aria-label={`Edit ${item.name}`}
                          onClick={() => openEditModal(item)}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          type="button"
                          className="ops-icon-btn danger"
                          title={`Delete ${item.name}`}
                          aria-label={`Delete ${item.name}`}
                          onClick={() => setPendingDeleteItem(item)}
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

      {modalOpen && (
        <div className="ops-modal-backdrop">
          <div className="ops-modal" style={{ maxWidth: 600 }}>
            <div className="ops-modal-header" style={{ alignItems: "flex-start" }}>
              <div>
                <h2>{editingId ? "Edit Menu Item" : "Add Menu Item"}</h2>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#766D63" }}>
                  Add the item details and upload its food image.
                </p>
              </div>
              <button
                type="button"
                className="ops-modal-close"
                aria-label="Close modal"
                onClick={() => setModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSave}
              style={{ display: "flex", flexDirection: "column", gap: 15 }}
            >
              {modalError && <div className="ops-alert error">{modalError}</div>}

              <div className="ops-field">
                <label htmlFor="menu-name">
                  Item Name<span className="ops-required-star">*</span>
                </label>
                <input
                  id="menu-name"
                  className="ops-input"
                  placeholder="e.g. Paneer Tikka Masala"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="ops-field">
                <label htmlFor="menu-description">
                  Description<span className="ops-required-star">*</span>
                </label>
                <textarea
                  id="menu-description"
                  className="ops-textarea"
                  placeholder="Describe the dish for customers..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="ops-form-grid">
                <div className="ops-field">
                  <label htmlFor="menu-course">
                    All Courses<span className="ops-required-star">*</span>
                  </label>
                  <OpsSelect
                    id="menu-course"
                    ariaLabel="All Courses"
                    fullWidth
                    value={form.course}
                    onChange={(val) => setForm({ ...form, course: val })}
                    options={[
                      { value: "", label: "Select a course" },
                      ...courses.map((c) => ({
                        value: c,
                        label: tagLabels[c] || formatTagLabel(c),
                      })),
                    ]}
                  />
                </div>

                <div className="ops-field">
                  <label htmlFor="menu-cuisine">
                    Cuisine Region<span className="ops-required-star">*</span>
                  </label>
                  <OpsSelect
                    id="menu-cuisine"
                    ariaLabel="Cuisine Region"
                    fullWidth
                    value={form.cuisineRegion}
                    onChange={(val) => setForm({ ...form, cuisineRegion: val })}
                    options={[
                      { value: "", label: "Select cuisine region" },
                      ...cuisineRegions.map((c) => ({
                        value: c,
                        label: tagLabels[c] || formatTagLabel(c),
                      })),
                    ]}
                  />
                </div>

                <div className="ops-field">
                  <label htmlFor="menu-inr">
                    Price (INR)<span className="ops-required-star">*</span>
                  </label>
                  <input
                    id="menu-inr"
                    type="number"
                    min={1}
                    step="0.01"
                    className="ops-input"
                    value={form.retailPriceInr}
                    onChange={(e) =>
                      setForm({ ...form, retailPriceInr: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="ops-field">
                  <label htmlFor="menu-spice">
                    Spice Level<span className="ops-required-star">*</span>
                  </label>
                  <OpsSelect
                    id="menu-spice"
                    ariaLabel="Spice Level"
                    fullWidth
                    value={form.spiceLevel}
                    onChange={(val) => setForm({ ...form, spiceLevel: val })}
                    options={spiceOptions}
                  />
                </div>

                <div className="ops-field full">
                  <label htmlFor="menu-availability">
                    Availability<span className="ops-required-star">*</span>
                  </label>
                  <OpsSelect
                    id="menu-availability"
                    ariaLabel="Availability"
                    fullWidth
                    value={form.isAvailable ? "available" : "unavailable"}
                    onChange={(val) =>
                      setForm({ ...form, isAvailable: val === "available" })
                    }
                    options={[
                      { value: "available", label: "Available" },
                      { value: "unavailable", label: "Unavailable" },
                    ]}
                  />
                </div>
              </div>

              {dietaryTagOptions.length > 0 && (
                <div className="ops-field">
                  <label>Dietary Tags</label>
                  <div className="ops-tag-chips">
                    {dietaryTagOptions.map((tag) => {
                      const selected = form.dietaryCompatible.includes(tag);
                      return (
                        <label
                          key={tag}
                          className={`ops-tag-chip${selected ? " selected" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              toggleTag("dietaryCompatible", tag)
                            }
                          />
                          {tagLabels[tag] || formatTagLabel(tag)}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {moodTagOptions.length > 0 && (
                <div className="ops-field">
                  <label>Mood Tags</label>
                  <div className="ops-tag-chips">
                    {moodTagOptions.map((tag) => {
                      const selected = form.moodTags.includes(tag);
                      return (
                        <label
                          key={tag}
                          className={`ops-tag-chip${selected ? " selected" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleTag("moodTags", tag)}
                          />
                          {tagLabels[tag] || formatTagLabel(tag)}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="ops-field">
                <label htmlFor="menu-image-file">Food Image</label>
                <div className="ops-file-input-wrap">
                  <input
                    id="menu-image-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/*"
                    onChange={(e) =>
                      handleFileChange(e.target.files?.[0] ?? null)
                    }
                  />
                </div>
                <span style={{ fontSize: 10, color: "#8D8379" }}>
                  Choose a JPG, PNG or WebP image.
                </span>
              </div>

              <div className="ops-menu-image-preview">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Menu item preview" />
                ) : (
                  <span>Image preview will appear here</span>
                )}
              </div>

              <div className="ops-checkbox-row">
                <label className="ops-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) =>
                      setForm({ ...form, isAvailable: e.target.checked })
                    }
                  />
                  Available for Ordering
                </label>

                <label className="ops-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isSignature}
                    onChange={(e) =>
                      setForm({ ...form, isSignature: e.target.checked })
                    }
                  />
                  Signature Dish
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 4,
                }}
              >
                <button
                  type="button"
                  className="ops-btn ops-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ops-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Menu Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <OpsConfirmModal
        open={Boolean(pendingDeleteItem)}
        title="Delete Menu Item"
        message={
          pendingDeleteItem
            ? `Are you sure you want to delete "${pendingDeleteItem.name}" from the menu?`
            : ""
        }
        confirmLabel="Delete Item"
        variant="danger"
        busy={deleting}
        onConfirm={confirmDeleteItem}
        onClose={() => setPendingDeleteItem(null)}
      />
    </OpsShell>
  );
}
