import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Logo from "./components/Logo";
import { SITE_CONFIG, usePageSeo } from "./seo/siteSeo";

const C = {
  bg: "#fbf7f2",
  cream: "#f7efe4",
  sand: "#e8ddd0",
  terracotta: "#c96b3c",
  burnt: "#a85a30",
  espresso: "#2e2118",
  dark: "#1c1612",
  warmGray: "#7d7068",
  muted: "#a69a8e",
  white: "#fffdf9",
  card: "rgba(255,253,249,0.72)",
  coral: "#d4785a",
  amber: "#d4a24e",
  sage: "#8ba888",
  sky: "#7aafc4",
  plum: "#8a6fa8",
};

const CONTACT_EMAIL = SITE_CONFIG.contactEmail;

const scrollToHash = (hash) => {
  if (typeof window === "undefined" || !hash?.startsWith("#")) {
    return;
  }

  const target = document.querySelector(hash);
  if (!target) {
    return;
  }

  const nav = document.querySelector(".site-nav");
  const navHeight = nav?.getBoundingClientRect().height ?? 0;
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;

  window.history.replaceState({}, "", hash);
  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });
};

const scrollToHashAfterMenuClose = (hash) => {
  if (typeof window === "undefined") {
    return;
  }

  window.setTimeout(() => {
    scrollToHash(hash);
  }, 220);
};

const services = [
  {
    num: "01",
    title: "Custom Website Design",
    desc: "A website built specifically for your business, not a template with your logo dropped in. Designed to look polished on every screen and guide visitors toward getting in touch.",
    color: C.terracotta,
  },
  {
    num: "02",
    title: "Search Engine Optimisation",
    desc: "Proper page structure, metadata, and indexing so your business appears when potential customers search for the services you offer.",
    color: C.amber,
  },
  {
    num: "03",
    title: "Hosting Setup & Handoff",
    desc: "We configure your hosting, deploy the finished site, and hand over full access. You own everything from day one, with no ongoing fees to us.",
    color: C.sage,
  },
  {
    num: "04",
    title: "Performance Optimisation",
    desc: "Clean, lightweight code and optimised assets so your site loads quickly on any connection, because slow websites lose customers.",
    color: C.sky,
  },
  {
    num: "05",
    title: "Contact & Enquiry Forms",
    desc: "Professionally designed forms with input validation, making it easy for genuine leads to reach you while keeping spam to a minimum.",
    color: C.coral,
  },
  {
    num: "06",
    title: "Google Business Integration",
    desc: "Your site connected to Google Maps and local search, giving nearby customers the confidence to find and choose your business.",
    color: C.plum,
  },
];

const processSteps = [
  {
    step: "1",
    title: "Consultation",
    desc: "We discuss your business, your customers, and what you need the website to achieve. A brief call or message is all it takes.",
    time: "Day 1",
  },
  {
    step: "2",
    title: "Design",
    desc: "You receive a visual direction early on. We refine together until the look, feel, and structure are exactly right.",
    time: "Day 2-5",
  },
  {
    step: "3",
    title: "Development",
    desc: "The approved design is built into a fully responsive, fast-loading website with SEO foundations in place.",
    time: "Day 5-10",
  },
  {
    step: "4",
    title: "Launch",
    desc: "Final testing, hosting deployment, and a complete handover. Your website goes live and the access is entirely yours.",
    time: "Day 10-14",
  },
];

const plans = [
  {
    name: "Starter",
    price: "R2,000",
    desc: "A clean, professional single-page website for businesses establishing their online presence.",
    best: false,
    features: [
      "Single-page website",
      "Mobile responsive design",
      "Contact section",
      "Basic SEO setup",
      "Hosting setup & deployment",
      "1 round of revisions",
    ],
  },
  {
    name: "Professional",
    price: "R3,500",
    desc: "A comprehensive multi-page website built for businesses ready to grow their customer base online.",
    best: true,
    features: [
      "Multi-page website (up to 5 pages)",
      "Mobile responsive design",
      "Enquiry form with validation",
      "Full SEO setup & Google indexing",
      "Hosting setup & deployment",
      "Google Maps integration",
      "Speed optimisation",
      "2 rounds of revisions",
    ],
  },
  {
    name: "Premium",
    price: "R5,000",
    desc: "The complete package for businesses that want the highest standard of online presence.",
    best: false,
    features: [
      "Multi-page website (up to 8 pages)",
      "Advanced enquiry forms",
      "Full SEO & analytics setup",
      "Image & speed optimisation",
      "Social media integration",
      "3 rounds of revisions",
      "30 days post-launch support",
    ],
  },
];

