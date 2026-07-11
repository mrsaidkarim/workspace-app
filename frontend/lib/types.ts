export interface Team {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  team_id: number;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  project_id: number;
}