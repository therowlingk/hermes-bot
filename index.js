const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {
  polling: true
});

bot.on('message', (msg) => {
  console.log(msg.text);

  if (msg.text === '/start') {
    bot.sendMessage(msg.chat.id, 'Hermes Bot Online 🚀');
  }
});

console.log('Bot Running...');
