/*
NodeJS server that is a possible strategy for the strategy server.
Upon startup, it sends a request to the strategy server, verifies that
the stategy server recieved the request, then listens for possible requests
*/

var PORT = 3002   // port that this server will run on

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
    console.log(str);
    if (str == "Request recieved"){
      console.log("Server has acknowledged, awaiting test...");
    } else {
      throw "Unexpected server response";
    }
  });
}

var req = http.request(options, callback);

/*if (str == "Request recieved"){

} else {
  throw new ECONNREFUSED;
}*/

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

    console.log(url);

    var callback = function(err, result) {
        res.writeHead(200, {
            'Content-Type' : 'x-application/json'
        });
        res.end(result);
    };

    callback(null, "Request recieved");

}).listen(PORT);
