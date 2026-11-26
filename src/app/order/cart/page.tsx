
"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { usePublicSettings } from "@/components/PublicSettingsProvider";

const CART_KEY = "cravora_wireframe_cart";
const CURRENCY_KEY = "cravora_wireframe_currency";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type MenuItem = {
  id: string;
  name: string;
  description?: string | null;
  course?: string | null;
  imageUrl?: string | null;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currency, setCurrency] = useState("INR");
  const [loaded, setLoaded] = useState(false);
  const settings = usePublicSettings();

  const symbol = currency === "INR" ? "₹" : "$";

  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      setCart(Array.isArray(savedCart) ? savedCart : []);

      const savedCurrency =
        localStorage.getItem(CURRENCY_KEY) || "INR";

      setCurrency(savedCurrency === "USD" ? "USD" : "INR");
    } catch {
      setCart([]);
    }

    setLoaded(true);

    async function loadMenuItems() {
      try {
        const response = await fetch("/api/menu-items");

        if (!response.ok) {
          throw new Error("Unable to load menu items");
        }

        const data = await response.json();
        setMenuItems(data.items || []);
      } catch (error) {
        console.error("Menu loading error:", error);
      }
    }

    loadMenuItems();
  }, []);

  function saveCart(updatedCart: CartItem[]) {
    setCart(updatedCart);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  }

  function updateQuantity(id: string, change: number) {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + change }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  }

  function removeItem(id: string) {
    saveCart(cart.filter((item) => item.id !== id));
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const groupedItems = useMemo(() => {
    const groups: Record<string, CartItem[]> = {};

    cart.forEach((item) => {
      const menuItem = menuItems.find(
        (menu) => menu.id === item.id
      );

      const course = menuItem?.course || "Other Items";

      if (!groups[course]) {
        groups[course] = [];
      }

      groups[course].push(item);
    });

    return groups;
  }, [cart, menuItems]);

  function formatPrice(price: number) {
    return `${symbol}${Number(price).toFixed(2)}`;
  }

  if (!loaded) {
    return <main className="cart-section"><div className="container">Loading your cart...</div></main>;
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
            <a href="/order" className="active">Order Online</a>
            <a href="/my-activity">My Activity</a>
            <a href="/about">Our Story</a>
            <a href="/contact">Contact</a>
          </nav>

          <div className="header-actions">
            <a href="/order/cart" className="btn btn-primary">
              Cart ({cartCount})
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="container cart-heading">
          <p className="eyebrow">YOUR SELECTION</p>
          <h1>Your Cart</h1>
          <p>Review your favourites before placing your order.</p>
        </section>

        <section className="cart-section">
          <div className="container">

            {cart.length === 0 ? (
              <div id="empty-cart">
                <h2>Your cart is empty</h2>
                <p>
                  Looks like you haven&apos;t added anything to your cart yet.
                  Explore our menu and find something delicious.
                </p>
                <a href="/order" className="btn btn-primary">
                  Explore Menu
                </a>
              </div>
            ) : (
              <div className="cart-layout">

                <section className="cart-items-area">
                  <div className="cart-items-header">
                    <h2>Selected Items</h2>
                    <span>{cartCount} items</span>
                  </div>

                  {Object.entries(groupedItems).map(
                    ([course, items]) => (
                      <div
                        className="cart-category-section"
                        key={course}
                      >
                        <h3 className="cart-category-heading">
                          {course.replace(/_/g, " ")}
                        </h3>

                        {items.map((item) => {
                          const menuItem = menuItems.find(
                            (menu) => menu.id === item.id
                          );

                          return (
                            <article
                              className="cart-item"
                              key={item.id}
                            >
                              {menuItem?.imageUrl ? (
                                <img
                                  src={menuItem.imageUrl}
                                  alt={item.name}
                                  className="cart-item-image"
                                />
                              ) : (
                                <div className="cart-item-image image-placeholder">
                                  <span>Cravora</span>
                                </div>
                              )}

                              <div className="cart-item-details">
                                <h3>{item.name}</h3>

                                {menuItem?.description && (
                                  <p>{menuItem.description}</p>
                                )}

                                <strong>
                                  {formatPrice(item.price)}
                                </strong>
                              </div>

                              <div className="cart-item-actions">
                                <div className="cart-quantity-controls">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateQuantity(item.id, -1)
                                    }
                                    aria-label={`Decrease ${item.name} quantity`}
                                  >
                                    −
                                  </button>

                                  <span>{item.quantity}</span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateQuantity(item.id, 1)
                                    }
                                    aria-label={`Increase ${item.name} quantity`}
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  className="cart-remove"
                                  onClick={() => removeItem(item.id)}
                                >
                                  Remove
                                </button>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )
                  )}

                </section>

                <aside className="cart-summary">
                  <h2>Order Summary</h2>

                  <div className="summary-row">
                    <span>Items ({cartCount})</span>
                    <strong>{formatPrice(subtotal)}</strong>
                  </div>

                  <div className="summary-row summary-total">
                    <span>Total Amount</span>
                    <strong>{formatPrice(subtotal)}</strong>
                  </div>

                  {!settings.acceptOnlineOrders && (
                    <div
                      className="service-paused-banner"
                      role="status"
                      style={{ marginTop: 14, marginBottom: 0 }}
                    >
                      <strong>Online Ordering Paused</strong>
                      <span>
                        Checkout is temporarily unavailable. Call{" "}
                        {settings.restaurantPhone} for assistance.
                      </span>
                    </div>
                  )}

                  {settings.acceptOnlineOrders ? (
                    <a
                      href="/order/checkout"
                      className="btn btn-primary cart-checkout-btn"
                    >
                      Proceed to Checkout
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary cart-checkout-btn"
                      disabled
                    >
                      Proceed to Checkout
                    </button>
                  )}

                  <a
                    href="/order"
                    className="continue-shopping"
                  >
                    ← Continue Shopping
                  </a>
                </aside>

              </div>
            )}

          </div>
        </section>
      </main>

      <SiteFooter activePath="/order" />
    </>
  );
}

