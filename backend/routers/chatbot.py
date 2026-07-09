import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from google import genai
from google.genai.errors import ClientError
from google.genai import types
from utils import SYSTEM_PROMPT

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_MODEL = os.getenv('GEMINI_MODEL')

chatbot_router = APIRouter()
client = genai.Client(api_key=GEMINI_API_KEY)

class Message(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    message: str = Field(..., max_length=1000)
    lang: str = "ro"
    history: list[Message] = []

search_tool = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="search_products",
            description="Search the furniture catalogue for items matching "
                        "a customer's description, material, or category.",
            parameters={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "What the customer is looking for"}
                },
                "required": ["query"]
            }
        )
    ]
)

@chatbot_router.post('/')
def chat(req: ChatRequest):
    lang_name = "Romanian" if req.lang == "ro" else "Russian"
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[
                {"role": m.role, "parts": [{"text": m.text}]} for m in req.history
            ],
            config={
                'system_instruction': f'{SYSTEM_PROMPT}\n\nRespond in {lang_name}',
                'tools': [search_tool]
            }
        )
        return {'reply': response.text}
    except ClientError as e:
        raise HTTPException(status_code=429, detail='Assistant is busy, please try again shortly.')
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))