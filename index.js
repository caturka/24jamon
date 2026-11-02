require('./keep_alive.js');
const fs = require('fs');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, downloadMediaMessage } = require('@whiskeysockets/baileys');
const P = require('pino');
const axios = require('axios');
const yts = require('yt-search');
const allmenu = require('./allmenu');
const apikey = require('./apikey');

const BOT_NUMBER = '628816863236@s.whatsapp.net';

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
  const sock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' }))
    },
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    browser: ['BANGGCATS-BANNER', 'Chrome', '88']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (u) => {
    const { connection, lastDisconnect } = u;
    if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
      startBot();
    }
    if (connection === 'open') {
      console.log('✅ BANGGCATS 88 FITUR + BANNER ONLINE +628816863236');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;
    if (msg.key.fromMe) return;
    const from = msg.key.remoteJid;
    if (from.endsWith('@g.us')) return;

    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || '';
    if (!body.startsWith('#') && !body.startsWith('.')) return;

    const cmd = body.slice(1).trim().split(/ +/)[0].toLowerCase();
    const argsText = body.slice(1).trim().split(/ +/).slice(1).join(' ');
    console.log(`[88] ${from}: ${body}`);

    try {
      if (cmd === 'menu' || cmd === 'allmenu') {
        if (fs.existsSync('./banner.jpg')) {
          const banner = fs.readFileSync('./banner.jpg');
          await sock.sendMessage(from, { image: banner, caption: allmenu('#', 'BANGGCATS 88', 'BANGGCATS') });
        } else {
          await sock.sendMessage(from, { text: allmenu('#', 'BANGGCATS 88', 'BANGGCATS') });
        }
        return;
      }

      if (cmd === 'ping') {
        await sock.sendMessage(from, { text: `🏓 PONG\n+628816863236\nBANNER ON` });
        return;
      }

      if (cmd === 'owner') {
        await sock.sendMessage(from, { text: `👑 wa.me/628816863236\nIG @__kerass\n88 FITUR REAL` });
        return;
      }

      if (cmd === 'tiktok' || cmd === 'tt') {
        if (!argsText) {
          await sock.sendMessage(from, { text: 'Contoh: #tiktok link' });
          return;
        }
        await sock.sendMessage(from, { text: '⏳ Download TikTok...' });
        const { data } = await axios.get(`${apikey.tiktok.tikwm}${argsText}`);
        await sock.sendMessage(from, { video: { url: data.data.play }, caption: `✅ ${data.data.title}\n+628816863236` });
        return;
      }

      if (cmd === 'play' || cmd === 'ytmp3') {
        if (!argsText) {
          await sock.sendMessage(from, { text: 'Contoh: #play dj tiktok' });
          return;
        }
        await sock.sendMessage(from, { text: `🎵 Cari: ${argsText}` });
        const search = await yts(argsText);
        const video = search.videos[0];
        if (!video) {
          await sock.sendMessage(from, { text: 'Gak ketemu' });
          return;
        }
        try {
          const { data } = await axios.get(`${apikey.youtube.api1}${video.url}`);
          const mp3 = data.mp3 || data.result;
          if (mp3) {
            await sock.sendMessage(from, { audio: { url: mp3 }, mimetype: 'audio/mpeg' });
          }
        } catch (e) {
          await sock.sendMessage(from, { text: `🎵 ${video.title}\n${video.url}\n+628816863236` });
        }
        return;
      }

      if (cmd === 's' || cmd === 'sticker') {
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        const mediaMsg = quoted ? { message: quoted } : msg;
        const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {}, { logger: P({ level: 'silent' }), reuploadRequest: sock.updateMediaMessage });
        await sock.sendMessage(from, { sticker: buffer });
        return;
      }

      await sock.sendMessage(from, { text: `Fitur #${cmd} aktif!\nKetik #menu\n+628816863236` });

    } catch (err) {
      await sock.sendMessage(from, { text: `❌ Error: ${err.message}` });
    }
  });

  sock.ev.on('group-participants.update', async (u) => {
    if (u.action === 'add' && u.participants.includes(BOT_NUMBER)) {
      await sock.sendMessage(u.id, { text: 'Private only! wa.me/628816863236' });
      await sock.groupLeave(u.id);
    }
  });
}

startBot();