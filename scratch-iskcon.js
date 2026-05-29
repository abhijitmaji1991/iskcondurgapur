const https = require('https');

https.get('https://audio.iskcondesiretree.com/index.php?q=f&f=%2F01_-_Srila_Prabhupada', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // print first 2000 characters to see the structure
    console.log(data.substring(0, 3000));
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
