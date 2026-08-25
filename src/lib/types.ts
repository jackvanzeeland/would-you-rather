export type CategoryName =
  | "Deep Thoughts"
  | "Family"
  | "Friends"
  | "Dating"
  | "Occupation"
  | "Dreams"
  | "Recreation"
  | "Less of Two Evils";

export interface Question {
  option1: string;
  option2: string;
  category: CategoryName;
}

export interface CategoryTheme {
  name: CategoryName;
  accent: string;
  accentSoft: string;
  tagline: string;
}

export type OptionKey = "option1" | "option2";
