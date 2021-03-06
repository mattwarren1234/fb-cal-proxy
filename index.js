'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  // config = require('./config.json'),
  app = express().use(bodyParser.json()); // creates express http server

// let VERIFY_TOKEN = config.VERIFY_TOKEN || process.env.VERIFY_TOKEN
let VERIFY_TOKEN = process.env.VERIFY_TOKEN
if (!VERIFY_TOKEN)  {
  console.log('missing verify token! exiting')
  // i know this is bad nodejs, go fuck yourself
  process.exit() 
} else {
  console.log('verify token is ', VERIFY_TOKEN)
}


// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      console.log('entry is', JSON.stringify(entry))

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      if (entry.messaging) {
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
      } else {
        // absolutely fuck loosely typed languages. what is this, a framework for ants
        if (entry.field && entry.value){
          console.log('field is ', entry.field)
          if (entry.field == "feed") {
            console.log(entry.value)
          }
        }
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
