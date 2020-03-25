//pm2 is a nodejs process manager
// allows to manage zero downtime clusters in production
// run "pm2 start index.js -i 3" to run 3 instances of index.js 
    // if instead of 3 -1 is specified it by default sets the number of instances which should run accoring to our application
// "pm2 list" tells about all of the applications that are currently running 
// "pm2 stop index" to stop and "pm2 delete index" to delete pm2 from our application
// "pm2 logs" to get logs
// "pm2 monit" to monitor app live
// "pm2 reload" 
const http = require("http");
const options = [
  "Go for it",
  "Maybe sleep on it",
  "Do some more research",
  "I don't know",
  "I wouldn't"
];
const server = http.createServer((req, res) => {
  const randomIndex = Math.floor(Math.random() * options.length);
  const advice = options[randomIndex];
  const payload = JSON.stringify({ processId: process.pid, advice });
  res.writeHead(200, { "Content-type": "application/json" });
  res.end(payload);
});
server.listen(3001);
console.log("advice server running");
