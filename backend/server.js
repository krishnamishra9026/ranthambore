const app = require('express')();
const https = require('https');
const fs = require('fs');

//GET home route
app.get('/tata', (req, res) => {
     res.send('Hello World');
});

// we will pass our 'app' to 'https' server
https.createServer(app).listen(3000);