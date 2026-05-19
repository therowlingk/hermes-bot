const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

/*
====================================
BOT TELEGRAM
====================================
*/

const bot = new TelegramBot(
  process.env.BOT_TOKEN,
  {
    polling: true
  }
);

console.log("🚀 AIMAN AI ONLINE");

/*
====================================
MESSAGE HANDLER
====================================
*/

bot.on('message', async (msg) => {

  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  console.log("USER:", text);

  /*
  ====================================
  START
  ====================================
  */

  if (text === '/start') {

    return bot.sendMessage(
      chatId,
      `
🚀 AIMAN AI ONLINE

Crypto Assistant:
• Airdrop
• Mint FCFS
• Web3
• Testnet
• NFT
• Alpha Finder

Silakan chat apa saja.
`
    );
  }

  /*
  ====================================
  TYPING
  ====================================
  */

  bot.sendChatAction(chatId, 'typing');

  /*
  ====================================
  AI REQUEST
  ====================================
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
              'Kamu adalah AIMAN AI, asisten crypto profesional khusus airdrop, mint FCFS, web3, dan testnet.'
          },
          {
            role: 'user',
            content: text
          }
        ]

      },

      {
        headers: {
          Authorization:
            `Bearer ${process.env.FREEMODEL_API_KEY}`,

          'Content-Type':
            'application/json'
        },

        timeout: 30000
      }
    );

    console.log("AI RESPONSE:", response.data);

    /*
    ====================================
    GET AI TEXT
    ====================================
    */

    let aiReply =
      response.data?.choices?.[0]?.message?.content;

    /*
    ====================================
    FALLBACK
    ====================================
    */

    if (!aiReply) {

      aiReply =
        '❌ AIMAN AI tidak memberi jawaban.';
    }

    /*
    ====================================
    SEND TO TELEGRAM
    ====================================
    */

    await bot.sendMessage(
      chatId,
      aiReply
    );

  } catch (err) {

    console.log(
      "ERROR:",
      err.response?.data || err.message
    );

    await bot.sendMessage(
      chatId,
      '❌ Error AI.\n\nCek Railway Logs.'
    );
  }

});
