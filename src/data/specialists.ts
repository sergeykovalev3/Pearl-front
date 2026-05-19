import { SITE_AUTHOR_GITHUB_HREF } from "@/data/siteNavLinks";

export const SPECIALISTS_HOME_IMAGE_PATH = "/images/home/ourSpecialists";

export type SiteSpecialist = {
  id: string;
  name: string;
  /** Short line on home carousel cards */
  position: string;
  /** Subtitle on About (e.g. specialty focus) */
  aboutPosition: string;
  /** Long bio on About */
  description: string;
  /** Same assets as home carousel (`/images/home/ourSpecialists/...`) */
  image: string;
  link: string;
};

export type HomeSpecialistCard = {
  id: string;
  name: string;
  position: string;
  image: string;
  link: string;
};

export type AboutSpecialistCard = {
  id: string;
  name: string;
  position: string;
  description: string;
  image: string;
};

const H = SPECIALISTS_HOME_IMAGE_PATH;

export const siteSpecialists: SiteSpecialist[] = [
  {
    id: "liam-foster",
    name: "Liam Foster",
    position: "Periodontist.",
    aboutPosition: "(Specialty in periodontics and implant therapy)",
    description:
      "Dr. Foster focuses on gum health, periodontal maintenance, and implant-related soft-tissue stability. He works closely with restorative colleagues so treatment plans stay predictable from surgery through long-term upkeep.",
    image: `${H}/specialist1.jpg`,
    link: SITE_AUTHOR_GITHUB_HREF,
  },
  {
    id: "daniel-reyes",
    name: "Daniel Reyes",
    position: "Orthodontist.",
    aboutPosition: "(Specialty in orthodontics and dentofacial orthopedics)",
    description:
      "Dr. Reyes plans aligners and braces with bite function and facial balance in mind, not tooth movement alone. He aims for timelines and expectations families can stick to between adjustment visits.",
    image: `${H}/specialist2.jpg`,
    link: SITE_AUTHOR_GITHUB_HREF,
  },
  {
    id: "chloe-bennett",
    name: "Chloe Bennett",
    position: "Endodontist.",
    aboutPosition: "(Specialty in endodontics and microscopic root canal therapy)",
    description:
      "Dr. Bennett saves natural teeth whenever possible with careful diagnosis and magnification-guided root canal treatment. She explains options clearly so patients understand when a referral is worthwhile and what recovery usually looks like.",
    image: `${H}/specialist3.jpg`,
    link: SITE_AUTHOR_GITHUB_HREF,
  },
  {
    id: "jacob-jones",
    name: "Jacob Jones",
    position: "Pediatric Dentist.",
    aboutPosition: "(Specialty in pediatric dentistry)",
    description:
      "Dr. Jones creates a positive dental home for children and teens, using age-appropriate communication and gentle techniques. He partners with families on prevention, growth guidance, and treatment timing so young patients build healthy habits for life.",
    image: `${H}/specialist4.jpg`,
    link: SITE_AUTHOR_GITHUB_HREF,
  },
  {
    id: "ethan-cole",
    name: "Ethan Cole",
    position: "Prosthodontist.",
    aboutPosition: "(Specialty in prosthodontics and full-mouth rehabilitation)",
    description:
      "Dr. Cole restores chewing comfort and natural-looking smiles with crowns, bridges, dentures, and implant-supported prostheses. He balances durable materials, bite harmony, and aesthetic detail for complex or worn dentitions.",
    image: `${H}/specialist5.jpg`,
    link: SITE_AUTHOR_GITHUB_HREF,
  },
  {
    id: "nina-alvarez",
    name: "Nina Alvarez",
    position: "Cosmetic Dentist.",
    aboutPosition: "(Specialty in cosmetic and aesthetic dentistry)",
    description:
      "Dr. Alvarez focuses on smile design, veneers, bonding, and whitening tailored to each patient's goals and facial features. She prioritizes conservative approaches, clear expectations, and results that look fresh rather than overdone.",
    image: `${H}/specialist6.jpg`,
    link: SITE_AUTHOR_GITHUB_HREF,
  },
  {
    id: "david-kim",
    name: "David Kim",
    position: "Oral Surgeon.",
    aboutPosition: "(Specialty in oral and maxillofacial surgery)",
    description:
      "Dr. Kim performs extractions, wisdom tooth surgery, and other oral surgical procedures with attention to safety, anesthesia comfort, and straightforward recovery instructions. He coordinates with referring doctors to keep treatment seamless from consult to follow-up.",
    image: `${H}/specialist7.jpg`,
    link: SITE_AUTHOR_GITHUB_HREF,
  },
];

export const homeSpecialists: HomeSpecialistCard[] = siteSpecialists.map(
  ({ id, name, position, link, image }) => ({
    id,
    name,
    position,
    link,
    image,
  }),
);

export const aboutSpecialists: AboutSpecialistCard[] = siteSpecialists.map(
  ({ id, name, aboutPosition, description, image }) => ({
    id,
    name,
    position: aboutPosition,
    description,
    image,
  }),
);
