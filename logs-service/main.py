from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import models
import database
import schemas 


app = FastAPI()

# Dependencia de la base de datos
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint para crear un log
@app.post("/logs/", response_model=schemas.LogResponse)
def create_log(log: schemas.LogCreate, db: Session = Depends(get_db)):
    db_log = models.Log(**log.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

# Endpoint para obtener logs con filtros y paginación
@app.get("/logs/", response_model=List[schemas.LogResponse])
def get_logs(
    db: Session = Depends(get_db),
    application_name: Optional[str] = None,
    log_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    skip: int = 0,
    limit: int = 10
):
    query = db.query(models.Log)
    if application_name:
        query = query.filter(models.Log.application_name == application_name)
    if log_type:
        query = query.filter(models.Log.log_type == log_type)
    if start_date:
        query = query.filter(models.Log.created_at >= start_date)
    if end_date:
        query = query.filter(models.Log.created_at <= end_date)
    return query.order_by(models.Log.created_at).offset(skip).limit(limit).all()
