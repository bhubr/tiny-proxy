const http = require('http');
const { hostname } = require('./settings');

http.createServer(function (incomingReq, outerRes) {

  outerRes.setHeader('Access-Control-Allow-Origin', '*');
	outerRes.setHeader('Access-Control-Request-Method', '*');
	outerRes.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	outerRes.setHeader('Access-Control-Allow-Headers', '*');
	if ( incomingReq.method === 'OPTIONS' ) {
		outerRes.writeHead(200);
		outerRes.end();
		return;
	}

  // res.writeHead(200, {'Content-Type': 'text/plain'});
  // res.end('Hello World!');

  const options = {
    hostname: 'hubblesite.org',
    port: 80,
    // path: '/upload',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  };

  let output = '';
  outerRes.writeHead(200, {'Content-Type': 'text/plain'});

  console.log('incoming path', incomingReq.url);
  options.path = incomingReq.url;
  
  const outgoingReq = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
      output += chunk;
    });
    res.on('end', () => {
      console.log('No more data in response.');
      outerRes.end(output);
    });
  });
  
  outgoingReq.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  
  // write data to request body
  // outgoingReq.write(postData);
  outgoingReq.end();


}).listen(8080);