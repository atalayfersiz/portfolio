export interface EducationItem {
  period?: string;
  degree: string;
  institution: string;
  department?: string;
  location: string;
  gpa?: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  type: string;
  bullets: string[];
}

export interface CompetitionItem {
  title: string;
  award?: string;
  projectSlug?: string;
}

export interface ContactInfo {
  location: string;
  email: string;
  phone?: string;
}

export const contactInfo: ContactInfo = {
  location: "Berlin, Germany",
  email: "atalayfersiz@outlook.com",
};

export const educationData: EducationItem[] = [
  {
    period: "Current",
    degree: "Master of Architecture Typology",
    institution: "Technische Universität Berlin",
    department: "Department of Architecture",
    location: "Berlin, Germany",
    gpa: "Semester III",
  },
  {
    period: "Graduated",
    degree: "Bachelor of Architecture",
    institution: "Yıldız Technical University",
    department: "Department of Architecture",
    location: "Istanbul, Turkey",
    gpa: "GPA: 3.54 / 4.0 (High Honor Degree)",
  },
];

export const experienceData: ExperienceItem[] = [
  {
    period: "December 2025",
    role: "Research Assistant",
    company: "Technische Universität Berlin",
    location: "Department of Civil Engineering, Berlin",
    type: "Part Time",
    bullets: [
      "Contributing to a project about digital twins of bridges.",
      "Collecting and organizing data for digital twin creation.",
    ],
  },
  {
    period: "Spring 2023 - 2024 (PT) | Spring 2024 - Fall 2025 (FT)",
    role: "Junior Architect",
    company: "Dilekci Architects",
    location: "Istanbul, Turkey",
    type: "Full Time / Part Time",
    bullets: [
      "Designed and developed architectural plans and 3D models for high-rise and mid-rise projects.",
      "Ensured alignment with client goals and compliance; managed project phases from concept to detailed design.",
      "Conducted site inspections and resolved design challenges; prepared technical documentation and specifications.",
      "Integrated sustainable, energy-efficient materials.",
      "Mastered high-rise systems, including structural requirements, facade design, and urban-tower relations.",
    ],
  },
  {
    period: "Summer 2021 - 2022",
    role: "Architect Intern",
    company: "Dilekci Architects",
    location: "Istanbul, Turkey",
    type: "Internship",
    bullets: [
      "Drafted layouts, elevations, and 3D models using AutoCAD, Rhinoceros, and SketchUp.",
      "Collaborated with senior architects on innovative solutions for diverse projects.",
      "Prepared visualizations and presentation materials for stakeholders.",
      "Researched and applied sustainable design practices.",
    ],
  },
  {
    period: "Summer 2023",
    role: "Participant",
    company: "ITU “Artificial Intelligence and Architecture/Design Education” Workshop",
    location: "Istanbul, Turkey",
    type: "Workshop",
    bullets: [
      "Engaged in discussions on the integration of artificial intelligence in architectural education and design practices.",
      "Participated in thematic sessions addressing AI’s role, potential risks, and ethical considerations in architectural processes.",
      "Collaborated with architects, educators, and industry experts to explore innovative solutions for leveraging AI in architectural education and professional practice.",
    ],
  },
  {
    period: "Summer 2020",
    role: "Construction Architect Intern",
    company: "Uran Architecture",
    location: "Muğla, Turkey",
    type: "Internship",
    bullets: [
      "Assisted in designing architectural plans, ensuring compliance with codes and client specifications.",
      "Monitored construction progress to meet deadlines and quality standards.",
      "Collaborated on innovative residential and commercial designs; prepared material specifications and technical reports.",
    ],
  },
];

export const competitionsData: CompetitionItem[] = [
  {
    title: "Cuhadaroglu 2023 SEMTLI",
    award: "Jury Special Award",
    projectSlug: "roboshore",
  },
  {
    title: "MDC Miniature Design Competition",
    award: "Honorable Mention",
    projectSlug: "mdc",
  },
  {
    title: "AMORF Natural Stone Competition",
    projectSlug: "amorf",
  },
  {
    title: "Kartalkaya Mountain Hotel",
    projectSlug: "kartalkaya",
  },
  {
    title: "Kaira Looro Elementary School",
    projectSlug: "kairo-looro",
  },
];

export interface LanguageItem {
  language: string;
  level: string;
  detail?: string;
}

export const languagesData: LanguageItem[] = [
  {
    language: "Turkish",
    level: "Native",
  },
  {
    language: "English",
    level: "C1",
    detail: "Professional / Fluent",
  },
  {
    language: "German",
    level: "B1",
    detail: "Intermediate",
  },
];

export const softwareSkills = {
  advanced: ["AutoCAD", "Rhinoceros", "Grasshopper", "Enscape", "Lumion", "D5 Render"],
  intermediate: ["3DS Max", "Sketchup", "Twinmotion", "DaVinci Resolve"],
  basic: ["ArchiCAD", "Revit", "Blender", "Unreal Engine", "Stable Diffusion"],
};

