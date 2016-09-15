const fs = require('fs');
const webSocket = require('ws');
const child = require('child_process');
 
var tempFileNum = 0;
var interpretadorBirl = 'bin/birlscript';
var webSocketServer = new webSocket.Server({port:8080});
 
webSocketServer.on('connection', function(cliente) {
    cliente.on('message', function(message) {
        var json = JSON.parse(message);
 
        if (json.hasOwnProperty('codigo')) {
 
            var arquivo = 'code/' + (tempFileNum++) + '.birl';
 
            fs.writeFile(arquivo, json['codigo'], function(err) {
                if (err) return console.log(err);
 
                var processo = child.execFile(interpretadorBirl, [arquivo]);
 
                processo.stdout.on('data', function(data) {
                    cliente.send(JSON.stringify({
                        output: data.toString()
                    }));
                    fs.unlink(arquivo);
                });
            });
        }
    });
});