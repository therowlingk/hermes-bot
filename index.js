const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

console.log("🚀 AIMAN AI Running...");

/*
====================================
MEMORY CHAT
====================================
*/

const chats = {};

/*
====================================
START
====================================
*/

bot.on('message', async (msg) => {

  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  console.log(text);

  /*
  ====================================
  START COMMAND
  ====================================
  */

  if (text === '/start') {

    return bot.sendMessage(
      chatId,
      `
🚀 AIMAN AI Crypto Assistant Online

Fitur:
• AI Crypto Research
• Airdrop Hunter
• Wallet Tracker
• Auto Alpha Finder
• FCFS Mint Guide
• Testnet Farming
• Onchain Analysis
• Crypto Security

Commands:
/help
/reset
/wallet 0x...
/alpha
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
/reset → Reset memory chat

/wallet 0x... → Track wallet
/alpha → Cari alpha crypto
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
      '🧠 Memory chat berhasil direset.'
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

    bot.sendChatAction(chatId, 'typing');

    try {

      /*
      ====================================
      DEXSCREENER
      ====================================
      */

      const walletInfo = `
👛 Wallet Tracker

Address:
${address}

🔍 Tools:
• DeBank
https://debank.com/profile/${address}

• Arkham
https://platform.arkhamintelligence.com/explorer/address/${address}

• DexScreener
https://dexscreener.com

⚠️ Selalu DYOR sebelum copy trade.
`;

      return bot.sendMessage(chatId, walletInfo);

    } catch (err) {

      console.log(err.message);

      return bot.sendMessage(
        chatId,
        '❌ Gagal track wallet.'
      );
    }
  }

  /*
  ====================================
  AUTO ALPHA FINDER
  ====================================
  */

  if (text === '/alpha') {

    bot.sendChatAction(chatId, 'typing');

    const alphaText = `
🔥 AIMAN Alpha Finder

Potensi alpha yang wajib dipantau:

1. LayerZero ecosystem
2. Monad testnet
3. Berachain ecosystem
4. Initia testnet
5. ZKsync ecosystem
6. Base ecosystem
7. Blast ecosystem
8. Scroll ecosystem

🎯 Fokus:
• Testnet aktif
• Early NFT mint
• Discord role
• Galxe campaign
• Mainnet interaction

⚠️ Gunakan wallet khusus airdrop.
`;

    return bot.sendMessage(chatId, alphaText);
  }

  /*
  ====================================
  MEMORY CHAT SETUP
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

  if (chats[chatId].length > 12) {

    chats[chatId].shift();
  }

  /*
  ====================================
  TYPING
  ====================================
  */

  bot.sendChatAction(chatId, 'typing');

  /*
  ====================================
  AI RESPONSE
  ====================================
  */

  try {

    const response = await axios.post(
      'https://api.freemodel.dev/v1/chat/completions',
      {
        model: 'claude-3-sonnet',

        messages: [

          {
            role: 'system',
            content: `
Kamu adalah AIMAN AI.

Asisten AI profesional khusus:
- Crypto
- Airdrop
- Mint FCFS
- NFT
- Testnet
- Trading
- Web3
- Onchain analysis
- Wallet security
- Farming
- Alpha finder

Tugas:
- Membantu user mencari peluang airdrop
- Memberikan strategi crypto
- Membantu memahami project blockchain
- Memberikan langkah jelas
- Memberikan insight crypto modern
- Membantu analisa peluang early project

Aturan:
- Jangan pernah meminta seed phrase
- Jangan memberikan scam link
- Prioritaskan keamanan wallet
- Berikan jawaban profesional
- Gunakan bahasa Indonesia modern
- Fokus dan tidak bertele-tele
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
        }
      }
    );

    const aiReply =
      response.data.choices[0].message.content;

    /*
    ====================================
    SAVE MEMORY AI
    ====================================
    */

    chats[chatId].push({
      role: 'assistant',
      content: aiReply
    });

    /*
    ====================================
    SEND REPLY
    ====================================
    */

    bot.sendMessage(chatId, aiReply);

  } catch (err) {

    console.log(
      err.response?.data || err.message
    );

    bot.sendMessage(
      chatId,
      '❌ AIMAN AI Error.'
    );
  }

});
