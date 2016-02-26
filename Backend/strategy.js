/*
NodeJS server that recieves requests from candidates that want to be part of the strategy,
verifies that they are eligible, then adds them to the list of strategies
Upon recieving a request from a client, the server sends requests to the candidates, recieves
the response, then passes along the data to the client
*/

//dependencies
var querystring = require('querystring');
var fs = require('fs');
var http = require('http');

// persistent variables
var servers = [];

http.createServer(function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var url = req.url;
  var str = "";

  // figure out if we are dealing with a new server request, a validation request, or a client request
  if (url.substring(0, 18) == "/validateresponse/") {
    console.log("Server has requested validation...");
    url = url.substring(18, url.length);
    if (servers[servers.length - 1] == url){
      console.log("Sent validation");
      res.end("validated");
    } else {
      console.log("Sent invalidation");
      res.end("invalidated");
    }
  } else if (url.match(/http:/i) || url.match(/localhost/i)){
    // this is a server request
    console.log("Found a server request");
    // respond so the candidate server knows request was recieved
    res.end("Request recieved");
    servers.push(url.substring(1, url.length));
    var portStart = servers[servers.length - 1].length - 4;
    // test server to make sure it is compatible
    var options = {
      host: servers[servers.length - 1].substring(0, portStart - 1),
      path: '/Dallas%20NewYorkCity',
      port: servers[servers.length - 1].substring(portStart, portStart + 4)
    };
    var callback = function(response){
      var str = "";

      response.on('data', function(chunk){
        str += chunk;
      });

      response.on('end', function(){
        console.log("Test recieved, validating...");
        // we have recieved a response and this is the end
        // TODO: run logic here and verify that the response is valid
        if (str.length > 0){
          console.log("Server validated. Server added");
        } else {
          servers.pop();
          console.log("Server invalidated. Server not added");
        }
      });
    }
    var req = http.request(options, callback);
    req.end();
    console.log("Test data sent, awaiting response...")
  } else {
    console.log("Found a client request");
    // this is a client request
    var start, end

    // generate substring
    for (x = 0; x<url.length;x++){
      if (url[x] == '[')
      start = x + 1;
      if (url[x] == ']')
      end = x;
    }

    // get the string in correct format for parsing
    jsonObj = url.substring(start, end);
    jsonObj = jsonObj.replace(new RegExp("%20", 'g'), " ");

    // create a JSON object from string
    jsonObj = JSON.parse("[" + jsonObj + "]");

    // sort the JSON array using a simple selection sort
    var smallest;
    var length = jsonObj.length;
    for (x = 0; x < length - 1; x++){
      smallest = x;
      for (y = x + 1; y < length; y++){
        if (jsonObj[y] < jsonObj[smallest]){
          smallest = y;
        }
      }
      smallestNumber = jsonObj[smallest];
      jsonObj[smallest] = jsonObj[x];
      jsonObj[x] = smallestNumber;
    }

    var callback = function(err, result) {
      res.writeHead(200, {
        'Content-Type' : 'x-application/json'
      });
      res.end(result);
    };

    callback(null, JSON.stringify(jsonObj));
  }

}).listen(3000);
