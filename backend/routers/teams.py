from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from crud import create_team, delete_team, get_team, list_teams, update_team
from database import get_db
from schemas import TeamCreate, TeamRead, TeamUpdate


router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("", response_model=list[TeamRead])
def read_teams(db: Session = Depends(get_db)):
	return list_teams(db)


@router.post("", response_model=TeamRead, status_code=status.HTTP_201_CREATED)
def add_team(payload: TeamCreate, db: Session = Depends(get_db)):
	return create_team(db, payload)


@router.get("/{team_id}", response_model=TeamRead)
def read_team(team_id: int, db: Session = Depends(get_db)):
	team = get_team(db, team_id)
	if team is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
	return team


@router.put("/{team_id}", response_model=TeamRead)
def modify_team(team_id: int, payload: TeamUpdate, db: Session = Depends(get_db)):
	team = get_team(db, team_id)
	if team is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
	return update_team(db, team, payload)


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_team(team_id: int, db: Session = Depends(get_db)):
	team = get_team(db, team_id)
	if team is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
	delete_team(db, team)
