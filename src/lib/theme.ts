import type { CategoryName, CategoryTheme } from "./types";

export const CATEGORY_ORDER: CategoryName[] = [
  "Deep Thoughts",
  "Family",
  "Friends",
  "Dating",
  "Occupation",
  "Dreams",
  "Recreation",
];

export const CATEGORY_THEMES: Record<CategoryName, CategoryTheme> = {
  "Deep Thoughts": {
    name: "Deep Thoughts",
    accent: "#6C4FF6",
    accentSoft: "#EDE9FE",
    tagline: "Big questions, no easy outs",
  },
  Family: {
    name: "Family",
    accent: "#F5A623",
    accentSoft: "#FEF3D9",
    tagline: "For the whole crew",
  },
  Friends: {
    name: "Friends",
    accent: "#14B8A6",
    accentSoft: "#DBF6F1",
    tagline: "Group chat energy",
  },
  Dating: {
    name: "Dating",
    accent: "#F0537D",
    accentSoft: "#FDE3EA",
    tagline: "Love, tested",
  },
  Occupation: {
    name: "Occupation",
    accent: "#3B82F6",
    accentSoft: "#DFEAFE",
    tagline: "Career curveballs",
  },
  Dreams: {
    name: "Dreams",
    accent: "#C026D3",
    accentSoft: "#F7DFF7",
    tagline: "If anything were possible",
  },
  Recreation: {
    name: "Recreation",
    accent: "#22C55E",
    accentSoft: "#DEFBE7",
    tagline: "Food, sports & fun",
  },
};
