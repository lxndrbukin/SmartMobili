import os
from dotenv import load_dotenv
import requests
import logging

load_dotenv()
logging.basicConfig(filename='telegram_admin_bot.log', level=logging.INFO)

TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
CHAT_ID = os.getenv('TELEGRAM_BOT_CHAT_ID')

def send_message(text: str) -> bool:
    try:
        response = requests.post(
            f'https://api.telegram.org/bot{TOKEN}/sendMessage',
            data={'chat_id': CHAT_ID, 'text': text, 'parse_mode': 'HTML'},
            
        )
        if response.json()['ok'] == False:
            return False
        return True
    except requests.exceptions.RequestException:
        return False

def notify_admin(message: str):
    res = send_message(message)
    if not res:
        logging.error('Telegram could not be reached')