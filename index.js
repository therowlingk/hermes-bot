const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

/*
====================================
AIMAN AI TELEGRAM BOT
STABLE VERSION
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
MEMORY CHAT
====================================
*/

const chats = {};

/*
====================================
BOT MESSAGE
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
🚀 AIMAN AI CRYPTO ASSISTANT

Fitur:
• Airdrop Hunter
• Alpha Finder
• Mint FCFS Guide
• Web3 Assistant
• Testnet Farming
• Wallet Tracker
• Crypto Research

Commands:
/help
/reset
/alpha
/wallet 0x...

Silakan chat apa saja tentang crypto.
`
    );
  }

  /*
  ====================================
  HELP
  ====================================
  */

  if (text === '/help') {

    return bot.sendMessage(
      chatId,
`
📚 AIMAN COMMANDS

/start → Mulai bot
/help → Bantuan
/reset → Reset memory

/alpha → Cari alpha crypto
/wallet 0x... → Wallet tracker

Contoh:
Apa airdrop potensial minggu ini?
`
    );
  }

  /*
  ====================================
  RESET MEMORY
  ====================================
  */

  if (text === '/reset') {

    chats[chatId] = [];

    return bot.sendMessage(
      chatId,
      '🧠 Memory berhasil direset.'
    );
  }

  /*
  ====================================
  ALPHA FINDER
  ====================================
  */

  if (text === '/alpha') {

    return bot.sendMessage(
      chatId,
`
🔥 AIMAN Alpha Finder

Potensi Alpha:
• LayerZero ecosystem
• Monad testnet
• Berachain ecosystem
• Blast ecosystem
• Base ecosystem
• Scroll ecosystem
• ZKsync ecosystem

Fokus:
• Testnet
• Galxe
• Discord role
• NFT mint
• Early mainnet

⚠️ Gunakan wallet khusus airdrop.
`
    );
  }

  /*
  ====================================
  WALLET TRACKER
  ====================================
  */

  if (text.startsWith('/wallet')) {

    const address = text.split(' ')[1];

    if (!address) {

      return bot.sendMessage(
        chatId,
        '❌ Contoh:\n/wallet 0x123...'
      );
    }

    return bot.sendMessage(
      chatId,
`
👛 Wallet Tracker

Address:
${address}

🔍 Track:
https://debank.com/profile/${address}

🔍 Arkham:
https://platform.arkhamintelligence.com/explorer/address/${address}

⚠️ DYOR sebelum copy trade.
`
    );
  }

  /*
  ====================================
  MEMORY SETUP
  ====================================
  */

  if (!chats[chatId]) {

    chats[chatId] = [];
  }

  chats[chatId].push({
    role: 'user',
    content: text
  });

  /*
  ====================================
  LIMIT MEMORY
  ====================================
  */

  if (chats[chatId].length > 10) {

    chats[chatId].shift();
  }

  /*
  ====================================
  TYPING
  ====================================
  */

  await bot.sendChatAction(
    chatId,
    'typing'
  );

  /*
  ====================================
  LOADING MESSAGE
  ====================================
  */

  const loading = await bot.sendMessage(
    chatId,
    '🔍 AIMAN sedang berpikir...'
  );

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

        max_tokens: 300,

        messages: [

          {
            role: 'system',

            content:
`
Kamu adalah AIMAN AI.

Asisten AI profesional khusus:
- Crypto
- Airdrop
- Mint FCFS
- NFT
- Web3
- Testnet
- Wallet Security
- Alpha Finder

Karakter:
- Pintar
- Cepat
- Profesional
- Modern
- Fokus hasil

Aturan:
- Jangan pernah meminta seed phrase
- Jangan memberikan scam link
- Prioritaskan keamanan wallet
- Gunakan bahasa Indonesia modern
`
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

        },

        timeout: 120000
      }
    );

    console.log(
      "AI RESPONSE:",
      response.data
    );

    /*
    ====================================
    GET AI REPLY
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
        '❌ AIMAN tidak memberi jawaban.';
    }

    /*
    ====================================
    SAVE MEMORY
    ====================================
    */

    chats[chatId].push({
      role: 'assistant',
      content: aiReply
    });

    /*
    ====================================
    DELETE LOADING
    ====================================
    */

    await bot.deleteMessage(
      chatId,
      loading.message_id
    );

    /*
    ====================================
    SEND REPLY
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

    await bot.deleteMessage(
      chatId,
      loading.message_id
    );

    await bot.sendMessage(
      chatId,
`
❌ AIMAN AI ERROR

Kemungkinan:
• API lambat
• Model sibuk
• Timeout
• FreeModel overload

Coba lagi beberapa saat.
`
    );
  }

});
