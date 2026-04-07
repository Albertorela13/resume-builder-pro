export type GenKey = "full" | "role" | "none";

export interface SuggestionItem {
  title: string;
  content: string;
}

// SUMMARY suggestions — one paragraph each
export const summarySuggestions: Record<GenKey, SuggestionItem[]> = {
  full: [
    {
      title: "Growth & retention focus",
      content:
        "Data-driven Product Manager with 6+ years leading SaaS B2C platforms. Proven track record improving user retention by 23% through cross-functional collaboration with engineering and design, aligned with data-oriented product vision and ARR-focused roadmap strategy.",
    },
    {
      title: "Leadership & strategy focus",
      content:
        "Senior PM with 6+ years building and scaling digital products in competitive SaaS B2C markets. Track record of aligning product roadmaps with ARR targets, managing cross-functional stakeholders from C-suite to engineering, and building teams that ship with confidence.",
    },
    {
      title: "Execution & delivery focus",
      content:
        "Product Manager with a consistent record of delivering high-impact product launches on time and within budget. Skilled at balancing short-term wins with long-term platform health, combining analytical rigor with strong design sensibility to advocate for the end user at every stage.",
    },
  ],
  role: [
    {
      title: "Generalist PM profile",
      content:
        "Product Manager with 6 years spanning discovery, delivery, and go-to-market across SaaS B2C products. Proven ability to define clear product visions, translate them into actionable roadmaps, and collaborate effectively across engineering, design, marketing, and commercial functions.",
    },
    {
      title: "Growth specialist",
      content:
        "Specialized in growth product management with a focus on acquisition, activation, and retention funnels. Built and led experimentation programs resulting in consistent metric uplift. Strong analytical background — comfortable with SQL, Amplitude, and product analytics tooling.",
    },
    {
      title: "Strategic & commercial angle",
      content:
        "Senior PM with experience translating business strategy into product decisions with measurable ROI. Experienced in working with sales and marketing to ensure product-market fit and GTM alignment, and comfortable owning P&L-related discussions.",
    },
  ],
  none: [
    {
      title: "Core PM profile",
      content:
        "Product Manager with solid experience leading end-to-end product development in digital environments. Comfortable managing ambiguity, prioritizing ruthlessly, and delivering results across cross-functional teams with user empathy and business acumen.",
    },
    {
      title: "User-centered approach",
      content:
        "Product leader with a deep commitment to understanding user needs and translating them into impactful solutions. Proven track record of running user research and continuous discovery at scale, building business cases that balance user value with commercial outcomes.",
    },
    {
      title: "Team & delivery focus",
      content:
        "Experienced in building high-performing product squads and creating conditions for teams to do their best work. Skilled at unblocking delivery through clear prioritization, stakeholder alignment, and process design, with a strong ownership mindset.",
    },
  ],
};

// EXPERIENCE suggestions — 4 bullet points each
export const experienceSuggestions: Record<GenKey, SuggestionItem[]> = {
  full: [
    {
      title: "Retention & growth impact",
      content:
        "• Led data-informed feature prioritization that drove a 23% retention improvement across a 3M+ user SaaS platform.\n• Managed cross-functional squads of 8–12 across engineering, design, and data to deliver quarterly roadmap goals.\n• Introduced OKR framework adopted org-wide, cutting planning cycle time by 30%.\n• Aligned product roadmap directly with ARR targets, contributing to 18% revenue growth year-on-year.",
    },
    {
      title: "Platform & technical depth",
      content:
        "• Owned end-to-end product lifecycle for core SaaS platform features — from discovery to post-launch iteration.\n• Partnered closely with engineering to define technical requirements, manage trade-offs, and maintain platform health.\n• Reduced critical bug backlog by 40% by implementing structured triage and prioritization processes.\n• Drove adoption of API-first design principles that reduced integration time for enterprise clients by 50%.",
    },
    {
      title: "Stakeholder & strategy alignment",
      content:
        "• Managed product strategy for a portfolio of 4 product lines with combined ARR of $12M.\n• Presented quarterly roadmaps and progress updates to C-suite and board-level stakeholders.\n• Built and maintained a prioritization framework used by 3 product teams to align on trade-offs.\n• Collaborated with sales and marketing to co-own GTM strategy for 2 major product launches.",
    },
  ],
  role: [
    {
      title: "Delivery & ownership",
      content:
        "• Owned product roadmap end-to-end, coordinating across engineering, design, and commercial teams to hit quarterly targets.\n• Delivered 3 major product releases on schedule, each resulting in measurable improvement in user satisfaction scores.\n• Established clear definition-of-done standards and sprint rituals that improved team delivery predictability by 25%.\n• Maintained a healthy backlog with clear priority rationale accessible to all stakeholders.",
    },
    {
      title: "Discovery & user insight",
      content:
        "• Led continuous discovery programme including bi-weekly user interviews, usability tests, and survey analysis.\n• Translated user insights into actionable problem statements that shaped quarterly roadmap priorities.\n• Built internal research repository used by design and engineering to inform decision-making.\n• Reduced time-to-insight by 40% by introducing standardized research templates and tooling.",
    },
    {
      title: "Cross-functional collaboration",
      content:
        "• Served as primary liaison between product, engineering, design, and commercial teams across 2 product areas.\n• Facilitated weekly cross-functional syncs that reduced misalignment incidents and improved on-time delivery.\n• Created shared product principles adopted across the product org to align autonomous teams.\n• Mentored 2 associate PMs and contributed to PM hiring process and onboarding programme.",
    },
  ],
  none: [
    {
      title: "Core responsibilities",
      content:
        "• Defined and maintained product roadmap aligned with business objectives and user needs.\n• Collaborated with engineering and design to ship features from concept to production.\n• Gathered and synthesized qualitative and quantitative feedback to inform prioritization decisions.\n• Communicated progress, risks, and decisions clearly to stakeholders at all levels.",
    },
    {
      title: "Achievements & impact",
      content:
        "• Improved core product KPIs quarter-over-quarter through structured experimentation and iteration.\n• Reduced time-to-market for new features by introducing lightweight discovery and delivery processes.\n• Built strong relationships with key stakeholders, earning trust as a reliable and transparent partner.\n• Contributed to team culture by promoting user-centered thinking and data-informed decision-making.",
    },
    {
      title: "Growth & learning",
      content:
        "• Expanded product scope from single feature ownership to full product area leadership over 2 years.\n• Developed deep expertise in B2C SaaS product management, monetization, and growth mechanics.\n• Completed formal training in product strategy, user research, and agile delivery methodologies.\n• Active contributor to internal knowledge-sharing through documentation, workshops, and peer mentoring.",
    },
  ],
};

// SKILLS suggestions — flat list of 10
export const skillsSuggestions: Record<GenKey, string[]> = {
  full: [
    "Retention optimization",
    "Data-driven roadmapping",
    "SaaS growth metrics",
    "A/B testing",
    "Amplitude",
    "OKR frameworks",
    "Cross-functional leadership",
    "Stakeholder management",
    "Funnel analysis",
    "Agile/Scrum",
  ],
  role: [
    "Product strategy",
    "Roadmap planning",
    "Agile/Scrum",
    "Stakeholder management",
    "User research",
    "Data analysis",
    "KPI definition",
    "Cross-functional collaboration",
    "Sprint planning",
    "Go-to-market",
  ],
  none: [
    "Product management",
    "Roadmap planning",
    "User research",
    "Stakeholder communication",
    "Agile/Scrum",
    "Data analysis",
    "Design thinking",
    "Problem-solving",
    "Team collaboration",
    "Communication",
  ],
};
