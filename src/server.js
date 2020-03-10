import http from 'http';
import https from 'https';
import auth from 'http-auth';
import fs from 'fs';

export default function Server({
  port = 8383,
  httpAuthUser,
  httpAuthPass,
  sslKey,
  sslCertificate,
}, cb) {
  let sslServerOptions = {};

  if (sslCertificate) {
    https = true;
    sslServerOptions = {
      key: fs.readFileSync(sslKey),
      cert: fs.readFileSync(sslCertificate),
    };
  }

  if (httpAuthUser && httpAuthPass) {
    const basicAuth = auth.basic({
      realm: 'Auth required',
    }, (username, password, callback) => {
      callback(username === httpAuthUser && password === httpAuthPass);
    });

    if (sslCertificate) {
      https.createServer(basicAuth, sslServerOptions, cb).listen(port, '0.0.0.0');
    } else {
      http.createServer(basicAuth, cb).listen(port, '0.0.0.0');
    }
  } else if (sslCertificate) {
    https.createServer(sslServerOptions, cb).listen(port, '0.0.0.0');
  } else {
    http.createServer(cb).listen(port, '0.0.0.0');
  }
}
