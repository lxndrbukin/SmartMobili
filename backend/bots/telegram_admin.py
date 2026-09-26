import os
from dotenv import load_dotenv
import requests
import logging

load_dotenv()
logging.basicConfig(filename='telegram_admin_bot.log', level=logging.INFO)

TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
CHAT_IDS = os.getenv('TELEGRAM_BOT_CHAT_IDS')

def send_message(text: str, chat_id: str) -> bool:
    try:
        response = requests.post(
            f'https://api.telegram.org/bot{TOKEN}/sendMessage',
            data={'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'},
        )
        if response.json()['ok'] == False:
            return False
        return True
    except requests.exceptions.RequestException:
        return False

def notify_admin(message: str):
    for chat_id in CHAT_IDS.split(','):
        res = send_message(message, chat_id)
        if not res:
            logging.error('Telegram could not be reached')