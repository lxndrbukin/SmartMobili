from fastapi import APIRouter, Depends
from dotenv import load_dotenv
from utils import get_current_user
from db_models.auth import User
from datetime import datetime, timedelta
import httpx
import os

load_dotenv()

token = os.getenv("VERCEL_ACCESS_TOKEN")
project_id = os.getenv("VERCEL_PROJECT_ID")

analytics_router = APIRouter(prefix="/analytics")

def get_date_range(days: int):
    until = datetime.utcnow() + timedelta(days=1)
    since = until - timedelta(days=days)
    return (
        since.strftime("%Y-%m-%dT00:00:00.000Z"),
        until.strftime("%Y-%m-%dT00:00:00.000Z"),
    )

@analytics_router.get("/views_for_week")
async def get_week_analytics(days: int, current_user: User = Depends(get_current_user)):
    until = datetime.utcnow()
    since = until - timedelta(days=days)
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.vercel.com/v1/query/web-analytics/visits/aggregate",
            params={
                "projectId": project_id,
                "by": "day",
                "since": since.strftime("%Y-%m-%dT00:00:00.000Z"),
                "until": until.strftime("%Y-%m-%dT00:00:00.000Z"),
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        return response.json()

@analytics_router.get("/views_per_country")
async def get_country_analytics(days: int, current_user: User = Depends(get_current_user)):
    since, until = get_date_range(days)
    
    params = {
        "projectId": project_id,
        "by": "country",
        "since": since,
        "until": until,
        "filter": "environment eq 'production'"
    }
        
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.vercel.com/v1/query/web-analytics/visits/aggregate",
            params=params,
            headers={"Authorization": f"Bearer {token}"}
        )
        return response.json()

@analytics_router.get("/views_per_page")
async def get_page_analytics(days: int, current_user: User = Depends(get_current_user)):
    since, until = get_date_range(days)
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.vercel.com/v1/query/web-analytics/visits/aggregate",
            params={
                "projectId": project_id,
                "by": "requestPath",
                "since": since,
                "until": until,
                "filter": "environment eq 'production'"
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        return response.json()