export type Article = {
  id: string;
  title: string;
  description: string;
  /** Full body copy for the blog post page; `description` is for cards/listings only. */
  text: string;
  author: string;
  previewImage: string;
  image: string;
  tags: string[];
};

export const articlesTags = {
  selfCare: "Self Care",
  prevention: "Prevention",
  cosmeticDentistry: "Cosmetic Dentistry",
  pediatricCare: "Pediatric Care",
  orthodontics: "Orthodontics",
  emergencyCare: "Emergency Care",
  implants: "Implants",
  oralHygiene: "Oral Hygiene",
  whitening: "Whitening",
  nutritionTips: "Nutrition Tips",
} as const;

const previewsBasePath = "/images/data/articles";

const previewImages = {
  image1: `${previewsBasePath}/preview1.png`,
  image2: `${previewsBasePath}/preview2.png`,
  image3: `${previewsBasePath}/preview3.png`,
  image4: `${previewsBasePath}/preview4.png`,
  image5: `${previewsBasePath}/preview5.png`,
  image6: `${previewsBasePath}/preview6.png`,
  image7: `${previewsBasePath}/preview7.png`,
  image8: `${previewsBasePath}/preview8.png`,
} as const;

const mainImage = "/images/data/articles/mainImage.jpg" as const;

const previewRotate = [
  previewImages.image1,
  previewImages.image2,
  previewImages.image3,
  previewImages.image4,
  previewImages.image5,
  previewImages.image6,
  previewImages.image7,
  previewImages.image8,
] as const;

/**
 * Shared long-form body attached to each seeded article record (titles and meta vary per slug).
 * Paragraph breaks → separate paragraphs on the post page.
 */
