export const themeTokens = {
  colors: {
    dark: {
      background: "#0d0d0e",
      foreground: "#f4f4f5",
      accent: "#e4e4e7",
      muted: "#27272a",
      mutedForeground: "#a1a1aa",
      border: "#1f1f23",
    },
    light: {
      background: "#fafafa",
      foreground: "#09090b",
      accent: "#18181b",
      muted: "#f4f4f5",
      mutedForeground: "#71717a",
      border: "#e4e4e7",
    },
  },
  typography: {
    headingFont: "font-sans font-light tracking-tight",
    bodyFont: "font-sans font-normal tracking-normal text-muted-foreground",
    monoFont: "font-mono text-xs uppercase tracking-widest text-muted-foreground",
  },
  presets: {
    "minimal-grid": {
      container: "max-w-7xl mx-auto px-6 py-12",
      grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
      cardAspect: "aspect-[4/3]",
    },
    editorial: {
      container: "max-w-5xl mx-auto px-6 py-16",
      grid: "flex flex-col gap-24",
      cardAspect: "aspect-[16/9]",
    },
    fullscreen: {
      container: "w-full h-screen px-4 py-4 flex flex-col justify-between overflow-hidden",
      grid: "relative w-full h-[80vh] flex items-center justify-center",
      cardAspect: "w-full h-full object-cover",
    },
  },
};
