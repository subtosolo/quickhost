const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const urlDatabase = {};

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'frontend')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.post("/api/shorten", (req, res) => {
  const { alias, longUrl, domain } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: "URL is required" });
  }

  const validDomains = ["quickhost.click"];
  if (!validDomains.includes(domain)) {
    return res.status(400).json({ error: "invalid domain selected" });
  }

  if (urlDatabase[alias]) {
    return res.status(400).json({ error: "alias already taken, please choose another one" });
  }
  const shortAlias = alias || Math.random().toString(36).substr(2, 6);
  urlDatabase[shortAlias] = longUrl;
  const shortUrl = `http://${domain}/${shortAlias}`;
  res.json({ shortUrl });
});


app.get("/:alias", (req, res) => {
  const alias = req.params.alias;
  const longUrl = urlDatabase[alias];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send("this is not a real/working link");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`ts is running on http://localhost:${PORT}`);
});
