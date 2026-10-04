import { Project } from "@/types/portfolio";

export const explorationProjects: Project[] = [
  {
    id: "aggregation",
    title: "AGGREGATION",
    slug: "aggregation",
    category: "explorations",
    categories: ["explorations"],
    gridPos: { x: 1, y: 3 },
    subtitle: "Parametric Exploration • Spatial Growth & Volumetric Aggregation",
    year: "2024",
    location: "Istanbul",
    coverImage: {
      url: "/projects/explorations/aggregation/cover/Animation_00008.jpg",
      alt: "Aggregation parametric spatial growth cover",
      aspectRatio: "1/1",
    },
    gallery: [
      {
        url: "/projects/explorations/aggregation/cover/Animation_00008.jpg",
        alt: "Aggregation Static Frame",
      },
      {
        url: "/projects/explorations/aggregation/gallery/360animation.mp4",
        alt: "Aggregation 360 Degree Orbit Animation",
      },
      {
        url: "/projects/explorations/aggregation/gallery/Animation.mp4",
        alt: "Aggregation Procedural Assembly Video",
      },
    ],
    description:
      "An exploration into rule-based computational aggregation systems, investigating how discrete geometric components self-assemble into coherent spatial armatures and porous topologies.",
    fullStory:
      "Using procedural algorithms in Grasshopper and Rhinoceros, iterative growth rules determine modular connection vectors. The resulting formations balance structural redundancy, volumetric porosity, and visual density.",
    technicalSpecs: [
      { label: "Medium", value: "Computational Design & Animation" },
      { label: "Tools", value: "Grasshopper, Rhinoceros, Blender" },
      { label: "Year", value: "2024" },
    ],
    tags: ["Parametric", "Aggregation", "Computational Geometry", "Animation", "Explorations"],
  },
  {
    id: "blended-mesh",
    title: "BLENDED MESH",
    slug: "blended-mesh",
    category: "explorations",
    categories: ["explorations"],
    gridPos: { x: 3, y: 0 },
    subtitle: "Parametric Exploration • Continuous Topological Morphing & SubD",
    year: "2024",
    location: "Istanbul",
    coverImage: {
      url: "/projects/explorations/blended-mesh/cover/1_a copy.jpg",
      alt: "Blended mesh smooth curvature render",
      aspectRatio: "1/1",
    },
    gallery: [
      {
        url: "/projects/explorations/blended-mesh/cover/1_a copy.jpg",
        alt: "Blended Mesh Render Study",
      },
      {
        url: "/projects/explorations/blended-mesh/gallery/Animation_3.mp4",
        alt: "Topological Mesh Blend Animation 01",
      },
      {
        url: "/projects/explorations/blended-mesh/gallery/Animation_4.mp4",
        alt: "Topological Mesh Blend Animation 02",
      },
    ],
    description:
      "Investigating smooth topological transitions between distinct spatial primitives through algorithmic blending and Subdivision (SubD) surfacing.",
    fullStory:
      "This study explores continuous surface continuity (G2 curvature) across branching geometries, creating organic junctions capable of mediating varied structural loads and spatial programs.",
    technicalSpecs: [
      { label: "Medium", value: "Computational Mesh Topology" },
      { label: "Tools", value: "Grasshopper, SubD, Rhino 8" },
      { label: "Year", value: "2024" },
    ],
    tags: ["Parametric", "SubD", "Mesh Blending", "Curvature Continuity", "Explorations"],
  },
  {
    id: "curve-growth",
    title: "CURVE GROWTH",
    slug: "curve-growth",
    category: "explorations",
    categories: ["explorations"],
    gridPos: { x: 5, y: 2 },
    subtitle: "Parametric Exploration • Differential Growth Dynamics on Freeform Surfaces",
    year: "2024",
    location: "Istanbul",
    coverImage: {
      url: "/projects/explorations/curve-growth/cover/Render4 copy.jpg",
      alt: "Differential curve growth render",
      aspectRatio: "1/1",
    },
    gallery: [
      {
        url: "/projects/explorations/curve-growth/cover/Render4 copy.jpg",
        alt: "Curve Growth Surface Render 4",
      },
      {
        url: "/projects/explorations/curve-growth/gallery/Render3 copy.jpg",
        alt: "Curve Growth Surface Render 3",
      },
      {
        url: "/projects/explorations/curve-growth/gallery/Render5 copy.jpg",
        alt: "Curve Growth Surface Render 5",
      },
      {
        url: "/projects/explorations/curve-growth/gallery/Curve Growth On Surface.mp4",
        alt: "Differential Curve Growth Dynamic Surface Simulation",
      },
    ],
    description:
      "Simulating organic self-avoiding differential curve growth constrained to complex double-curved surface substrates.",
    fullStory:
      "Inspired by biological morphogenesis and meandering river systems, the growth algorithm calculates node-to-node repulsion and surface attraction to produce intricate meandering facade skins and ornamental structural paths.",
    technicalSpecs: [
      { label: "Medium", value: "Morphogenetic Surface Simulation" },
      { label: "Tools", value: "Grasshopper, Python, Anemone" },
      { label: "Year", value: "2024" },
    ],
    tags: ["Parametric", "Differential Growth", "Morphogenesis", "Complex Surfaces", "Explorations"],
  },
  {
    id: "fields",
    title: "FIELDS",
    slug: "fields",
    category: "explorations",
    categories: ["explorations"],
    gridPos: { x: 7, y: 1 },
    subtitle: "Parametric Exploration • Vector Field Deformation & Landscape Topographies",
    year: "2024",
    location: "Istanbul",
    coverImage: {
      url: "/projects/explorations/fields/cover/Frame_00068.jpg",
      alt: "Vector field flow landscape",
      aspectRatio: "1/1",
    },
    gallery: [
      {
        url: "/projects/explorations/fields/cover/Frame_00068.jpg",
        alt: "Vector Field Terrain Iso-Contours",
      },
      {
        url: "/projects/explorations/fields/gallery/Frame_00028.jpg",
        alt: "Vector Field Attractor Inception",
      },
      {
        url: "/projects/explorations/fields/gallery/Frame_00098.jpg",
        alt: "Vector Field High-Density Formation",
      },
      {
        url: "/projects/explorations/fields/gallery/Landscape with Fields2.mp4",
        alt: "Field Landscape Dynamic Flow Animation",
      },
    ],
    description:
      "Deploying multi-source vector and scalar potential fields to modulate terrain topography, urban circulation vectors, and spatial density gradients.",
    fullStory:
      "By combining charge points, vortex centers, and directional forces, the landscape transforms dynamically into continuous topographic folds that define public circulation channels and sheltered interior volumes.",
    technicalSpecs: [
      { label: "Medium", value: "Vector Field Simulation" },
      { label: "Tools", value: "Grasshopper, Kangaroo, Cinema 4D" },
      { label: "Year", value: "2024" },
    ],
    tags: ["Parametric", "Vector Fields", "Topography", "Generative Landscape", "Explorations"],
  },
  {
    id: "origami",
    title: "ORIGAMI",
    slug: "origami",
    category: "explorations",
    categories: ["explorations"],
    gridPos: { x: 8, y: 0 },
    subtitle: "Parametric Exploration • Kinetic Deployable Origami & Rigid Folding Kinematics",
    year: "2024",
    location: "Istanbul",
    coverImage: {
      url: "/projects/explorations/origami/cover/3.png",
      alt: "Kinetic origami folding geometry",
      aspectRatio: "1/1",
    },
    gallery: [
      {
        url: "/projects/explorations/origami/cover/3.png",
        alt: "Origami Tessellation Pattern & Facet Layout",
      },
      {
        url: "/projects/explorations/origami/gallery/Nasa Origami Folding .mp4",
        alt: "Kinetic Origami Folding Simulation Video",
      },
    ],
    description:
      "A study of rigid origami kinematic tessellations inspired by aerospace deployable structures (NASA Miura-ori / Starshade principles).",
    fullStory:
      "The system investigates single-degree-of-freedom deployment mechanisms where entire planar surfaces collapse into compact transport envelopes and expand into rigid structural shells without material deformation.",
    technicalSpecs: [
      { label: "Medium", value: "Kinetic Kinematic Simulation" },
      { label: "Tools", value: "Grasshopper, Kangaroo Physics" },
      { label: "Year", value: "2024" },
    ],
    tags: ["Origami", "Kinetic Architecture", "Deployable Structures", "Aerospace", "Explorations"],
  },
  {
    id: "particle",
    title: "PARTICLE",
    slug: "particle",
    category: "explorations",
    categories: ["explorations"],
    gridPos: { x: 0, y: 1 },
    subtitle: "Parametric Exploration • Particle Physics Systems & Swarm Aggregation",
    year: "2024",
    location: "Istanbul",
    coverImage: {
      url: "/projects/explorations/particle/cover/Frame_00093.jpg",
      alt: "Particle system swarm dynamic state",
      aspectRatio: "1/1",
    },
    gallery: [
      {
        url: "/projects/explorations/particle/cover/Frame_00093.jpg",
        alt: "Particle Swarm Climax State",
      },
      {
        url: "/projects/explorations/particle/gallery/1.png",
        alt: "Particle Field Vector Trail 01",
      },
      {
        url: "/projects/explorations/particle/gallery/2.png",
        alt: "Particle Field Vector Trail 02",
      },
      {
        url: "/projects/explorations/particle/gallery/3.png",
        alt: "Particle Field Vector Trail 03",
      },
      {
        url: "/projects/explorations/particle/gallery/Particle Fields Animation 2.mp4",
        alt: "Particle Fields Swarm Simulation Animation",
      },
    ],
    description:
      "Exploration of emergent spatial complexity using multi-agent particle systems and boid flocking behavioral dynamics.",
    fullStory:
      "Particles guided by gravity, collision avoidance, and co-directional alignment leave behind persistent structural threads, weaving intricate micro-architectures and fibrous canopies.",
    technicalSpecs: [
      { label: "Medium", value: "Particle Dynamics & Multi-Agent Swarms" },
      { label: "Tools", value: "Processing / Grasshopper, C# Scripts" },
      { label: "Year", value: "2024" },
    ],
    tags: ["Parametric", "Particle Physics", "Swarm Intelligence", "Generative Systems", "Explorations"],
  },
  {
    id: "kreuzberg-tower-to-daw",
    title: "KREUZBERG TOWER TO DAW",
    slug: "kreuzberg-tower-to-daw",
    category: "explorations",
    categories: ["explorations"],
    gridPos: { x: 9, y: 2 },
    subtitle: "Audio-Spatial Exploration • John Hejduk's Kreuzberg Tower Translated to Sound",
    year: "2026",
    location: "Berlin / Kreuzberg",
    coverImage: {
      url: "/projects/explorations/kreuzberg-tower-to-daw/cover/cover.jpg",
      alt: "Kreuzberg Tower to DAW audio-spatial translation",
      aspectRatio: "1/1",
    },
    gallery: [],
    description:
      "Translating the architectural rhythms, tectonic proportions, and spatial character of John Hejduk's Kreuzberg Tower (IBA 1987) into digital audio workstation (DAW) sound compositions.",
    fullStory:
      "Photos: Eric Bauermeister. The study maps spatial geometries, fenestration patterns, and monolithic facades into synthesized audio frequencies, textural soundscapes, and rhythmic MIDI sequences.",
    technicalSpecs: [
      { label: "Subject", value: "Kreuzberg Tower (John Hejduk, IBA 1987)" },
      { label: "Photos", value: "Eric Bauermeister" },
      { label: "Medium", value: "Audio-Spatial Synthesis / DAW" },
      { label: "Location", value: "Kreuzberg, Berlin" },
      { label: "Year", value: "2026" },
    ],
    instagramReelUrl: "https://www.instagram.com/reel/DcDw96txm-Q/",
    instagramEmbedUrl: "https://www.instagram.com/reel/DcDw96txm-Q/embed",
    tags: ["Audio-Spatial", "DAW", "John Hejduk", "Kreuzberg Tower", "IBA Berlin", "Explorations", "Video"],
  },
  {
    id: "friedrichstrasse-to-daw",
    title: "FRIEDRICHSTRASSE 32/33 TO DAW",
    slug: "friedrichstrasse-to-daw",
    category: "explorations",
    categories: ["explorations"],
    gridPos: { x: 0, y: 3 },
    subtitle: "Audio-Spatial Exploration • Friedrichstraße 32/33 Architectural Translation",
    year: "2026",
    location: "Berlin / Friedrichstraße",
    coverImage: {
      url: "/projects/explorations/friedrichstrasse-to-daw/cover/cover.jpg",
      alt: "Friedrichstraße 32/33 to DAW audio-spatial translation",
      aspectRatio: "1/1",
    },
    gallery: [],
    description:
      "Sonification and spatial acoustic translation of Berlin's Friedrichstraße 32/33 urban facade and architectural rhythms into DAW soundscapes.",
    fullStory:
      "Investigating the sonic translation of architectural grids, vertical alignments, and urban street wall dynamics into structured harmonic intervals and modular synth textures.",
    technicalSpecs: [
      { label: "Subject", value: "Friedrichstraße 32/33, Berlin" },
      { label: "Medium", value: "Spatial Sound Design & DAW" },
      { label: "Location", value: "Friedrichstraße, Berlin" },
      { label: "Year", value: "2026" },
    ],
    instagramReelUrl: "https://www.instagram.com/reel/Db0wVvGA8Yd/",
    instagramEmbedUrl: "https://www.instagram.com/reel/Db0wVvGA8Yd/embed",
    tags: ["Audio-Spatial", "DAW", "Friedrichstraße", "Urban Sonification", "Berlin", "Explorations", "Video"],
  },
  {
    id: "unite-dhabitation-to-daw",
    title: "UNITÉ D'HABITATION TO DAW",
    slug: "unite-dhabitation-to-daw",
    category: "explorations",
    categories: ["explorations"],
    gridPos: { x: 7, y: 0 },
    subtitle: "Audio-Spatial Exploration • Le Corbusier's Modulor Rhythms to Sound",
    year: "2026",
    location: "Berlin / Westend",
    coverImage: {
      url: "/projects/explorations/unite-dhabitation-to-daw/cover/cover.jpg",
      alt: "Unité d'Habitation to DAW audio-spatial translation",
      aspectRatio: "1/1",
    },
    gallery: [],
    description:
      "Translating Le Corbusier's iconic Unité d'Habitation (Corbusierhaus Berlin) proportional systems, Modulor dimensions, and brise-soleil facades into synthesized sound design.",
    fullStory:
      "The Modulor dimensional scale directly informs harmonic overtones, tempo subdivisions, and polyrhythmic structures within the DAW environment, bridging architectural proportion with auditory perception.",
    technicalSpecs: [
      { label: "Subject", value: "Corbusierhaus Berlin (Le Corbusier)" },
      { label: "Medium", value: "Modulor Proportional Sonification" },
      { label: "Location", value: "Westend, Berlin" },
      { label: "Year", value: "2026" },
    ],
    instagramReelUrl: "https://www.instagram.com/reel/DZGYy2ERpFq/",
    instagramEmbedUrl: "https://www.instagram.com/reel/DZGYy2ERpFq/embed",
    tags: ["Audio-Spatial", "DAW", "Le Corbusier", "Unite d'Habitation", "Modulor", "Explorations", "Video"],
  },
  {
    id: "james-simon-galerie-audio-path",
    title: "JAMES-SIMON-GALERIE AUDIO PATH",
    slug: "james-simon-galerie-audio-path",
    category: "explorations",
    categories: ["explorations"],
    gridPos: { x: 8, y: 2 },
    subtitle: "Audio-Spatial Exploration • David Chipperfield's Colonnade & Spatial Trajectory",
    year: "2026",
    location: "Berlin / Museumsinsel",
    coverImage: {
      url: "/projects/explorations/james-simon-galerie-audio-path/cover/cover.jpg",
      alt: "Audio-Spatial Path James-Simon-Galerie translation",
      aspectRatio: "1/1",
    },
    gallery: [],
    description:
      "An audio-spatial trajectory mapping the monumental colonnades, grand stairways, and volumetric transitions of David Chipperfield's James-Simon-Galerie on Berlin's Museum Island.",
    fullStory:
      "Recording and modulating the reverberant acoustic properties and visual pacing along the Museum Island public promenade, transforming physical architectural promenade into a dynamic auditory experience.",
    technicalSpecs: [
      { label: "Subject", value: "James-Simon-Galerie (David Chipperfield)" },
      { label: "Medium", value: "Audio-Spatial Promenade & Sound Design" },
      { label: "Location", value: "Museumsinsel, Berlin" },
      { label: "Year", value: "2026" },
    ],
    instagramReelUrl: "https://www.instagram.com/reel/DclVEKMxCo1/",
    instagramEmbedUrl: "https://www.instagram.com/reel/DclVEKMxCo1/embed",
    tags: ["Audio-Spatial", "DAW", "Chipperfield", "James-Simon-Galerie", "Museum Island", "Explorations", "Video"],
  },
];