const heroBlobs = [
  {
    size: "clamp(8rem, 20vw, 16rem)",
    top: "12%",
    left: "10%",
    gradient: `linear-gradient(145deg, ${C.terracotta}, ${C.coral})`,
    delay: "0s",
  },
  {
    size: "clamp(6.5rem, 16vw, 12rem)",
    top: "8%",
    right: "10%",
    gradient: `linear-gradient(145deg, ${C.sky}, ${C.plum})`,
    delay: "-2s",
  },
  {
    size: "clamp(6rem, 14vw, 10.5rem)",
    bottom: "14%",
    left: "8%",
    gradient: `linear-gradient(145deg, ${C.amber}, ${C.terracotta})`,
    delay: "-4s",
  },
  {
    size: "clamp(5.5rem, 12vw, 8.75rem)",
    bottom: "10%",
    right: "8%",
    gradient: `linear-gradient(145deg, ${C.sage}, ${C.sky})`,
    delay: "-1s",
  },
];

const floatingOrbs = [
  {
    className: "hero-orb hero-orb-one",
    size: "clamp(10rem, 24vw, 22rem)",
    top: "10%",
    left: "0%",
    gradient: `radial-gradient(circle, ${C.sky}42, transparent 72%)`,
  },
  {
    className: "hero-orb hero-orb-two",
    size: "clamp(9rem, 20vw, 20rem)",
    bottom: "5%",
    right: "0%",
    gradient: `radial-gradient(circle, ${C.sky}2d, ${C.coral}18, transparent 72%)`,
  },
  {
    className: "hero-orb hero-orb-three",
    size: "clamp(8rem, 16vw, 16rem)",
    top: "30%",
    right: "18%",
    gradient: `radial-gradient(circle, ${C.sky}24, ${C.plum}18, transparent 74%)`,
  },
];

const getSectionHref = (section) => `#${section}`;

const useInView = () => {
  const ref = useRef(null);
  return [ref, true];
};

const BouncingSpheres = () => {
  const canvasRef = useRef(null);
  const spheresRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef(null);
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    const colors = [
      { r: 201, g: 107, b: 60 },
      { r: 212, g: 120, b: 90 },
      { r: 196, g: 168, b: 130 },
      { r: 212, g: 162, b: 78 },
      { r: 139, g: 168, b: 136 },
      { r: 122, g: 175, b: 196 },
      { r: 138, g: 111, b: 168 },
    ];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);

      const count = window.innerWidth < 640 ? 8 : 14;
      spheresRef.current = Array.from({ length: count }, () => {
        const radius = 18 + Math.random() * 52;
        const color = colors[Math.floor(Math.random() * colors.length)];

        return {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 1.4,
          vy: (Math.random() - 0.5) * 1.4,
          radius,
          color,
          opacity: 0.15 + Math.random() * 0.16,
        };
      });
    };

    const onMouseMove = (event) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      spheresRef.current.forEach((sphere, index) => {
        if (!reducedMotion) {
          const dx = sphere.x - mouseRef.current.x;
          const dy = sphere.y - mouseRef.current.y;
          const dist = Math.hypot(dx, dy);

          if (dist > 0 && dist < 180) {
            const force = ((180 - dist) / 180) * 0.08;
            sphere.vx += (dx / dist) * force;
            sphere.vy += (dy / dist) * force;
          }

          sphere.vx += Math.sin(time * 0.00028 + index * 1.3) * 0.01;
          sphere.vy += Math.cos(time * 0.0003 + index * 1.9) * 0.01;
          sphere.vx *= 0.995;
          sphere.vy *= 0.995;
          sphere.x += sphere.vx;
          sphere.y += sphere.vy;

          if (sphere.x - sphere.radius < 0 || sphere.x + sphere.radius > window.innerWidth) {
            sphere.vx *= -0.92;
          }

          if (sphere.y - sphere.radius < 0 || sphere.y + sphere.radius > window.innerHeight) {
            sphere.vy *= -0.92;
          }

          sphere.x = Math.max(sphere.radius, Math.min(window.innerWidth - sphere.radius, sphere.x));
          sphere.y = Math.max(sphere.radius, Math.min(window.innerHeight - sphere.radius, sphere.y));
        }

        const gradient = ctx.createRadialGradient(
          sphere.x - sphere.radius * 0.28,
          sphere.y - sphere.radius * 0.28,
          sphere.radius * 0.08,
          sphere.x,
          sphere.y,
          sphere.radius
        );

        gradient.addColorStop(0, `rgba(${Math.min(255, sphere.color.r + 65)},${Math.min(255, sphere.color.g + 65)},${Math.min(255, sphere.color.b + 55)},${sphere.opacity})`);
        gradient.addColorStop(0.55, `rgba(${sphere.color.r},${sphere.color.g},${sphere.color.b},${sphere.opacity})`);
        gradient.addColorStop(1, `rgba(${Math.max(0, sphere.color.r - 40)},${Math.max(0, sphere.color.g - 40)},${Math.max(0, sphere.color.b - 24)},0)`);

        ctx.beginPath();
        ctx.arc(sphere.x, sphere.y, sphere.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMouseMove, { passive: true });
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMouseMove);
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [reducedMotion]);

  return <canvas aria-hidden="true" className="background-canvas" ref={canvasRef} />;
};

