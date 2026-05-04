const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const FILE = 'payloads.json';

function load() {
  try {
    return fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : { payloads: {} };
  } catch(e) { return { payloads: {} }; }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

app.post('/send', (req, res) => {
  const { AES, noob } = req.body || {};
  if (!noob) return res.json({status: "error"});

  const db = load();
  db.payloads[noob] = { AES: AES || "", time: Date.now() };
  save(db);
  res.json({status: "OK"});
});

app.get('/get', (req, res) => {
  const noob = req.query.noob;
  const db = load();
  const p = (noob && db.payloads[noob]) || {AES:"", time:0};
  res.json(p);
});

app.listen(process.env.PORT || 3000, () => console.log("🔥 Live"));