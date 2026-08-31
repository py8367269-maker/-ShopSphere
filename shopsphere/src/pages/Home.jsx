function Home() {
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="hero" id="home">
        <div className="hero-text">
          <p className="tagline">THE FUTURE OF SHOPPING</p>

          <h1>
            Discover a new
            <span> way to shop.</span>
          </h1>

          <p className="description">
            Explore products in an immersive shopping experience
            designed for the next generation.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Explore Collection →</button>
            <button className="secondary-btn">Learn More</button>
          </div>
        </div>

        {/* ================= HERO PRODUCT GRID ================= */}
        <div className="hero-grid">
          <img
            src="https://images.unsplash.com/photo-1556761175-129418cb2dfe?w=500"
            alt="Headphones"
            className="grid-img grid-img-1"
          />
          <img
            src="https://images.unsplash.com/photo-1626432424546-104e5fdbe556?w=500"
            alt="Boots"
            className="grid-img grid-img-2"
          />
          <img
            src="https://images.unsplash.com/photo-1697319501786-8f5dc64326ad?w=500"
            alt="Jacket"
            className="grid-img grid-img-3"
          />
          <img
            src="https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=500"
            alt="Handbag"
            className="grid-img grid-img-4"
          />
          <img
            src="https://images.unsplash.com/photo-1588748543198-cd1afaf858ff?w=500"
            alt="Watch"
            className="grid-img grid-img-5"
          />
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="categories" id="shop">
        <div className="section-heading">
          <p>EXPLORE</p>
          <h2>Shop by Category</h2>
        </div>

        <div className="category-grid">
          <div className="category-card">
            <div className="category-icon">👟</div>
            <h3>Fashion</h3>
            <p>Modern styles</p>
          </div>

          <div className="category-card">
            <div className="category-icon">💻</div>
            <h3>Technology</h3>
            <p>Smart essentials</p>
          </div>

          <div className="category-card">
            <div className="category-icon">🏠</div>
            <h3>Home</h3>
            <p>Beautiful spaces</p>
          </div>

          <div className="category-card">
            <div className="category-icon">🎧</div>
            <h3>Accessories</h3>
            <p>Complete your look</p>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="about" id="about">
        <p className="about-label">WHY SHOPSPHERE?</p>

        <h2>
          Shopping should feel
          <span> exciting.</span>
        </h2>

        <p className="about-text">
          ShopSphere combines modern design, interactive experiences,
          and intelligent technology to create a completely different
          way of discovering products.
        </p>
      </section>
    </>
  );
}

export default Home;