export type Category = 
  | 'all' 
  | 'selected'
  | 'academic' 
  | 'professional'
  | 'explorations';

export type LayoutPreset = 'paule-perron' | 'minimal-grid' | 'editorial' | 'fullscreen';

export interface ProjectImage {
  url: string;
  caption?: string;
  alt: string;
  aspectRatio?: '4/3' | '3/4' | '16/9' | '9/16' | '1/1' | '21/9';
}

export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: Category;
  categories: Category[];
  subtitle: string;
  year: string;
  location?: string;
  client?: string;
  medium?: string;
  dimensions?: string;
  architecturalScale?: string;
  coverImage: ProjectImage;
  gallery: ProjectImage[];
  description: string;
  fullStory?: string;
  technicalSpecs?: TechnicalSpec[];
  featured?: boolean;
  tags: string[];
  gridPos?: { x: number; y: number }; // 10x4 spatial grid slot (0..9, 0..3)
  instagramReelUrl?: string;
  instagramEmbedUrl?: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  title: string;
  subtitle: string;
  bio: string;
  activePreset: LayoutPreset;
  availablePresets: {
    id: LayoutPreset;
    name: string;
    description: string;
  }[];
  socials: {
    instagram?: string;
    linkedin?: string;
    email?: string;
    github?: string;
  };
}
