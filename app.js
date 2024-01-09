const https = require('https');
const dotenv = require('dotenv');
const express = require('express');
const http = require('http');

const server = express();

dotenv.config({ path: './config.env'});

const options = {
  hostname: process.env.HOST_DOMAIN,
  path: process.env.HOST_PATH,
  method: 'GET'
};

const secondOptions = {
  hostname: 'course-checker.onrender.com',
  path: '/',
  method: 'GET',
};

const selfOption = {
  hostname: process.env.SELF_DOMAIN,
  port: process.env.PORT,
  path: process.env.SELF_PATH,
  method: 'GET'
};

async function autoRefresh() {
  const req = https.request(options, res => {
    console.log(`Status code: ${res.statusCode}, Sucessfully sent req to ${process.env.HOST_DOMAIN}`);

  });
  // req.on('error', err => {
  //   console.log(`Error: ${err.message}`);
  // });
  req.end();
};

async function secondRefresh() {
  const req = https.request(secondOptions, res => {
    console.log(`Status code: ${res.statusCode}, Sucessfully sent req to ${process.env.HOST_DOMAIN}`);

  });

  req.end();
}

async function selfRefresh() {
  // Testing on local host: using http instead of https
  const req = https.request(selfOption, res => {
    console.log(`Status code: ${res.statusCode}, Successfully sent req to local Server`);

  });

  req.on('error', err => {
    console.log(`Error: ${err.message}`);
  });

  req.end();
};

server.get('/', async (req, res) => {
  try {
  await autoRefresh();
  const delay = 0.1 * 60 * 1000; // 12 minutes timout
  setTimeout(selfRefresh, delay);
  setTimeout(secondOptions, delay);
  
  res.status(200).json({
    message: `Successfully sent req to ${process.env.HOST_DOMAIN}`
  });

  } catch (err) {
      await selfRefresh();
      res.status(400).json({
        message: `Error`
      });
  };
});

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`App running on port ${port}`);
});

server.on('error', err => {
  console.error(`Server error: ${err.message}`);
});
