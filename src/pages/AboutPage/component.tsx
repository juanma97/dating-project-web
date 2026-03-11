import React from 'react';
import Header from '../../components/Header/component';
import Footer from '../../components/Footer/component';
import './component.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <Header />

      <main className="about-main">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1 className="about-title">
              Bridge the gap between digital discovery and physical interaction.
            </h1>
            <p className="about-subtitle">
              We are building a premium platform to revolutionize how people connect in the real
              world. Our mission is to take you off the screen and into meaningful, face-to-face
              conversations.
            </p>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="about-values">
          <h2 className="section-heading">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">✨</div>
              <h3 className="value-title">Minimalist Design</h3>
              <p className="value-text">
                We remove friction so you can focus on what matters. Every element on our platform
                serves a purpose to guide your journey effortlessly.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">💎</div>
              <h3 className="value-title">Excellent Experience</h3>
              <p className="value-text">
                From a curated list of events to a premium feel across all devices, we ensure your
                time spent here is intuitive, beautiful, and flawless.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3 className="value-title">Real-World Connectivity</h3>
              <p className="value-text">
                We believe the best relationships are built in person. Our platform is just the
                starting point for your next great authentic connection.
              </p>
            </div>
          </div>
        </section>

        {/* Audience / Platform Section */}
        <section className="about-platform">
          <div className="platform-content">
            <h2 className="section-heading">Who We Are For</h2>
            <div className="audience-blocks">
              <div className="audience-block">
                <h3>For Individuals</h3>
                <p>
                  Looking for authentic, face-to-face connections? Discover curated speed dating
                  events and expand your social circle without the endless swiping.
                </p>
              </div>
              <div className="audience-block">
                <h3>For Organizers</h3>
                <p>
                  Seeking a clean, high-traffic platform to list your events? Reach a targeted
                  audience ready to engage and connect in the real world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="about-cta">
          <h2>Ready to meet someone new?</h2>
          <p>Explore upcoming events near you today.</p>
          <a href="/" className="cta-button">
            Find Events
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
