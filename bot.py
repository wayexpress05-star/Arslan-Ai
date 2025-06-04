import telebot
import requests

BOT_TOKEN = 'PASTE_YOUR_BOT_TOKEN'
bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['start'])
def start_msg(message):
    bot.send_message(message.chat.id, "Welcome to Arslan-MD Session Bot!\nSend your number with country code (no +).")

@bot.message_handler(func=lambda m: m.text.isdigit())
def handle_number(message):
    phone = message.text.strip()
    bot.send_message(message.chat.id, f"Creating pairing code for {phone}...")
    r = requests.post("https://sarkar-md-session-generator.koyeb.app/pair", json={"number": phone})
    if r.status_code == 200:
        data = r.json()
        code = data.get("code")
        bot.send_message(message.chat.id, f"✅ Pairing code: `{code}`\nOpen WhatsApp -> Linked Devices -> Link New Device.", parse_mode="Markdown")
    else:
        bot.send_message(message.chat.id, "❌ Failed to generate pairing code.")

bot.infinity_polling()