const sharedArticleBody = `
Healthy teeth rarely happen by accident. They are the result of small, repeatable habits that stack over months and years—and of a dental team that catches changes early, before discomfort or bigger treatment plans enter the picture. At Pearl, we anchor care in prevention because it is where patients gain the most control: clearer expectations, predictable maintenance, and a smile that feels stable rather than fragile.

If you strip oral health down to its essentials, you are balancing three forces—plaque control, enamel protection, and regular professional assessment. Plaque is a soft, sticky biofilm that forms continuously. Within hours it begins to reorganize bacteria along the gumline and in grooves your brush cannot always reach thoroughly. Fluoride in toothpaste strengthens enamel remineralization after mild acid attacks, while mechanical cleaning disrupts plaque before it hardens into tartar that only instruments in the office can remove.

Home hygiene is less about gadgets and more about consistency and coverage. Spend about two gentle minutes brushing twice a day—pressure should feel like polishing, not scrubbing a pan. Tilt the bristles slightly toward the gumline and use short strokes or small circles so bristles tuck slightly under the tissue collar where inflammation often begins. Angle alone will not compensate for rushing; pacing matters. Follow with daily cleaning between teeth: floss curves around each tooth in a C-shape, sliding under the gumline without snapping. Where spaces are wider, picks or brushes sized for embrasures outperform awkward hacks. Mouthwash can be a supportive step for some patients, but it never replaces flossing or mechanical plaque removal along contact points.

Nutrition reshapes risk in quiet ways dentists see every week. Frequency often matters more than a single sugary dessert shared at dinner. Repeated snacking and sipping acidic drinks—coffee with sugar, flavored sparkling water, juice, sports beverages—cycles the mouth through acidic dips that soften enamel temporarily. Drinking plain water afterward, consolidating sweets with meals rather than grazing, and finishing with enamel-safe rinses blunt that punch. Calcium-rich foods and fibrous vegetables help stimulate saliva flow, your natural buffer and rinsing mechanism.

Professional visits are calibrated to your biology, history, and goals—not a rigid calendar photocopied onto everyone. For many adults stable on prevention, alternating hygiene and periodic exams aligns well; others with periodontal history or dry mouth medications may benefit from tighter intervals until metrics stabilize. Your hygienist evaluates pocket depths, bleeding patterns, and stain or tartar distribution to tailor instrumentation and fluoride or desensitizer selection. Radiographs follow evidence-based necessity rather than reflex; we order them when timelines or diagnostic questions justify exposure.

Pain is not the first reliable signal of dental disease. Cavities reach nerve proximity before throbbing wakes people at night; gum inflammation can simmer with little more than redness or subtle bleeding during brushing—easy to excuse as “firm brushing.” This is why we emphasize tactile feedback and visuals you can replicate at home—pink, stippled gingiva hugs teeth without puffiness—and why we normalize photographs and charting trends over time rather than reacting to episodic sensations alone.

Comfort and communication shape outcomes as much as technical skill. Anxiety is common even among patients who logically understand procedures. Transparent pacing—“what you will hear, taste, feel, and for how long”—reduces ambiguity. Slow breathing, segmented appointments, topical anesthetics, and deeper anesthesia when appropriate all expand who can sustainably keep care current. Bringing headphones, choosing morning slots when rested, or debriefing a single question per visit lowers the activation energy of returning regularly.

Treatment recommendations should always map to individualized risk. A patient with acidic diet plus clenching may need enamel protection counseling before whitening. Someone with periodontal attachment loss might prioritize occlusion and splint considerations before elective cosmetics. Pediatric visits focus as much on eruption patterns and habit counseling as drilling. Orthodontic choices weigh compliance, periodontal biotype, and skeletal goals—not only tooth alignment on a chart. Implants hinge on bone volume healing mechanics and restorative plans that keep cleansability realistic long term.

Dental emergencies sharpen our triage instincts. Thermal sensitivity after recent dentistry may behave differently than spontaneous lingering pain waking you from sleep. Swelling spreading toward the airway, trauma with mobility or displacement, uncontrolled bleeding, or fever mandates urgent escalation—we would rather clarify boundaries early than reassure vaguely. Conversely, chipped enamel without pulp exposure sometimes receives smooth-polish options or guarded monitoring depending on occlusion and cosmetics.

Pearl exists to make disciplined prevention feel humane and doable. Bring your toothbrush and show us how you maneuver around molars—we will troubleshoot rather than lecture. Mention medications, GERD symptoms, vaping, athletics, grind patterns, whitening attempts, sleep issues, pregnancy, or oncology care; systemic context changes salivary flow, gingival response, and healing expectations. Dentistry at its best is collaborative: calibrated science, tactile teaching, and a schedule you can realistically keep.

Commit to the basics that never go out of style: thorough twice-daily hygiene, purposeful interproximal cleaning, mindful diet timing, fluoride appropriate to your decay risk profile, athletic guards when warranted, night appliances when forces threaten enamel or joints—and a professional rhythm matched to how your mouth behaves, not someone else’s template. Progress is seldom dramatic day to day but unmistakable across years—healthier probing depths, quieter hygiene visits, enamel that survives stress because early intervention caught problems while they were reversible or small.

If nothing here feels urgent except curiosity, schedule a preventive visit anyway. Establishing a baseline beats guessing from memory; digital records anchor trends you cannot feel yet. Pearl is ready to meet you wherever you start—steady maintainer rebuilding after a gap, newcomer to the area navigating insurance, parent coordinating family blocks, professional seeking cosmetic refinements anchored in stable biology—or anyone who wants a calmer dentist-patient alliance than they have experienced before. Oral health deserves the same intentionality every other cornerstone of wellbeing receives—we will walk you through yours with specificity, patience, and respect.
`.trim();

type ArticleSeed = Omit<Article, "text">;

