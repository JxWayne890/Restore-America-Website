import { getServiceLocationBySlug } from "../../shared/data/locations";

export function injectLocationSeo(html: string, url: string): string {
  // Only inject SEO if it's a valid location route
  if (!url.startsWith("/locations/")) {
    return html;
  }

  const slug = url.split("/").pop()?.split("?")[0] || "";
  const location = getServiceLocationBySlug(slug);

  if (!location) {
    // If invalid location, fallback to default HTML
    return html;
  }

  const title = `${location.label} Roofing & Restoration | Restore America`;
  const canonicalUrl = `https://restoreamericaroof.com/locations/${location.slug}`;

  // Build the rich snippet for this specific location
  const localBusinessSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://restoreamericaroof.com/locations/${location.slug}#business`,
    "name": `Restore America Roofing & Restoration - ${location.label}`,
    "description": location.heroDescription,
    "url": canonicalUrl,
    "telephone": "+18445387737",
    "email": "office@gorestoreamerica.com",
    "image": "https://i.imgur.com/L4Hc0Pd.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.city,
      "addressRegion": location.stateCode,
      "addressCountry": "US"
    },
    // Adding the area served array which increases relevance for local search
    "areaServed": [
      {
        "@type": "City",
        "name": location.city
      },
      ...location.nearbyAreas.map(area => ({
        "@type": "City",
        "name": area
      }))
    ]
  });

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://restoreamericaroof.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Locations",
        "item": "https://restoreamericaroof.com/locations"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": location.label,
        "item": canonicalUrl
      }
    ]
  });

  const schemaScriptTags = `
    <!-- Dynamically Injected Location Schema -->
    <script type="application/ld+json">${localBusinessSchema}</script>
    <script type="application/ld+json">${breadcrumbSchema}</script>
  `;

  // String replacement on the static index.html payload
  let modifiedHtml = html;

  // Replace Title
  modifiedHtml = modifiedHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${title}</title>`
  );

  // Replace Description
  modifiedHtml = modifiedHtml.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${location.metaDescription}" />`
  );

  // Replace Canonical URL
  modifiedHtml = modifiedHtml.replace(
    /<link rel="canonical" href=".*?" \/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Append new schema scripts directly before the closing head tag
  modifiedHtml = modifiedHtml.replace(
    /<\/head>/,
    `${schemaScriptTags}\n  </head>`
  );

  return modifiedHtml;
}
