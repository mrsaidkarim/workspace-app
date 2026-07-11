from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TeamBase(BaseModel):
	name: str = Field(..., min_length=1)


class TeamCreate(TeamBase):
	pass


class TeamUpdate(BaseModel):
	name: Optional[str] = Field(default=None, min_length=1)


class TeamRead(TeamBase):
	id: int
	created_at: datetime

	model_config = {"from_attributes": True}


class ProjectBase(BaseModel):
	name: str = Field(..., min_length=1)
	description: Optional[str] = None
	team_id: int


class ProjectCreate(ProjectBase):
	pass


class ProjectUpdate(BaseModel):
	name: Optional[str] = Field(default=None, min_length=1)
	description: Optional[str] = None
	team_id: Optional[int] = None


class ProjectRead(ProjectBase):
	id: int
	created_at: datetime

	model_config = {"from_attributes": True}


class NoteBase(BaseModel):
	title: str = Field(..., min_length=1)
	content: Optional[str] = None
	project_id: int


class NoteCreate(NoteBase):
	pass


class NoteUpdate(BaseModel):
	title: Optional[str] = Field(default=None, min_length=1)
	content: Optional[str] = None
	project_id: Optional[int] = None


class NoteRead(NoteBase):
	id: int
	created_at: datetime
	updated_at: datetime

	model_config = {"from_attributes": True}
