require('dotenv').config();
const dns = require('dns');
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const urlDatabase = [];
let shortUrlCounter = 1;


app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(express.urlencoded());
// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const { url: urlString } = req.body;
  const { hostname } = new URL(urlString);

 // res.json({holi:hostname})
 dns.lookup(hostname, (err, address, family) => {
  if (err) {
    console.error(err);
    res.status(400).json({  error: 'invalid url' });
  } else {
    // La URL es válida

    const originalUrl = { original_url: urlString, short_url: shortUrlCounter };
    urlDatabase.push(originalUrl);

    // Devolvemos la URL original y la URL corta generada
    res.status(200).json(originalUrl);

    // Incrementamos el contador para la siguiente URL corta
    shortUrlCounter++;  }
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  const matchedUrl = urlDatabase.find(url => url.short_url === shortUrl);
  if(matchedUrl){
    res.redirect(matchedUrl.original_url);
  } else {
    res.status(400).json({  error: 'invalid url' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
