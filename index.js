// BANGGCATS ULTIMATE 88 FITUR + BANNER + APIKEY .ENV - +628816863236 IG @__kerass PRIVATE ONLY
require('dotenv').config();
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
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({level:'silent'})) },
    logger: P({level:'silent'}),
    printQRInTerminal: true,
    browser: ['BANGGCATS BANNER','Chrome','88']
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', async (u) => {
    if(u.connection === 'close' && u.lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) startBot();
    if(u.connection === 'open') console.log('✅ 88 FITUR + BANNER + APIKEY ONLINE +628816863236');
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if(!msg.message || msg.key.fromMe) return;
    const from = msg.key.remoteJid;
    if(from.endsWith('@g.us')) return; // ANTI GRUP 100%
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || '';
    if(!body.startsWith('#') && !body.startsWith('.')) return;
    const args = body.slice(1).trim().split(/ +/).slice(1).join(' ');
    const cmd = body.slice(1).trim().split(/ +/)[0].toLowerCase();
    console.log(`[BANNER-88] ${from}: ${body}`);

    try {
      // MENU + BANNER
      if(cmd==='menu'||cmd==='allmenu'){
        try{
          if(fs.existsSync('./banner.jpg')){
            let banner = fs.readFileSync('./banner.jpg');
            await sock.sendMessage(from,{image:banner,caption:allmenu('#','BANGGCATS ULTIMATE 88','BANGGCATS')});
          } else {
            await sock.sendMessage(from,{text:allmenu('#','BANGGCATS ULTIMATE 88','BANGGCATS')});
          }
        }catch{
          await sock.sendMessage(from,{text:allmenu('#','BANGGCATS ULTIMATE 88','BANGGCATS')});
        }
        return;
      }
      if(cmd==='ping'){ return sock.sendMessage(from,{text:`🏓 PONG ${Date.now()-msg.messageTimestamp*1000}ms\n+628816863236 BANNER ON`}); }
      if(cmd==='owner'){ return sock.sendMessage(from,{text:`👑 wa.me/628816863236\n📸 IG @__kerass\n88 FITUR + BANNER REAL`}); }
      if(cmd==='runtime'){ let up=process.uptime(); return sock.sendMessage(from,{text:`⏰ ${Math.floor(up/3600)}j ${Math.floor((up%3600)/60)}m ON\n+628816863236`}); }
      if(cmd==='apikey'||cmd==='api'){ 
        return sock.sendMessage(from,{text:`🔑 APIKEY 88 FITUR\n✅ Tiktok: ${apikey.tiktok.tikwm}\n✅ YT: ${apikey.youtube.api1}\n✅ IG: ${apikey.downloader.ig}\n✅ TextPro: ${apikey.textpro.api}\n\n+628816863236`});
      }

      // STICKER REAL
      if(cmd==='s'||cmd==='sticker'){
        let quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        let media = quoted ? {message:quoted} : msg;
        let buffer = await downloadMediaMessage(media,'buffer',{},{logger:P({level:'silent'}),reuploadRequest:sock.updateMediaMessage});
        return sock.sendMessage(from,{sticker:buffer});
      }
      if(cmd==='toimg'){
        let quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        let buffer = await downloadMediaMessage({message:quoted},'buffer',{},{logger:P({level:'silent'}),reuploadRequest:sock.updateMediaMessage});
        return sock.sendMessage(from,{image:buffer,caption:'✅ toimg done\n+628816863236'});
      }

      // TIKTOK REAL + APIKEY
      if(cmd==='tiktok'||cmd==='tt'){
        if(!args) return sock.sendMessage(from,{text:'#tiktok link'});
        await sock.sendMessage(from,{text:'⏳ Download TikTok...'});
        let {data} = await axios.get(`${apikey.tiktok.tikwm}${args}`);
        return sock.sendMessage(from,{video:{url:data.data.play},caption:`✅ TikTok ${data.data.title}\n+628816863236`});
      }

      // PLAY YTMP3 REAL + APIKEY
      if(cmd==='play'||cmd==='ytmp3'||cmd==='song'){
        if(!args) return sock.sendMessage