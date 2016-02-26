/*
NodeJS server that is a possible strategy for the strategy server.
Upon startup, it sends a request to the strategy server, verifies that
the stategy server recieved the request, then listens for possible requests
*/

var PORT = 3001

//GET REQUEST
var http = require('http');

var options = {
  host: 'localhost',
  path: '/localhost:' + PORT.toString(),
  port: '3000'
};

callback = function(response){
  var str = '';

  // another chuck of data has been recieved, so append it to 'str'
  response.on('data', function(chunk){
    str += chunk;
  });

  // the whole response has been recieved, so we just print it  out here
  response.on('end', function(){
    //console.log(str);
    if (str == "Request recieved"){
      console.log("Server has acknowledged, awaiting test...");
    } else {
      throw "Unexpected server response";
    }
  });
}

var req = http.request(options, callback);

req.on('error', function(err){
  if (err.code == "ECONNREFUSED"){
    console.log("\n\nERROR: Cannot contact strategy server");
    console.log("\n\nPlease verify strategy server is running on port 3000 and try again!");
    console.log("(lsof -i -P | grep -i \"listen\")");
    console.log("Look for a process called node running on *:3000")
  } else {
    console.log(err);
  }
  throw "Undefined behavior, terminating server...";
});
req.end();


// Server
http.createServer(function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var url = req.url;

  if (url.search("dallas")){
    // this is a test

    console.log("Test recieved");

    var divider = url.indexOf("%20");
    var source = url.substring(1, divider);
    var destination = url.substring(divider + 3, url.length);

    var numMiles = distance(source, destination);
    var cost = numMiles * 175;
    cost = Math.floor(cost);
    cost /= 100;

    resStr = "To go from " + source + " to " + destination + ",\n";
    resStr += "which is " + numMiles + " miles apart\n";
    resStr += "Will cost $" + cost + " using a taxi";

    res.end(resStr);

    console.log("Test response sent, awaiting validation...")

    /*var callback = function(err, result) {
        res.writeHead(200, {
            'Content-Type' : 'x-application/json'
        });
        res.end(result);
    };*/

    // check server to see if response was validated
    var options1 = {
      host: 'localhost',
      path: '/validateresponse/localhost:3001',
      port: '3000'
    }

    var callback1 = function(response){
      var str = ""

      response.on('data', function(chunk){
        str += chunk;
      });

      response.on('end', function(){
        if (str.substring(0, 1) == "in"){
          console.log("Strategy has denied this server, terminating...");
          throw "Request denied";
        } else {
          console.log("Strategy has accepted this server");
        }
      });
    }
    var req = http.request(options1, callback1);
    req.end();
  } else {
    console.log(url);
    // this is a request
  }

  //callback(null, "Request recieved");

}).listen(PORT);

distance = function(source, destination){
  return Math.random() * 1000;
}
