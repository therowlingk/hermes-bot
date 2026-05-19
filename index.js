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
      '🚀 Hermes AI Online!\n\nSilakan chat apa saja.'
    );

  }

  try {

    const response = await axios.post(
      'https://api.freemodel.dev/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',

        messages: [
          {
            role: 'user',
            content: text
          }
        ]

      },
      {
        headers: {
          'Authorization':
            `Bearer ${process.env.FREEMODEL_API_KEY}`,

          'Content-Type': 'application/json'
        }
      }
    );

    const aiReply =
      response.data.choices[0].message.content;

    bot.sendMessage(chatId, aiReply);

  } catch (err) {

    console.log(err.response?.data || err.message);

    bot.sendMessage(
      chatId,
      '❌ Error AI:\n' +
      JSON.stringify(
        err.response?.data || err.message
      )
    );

  }

});          'Authorization': `Bearer ${process.env.FREEMODEL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(response.data);

    const aiReply =
      response.data.choices?.[0]?.message?.content ||
      'AI tidak memberi jawaban';

    bot.sendMessage(chatId, aiReply);

  } catch (err) {

    console.log(err.response?.data || err.message);

    bot.sendMessage(
      chatId,
      '❌ Error AI:\n' +
      JSON.stringify(err.response?.data || err.message)
    );
  }
});
