const http = require('http');
const serveHandler = require('serve-handler');
const open = require('open');

run();
function run(){
  const server = http.createServer((request, response) => {
    return serveHandler(request, response);
  })   
  server.listen(5001, () => {
    console.log('Dev Server Running at http://localhost:5001');
    open('http://localhost:5000/playground');
  })
}
