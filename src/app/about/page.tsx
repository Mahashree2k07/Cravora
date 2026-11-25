
import Image from "next/image";
import styles from "./about.module.css";

export default function About() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a href="/" className="logo">cravora<span>.</span></a>

          <nav className="main-nav">
            <a href="/">Home</a>
            <a href="/dining">Dining</a>
            <a href="/order">Order Online</a>
            <a href="/my-activity">My Activity</a>
            <a href="/about" className="active">Our Story</a>
            <a href="/contact">Contact</a>
          </nav>

          <div className="header-actions">
            <a href="/order" className="btn btn-primary">Order Now</a>
          </div>
        </div>
      </header>

      <main className={styles.storyPage}>
        {/* INTRODUCTION */}
        <section className={styles.hero}>
          <div className={styles.heroLayout}>
            <div className={styles.heroContent}>
              <p className={styles.eyebrow}>GET TO KNOW CRAVORA</p>
              <h1>Good food brings people together.</h1>
              <p>
                Every meal has a story, every flavour creates a
                memory. Cravora makes it easier to discover food
                and enjoy the moments that come with it.
              </p>
            </div>

            <div className={styles.heroImage}>
              <Image
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85"
                alt="A colourful spread of freshly prepared food"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* THE IDEA BEHIND CRAVORA */}
        <section className={styles.intro}>
          <div className={styles.introLayout}>
            <div>
              <p className={styles.eyebrow}>THE IDEA BEHIND CRAVORA</p>
              <h2>More than just finding a meal.</h2>
            </div>

            <div className={styles.introContent}>
              <p>Finding something delicious should feel exciting, not complicated.</p>
              <p>
                Cravora brings food discovery and ordering together
                in one place, helping customers explore dishes,
                discover different flavours and choose what they
                would love to enjoy.
              </p>
              <p>
                Whether it is a quick meal, a favourite dish or
                a table shared with people who matter, we want
                every food experience to feel a little more special.
              </p>
            </div>
          </div>
        </section>

        {/* OUR FOOD PHILOSOPHY */}
        <section className={styles.philosophy}>
          <div className={styles.centerHeading}>
            <p className={styles.eyebrow}>WHAT MATTERS TO US</p>
            <h2>Our food philosophy.</h2>
            <p>A good food experience is about more than what is on the plate.</p>
          </div>

          <div className={styles.philosophyGrid}>
            <article className={styles.card}>
              <span className={styles.number}>01</span>
              <h3>Discover with curiosity</h3>
              <p>
                Explore different dishes, flavours and food choices.
                There is always something new to discover.
              </p>
            </article>

            <article className={styles.card}>
              <span className={styles.number}>02</span>
              <h3>Choose with confidence</h3>
              <p>
                Clear dish information and useful choices help make
                the food ordering experience easier.
              </p>
            </article>

            <article className={styles.card}>
              <span className={styles.number}>03</span>
              <h3>Enjoy every moment</h3>
              <p>
                From everyday meals to dining with loved ones,
                food is best enjoyed when it brings people together.
              </p>
            </article>
          </div>
        </section>

        {/* THE CRAVORA EXPERIENCE */}
        <section className={styles.experience}>
          <div className={styles.experienceLayout}>
            <div className={styles.experienceImage}>
              <Image
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=85"
                alt="A table filled with delicious food"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className={styles.experienceContent}>
              <p className={styles.eyebrow}>THE CRAVORA EXPERIENCE</p>
              <h2>Food discovery, made simpler.</h2>
              <p>
                We bring together the things that make enjoying
                food easier and more enjoyable.
              </p>

              <div className={styles.point}>
                <span>01</span>
                <div>
                  <h3>Explore</h3>
                  <p>Discover dishes and find flavours that interest you.</p>
                </div>
              </div>

              <div className={styles.point}>
                <span>02</span>
                <div>
                  <h3>Order</h3>
                  <p>Choose your favourites and place your order conveniently.</p>
                </div>
              </div>

              <div className={styles.point}>
                <span>03</span>
                <div>
                  <h3>Enjoy</h3>
                  <p>Make room for good food and great moments.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="/" className="logo">cravora<span>.</span></a>
            <p>
              Good food. Better living. Creating experiences
              that bring people together, one meal at a time.
            </p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <a href="/dining">Dining</a>
            <a href="/order">Order Online</a>
          </div>

          <div className="footer-column">
            <h4>Information</h4>
            <a href="/about">Our Story</a>
            <a href="/contact">Contact</a>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>© 2026 Cravora. All rights reserved.</p>
          <p>Good Food. Great Moments.</p>
        </div>
      </footer>
    </>
  );
}
