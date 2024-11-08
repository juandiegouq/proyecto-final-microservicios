from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LogCreate(BaseModel):
    application_name: str
    log_type: str
    class_module: str
    summary: str
    description: str

class LogResponse(LogCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
