import os
from dotenv import load_dotenv
from fastapi import APIRouter, status, HTTPException
from pydantic import BaseModel
from google import genai
from utils import SYSTEM_PROMPT

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_MODEL = os.getenv('GEMINI_MODEL')

chatbot_router = APIRouter()
client = genai.Client(api_key=GEMINI_API_KEY)

class ChatRequest(BaseModel):
    message: str
    lang: str = "ro"

@chatbot_router.post('/', status_code=status.HTTP_201_CREATED)
def chat(req: ChatRequest):
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=req.message,
            config={'system_instruction': SYSTEM_PROMPT}
        )
        return {'reply': response.text}
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))