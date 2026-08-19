import os
from dotenv import load_dotenv
import requests

load_dotenv()

TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
CHAT_ID = os.getenv('TELEGRAM_BOT_CHAT_ID')

def send_message(text: str) -> bool:
    try:
        response = requests.post(
            f'https://api.telegram.org/bot{TOKEN}/sendMessage',
            data={'chat_id': CHAT_ID, 'text': text}
        )
        if response.json()['ok'] == False:
            return False
        return True
    except requests.exceptions.RequestException:
        return False