const AuroraGlow = () => <div aria-hidden="true" className="aurora-glow" />;

const Label = ({ children }) => <span className="section-label">{children}</span>;

const Button = ({
  children,
  variant = "primary",
  href,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  const Tag = href ? "a" : "button";
  const external = href && /^https?:\/\//i.test(href);
  const isHashLink = href?.startsWith("#");

  return (
    <Tag
      className={`button button--${variant} ${className}`.trim()}
      href={href}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }

        if (isHashLink) {
          event.preventDefault();
          scrollToHash(href);
        }

        onClick?.(event);
      }}
      rel={external ? "noopener noreferrer" : undefined}
      target={external ? "_blank" : undefined}
      type={href ? undefined : type}
      disabled={href ? undefined : disabled}
      aria-disabled={disabled ? "true" : undefined}
    >
      {children}
    </Tag>
  );
};

const Section = ({ children, id, tone = "default", className = "", containerClassName = "" }) => {
  const [ref, visible] = useInView();

  return (
    <section
      id={id}
      ref={ref}
      className={`section section--${tone} ${visible ? "is-visible" : ""} ${className}`.trim()}
    >
      <div className={`container ${containerClassName}`.trim()}>{children}</div>
    </section>
  );
};

const SectionHeading = ({ label, title, intro, align = "left", children }) => (
  <div className={`section-heading section-heading--${align}`}>
    <Label>{label}</Label>
    <h2>{title}</h2>
    {intro ? <p>{intro}</p> : null}
    {children}
  </div>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const navLinks = [
    { label: "Services", href: getSectionHref("services") },
    { label: "Process", href: getSectionHref("process") },
    { label: "Pricing", href: getSectionHref("pricing") },
    { label: "Contact", href: getSectionHref("contact") },
  ];

  return (
    <nav className={`site-nav ${scrolled ? "is-scrolled" : ""}`} aria-label="Primary">
      <div className="container nav-shell">
        <a href="/" className="brand-link" aria-label="Frank Sites home">
          <Logo />
        </a>

        <div className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link"
              onClick={(event) => {
                event.preventDefault();
                scrollToHash(link.href);
              }}
            >
              {link.label}
            </a>
          ))}

          <Button href={getSectionHref("contact")} className="nav-cta">
            Get a Quote
          </Button>
        </div>

        <button
          type="button"
          className={`mobile-menu-button ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((value) => !value)}
          aria-controls="mobile-menu"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
        <div className="container mobile-menu__inner">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="mobile-menu__link"
              onClick={(event) => {
                event.preventDefault();
                setMenuOpen(false);
                scrollToHashAfterMenuClose(link.href);
              }}
            >
              {link.label}
            </a>
          ))}

        </div>
      </div>
    </nav>
  );
};

const HeroVisual = () => (
  <div className="hero-visual">
    <div className="hero-visual__glow" />
    {floatingOrbs.map((orb) => (
      <div
        key={orb.className}
        className={orb.className}
        style={{
          "--orb-size": orb.size,
          "--orb-top": orb.top,
          "--orb-right": orb.right,
          "--orb-bottom": orb.bottom,
          "--orb-left": orb.left,
          "--orb-gradient": orb.gradient,
        }}
      />
    ))}

    <div className="hero-blob-cluster">
      {heroBlobs.map((blob, index) => (
        <div
          key={index}
          className="hero-blob"
          style={{
            "--blob-size": blob.size,
            "--blob-top": blob.top,
            "--blob-right": blob.right,
            "--blob-bottom": blob.bottom,
            "--blob-left": blob.left,
            "--blob-gradient": blob.gradient,
            "--blob-delay": blob.delay,
          }}
        />
      ))}
    </div>
  </div>
);

const Hero = () => (
  <section id="top" className="hero">
    <div className="container hero__container">
      <div className="hero__grid">
        <div className="hero__copy">
          <div className="hero-badge">
            <span className="hero-badge__dot" />
            <span>Accepting new clients</span>
          </div>

          <h1>
            A professional
            <br />
            website your
            <br />
            <span>business deserves</span>
            <strong>.</strong>
          </h1>

          <p className="hero__lede">
            Frank Sites designs and builds polished, high-performing websites
            for small businesses, crafted to establish credibility, attract the
            right customers, and deliver results from the moment you go live.
          </p>

          <div className="hero__actions">
            <Button href="#pricing">View Pricing</Button>
            <Button href="#services" variant="secondary">
              Explore Services
            </Button>
          </div>

          <div className="hero-chip-row">
            {[
              { label: "Delivered in 1-2 weeks", color: C.amber },
              { label: "Mobile-first design", color: C.sky },
              { label: "SEO foundations included", color: C.sage },
            ].map((item) => (
              <div
                key={item.label}
                className="hero-chip"
                style={{ "--chip-color": item.color }}
              >
                <span className="hero-chip__dot" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <HeroVisual />
      </div>
    </div>
  </section>
);

const ServicesSection = () => (
  <Section id="services" tone="cream">
    <SectionHeading
      label="Services"
      align="center"
      title={
        <>
          A complete website
          <br />
          solution, delivered<span className="accent-dot">.</span>
        </>
      }
      intro="Every project includes the essentials your business needs to look credible and perform well online."
    />

    <div className="card-grid card-grid--services">
      {services.map((service) => (
        <article
          key={service.num}
          className="card service-card"
          style={{ "--card-accent": service.color }}
        >
          <div className="service-card__badge">{service.num}</div>
          <h3>{service.title}</h3>
          <p>{service.desc}</p>
        </article>
      ))}
    </div>
  </Section>
);

const ProcessSection = () => (
  <Section id="process">
    <SectionHeading
      label="Our Process"
      align="center"
      title={
        <>
          From brief to launch
          <br />
          in two weeks<span className="accent-dot">.</span>
        </>
      }
      intro="A structured, transparent process with clear milestones at every stage, so you always know exactly where things stand."
    />

    <div className="card-grid card-grid--process">
      {processSteps.map((step, index) => (
        <article
          key={step.step}
          className={`process-card ${index === 0 ? "is-featured" : ""}`}
        >
          <div className="process-card__number">{step.step}</div>
          <span className="process-card__time">{step.time}</span>
          <h3>{step.title}</h3>
          <p>{step.desc}</p>
        </article>
      ))}
    </div>
  </Section>
);

const PricingSection = () => {
  const [hovered, setHovered] = useState(1);

  return (
    <Section id="pricing" tone="cream">
      <SectionHeading
        label="Pricing"
        align="center"
        title={
          <>
            Transparent, one-time pricing
            <span className="accent-dot">.</span>
          </>
        }
        intro="No monthly retainers. No hidden costs. A single investment, and the website is yours to keep."
      />

      <div className="card-grid card-grid--pricing">
        {plans.map((plan, index) => (
          <article
            key={plan.name}
            className={`pricing-card ${plan.best ? "is-best" : ""} ${
              hovered === index ? "is-hovered" : ""
            }`}
            onMouseEnter={() => setHovered(index)}
          >
            {plan.best ? <div className="pricing-card__tag">Recommended</div> : null}
            <h3>{plan.name}</h3>
            <div className="pricing-card__price">{plan.price}</div>
            <p className="pricing-card__summary">{plan.desc}</p>
            <div className="pricing-card__features">
              {plan.features.map((feature) => (
                <div key={feature} className="pricing-card__feature">
                  <span className="pricing-card__dot" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Button
              href="#contact"
              variant={plan.best ? "primary" : "secondary"}
              className="button--full"
            >
              Get Started
            </Button>
          </article>
        ))}
      </div>

      <p className="pricing-note">
        Need something beyond these packages? <a href="#contact">Get in touch</a>{" "}
        for a tailored quote.
      </p>
    </Section>
  );
};

const CTASection = () => {
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStartedAt] = useState(() => Date.now());

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      business: formData.get("business"),
      message: formData.get("message"),
      website: formData.get("website"),
      formStartedAt,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({
        ok: false,
        message: "Something went wrong. Please email us directly instead.",
      }));

      if (!response.ok || !result.ok) {
        setStatus({
          type: "error",
          message: result.message || "We could not send your enquiry just now.",
        });
        return;
      }

      form.reset();
      setStatus({
        type: "success",
        message: "Thanks, your enquiry has been sent. We will be in touch soon.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "We could not send your enquiry just now. Please email us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contact" className="cta-section">
      <div className="cta-shell">
        <div className="cta-shell__orb cta-shell__orb--top" />
        <div className="cta-shell__orb cta-shell__orb--bottom" />

        <div className="cta-grid">
          <div className="cta-copy">
            <h2>
              Let&apos;s discuss
              <br />
              your project<span>.</span>
            </h2>
            <p>
              Share a few details about your business and what you need. We
              will respond with a recommended approach, timeline, and quote
              with no obligation.
            </p>
            <div className="hero__actions">
              <Button variant="dark" href={`mailto:${CONTACT_EMAIL}`}>
                Email Directly
              </Button>
            </div>
          </div>

          <form className="cta-form" onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="sr-only"
            />
            <div className="form-grid">
              <label className="sr-only" htmlFor="contact-name">
                Full name
              </label>
              <input
                id="contact-name"
                name="name"
                placeholder="Full name"
                autoComplete="name"
                required
              />
              <label className="sr-only" htmlFor="contact-email">
                Email address
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                required
              />
              <label className="sr-only" htmlFor="contact-business">
                Business name
              </label>
              <input
                id="contact-business"
                name="business"
                placeholder="Business name (optional)"
                autoComplete="organization"
              />
              <label className="sr-only" htmlFor="contact-message">
                Project details
              </label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Briefly describe what you need, your type of business, number of pages, or any specific requirements."
                required
              />
              <Button type="submit" className="button--full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Submit Enquiry"}
              </Button>
              <p className={`form-status form-status--${status.type}`} aria-live="polite">
                {status.message}
              </p>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
};

const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-shell">
      <div className="footer-top">
        <div className="footer-brand">
          <a href="/" className="brand-link" aria-label="Frank Sites home">
            <Logo />
          </a>
          <p>
            Professional web design for small businesses. One-time investment,
            complete ownership, lasting results.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Navigate</h4>
            <a
              href={getSectionHref("services")}
              onClick={(event) => {
                event.preventDefault();
                scrollToHash(getSectionHref("services"));
              }}
            >
              Services
            </a>
            <a
              href={getSectionHref("process")}
              onClick={(event) => {
                event.preventDefault();
                scrollToHash(getSectionHref("process"));
              }}
            >
              Process
            </a>
            <a
              href={getSectionHref("pricing")}
              onClick={(event) => {
                event.preventDefault();
                scrollToHash(getSectionHref("pricing"));
              }}
            >
              Pricing
            </a>
            <a
              href={getSectionHref("contact")}
              onClick={(event) => {
                event.preventDefault();
                scrollToHash(getSectionHref("contact"));
              }}
            >
              Contact
            </a>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <p>South Africa</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>(c) {new Date().getFullYear()} Frank Sites. All rights reserved.</p>
        <p>Designed and built in South Africa</p>
      </div>
    </div>
  </footer>
);

const HomePage = ({ pathname }) => {
  usePageSeo(pathname);

  return (
    <>
      <Hero />
      <ServicesSection />
      <ProcessSection />
      <PricingSection />
      <CTASection />
    </>
  );
};

export default function App({ initialPathname = "/" }) {
  const pathname =
    typeof window === "undefined"
      ? initialPathname
      : window.location.pathname.replace(/\/+$/, "") || "/";

  return (
    <div className="page-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <AuroraGlow />
      <BouncingSpheres />
      <Navbar />
      <main id="main-content">
        <HomePage pathname={pathname} />
      </main>
      <Footer />
    </div>
  );
}
