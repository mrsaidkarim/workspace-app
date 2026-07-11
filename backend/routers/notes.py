from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from crud import create_note, delete_note, get_note, get_project, list_notes, update_note
from database import get_db
from schemas import NoteCreate, NoteRead, NoteUpdate


router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("", response_model=list[NoteRead])
def read_notes(
	project_id: int | None = Query(default=None),
	db: Session = Depends(get_db),
):
	return list_notes(db, project_id=project_id)


@router.post("", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
def add_note(payload: NoteCreate, db: Session = Depends(get_db)):
	project = get_project(db, payload.project_id)
	if project is None:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Project does not exist")
	return create_note(db, payload)


@router.get("/{note_id}", response_model=NoteRead)
def read_note(note_id: int, db: Session = Depends(get_db)):
	note = get_note(db, note_id)
	if note is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
	return note


@router.put("/{note_id}", response_model=NoteRead)
def modify_note(note_id: int, payload: NoteUpdate, db: Session = Depends(get_db)):
	note = get_note(db, note_id)
	if note is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
	if payload.project_id is not None:
		project = get_project(db, payload.project_id)
		if project is None:
			raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Project does not exist")
	return update_note(db, note, payload)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_note(note_id: int, db: Session = Depends(get_db)):
	note = get_note(db, note_id)
	if note is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
	delete_note(db, note)
