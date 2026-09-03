from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from google import genai
from google.genai.errors import ClientError
from google.genai import types
from utils import SYSTEM_PROMPT
from sqlalchemy.orm import Session
from db_models.chatbot import Chat, ChatMessage
from db import get_db
from utils import search_products
from gemini_client import client, GEMINI_MODEL
import uuid

chatbot_router = APIRouter(prefix="/chatbot", tags=["chatbot"])

chat_sessions = {}

class ChatRequest(BaseModel):
    message: str = Field(..., max_length=1000)
    lang: str = "ro"
    conversation_id: str | None = None

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

@chatbot_router.post("/")
def chat(req: ChatRequest, db: Session = Depends(get_db)):
    lang_name = "Romanian" if req.lang == "ro" else "Russian"
    try:
        chat = db.query(Chat).filter(Chat.conversation_id == req.conversation_id).first()

        if not chat:
            chat = Chat(
                conversation_id=str(uuid.uuid4())
            )
            db.add(chat)
            db.commit()
            db.refresh(chat)
        user_message = ChatMessage(
            chat_id=chat.id,
            text=req.message,
            role="user"
        )
        db.add(user_message)
        db.commit()
        db.refresh(user_message)
        if req.conversation_id and req.conversation_id in chat_sessions:
            chat_session = chat_sessions[req.conversation_id]
            conversation_id = req.conversation_id
        else:
            conversation_id = chat.conversation_id
            chat_session = client.chats.create(
                model=GEMINI_MODEL,
                config={
                    "system_instruction": f"{SYSTEM_PROMPT}\n\nRespond in {lang_name}",
                    "tools": [search_tool]
                }
            )
            chat_sessions[conversation_id] = chat_session
        response = chat_session.send_message(req.message)
        part = response.candidates[0].content.parts[0]
        if part.function_call:
            args = part.function_call.args
            results = search_products(args["query"], req.lang, db)
            function_response_part = types.Part.from_function_response(
                name="search_products",
                response={"results": results}
            )
            final_response = chat_session.send_message(function_response_part)
            model_message = ChatMessage(
                chat_id=chat.id,
                text=final_response.text,
                role="model"
            )
            db.add(model_message)
            db.commit()
            db.refresh(model_message)
            return {"reply": final_response.text, "conversation_id": conversation_id}
        else:
            model_message = ChatMessage(
                chat_id=chat.id,
                text=response.text,
                role="model"
            )
            db.add(model_message)
            db.commit()
            db.refresh(model_message)
            return {"reply": response.text, "conversation_id": conversation_id}
    except ClientError as e:
        raise HTTPException(status_code=429, detail="Assistant is busy, please try again shortly.")
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))