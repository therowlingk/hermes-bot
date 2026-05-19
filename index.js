const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

console.log("Bot starting...");

bot.on('message', (msg) => {
  console.log(msg.text);

  if(msg.text === '/start'){
    bot.sendMessage(msg.chat.id, 'Hermes Bot Online 🚀');
  }
});
