from sqlalchemy.orm import Session

from models import Note, Project, Team
from schemas import NoteCreate, NoteUpdate, ProjectCreate, ProjectUpdate, TeamCreate, TeamUpdate


def list_teams(db: Session):
	return db.query(Team).order_by(Team.id.asc()).all()


def get_team(db: Session, team_id: int):
	return db.query(Team).filter(Team.id == team_id).first()


def create_team(db: Session, payload: TeamCreate):
	team = Team(name=payload.name)
	db.add(team)
	db.commit()
	db.refresh(team)
	return team


def update_team(db: Session, team: Team, payload: TeamUpdate):
	if payload.name is not None:
		team.name = payload.name
	db.commit()
	db.refresh(team)
	return team


def delete_team(db: Session, team: Team):
	db.delete(team)
	db.commit()


def list_projects(db: Session, team_id: int | None = None):
	query = db.query(Project).order_by(Project.id.asc())
	if team_id is not None:
		query = query.filter(Project.team_id == team_id)
	return query.all()


def get_project(db: Session, project_id: int):
	return db.query(Project).filter(Project.id == project_id).first()


def create_project(db: Session, payload: ProjectCreate):
	project = Project(
		name=payload.name,
		description=payload.description,
		team_id=payload.team_id,
	)
	db.add(project)
	db.commit()
	db.refresh(project)
	return project


def update_project(db: Session, project: Project, payload: ProjectUpdate):
	if payload.name is not None:
		project.name = payload.name
	if payload.description is not None:
		project.description = payload.description
	if payload.team_id is not None:
		project.team_id = payload.team_id
	db.commit()
	db.refresh(project)
	return project


def delete_project(db: Session, project: Project):
	db.delete(project)
	db.commit()


def list_notes(db: Session, project_id: int | None = None):
	query = db.query(Note).order_by(Note.id.asc())
	if project_id is not None:
		query = query.filter(Note.project_id == project_id)
	return query.all()


def get_note(db: Session, note_id: int):
	return db.query(Note).filter(Note.id == note_id).first()


def create_note(db: Session, payload: NoteCreate):
	note = Note(
		title=payload.title,
		content=payload.content,
		project_id=payload.project_id,
	)
	db.add(note)
	db.commit()
	db.refresh(note)
	return note


def update_note(db: Session, note: Note, payload: NoteUpdate):
	if payload.title is not None:
		note.title = payload.title
	if payload.content is not None:
		note.content = payload.content
	if payload.project_id is not None:
		note.project_id = payload.project_id
	db.commit()
	db.refresh(note)
	return note


def delete_note(db: Session, note: Note):
	db.delete(note)
	db.commit()
