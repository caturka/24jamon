require('./keep_alive.js');
const fs = require('fs');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, downloadMediaMessage } = require('@whiskeysockets/baileys');
const P = require('pino');
const qrcode = require('qrcode-terminal');
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
    browser: ['BANGGCATS-88', 'Chrome', '88.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (u) => {
    const { connection, lastDisconnect, qr } = u;
    
    if (qr) {
      console.log('\n================= SCAN INI BOS =================');
      qrcode.generate(qr, { small: true });
      console.log('================================================');
      console.log('SCAN PAKE HP +628816863236 | WA -> Linked devices');
      console.log('================================================\n');
    }

    if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
      console.log('Reconnect...');
      startBot();
    }
    if (connection === 'open') {
      console.log('✅ BANGGCATS 88 FITUR + BANNER + APIKEY ONLINE +628816863236');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;
    if (msg.key.fromMe) return;
    const from = msg.key.remoteJid;
    if (from.endsWith('@g.us')) return; // PRIVATE ONLY

    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || '';
    if (!body.startsWith('#') && !body.startsWith('.')) return;

    const args = body.slice(1).trim().split(/ +/);
    const cmd = args[0].toLowerCase();
    const argsText = args.slice(1).join(' ');
    console.log(`[88] ${from}: ${body}`);

    try {
      // MENU + BANNER
      if (cmd === 'menu' || cmd === 'allmenu' || cmd === 'help') {
        const menuText = allmenu('#', 'BANGGCATS 88', 'BANGGCATS');
        if (fs.existsSync('./banner.jpg')) {
          await sock.sendMessage(from, { image: fs.readFileSync('./banner.jpg'), caption: menuText });
        } else {
          await sock.sendMessage(from, { text: menuText });
        }
        return;
      }

      if (cmd === 'ping') {
        await sock.sendMessage(from, { text: `🏓 PONG\nSPEED: ON\nBOT: +628816863236\nBANNER: ON\n88 FITUR` });
        return;
      }

      if (cmd === 'owner' || cmd === 'creator') {
        await sock.sendMessage(from, { text: `👑 OWNER: wa.me/628816863236\nIG: @__kerass\n88 FITUR REAL NO FAKE` });
        return;
      }

      if (cmd === 'tiktok' || cmd === 'tt' || cmd === 'tiktokdl') {
        if (!argsText) { await sock.sendMessage(from, { text: 'Contoh: #tiktok https://vt.tiktok.com/...' }); return; }
        await sock.sendMessage(from, { text: '⏳ Download TikTok...' });
        try {
          const res = await axios.get(`${apikey.tiktok.tikwm}${argsText}`);
          const data = res.data.data;
          await sock.sendMessage(from, { video: { url: data.play }, caption: `✅ ${data.title}\n+628816863236` });
        } catch { await sock.sendMessage(from, { text: '❌ Gagal, coba link lain' }); }
        return;
      }

      if (cmd === 'play' || cmd === 'ytmp3' || cmd === 'song') {
        if (!argsText) { await sock.sendMessage(from, { text: 'Contoh: #play dj tiktok viral' }); return; }
        await sock.sendMessage(from, { text: `🎵 Cari: ${argsText}` });
        const search = await yts(argsText);
        const video = search.videos[0];
        if (!video) { await sock.sendMessage(from, { text: 'Gak ketemu' }); return; }
        try {
          const res = await axios.get(`${apikey.youtube.api1}${video.url}`);
          const mp3 = res.data.mp3 || res.data.result || res.data.url;
          if (mp3) {
            await sock.sendMessage(from, { audio: { url: mp3 }, mimetype: 'audio/mpeg', fileName: `${video.title}.mp3` });
          } else {
            await sock.sendMessage(from, { text: `🎵 ${video.title}\n${video.url}` });
          }
        } catch {
          await sock.sendMessage(from, { text: `🎵 ${video.title}\n${video.url}\n+628816863236` });
        }
        return;
      }

      if (cmd === 'ytmp4' || cmd === 'ytvideo') {
        if (!argsText) { await sock.sendMessage(from, { text: 'Contoh: #ytmp4 link youtube' }); return; }
        await sock.sendMessage(from, { text: '⏳ Download YTMP4...' });
        try {
          const res = await axios.get(`${apikey.youtube.api1}${argsText}`);
          const mp4 = res.data.mp4 || res.data.video;
          if (mp4) await sock.sendMessage(from, { video: { url: mp4 }, caption: '✅ Done +628816863236' });
        } catch { await sock.sendMessage(from, { text: '❌ Gagal download' }); }
        return;
      }

      if (cmd === 's' || cmd === 'sticker' || cmd === 'stiker') {
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        const mediaMsg = quoted ? { message: quoted } : msg;
        try {
          const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {}, { logger: P({ level: 'silent' }), reuploadRequest: sock.updateMediaMessage });
          await sock.sendMessage(from, { sticker: buffer });
        } catch { await sock.sendMessage(from, { text: 'Reply foto/video bos!' }); }
        return;
      }

      if (cmd === 'toimg') {
        try {
          const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
          if (!quoted?.stickerMessage) { await sock.sendMessage(from, { text: 'Reply stiker!' }); return; }
          const buffer = await downloadMediaMessage({ message: quoted }, 'buffer', {}, { logger: P({ level: 'silent' }), reuploadRequest: sock.updateMediaMessage });
          await sock.sendMessage(from, { image: buffer });
        } catch { await sock.sendMessage(from, { text: '❌ Gagal' }); }
        return;
      }

      // DEFAULT
      await sock.sendMessage(from, { text: `Fitur #${cmd} aktif!\nKetik #menu buat li