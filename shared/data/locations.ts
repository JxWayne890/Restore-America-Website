export type ServiceLocation = {
  slug: string;
  label: string;
  city: string;
  stateCode: "GA" | "FL" | "MO";
  stateName: string;
  heroDescription: string;
  metaDescription: string;
  commonIssues: string[];
  nearbyAreas: string[];
};

export const SERVICE_LOCATIONS: ServiceLocation[] = [
  {
    slug: "atlanta-ga",
    label: "Atlanta, GA",
    city: "Atlanta",
    stateCode: "GA",
    stateName: "Georgia",
    heroDescription:
      "From hail and high wind to aging roof systems, our team handles inspections, documentation, repairs, and insurance claim support across Metro Atlanta.",
    metaDescription:
      "Roofing and storm damage restoration in Atlanta, GA. Free inspections, insurance claim support, and rapid emergency response.",
    commonIssues: [
      "Hail and wind shingle damage after severe storms",
      "Interior leaks from flashing or valley failure",
      "Tree impact and emergency tarp stabilization",
    ],
    nearbyAreas: ["Buckhead", "Midtown", "East Atlanta", "Sandy Springs"],
  },
  {
    slug: "walton-county-ga",
    label: "Walton County, GA",
    city: "Walton County",
    stateCode: "GA",
    stateName: "Georgia",
    heroDescription:
      "We provide full roofing and restoration support throughout Walton County, including damage assessments, mitigation, and full rebuild coordination.",
    metaDescription:
      "Roof replacement and storm restoration in Walton County, GA. Free inspections and insurance guidance from Restore America.",
    commonIssues: [
      "Wind uplift and missing shingles",
      "Storm-driven leaks around chimneys and vents",
      "Water intrusion requiring mitigation and rebuild",
    ],
    nearbyAreas: ["Monroe", "Loganville", "Social Circle", "Good Hope"],
  },
  {
    slug: "jersey-ga",
    label: "Jersey, GA",
    city: "Jersey",
    stateCode: "GA",
    stateName: "Georgia",
    heroDescription:
      "Jersey is one of our core home markets. We help homeowners move from first inspection to final restoration with clear communication at every step.",
    metaDescription:
      "Local roofing and restoration services in Jersey, GA. Fire, flood, hail, and wind damage specialists with free inspections.",
    commonIssues: [
      "Aging roof system wear and active leaks",
      "Hail bruising and granule loss",
      "Tree limb impact after storms",
    ],
    nearbyAreas: ["Covington", "Monroe", "Loganville", "Walnut Grove"],
  },
  {
    slug: "orlando-fl",
    label: "Orlando, FL",
    city: "Orlando",
    stateCode: "FL",
    stateName: "Florida",
    heroDescription:
      "Orlando properties face heavy rain, wind, and weather-related roof stress. Our team provides fast assessments and complete restoration planning.",
    metaDescription:
      "Roof and storm restoration in Orlando, FL. Fast response, free inspections, and insurance-claim support for homeowners.",
    commonIssues: [
      "Wind-driven rain leaks and underlayment failure",
      "Storm damage to shingles, vents, and flashing",
      "Moisture intrusion and interior ceiling damage",
    ],
    nearbyAreas: ["Winter Park", "Lake Nona", "Altamonte Springs", "Kissimmee"],
  },
  {
    slug: "tampa-fl",
    label: "Tampa, FL",
    city: "Tampa",
    stateCode: "FL",
    stateName: "Florida",
    heroDescription:
      "We serve Tampa with emergency response, roof repair, and full restoration services tailored to Gulf Coast weather and claim timelines.",
    metaDescription:
      "Tampa roofing and restoration experts for storm, wind, and water damage. Request a free inspection with Restore America.",
    commonIssues: [
      "Wind and tropical storm roof damage",
      "Persistent leaks from compromised flashing",
      "Water damage requiring mitigation and reconstruction",
    ],
    nearbyAreas: ["Brandon", "Riverview", "South Tampa", "Temple Terrace"],
  },
  {
    slug: "jacksonville-fl",
    label: "Jacksonville, FL",
    city: "Jacksonville",
    stateCode: "FL",
    stateName: "Florida",
    heroDescription:
      "Across Jacksonville, we help homeowners recover quickly after storm events with inspection reports, claim support, and quality restoration work.",
    metaDescription:
      "Storm and roofing restoration in Jacksonville, FL. Free inspection, rapid response, and insurance assistance from Restore America.",
    commonIssues: [
      "Coastal wind exposure and shingle loss",
      "Roof deck moisture issues after heavy rain",
      "Flood-related interior damage and mitigation needs",
    ],
    nearbyAreas: ["Arlington", "Mandarin", "Riverside", "Orange Park"],
  },
  {
    slug: "st-louis-mo",
    label: "St. Louis, MO",
    city: "St. Louis",
    stateCode: "MO",
    stateName: "Missouri",
    heroDescription:
      "St. Louis weather can shift quickly from hail to high winds. We provide dependable inspection and restoration services for residential properties.",
    metaDescription:
      "St. Louis, MO roofing and storm restoration. Free inspections, insurance claim support, and complete build-back services.",
    commonIssues: [
      "Severe hail impact and shingle bruising",
      "Wind-driven ridge and flashing damage",
      "Tree strike emergencies requiring immediate protection",
    ],
    nearbyAreas: ["Clayton", "Chesterfield", "Florissant", "University City"],
  },
  {
    slug: "kansas-city-mo",
    label: "Kansas City, MO",
    city: "Kansas City",
    stateCode: "MO",
    stateName: "Missouri",
    heroDescription:
      "We support Kansas City homeowners with proactive inspections, detailed documentation, and full-service restoration after weather-related losses.",
    metaDescription:
      "Kansas City roofing and disaster restoration services. Free inspections and trusted help through every step of the insurance process.",
    commonIssues: [
      "Hail and wind roof system damage",
      "Leak paths around penetrations and valleys",
      "Storm debris damage requiring repairs and cleanup",
    ],
    nearbyAreas: ["Overland Park", "Lee's Summit", "North Kansas City", "Independence"],
  },
];

const SERVICE_LOCATION_BY_SLUG = new Map(
  SERVICE_LOCATIONS.map((location) => [location.slug, location])
);

export const getServiceLocationBySlug = (slug: string) =>
  SERVICE_LOCATION_BY_SLUG.get(slug) ?? null;
