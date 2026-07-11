from datetime import datetime, timedelta

from database import SessionLocal
from models import Note, Project, Team


def seed_demo_data() -> None:
    db = SessionLocal()
    try:
        db.query(Note).delete()
        db.query(Project).delete()
        db.query(Team).delete()
        db.commit()

        teams = [
            Team(name="Product"),
            Team(name="Engineering"),
            Team(name="Design"),
        ]
        db.add_all(teams)
        db.flush()

        projects = [
            Project(
                name="Launch Dashboard",
                description="Create a clean internal dashboard for weekly workspace reporting.",
                team_id=teams[0].id,
                created_at=datetime.utcnow() - timedelta(days=12),
            ),
            Project(
                name="API Hardening",
                description="Improve validation, error handling, and endpoint reliability.",
                team_id=teams[1].id,
                created_at=datetime.utcnow() - timedelta(days=8),
            ),
            Project(
                name="Design System Refresh",
                description="Update the visual language and reusable UI patterns.",
                team_id=teams[2].id,
                created_at=datetime.utcnow() - timedelta(days=5),
            ),
        ]
        db.add_all(projects)
        db.flush()

        notes = [
            Note(
                title="Kickoff summary",
                content="Align on scope, success metrics, and launch date.",
                project_id=projects[0].id,
                created_at=datetime.utcnow() - timedelta(days=11),
                updated_at=datetime.utcnow() - timedelta(days=11),
            ),
            Note(
                title="Validation checklist",
                content="Add request validation and reject invalid payloads early.",
                project_id=projects[1].id,
                created_at=datetime.utcnow() - timedelta(days=7),
                updated_at=datetime.utcnow() - timedelta(days=6),
            ),
            Note(
                title="Typography direction",
                content="Use a stronger headline face and more intentional spacing.",
                project_id=projects[2].id,
                created_at=datetime.utcnow() - timedelta(days=4),
                updated_at=datetime.utcnow() - timedelta(days=3),
            ),
            Note(
                title="Launch risks",
                content="Watch for delayed API responses and missing team assignments.",
                project_id=projects[0].id,
                created_at=datetime.utcnow() - timedelta(days=10),
                updated_at=datetime.utcnow() - timedelta(days=9),
            ),
        ]
        db.add_all(notes)
        db.commit()

        print("Seeded demo data:")
        print(f"- teams: {len(teams)}")
        print(f"- projects: {len(projects)}")
        print(f"- notes: {len(notes)}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()