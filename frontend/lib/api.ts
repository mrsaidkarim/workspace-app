import type { Note, Project, Team } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, init);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export type TeamPayload = { name: string };
export type ProjectPayload = { name: string; description?: string; team_id: number };
export type ProjectUpdatePayload = {
  name?: string;
  description?: string;
  team_id?: number;
};
export type NotePayload = { title: string; content?: string; project_id: number };
export type NoteUpdatePayload = {
  title?: string;
  content?: string;
  project_id?: number;
};

async function listTeams(): Promise<Team[]> {
  return request("/teams");
}

async function createTeam(payload: TeamPayload): Promise<Team> {
  return request("/teams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function updateTeam(id: number, payload: TeamPayload): Promise<Team> {
  return request(`/teams/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function removeTeam(id: number) {
  await request(`/teams/${id}`, { method: "DELETE" });
}

async function listProjects(teamId?: number): Promise<Project[]> {
  const query = teamId === undefined ? "" : `?team_id=${teamId}`;
  return request(`/projects${query}`);
}

async function createProject(payload: ProjectPayload): Promise<Project> {
  return request("/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function updateProject(id: number, payload: ProjectUpdatePayload): Promise<Project> {
  return request(`/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function removeProject(id: number) {
  await request(`/projects/${id}`, { method: "DELETE" });
}

async function listNotes(projectId?: number): Promise<Note[]> {
  const query = projectId === undefined ? "" : `?project_id=${projectId}`;
  return request(`/notes${query}`);
}

async function getNoteById(id: number): Promise<Note> {
  return request(`/notes/${id}`);
}

async function createNote(payload: NotePayload): Promise<Note> {
  return request("/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function updateNote(id: number, payload: NoteUpdatePayload): Promise<Note> {
  return request(`/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function removeNote(id: number) {
  await request(`/notes/${id}`, { method: "DELETE" });
}

export const teamsApi = {
  list: listTeams,
  create: createTeam,
  update: updateTeam,
  remove: removeTeam,
};

export const projectsApi = {
  list: listProjects,
  create: createProject,
  update: updateProject,
  remove: removeProject,
};

export const notesApi = {
  list: listNotes,
  get: getNoteById,
  create: createNote,
  update: updateNote,
  remove: removeNote,
};

export function projectsByTeam(teamId: number) {
  return listProjects(teamId);
}

export function notesByProject(projectId: number) {
  return listNotes(projectId);
}
