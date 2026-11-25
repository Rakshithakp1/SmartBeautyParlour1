
import './App.css';

function Home() {
  const services = [
    { icon: '💇‍♀️', name: 'Hair Styling', desc: 'Beautiful hairstyles and professional hair care.' },
    { icon: '✨', name: 'Facial & Skin Care', desc: 'Refresh your skin with our premium treatments.' },
    { icon: '💄', name: 'Makeup', desc: 'Look stunning for every special occasion.' },
    { icon: '💅', name: 'Nail Care', desc: 'Elegant manicure, pedicure and nail art.' }
  ];

  return (
    <div className="app">
      <nav className="navbar">
        <a href="#home" className="brand">
          <span className="brand-icon">✦</span>
          <span>GLAMOUR <b>GLOW</b><small>BEAUTY & WELLNESS</small></span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
          <a href="/my-bookings">My Bookings</a>
          <a href="/admin-dashboard">Admin Dashboard</a>
        </div>

        <a href="/login" className="nav-button">
          Login / Register <span>→</span>
        </a>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow"><span></span> YOUR BEAUTY, OUR PASSION</div>

            <h1>
              Enhance Your<br />
              <em>Natural Beauty</em>
            </h1>

            <p className="hero-description">
              Discover the beauty within you. Experience luxurious beauty
              treatments, expert care and a touch of elegance at Glamour Glow.
            </p>

            <div className="hero-buttons">
              <a href="/login" className="primary-button">Book Appointment <span>→</span></a>
              <a href="#services" className="secondary-button">Explore Services</a>
            </div>

            <div className="hero-features">
              <div><strong>20+</strong><span>Beauty Services</span></div>
              <i></i>
              <div><strong>Expert</strong><span>Beauty Care</span></div>
              <i></i>
              <div><strong>Premium</strong><span>Experience</span></div>
            </div>
          </div>

          <div className="hero-image-area">
            <div className="image-frame"></div>
            <img
              className="hero-image"
              src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1000&q=90"
              alt="Beautiful woman with elegant natural makeup"
            />
            <div className="image-label">
              <span>✦</span>
              <div><strong>Feel Beautiful</strong><small>Every day, every moment</small></div>
            </div>
            <div className="image-decoration">G</div>
          </div>
        </section>

        <section className="welcome-strip">
          <span>✦ PROFESSIONAL BEAUTY CARE</span>
          <span>✦ PREMIUM EXPERIENCE</span>
          <span>✦ BEAUTY WITH CONFIDENCE</span>
        </section>

        <section className="about-section" id="about">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85"
              alt="Beauty salon professional beauty care"
            />
            <div className="about-tag">Your Beauty Destination</div>
          </div>

          <div className="about-content">
            <div className="eyebrow">ABOUT GLAMOUR GLOW</div>
            <h2>Beauty Begins<br />With <em>You.</em></h2>
            <p>
              Glamour Glow is your destination for beauty, care and confidence.
              We bring together professional beauty services and personalized
              attention to make every visit special.
            </p>
            <p>
              From everyday beauty care to special occasion makeovers,
              our goal is to help you look and feel your best.
            </p>
            <a href="/login" className="text-link">Discover Your Beauty <span>→</span></a>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading">
            <div className="eyebrow">WHAT WE OFFER</div>
            <h2>Our Beauty <em>Services</em></h2>
            <p>Explore our range of beauty services, designed just for you.</p>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <div className="service-card" key={service.name}>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <p>{service.desc}</p>
                <a href="/login">Book Now <span>→</span></a>
              </div>
            ))}
          </div>

          <a href="/login" className="primary-button all-services">
            View All 20 Services <span>→</span>
          </a>
        </section>

        <section className="contact-section" id="contact">
          <div className="eyebrow">A LITTLE TIME FOR YOURSELF</div>
          <h2>Ready to Glow?</h2>
          <p>Give yourself the beauty care you deserve. Your beautiful journey starts here.</p>
          <a href="/login" className="primary-button">
            Book Your Appointment <span>→</span>
          </a>
        </section>
      </main>

      <footer className="footer">
        <a href="#home" className="footer-brand">GLAMOUR <b>GLOW</b></a>
        <p>Beauty is not just a look, it's a feeling.</p>
        <div>© 2026 Glamour Glow Beauty Parlour. All Rights Reserved.</div>
      </footer>
    </div>
  );
}

export default Home;
