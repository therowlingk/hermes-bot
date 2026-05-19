const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

console.log("Hermes AI Running...");

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    return bot.sendMessage(
      chatId,
      '🚀 Hermes AI Online!\nKetik apa saja.'
    );
  }

  try {

    const response = await axios.post(
      'https://freemodel.dev/api/generate',
      {
        prompt: text
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FREEMODEL_API_KEY}`
        }
      }
    );

    const aiReply =
      response.data.response || 'Tidak ada respon AI';

    bot.sendMessage(chatId, aiReply);

  } catch (err) {

    console.log(err.message);

    bot.sendMessage(
      chatId,
      '❌ Error AI.'
    );
  }
});
