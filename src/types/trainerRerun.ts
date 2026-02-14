export interface Intro {
  title: string;
  description: string[];
}

export interface Requirement {
  title: string;
  items: string[];
}

export interface TipsTricks {
  title: string;
  items: string[];
}

export interface Trainer {
  name: string;
  money: string | number;
}

export interface Route {
  name: string;
  notes?: string[];
  trainers?: Trainer[];
  pp_cost?: number | string;
  type?: string;
}

export interface Region {
  name: string;
  routes: Route[];
}

export interface TrainerRerunData {
  intro: Intro;
  requirements: Requirement;
  tips_tricks: TipsTricks;
  regions: Region[];
  source?: string[];
}