const articleSeeds: ArticleSeed[] = [
  {
    id: "care-of-your-teeth",
    title: "Care of Your Teeth",
    description:
      "Daily hygiene habits that keep enamel strong and your smile bright between visits.",
    author: "Anita Jackson",
    previewImage: previewRotate[0],
    image: mainImage,
    tags: [articlesTags.selfCare, articlesTags.oralHygiene],
  },
  {
    id: "why-preventive-checkups-matter",
    title: "Why Preventive Checkups Matter",
    description:
      "Early detection saves time and cost—what we look for at every recall appointment.",
    author: "Marcus Chen",
    previewImage: previewRotate[1],
    image: mainImage,
    tags: [articlesTags.prevention],
  },
  {
    id: "veneers-without-regret",
    title: "Veneers Without the Guesswork",
    description:
      "Planning shade, shape, and bite alignment before we touch healthy tooth structure.",
    author: "Sarah Mitchell",
    previewImage: previewRotate[2],
    image: mainImage,
    tags: [articlesTags.cosmeticDentistry],
  },
  {
    id: "first-dentist-visit-for-kids",
    title: "A Stress-Free First Visit for Kids",
    description:
      "How parents can prepare toddlers so the chair feels safe and predictable.",
    author: "Priya Kapoor",
    previewImage: previewRotate[3],
    image: mainImage,
    tags: [articlesTags.pediatricCare],
  },
  {
    id: "invisalign-vs-braces",
    title: "Invisalign vs. Braces: A Practical Timeline",
    description:
      "Compliance, case complexity, and what each option excels at today.",
    author: "James Porter",
    previewImage: previewRotate[4],
    image: mainImage,
    tags: [articlesTags.orthodontics],
  },
  {
    id: "dental-emergency-kit",
    title: "Build a Small Dental Emergency Kit",
    description:
      "What to pack at home and when to skip the drawer and head straight to us.",
    author: "Maria Santos",
    previewImage: previewRotate[5],
    image: mainImage,
    tags: [articlesTags.emergencyCare],
  },
  {
    id: "implant-healing-stages",
    title: "Implant Healing: What the First Months Feel Like",
    description:
      "Osseointegration in plain language, diet notes, and follow-up pacing.",
    author: "David Okonkwo",
    previewImage: previewRotate[6],
    image: mainImage,
    tags: [articlesTags.implants],
  },
  {
    id: "electric-vs-manual-brush",
    title: "Electric vs. Manual Toothbrushes in 2026",
    description:
      "Technique beats gadget choice—plus which features actually move the needle.",
    author: "Lisa Nguyen",
    previewImage: previewRotate[7],
    image: mainImage,
    tags: [articlesTags.oralHygiene, articlesTags.selfCare],
  },
  {
    id: "whitening-sensitive-teeth",
    title: "Whitening When Your Teeth Run Sensitive",
    description:
      "Desensitizing protocols we use before in-office gel applications.",
    author: "Elena Vasquez",
    previewImage: previewRotate[0],
    image: mainImage,
    tags: [articlesTags.whitening],
  },
  {
    id: "foods-that-feed-cavities",
    title: "Foods That Sneak Sugar Past Your Guards",
    description:
      "Hidden acids and frequency pitfalls even careful snackers overlook.",
    author: "Robert Hayes",
    previewImage: previewRotate[3],
    image: mainImage,
    tags: [articlesTags.nutritionTips, articlesTags.prevention],
  },
  {
    id: "root-canal-myth-busting",
    title: "Root Canal Myth-Busting From the Chairside",
    description:
      "Modern anesthesia, conservative access, and when retreatment is warranted.",
    author: "Amara Brooks",
    previewImage: previewRotate[5],
    image: mainImage,
    tags: [articlesTags.selfCare],
  },
  {
    id: "smile-confidence-at-work",
    title: "Smile Confidence Without Overdoing Cosmetics",
    description:
      "Subtle tweaks that photograph well—without shouting “recent dental work”.",
    author: "Thomas Reed",
    previewImage: previewRotate[2],
    image: mainImage,
    tags: [articlesTags.cosmeticDentistry, articlesTags.selfCare],
  },
];

export const articles: Article[] = articleSeeds.map((entry) => ({
  ...entry,
  text: sharedArticleBody,
}));
