from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from crud import create_project, delete_project, get_project, get_team, list_projects, update_project
from database import get_db
from schemas import ProjectCreate, ProjectRead, ProjectUpdate


router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectRead])
def read_projects(
	team_id: int | None = Query(default=None),
	db: Session = Depends(get_db),
):
	return list_projects(db, team_id=team_id)


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def add_project(payload: ProjectCreate, db: Session = Depends(get_db)):
	team = get_team(db, payload.team_id)
	if team is None:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Team does not exist")
	return create_project(db, payload)


@router.get("/{project_id}", response_model=ProjectRead)
def read_project(project_id: int, db: Session = Depends(get_db)):
	project = get_project(db, project_id)
	if project is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
	return project


@router.put("/{project_id}", response_model=ProjectRead)
def modify_project(project_id: int, payload: ProjectUpdate, db: Session = Depends(get_db)):
	project = get_project(db, project_id)
	if project is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
	if payload.team_id is not None:
		team = get_team(db, payload.team_id)
		if team is None:
			raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Team does not exist")
	return update_project(db, project, payload)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_project(project_id: int, db: Session = Depends(get_db)):
	project = get_project(db, project_id)
	if project is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
	delete_project(db, project)
