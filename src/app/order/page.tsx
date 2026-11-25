
"use client";

import { useEffect, useMemo, useState } from "react";

type Taxonomy = {
  slug: string;
  name: string;
};

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  course: string | null;
  cuisineRegion: string | null;
  spiceLevel: number | null;
  retailPriceInr: number | null;
  retailPriceUsd: number | null;
  moodTags: string[];
  dietaryCompatible: string[];
  allergens: string[];
  isSignature: boolean;
  imageUrl: string | null;
};

type Taxonomies = {
  courses: Taxonomy[];
  cuisineRegions: Taxonomy[];
  moodTags: Taxonomy[];
  dietaryTags: Taxonomy[];
  allergens: Taxonomy[];
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type FilterKey = "cuisine" | "course" | "spice" | "mood";

const CART_KEY = "cravora_wireframe_cart";
const CURRENCY_KEY = "cravora_wireframe_currency";

const spiceOptions = [
  { slug: "0", name: "No spice" },
  { slug: "1", name: "Level 1 Mild" },
  { slug: "2", name: "Level 2" },
  { slug: "3", name: "Level 3 Medium" },
  { slug: "4", name: "Level 4 Hot" },
  { slug: "5", name: "Level 5 Extra hot" },
];

const emptyFilters = {
  cuisine: [] as string[],
  course: [] as string[],
  spice: [] as string[],
  mood: [] as string[],
  dietary: [] as string[],
};

function displayName(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [taxonomies, setTaxonomies] = useState<Taxonomies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);

  
useEffect(() => {
  function handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest(".multi-select-filter")) {
      setOpenFilter(null);
    }
  }

  document.addEventListener("mousedown", handleOutsideClick);

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, []);

  const [optionSearch, setOptionSearch] = useState("");

  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [storageReady, setStorageReady] = useState(false);

  // Load the menu from the database API.
  useEffect(() => {
    async function loadMenu() {
      try {
        const response = await fetch("/api/menu-items");

        if (!response.ok) {
          throw new Error("Unable to load the menu.");
        }

        const data = await response.json();

        setMenuItems(data.items ?? []);
        setTaxonomies(data.taxonomies ?? null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  // Restore saved currency and cart after the page loads.
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem(CURRENCY_KEY);

      if (savedCurrency === "INR" || savedCurrency === "USD") {
        setCurrency(savedCurrency);
      }

      const savedCart = localStorage.getItem(CART_KEY);

      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch {
      setCart([]);
    }

    setStorageReady(true);
  }, []);

  // Save cart changes.
  useEffect(() => {
    if (storageReady) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, storageReady]);

  const currencySymbol = currency === "INR" ? "₹" : "$";

  function getPrice(item: MenuItem) {
    return currency === "INR"
      ? item.retailPriceInr
      : item.retailPriceUsd;
  }

  function formatPrice(price: number | null) {
    if (price === null || price === undefined) {
      return "Price unavailable";
    }

    return `${currencySymbol}${price.toFixed(2)}`;
  }

  // Apply search and all selected filters.
  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(term) ||
        (item.description ?? "").toLowerCase().includes(term);

      const matchesCuisine =
        filters.cuisine.length === 0 ||
        filters.cuisine.includes(item.cuisineRegion ?? "");

      const matchesCourse =
        filters.course.length === 0 ||
        filters.course.includes(item.course ?? "");

      const matchesSpice =
        filters.spice.length === 0 ||
        filters.spice.includes(String(item.spiceLevel));

      const matchesMood =
        filters.mood.length === 0 ||
        filters.mood.some((tag) => item.moodTags.includes(tag));

      const matchesDietary =
        filters.dietary.length === 0 ||
        filters.dietary.some((tag) =>
          item.dietaryCompatible.includes(tag)
        );

      return (
        matchesSearch &&
        matchesCuisine &&
        matchesCourse &&
        matchesSpice &&
        matchesMood &&
        matchesDietary
      );
    });
  }, [menuItems, search, filters]);

  function toggleFilter(key: FilterKey, value: string) {
    setFilters((current) => {
      const selected = current[key];

      return {
        ...current,
        [key]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    });
  }

  function clearFilters() {
    setSearch("");
    setFilters({
      cuisine: [],
      course: [],
      spice: [],
      mood: [],
      dietary: [],
    });
    setOpenFilter(null);
    setOptionSearch("");
  }

  function changeQuantity(item: MenuItem, change: number) {
    const price = getPrice(item);

    if (price === null || price === undefined) return;

    setCart((current) => {
      const existing = current.find((entry) => entry.id === item.id);

      if (existing) {
        const nextQuantity = existing.quantity + change;

        if (nextQuantity <= 0) {
          return current.filter((entry) => entry.id !== item.id);
        }

        return current.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: nextQuantity }
            : entry
        );
      }

      if (change > 0) {
        return [
          ...current,
          {
            id: item.id,
            name: item.name,
            price,
            quantity: 1,
          },
        ];
      }

      return current;
    });
  }

  function getCartQuantity(itemId: string) {
    return cart.find((item) => item.id === itemId)?.quantity ?? 0;
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartSubtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function renderFilter(
    key: FilterKey,
    placeholder: string,
    options: Taxonomy[]
  ) {
    const selected = filters[key];
    const isOpen = openFilter === key;

    const visibleOptions = options.filter((option) =>
      displayName(option.name)
        .toLowerCase()
        .includes(optionSearch.toLowerCase())
    );

    return (
      <div className="multi-select-filter" key={key}>
        
<button
  type="button"
  className="multi-select-trigger"
  aria-expanded={isOpen}
  onClick={() => {
    setOpenFilter(isOpen ? null : key);
    setOptionSearch("");
  }}
>
  <span>
    {selected.length === 0
      ? placeholder
      : `${selected.length} selected`}
  </span>
  <span className="dropdown-arrow" aria-hidden="true">
    ▾
  </span>
</button>
       

        {isOpen && (
          <div className="multi-select-panel">
            <input
              type="search"
              className="multi-select-search"
              placeholder="Search..."
              value={optionSearch}
              onChange={(event) => setOptionSearch(event.target.value)}
            />

            <div className="multi-select-options">
              {visibleOptions.map((option) => (
                <label className="multi-select-option" key={option.slug}>
                  <input
                    type="checkbox"
                    checked={selected.includes(option.slug)}
                    onChange={() => toggleFilter(key, option.slug)}
                  />
                  <span>{displayName(option.name)}</span>
                </label>
              ))}

              {visibleOptions.length === 0 && (
                <p className="filter-no-results">No options found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderDishCard(item: MenuItem) {
    const price = getPrice(item);
    const quantity = getCartQuantity(item.id);

    return (
      <article className="menu-item-card" key={item.id}>
        <div
          className={`menu-item-image ${
            item.imageUrl ? "" : "image-placeholder"
          }`}
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.parentElement?.classList.add(
                  "image-placeholder"
                );
                if (event.currentTarget.parentElement) {
                  event.currentTarget.parentElement.textContent =
                    "Image coming soon";
                }
              }}
            />
          ) : (
            "Image coming soon"
          )}

          {item.isSignature && (
            <span className="signature-badge">Signature</span>
          )}
        </div>

        <div className="menu-item-content">
          <div className="menu-card-title-row">
            <h3>{item.name}</h3>
            <span className="menu-item-price">{formatPrice(price)}</span>
          </div>

          <p className="menu-item-description">
            {item.description}
          </p>

          <div className="menu-item-dietary">
            {item.dietaryCompatible.map((tag) => (
              <span key={tag}>{displayName(tag)}</span>
            ))}
          </div>

          <div className="menu-card-bottom-row">
            <span className="menu-item-spice">
              Spice {item.spiceLevel ?? "N/A"}
            </span>

            <div className="menu-item-actions">
              {price === null || price === undefined ? (
                <span className="price-unavailable">
                  Price unavailable
                </span>
              ) : quantity > 0 ? (
                <>
                  <button
                    type="button"
                    aria-label={`Remove one ${item.name}`}
                    onClick={() => changeQuantity(item, -1)}
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    aria-label={`Add one ${item.name}`}
                    onClick={() => changeQuantity(item, 1)}
                  >
                    +
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="add-to-cart-btn"
                  onClick={() => changeQuantity(item, 1)}
                >
                  + Add
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }
    
return (
  <>
    <header className="site-header">
      <div className="container header-inner">
        <a href="/" className="logo">
          cravora<span>.</span>
        </a>

        <nav className="main-nav">
          <a href="/">Home</a>
          <a href="/dining">Dining</a>
          <a href="/order" className="active">
            Order Online
          </a>
          <a href="/my-activity">My Activity</a>
          <a href="/about">Our Story</a>
          <a href="/contact">Contact</a>
        </nav>

        <div className="header-actions">
          <a href="/order/cart" className="btn btn-primary">
            Cart <span>({cartCount})</span>
          </a>
        </div>
      </div>
    </header>
 

 
       <main className="menu-page">
        <section className="menu-hero">
          <div className="container">
            <div className="menu-hero-layout">
              <div className="menu-hero-content">
                <p className="eyebrow">FRESHLY PREPARED FOR YOU</p>
                <h1>Explore Our Menu</h1>
                <p className="menu-hero-description">
                  Discover dishes, explore flavours and find your favourites.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="menu-filter-section">
          <div className="container">
            <div className="menu-filter-top-row">
              <div className="menu-dropdown-filters">
                {taxonomies && (
                  <>
                    {renderFilter(
                      "cuisine",
                      "All Cuisine Regions",
                      taxonomies.cuisineRegions
                    )}
                    {renderFilter(
                      "course",
                      "All Courses",
                      taxonomies.courses
                    )}
                    {renderFilter(
                      "spice",
                      "All Spice Levels",
                      spiceOptions
                    )}
                    {renderFilter(
                      "mood",
                      "All Moods",
                      taxonomies.moodTags
                    )}
                  </>
                )}
              </div>

              <div className="menu-search menu-search-compact">
                <input
                  type="search"
                  placeholder="Search dishes..."
                  aria-label="Search dishes"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="dietary-filter-row">
              <h3>Dietary:</h3>

              <div className="dietary-options">
                <button
                  type="button"
                  className={`dietary-chip ${
                    filters.dietary.length === 0 ? "active" : ""
                  }`}
                  onClick={() =>
                    setFilters((current) => ({
                      ...current,
                      dietary: [],
                    }))
                  }
                >
                  All
                </button>

                {taxonomies?.dietaryTags.map((tag) => (
                  <button
                    type="button"
                    key={tag.slug}
                    className={`dietary-chip ${
                      filters.dietary.includes(tag.slug) ? "active" : ""
                    }`}
                    onClick={() =>
                      setFilters((current) => ({
                        ...current,
                        dietary: current.dietary.includes(tag.slug)
                          ? current.dietary.filter(
                              (value) => value !== tag.slug
                            )
                          : [...current.dietary, tag.slug],
                      }))
                    }
                  >
                    {displayName(tag.name)}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="clear-filters"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          </div>
        </section>

        <section className="menu-items-section">
          <div className="container">
            <div className="menu-results-heading">
              <p>
                {loading
                  ? "Loading dishes..."
                  : `${filteredItems.length} ${
                      filteredItems.length === 1 ? "dish" : "dishes"
                    } found`}
              </p>
            </div>

            {error && <p role="alert">{error}</p>}

            {!loading && !error && filteredItems.length === 0 && (
              <div id="menu-empty-state">
                <h2>No dishes found</h2>
                <p>Try changing your search or filters.</p>
                <button
                  type="button"
                  className="clear-filters"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              </div>
            )}

            {!loading &&
              taxonomies?.courses.map((course) => {
                const courseItems = filteredItems.filter(
                  (item) => item.course === course.slug
                );

                if (courseItems.length === 0) return null;

                return (
                  <section
                    className="menu-course-section"
                    key={course.slug}
                  >
                    <h2>{displayName(course.name)}</h2>
                    <div className="menu-items-grid">
                      {courseItems.map(renderDishCard)}
                    </div>
                  </section>
                );
              })}
          </div>
        </section>
      </main>

      {cartCount > 0 && (
        <div className="floating-cart-summary">
          <div className="floating-cart-details">
            <strong>
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </strong>
            <span>{formatPrice(cartSubtotal)}</span>
          </div>

          <a href="/order/cart">View Cart</a>
        </div>
      )}

      <footer className="site-footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <a href="/" className="logo">
                cravora<span>.</span>
              </a>

              <h2>
                Good food.
                <br />
                Great moments.
              </h2>

              <p>
                Discover delicious food, explore new flavours,
                and find something worth coming back for.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h3>EXPLORE</h3>
                <a href="/dining">Dining</a>
                <a href="/order">Order Online</a>
                <a href="/about">Our Story</a>
                <a href="/contact">Contact</a>
              </div>

              <div className="footer-column">
                <h3>GET IN TOUCH</h3>
                <a href="/contact">Contact Us →</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Cravora. All rights reserved.</p>
            <p>Made for the love of good food.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

