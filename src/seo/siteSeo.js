import { useEffect, useMemo } from "react";

export const SITE_CONFIG = {
  brandName: "Frank Sites",
  siteUrl: "https://franksites.co.za",
  contactEmail: "franksitesza@gmail.com",
  areaServed: "South Africa",
  locale: "en_ZA",
  socialImagePath: "/favicon.svg",
};

const HOME_TITLE = "Frank Sites | Professional Websites for Small Businesses";
const HOME_DESCRIPTION =
  "Frank Sites builds professional, high-performing websites for small businesses across South Africa, with a strong presence around Cape Town, mobile-first design, SEO foundations, and complete ownership from day one.";

const SERVICES = [
  "Custom Website Design",
  "Search Engine Optimisation",
  "Hosting Setup and Handoff",
  "Performance Optimisation",
  "Contact and Enquiry Forms",
  "Google Business Integration",
];

const normalizePathname = (pathname = "/") => {
  if (!pathname || pathname === "/") {
    return "/";
  }

  const noQuery = pathname.split("?")[0].split("#")[0];
  return noQuery.endsWith("/") ? noQuery.slice(0, -1) : noQuery;
};

export const absoluteUrl = (pathname = "/") => {
  const cleanPathname = normalizePathname(pathname);
  return `${SITE_CONFIG.siteUrl}${cleanPathname === "/" ? "/" : cleanPathname}`;
};

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_CONFIG.siteUrl}/#organization`,
      name: SITE_CONFIG.brandName,
      url: `${SITE_CONFIG.siteUrl}/`,
      email: SITE_CONFIG.contactEmail,
      areaServed: SITE_CONFIG.areaServed,
      address: {
        "@type": "PostalAddress",
        addressCountry: "ZA",
        addressRegion: "Western Cape",
        addressLocality: "Cape Town",
      },
      logo: absoluteUrl(SITE_CONFIG.socialImagePath),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.siteUrl}/#website`,
      url: `${SITE_CONFIG.siteUrl}/`,
      name: SITE_CONFIG.brandName,
      inLanguage: "en-ZA",
      publisher: { "@id": `${SITE_CONFIG.siteUrl}/#organization` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_CONFIG.siteUrl}/#professional-service`,
      name: SITE_CONFIG.brandName,
      description: HOME_DESCRIPTION,
      url: `${SITE_CONFIG.siteUrl}/`,
      email: SITE_CONFIG.contactEmail,
      areaServed: SITE_CONFIG.areaServed,
      serviceArea: [
        {
          "@type": "AdministrativeArea",
          name: "Western Cape",
        },
        {
          "@type": "City",
          name: "Cape Town",
        },
        {
          "@type": "Country",
          name: "South Africa",
        },
      ],
      provider: { "@id": `${SITE_CONFIG.siteUrl}/#organization` },
    },
    ...SERVICES.map((serviceName, index) => ({
      "@type": "Service",
      "@id": `${SITE_CONFIG.siteUrl}/#service-${index + 1}`,
      name: serviceName,
      serviceType: serviceName,
      areaServed: SITE_CONFIG.areaServed,
      provider: { "@id": `${SITE_CONFIG.siteUrl}/#organization` },
      url: `${SITE_CONFIG.siteUrl}/#services`,
    })),
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_CONFIG.siteUrl}/#breadcrumbs`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_CONFIG.siteUrl}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: `${SITE_CONFIG.siteUrl}/#services`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Pricing",
          item: `${SITE_CONFIG.siteUrl}/#pricing`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Contact",
          item: `${SITE_CONFIG.siteUrl}/#contact`,
        },
      ],
    },
  ],
};

export const PAGE_SEO = {
  "/": {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    canonicalPath: "/",
    robots: "index, follow",
    ogType: "website",
    schema: homeSchema,
  },
};

export const getPageSeo = (pathname = "/") => {
  const normalizedPath = normalizePathname(pathname);
  const page = PAGE_SEO[normalizedPath] ?? PAGE_SEO["/"];
  const canonicalPath = page.canonicalPath ?? normalizedPath;

  return {
    ...page,
    canonicalPath,
    canonicalUrl: absoluteUrl(canonicalPath),
    ogImage: absoluteUrl(SITE_CONFIG.socialImagePath),
  };
};

const upsertMetaByName = (name, content) => {
  if (!content) {
    return;
  }

  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const upsertMetaByProperty = (property, content) => {
  if (!content) {
    return;
  }

  let element = document.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const upsertCanonical = (href) => {
  if (!href) {
    return;
  }

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }

  canonical.setAttribute("href", href);
};

const upsertStructuredData = (schema) => {
  if (!schema) {
    return;
  }

  let script = document.querySelector('script[id="structured-data"]');
  if (!script) {
    script = document.createElement("script");
    script.id = "structured-data";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schema);
};

export const usePageSeo = (pathname = "/") => {
  const seo = useMemo(() => getPageSeo(pathname), [pathname]);

  useEffect(() => {
    document.title = seo.title;
    upsertCanonical(seo.canonicalUrl);
    upsertMetaByName("description", seo.description);
    upsertMetaByName("robots", seo.robots);
    upsertMetaByName("twitter:card", "summary_large_image");
    upsertMetaByName("twitter:title", seo.title);
    upsertMetaByName("twitter:description", seo.description);
    upsertMetaByName("twitter:image", seo.ogImage);
    upsertMetaByName("twitter:url", seo.canonicalUrl);

    upsertMetaByProperty("og:type", seo.ogType);
    upsertMetaByProperty("og:locale", SITE_CONFIG.locale);
    upsertMetaByProperty("og:site_name", SITE_CONFIG.brandName);
    upsertMetaByProperty("og:title", seo.title);
    upsertMetaByProperty("og:description", seo.description);
    upsertMetaByProperty("og:url", seo.canonicalUrl);
    upsertMetaByProperty("og:image", seo.ogImage);

    upsertStructuredData(seo.schema);
  }, [seo]);

  return seo;
};
