// APIKEY BACA DARI .env - AMAN +628816863236
require('dotenv').config();

module.exports = {
  // BACA DARI .env - JADI AMAN GAK KELIATAN DI GITHUB
  tiktok: {
    tikwm: process.env.TIKWM_API || 'https://www.tikwm.com/api/?url=',
  },
  youtube: {
    api1: process.env.YT_API1 || 'https://api.akuari.my.id/downloader/youtube?link=',
    api2: process.env.YT_API2 || 'https://api.agatz.xyz/api/ytmp3?url=',
    api3: process.env.YT_API3 || 'https://api.ryzendesu.vip/api/downloader/ytmp3?url=',
  },
  downloader: {
    ig: process.env.IG_API || 'https://api.akuari.my.id/downloader/ig?link=',
    fb: process.env.FB_API || 'https://api.akuari.my.id/downloader/fb?link=',
  },
  textpro: {
    api: process.env.TEXTPRO_API || 'https://api.ryzendesu.vip/api/textpro/',
  },
  keys: {
    lolhuman: process.env.LOLHUMAN_APIKEY || 'free',
    zenz: process.env.ZENZ_APIKEY || 'free',
    ryzendesu: process.env.RYZENDESU_APIKEY || 'free'
  },
  bot: {
    number: process.env.BOT_NUMBER || '628816863236',
    owner: process.env.OWNER_NAME || 'BANGGCATS',
    ig: process.env.IG_OWNER || '@__kerass'
  }
}