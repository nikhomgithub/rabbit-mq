var amqp = require('amqp');
 
var connection = amqp.createConnection({ host: 'localhost', port: 5672 });

var started = false;

connection.on('ready', function () {
    if (started === false) {
        started = true;
        connection.exchange('', {confirm: true}, function (exchange) {
            publish(exchange, 1);
        });
    }
});

function publish(exc, i) {
    if (i === 100) {
        return connection.disconnect();
    }
    
    exc.publish('green', i, {}, function (err) {
    console.log('Added ' + i);
    setTimeout(function() {
        publish(exc, ++i);
    }, 1);
    });
}