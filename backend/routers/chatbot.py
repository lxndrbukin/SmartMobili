from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from google import genai
from google.genai.errors import ClientError
from google.genai import types
from utils import SYSTEM_PROMPT
from sqlalchemy.orm import Session
from db import get_db
from utils import search_products
from gemini_client import client, GEMINI_MODEL


chatbot_router = APIRouter(prefix="/chatbot", tags=["chatbot"])

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
def chat(req: ChatRequest, db: Session = Depends(get_db)):
    lang_name = "Romanian" if req.lang == "ro" else "Russian"
    try:
        contents = [
                {"role": m.role, "parts": [{"text": m.text}]} for m in req.history
            ] + [
                {"role": "user", "parts": [{"text": req.message}]}
            ]
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=contents,
            config={
                'system_instruction': f'{SYSTEM_PROMPT}\n\nRespond in {lang_name}',
                'tools': [search_tool]
            }
        )
        part = response.candidates[0].content.parts[0]
        if part.function_call:
            args = part.function_call.args
            results = search_products(args["query"], req.lang, db)
            contents.append(response.candidates[0].content)
            contents.append(
                types.Content(
                    role='user',
                    parts=[types.Part.from_function_response(
                        name="search_products",
                        response={"results": results}
                    )]
                )
            )
            final_response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=contents,
                config={'system_instruction': f'{SYSTEM_PROMPT}\n\nRespond in {lang_name}'}
            )
            return {'reply': final_response.text}
        else:
            return {'reply': response.text}
    except ClientError as e:
        raise HTTPException(status_code=429, detail='Assistant is busy, please try again shortly.')
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))