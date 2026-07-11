# Workspace App

A lightweight full-stack workspace application that allows users to organize **Teams**, **Projects**, and **Notes**.

This project was built to demonstrate clean architecture, REST API design, CRUD operations, and a responsive frontend using modern web technologies.

## Live Demo
https://workspace-app-npru.vercel.app/

## Features

* Create and list Teams
* Create and list Projects within a Team
* Create, edit, delete, and list Notes within a Project
* Responsive user interface
* RESTful API built with FastAPI

## Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS

### Backend

* FastAPI
* SQLAlchemy
* SQLite

## Project Structure

```text
workspace-app/
│
├── frontend/          # Next.js application
│
└── backend/           # FastAPI application
```

## Data Model

```text
Team
 └── Project
      └── Note
```

* A Team can have multiple Projects.
* A Project belongs to one Team.
* A Project can have multiple Notes.
* A Note belongs to one Project.

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd workspace-app
```

### 2. Backend


```bash
cd backend

pip install fastapi uvicorn sqlalchemy pydantic

uvicorn app.main:app --reload
```app --reload
```

The backend will be available at:

```
http://localhost:8000
```

API documentation:

```
http://localhost:8000/docs
```

### 3. Frontend

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

The frontend will be available at:

```
http://localhost:3000
```

## API Overview

### Teams

| Method | Endpoint      | Description    |
| ------ | ------------- | -------------- |
| GET    | `/teams`      | List all teams |
| POST   | `/teams`      | Create a team  |
| DELETE | `/teams/{id}` | Delete a team  |

### Projects

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| GET    | `/teams/{team_id}/projects` | List projects for a team |
| POST   | `/teams/{team_id}/projects` | Create a project         |
| DELETE | `/projects/{id}`            | Delete a project         |

### Notes

| Method | Endpoint                       | Description              |
| ------ | ------------------------------ | ------------------------ |
| GET    | `/projects/{project_id}/notes` | List notes for a project |
| POST   | `/projects/{project_id}/notes` | Create a note            |
| PUT    | `/notes/{id}`                  | Update a note            |
| DELETE | `/notes/{id}`                  | Delete a note            |
