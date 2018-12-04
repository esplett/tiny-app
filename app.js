const http = require("http");
const PORT = 8080;


//produce a string of 6 random alphanumeric characters
function generateRandomString() {
  let i;
  for(i = ''; i.length < 6;)
    i += Math.random().toString(6).substring(2, 1)
    return i;
}
//math random (between 0 and 1)
//to.String ouputs 6
//substring extracts characters from string

// a function which handles requests and sends response
function requestHandler(request, response) {
  if (request.url == "/") {
    response.end("Welcome!");
  } else if (request.url == "/urls") {
    response.end("www.lighthouselabs.ca\nwww.google.com");
  } else {
    response.statusCode = 404; //error msg
    response.end("Unknown Path");
  }
}

var server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});

console.log(generateRandomString());