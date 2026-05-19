export type ServiceItem = {
  id: string;
  title: string;
  /** Short teaser for cards and meta description fallback. */
  description: string;
  image: string;
  tags: string[];
  /** Detail page body; paragraphs separated by blank lines (\n\n). */
  text: string;
};

const pathToImages = "/images/data/services";

export const services: ServiceItem[] = [
  {
    id: "root-canal-treatment",
    title: "Root Canal Treatment",
    description:
      "Comfortable, precise endodontic care to relieve pain and save your natural tooth whenever it is clinically appropriate.",
    image: `${pathToImages}/rootCanalTreatment.png`,
    tags: ["Endodontics", "Pain relief", "Tooth-saving care"],
    text: `
When decay or a deep crack reaches the inner pulp of your tooth, bacteria can irritate or infect the nerve. That often feels like lingering sensitivity to heat or cold, discomfort when biting, swelling near the gums, or a dull ache that does not disappear on its own. The goal of root canal treatment is straightforward: gently remove diseased pulp, disinfect the canals, and seal the space so healing can proceed and your bite stays stable.

At Pearl we treat root canal therapy as a calm, paced procedure—not a frantic fix. Local anesthesia ensures the tooth is profoundly numb before we begin; if you tend to feel anxious, tell us upfront so we can layer additional comforts and clarify each step ahead of time. Most visits feel similar to placing a meticulous filling once the tooth is settled.

Treatment begins with conservative access—we remove only enough structure to visualize the canals clearly on our digital imaging. Specialized instruments glide through each canal length to clean and shape systematically, flushing with antimicrobial solutions designed to dissolve debris and disrupt biofilm. After thorough drying, we place a dense, biocompatible filling material combined with adhesive sealers chosen for long-term leakage resistance.

Crowns commonly follow molars or heavily restored teeth once therapy is finished. Your dentist will advise based on remaining enamel, bite forces, and whether the tooth bore large fillings beforehand. Acting soon after diagnosis usually preserves more natural structure and minimizes the likelihood of escalating symptoms or systemic spread of infection.

If you notice pressure, tenderness, or a chipped tooth paired with discoloration or a small fistula on the gum, schedule an evaluation rather than waiting for “it to settle.” Early intervention simplifies care, lowers chair time, and gives you predictable relief with a roadmap you fully understand.`,
  },
  {
    id: "cosmetic-dentist",
    title: "Cosmetic Dentist",
    description:
      "Balanced veneers, whitening, bonding, and smile design that looks like you—only refreshed, symmetrical, and photo-ready.",
    image: `${pathToImages}/cosmeticDentist.png`,
    tags: ["Smile design", "Veneers", "Whitening"],
    text: `
Cosmetic dentistry succeeds when artistry meets biology. Changing the shape or shade of a tooth can highlight your natural character—or overpower it— depending on proportional planning and material choice. Pearl begins every cosmetic conversation with facial reference photos, periodontal health checks, and a discussion about how much healthy enamel you wish to conserve.

Whitening supervised in-office lifts deep stains accelerated by aging, coffee habits, or certain medications while we monitor gingival margins and enamel sensitivity thresholds. Mild cases often pair professional gel with calibrated take-home trays for maintenance you can reuse responsibly. Stubborn discoloration stemming from fluorosis or endodontically treated teeth may combine internal and external protocols customized to brightness goals.

Dental bonding sculpted from layered composite can close small gaps, refine edges, or mask isolated chips within a single visit when occlusion allows. Larger redesigns benefiting from luminous depth and fracture resistance commonly explore veneers or minimal-prep laminates—we mock shade contours with temporaries whenever helpful so approval happens before ceramics are finalized.

Orthodontically stable bites receive priority. If rotations or protrusion jeopardize veneers long term, coordinated alignment may precede elective surfaces. Smile design also considers lip position at rest versus full smile dynamics; millimeters differentiate between “appropriately expressive” versus “frozen.”

Pearl aligns recommendations with timelines you actually keep. Whether you crave subtle polish before milestones or phased upgrades across seasons, you receive treatment plans prioritized by longevity, upkeep, and your comfort—not pressure to renovate every tooth unnecessarily.`,
  },
  {
    id: "dental-implants",
    title: "Dental Implants",
    description:
      "Permanent-feeling replacements anchored in bone, planned with restorative function and effortless cleaning in mind from day one.",
    image: `${pathToImages}/dentalImplants.png`,
    tags: ["Implants", "Bone health", "Full-arch options"],
    text: `
A dental implant substitutes the root you lost—not merely the crown you see smiling. Titanium or ceramic fixtures integrate gradually with jawbone through a process termed osseointegration; once matured, connectors (abutments) uphold individual crowns, multi-unit bridges, or strategically angled full-arch hybrids.

Success begins with volumetric diagnostics. Cone-beam scans evaluate ridge height and width alongside proximity to sinus floors or inferior alveolar nerves. Mild deficiency often resolves via guided augmentation or sinus elevation timed before or alongside placement. Smoking status, unmanaged diabetes, and certain osteoporosis medications elevate risk—we discuss tailoring candidacy transparently rather than guaranteeing outcomes.

Computer-guided surgeries reduce exploratory tissue reflection by referencing digital wax-ups merged to scan data when intricate angulation emerges. Immediate provisional teeth exist for select arches with adequate primary stability though most patients interimize with discreet removable transitions while integration finishes.

Maintenance parallels natural teeth albeit with nuanced instruments: slender brushes access threads around abutments; professional recall intervals monitor peri-implant tissues for inflammation before bone loss manifests silently. Occlusal overload from unbalanced bites receives adjustment proactively.

Investment conversations include longevity assumptions, warranty caveats tied to adherence, and how implants influence nutrition when molars vanished. Pearl stages financing-friendly phases when sinus lifts or grafts precede definitive prosthetics—you always know sequencing before signing consent.`,
  },
  {
    id: "teeth-whitening",
    title: "Teeth Whitening",
    description:
      "Clinical-strength whitening with sensitivity protocols so brightening enamel feels gradual, safe, and under professional supervision.",
    image: `${pathToImages}/teethWhitening.png`,
    tags: ["Whitening", "Sensitivity care", "Stain removal"],
    text: `
Surface stains accumulate relentlessly—even rigorous brushers ingest pigment from tea, spiced sauces, balsamic reductions, berries, nicotine analogs, or chlorhexidine rinses. Whitening formulations use stabilized peroxide variants penetrating enamel microtubules where chromophores hide. OTC strips help mild cases yet lack viscosity control guarding gingiva or dosing calibrated to recession exposure.

Pearl inventories professional systems balancing lift versus comfort. Carbamide peroxide gels degrade slower for overnight trays; hydrogen peroxide options accelerate supervised chairside appointments when events loom. Barrier gels isolate soft tissue preventing chemical burns that casual kits risk.

Sensitivity arises transiently due to tubular fluid shifts—not necessarily permanent damage—but we precondition thin enamel cohorts using remineralizing pastes featuring fluoride and bioavailable calcium phosphate analogs days prior. Spacing booster sessions diminishes rebound aching while cumulative shade gains remain comparable.

Not every tooth whitens uniformly. Composite restorations, porcelain, and demineralized white spot lesions behave differently—we flag mismatches early and discuss replacement timing if uniform shade matters cosmetically. Internal bleaching tackles single dark non-vitals before crowning avoids opaque masking.

Whitening complements broader smile plans sequentially: lighten first, bond or veneer second so ceramic shade matches stabilized baseline. Hydration reminders, moderated acid exposure, and maintenance gel appointments sustain vibrancy—we supply realistic hue retention expectations instead of billboard promises.`,
  },
  {
    id: "emergency-dentistry",
    title: "Emergency Dentistry",
    description:
      "Same-day triage for traumatic injuries, escalating infections, uncontrolled bleeding, and pain that steals sleep—when minutes matter.",
    image: `${pathToImages}/emergencyDentistry.png`,
    tags: ["Urgent care", "Trauma", "Infection control"],
    text: `
Dental emergencies scramble routines without warning—a crown popping during dinner, lacrosse stick impact, throbbing swellings spreading toward the airway, thermal cracks exposing dentin painfully. Classification determines urgency rather than politely waiting until calendars align.

Pearl staffs triage questions filtering airway compromise, escalating facial swellings feverish, uncontrollable hemorrhage requiring pressure ineffectiveness, or avulsed permanent teeth soaking improperly. Telephone guidance advises cold compress intervals, saline rinses sparingly around clots, and positioning strategies while en route.

Traumatized anterior teeth hinge on concussion, subluxation, luxation variants, intrusive displacement, fractures involving pulp, root horizontal splits—we radiograph thoughtfully yet avoid redundant imaging harming developing tissues in youth. Splinting mobile segments stabilizes healing windows while antimicrobial rinses adjunctively reduce bacterial loading.

Dental abscesses demand source control; antibiotics alone postpone inevitable drainage needs. Localized incision or coronal pulp decompression relieves hydraulic pressure relieving agony swiftly when appropriate. Facial cellulitis escalation triggers hospital coordination—never understated.

Pain management leverages layered pharmacology aligning medical histories and allergy profiles. Anxiety spikes receive nitrous sedation options when airway stable and pregnancy status cleared. Transparent after-hours pathways mean you seldom wonder whether voicemail black holes swallowed your SOS—documented escalation lists exist.`,
  },
  {
    id: "prevention",
    title: "Prevention",
    description:
      "Hygiene intervals, fluoride strategy, periodontal mapping, diet coaching—small habits that postpone big treatment for years.",
    image: `${pathToImages}/prevention.png`,
    tags: ["Hygiene", "Checkups", "Gum health"],
    text: `
Preventive dentistry is not “just cleaning.” It aggregates risk scoring: caries lesion activity, periodontal pocket trends, occlusion wear facets, dryness medication effects, habitual clenching, dietary acid frequency—even sleep-disordered breathing signs sometimes surface chairside prompting referrals.

Pearl aligns recall cadences biologically—not calendar dogma. Stable low-risk adolescents might stretch modestly responsibly while diabetic adults with periodontal history compress intervals protecting attachment levels. Guided biofilm disruption uses ultrasonics and hand instrumentation matched to calculus tenacity and implant surfaces.

Radiographic selection weighs ALARA principles—you receive bitewing timelines tuned to decay susceptibility versus blanket annual exposure. Pediatric sealants strategically seal deep occlusal fissures where toothbrush filaments skim ineffectively. Adult adjunctive varnish applications remineralize incipient lesions before cavitation mandates drilling.

Chairside coaching refines technique without shaming—we demonstrate angled bristle tucking, interproximal brush sizing, floss tension subtleties influencing papilla health. Salivary flow discussions pair hydration rhythms with xylitol exposure windows complementing antimicrobial rinses sparing healthy flora.

Insurance navigation clarifies allowable frequencies transparently—we separate covered basics from elective protective upgrades openly. Investing prevention pays dividends aesthetically and financially: fewer crowns, quieter nights minus throbbing emergencies, systemic inflammation markers drifting favorably.`,
  },
];

export const homeFeaturedServiceIds = [
  "root-canal-treatment",
  "cosmetic-dentist",
  "dental-implants",
] as const;

export function getServicesByIds(ids: readonly string[]): ServiceItem[] {
  const byId = new Map(services.map((s) => [s.id, s] as const));
  return ids
    .map((id) => byId.get(id))
    .filter((s): s is ServiceItem => s != null);
}

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return services.find((s) => s.id === slug);
}
