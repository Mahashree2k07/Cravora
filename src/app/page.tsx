
import Image from "next/image";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      {/* HEADER */}
      <header className="site-header">
        <div className="container header-inner">
          <a href="/" className="logo">
            cravora<span>.</span>
          </a>

          <nav className="main-nav">
            <a href="/" className="active">Home</a>
            <a href="/dining">Dining</a>
            <a href="/order">Order Online</a>
            <a href="/my-activity">My Activity</a>
            <a href="/about">Our Story</a>
            <a href="/contact">Contact</a>
          </nav>

          <div className="header-actions">
            <a href="/order" className="btn btn-primary">
              Order Now
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <span className="eyebrow">
                A DIFFERENT KIND OF FOOD EXPERIENCE
              </span>

              <h1>
                Good food.
                <br />
                Better living.
              </h1>

              <p>
                More than a meal, it is a moment worth sharing.
                Discover thoughtfully crafted food experiences
                designed to bring people closer.
              </p>

              <div className="hero-actions">
                <a href="/order" className="btn btn-primary">
                  Explore Our Food
                </a>

                <a href="/dining" className="btn btn-secondary">
                  Discover Dining
                </a>
              </div>
            </div>

            <div className="hero-image">
              <Image
                src="/images/hero/cravora-hero.jpg"
                alt="A beautifully presented Indian food spread at Cravora"
                className="hero-main-image"
                width={1000}
                height={1000}
                priority
              />
            </div>
          </div>
        </section>

        {/* BRAND VALUES */}
        <section className="brand-values">
          <div className="container values-grid">
            <div className="value-item">
              <span>Fresh</span>
              <p>Ingredients</p>
            </div>

            <div className="value-item">
              <span>Made</span>
              <p>With care</p>
            </div>

            <div className="value-item">
              <span>Shared</span>
              <p>With love</p>
            </div>
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section className="section experience-section">
          <div className="container experience-grid">
            <div className="experience-image">
              <Image
                src="/images/hero/cravora-experience.jpg"
                alt="An inviting restaurant dining experience"
                className="experience-main-image"
                width={1000}
                height={1000}
              />
            </div>

            <div className="experience-content">
              <span className="eyebrow">
                THE CRAVORA EXPERIENCE
              </span>

              <h2>Made to be enjoyed.</h2>

              <span className="subheading">
                Our philosophy
              </span>

              <h3>Food connects us.</h3>

              <p>
                Great food is not just about what is on the plate.
                It is about everything around it.
              </p>

              <p>
                From intimate dinners to everyday meals and special
                celebrations, Cravora brings together the experiences
                that make food unforgettable.
              </p>
            </div>
          </div>
        </section>

        {/* DISCOVER OUR OFFERINGS */}
        <section className="section offerings-section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">
                DISCOVER WHAT WE OFFER
              </span>

              <h2>Find your flavour.</h2>

              <p>
                However you choose to enjoy good food, there is
                a Cravora experience waiting for you.
              </p>
            </div>

            <div className="offerings-grid">
              {/* DINING CARD */}
              <article className="offering-card">
                <div className="offering-image">
                  <Image
                    src="/images/hero/cravora-dining.jpg"
                    alt="An elegant restaurant dining experience"
                    width={900}
                    height={600}
                  />
                </div>

                <div className="offering-content">
                  <div className="offering-topline">
                    <span>THE RESTAURANT</span>
                    <span>01</span>
                  </div>

                  <h3>Dine With Us</h3>

                  <p>
                    Slow down, settle in, and experience
                    food worth remembering.
                  </p>

                  <a href="/dining" className="text-link">
                    Discover dining →
                  </a>
                </div>
              </article>

              {/* ORDER ONLINE CARD */}
              <article className="offering-card">
                <div className="offering-image">
                  <Image
                    src="/images/hero/cravora-order-online.jpg"
                    alt="A freshly prepared Indian meal ready to order"
                    width={900}
                    height={600}
                  />
                </div>

                <div className="offering-content">
                  <div className="offering-topline">
                    <span>AT YOUR DOORSTEP</span>
                    <span>02</span>
                  </div>

                  <h3>Order Online</h3>

                  <p>
                    Restaurant-quality favourites, delivered
                    straight to your table.
                  </p>

                  <a href="/order" className="text-link">
                    Explore the menu →
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="final-cta">
          <div className="container final-cta-inner">
            <div>
              <span className="eyebrow">
                YOUR NEXT FAVOURITE MOMENT STARTS HERE
              </span>

              <h2>
                Come hungry.
                <br />
                Leave happy.
              </h2>
            </div>

            <a href="/order" className="btn btn-primary">
              Get Started
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <SiteFooter activePath="/" />
    </>
  );
}
