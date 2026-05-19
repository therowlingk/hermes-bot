const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

console.log("🚀 AIMAN AI Running...");

const chats = {};

bot.on('message', async (msg) => {

  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  console.log("Message:", text);

  /*
  =========================
  START
  =========================
  */

  if (text === '/start') {

    return bot.sendMessage(
      chatId,
      `🚀 AIMAN AI Crypto Assistant Online

Ketik pertanyaan crypto apa saja.`
    );
  }

  /*
  =========================
  RESET MEMORY
  =========================
  */

  if (text === '/reset') {

    chats[chatId] = [];

    return bot.sendMessage(
      chatId,
      '🧠 Memory berhasil direset.'
    );
  }

  /*
  =========================
  MEMORY
  =========================
  */

  if (!chats[chatId]) {
    chats[chatId] = [];
  }

  chats[chatId].push({
    role: 'user',
    content: text
  });

  /*
  =========================
  LIMIT MEMORY
  =========================
  */

  if (chats[chatId].length > 10) {
    chats[chatId].shift();
  }

  bot.sendChatAction(chatId, 'typing');

  /*
  =========================
  AI REQUEST
  =========================
  */

  try {

    const response = await axios.post(
      'https://api.freemodel.dev/v1/chat/completions',

      {
        model: 'gpt-3.5-turbo',

        messages: [

          {
            role: 'system',
            content:
              'Kamu adalah AIMAN AI, asisten crypto profesional untuk airdrop, mint FCFS, testnet, whitelist, NFT, dan web3.'
          },

          ...chats[chatId]

        ]

      },

      {
        headers: {

          Authorization:
            `Bearer ${process.env.FREEMODEL_API_KEY}`,

          'Content-Type':
            'application/json'

        }
      }
    );

    console.log(response.data);

    const aiReply =
      response.data?.choices?.[0]?.message?.content
      || '❌ AI tidak memberi jawaban.';

    /*
    =========================
    SAVE MEMORY AI
    =========================
    */

    chats[chatId].push({
      role: 'assistant',
      content: aiReply
    });

    /*
    =========================
    SEND MESSAGE
    =========================
    */

    bot.sendMessage(chatId, aiReply);

  } catch (err) {

    console.log(
      err.response?.data || err.message
    );

    bot.sendMessage(
      chatId,
      '❌ Error AI:\n' +
      JSON.stringify(
        err.response?.data || err.message
      )
    );
  }

});
