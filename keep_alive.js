const express = require('express');
const app = express();
app.get('/', (req,res)=>{
  res.send('<h1>BANGGCATS BOT ON +628816863236</h1><p>PRIVATE CHAT ONLY</p><p>IG @__kerass</p><p>Active: '+new Date().toLocaleString()+'</p>');
});
app.get('/ping',(req,res)=>res.send('pong'));
app.listen(3000, ()=>console.log('Keep alive ON port 3000'));
module.exports = app;