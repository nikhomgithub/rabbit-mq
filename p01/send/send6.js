var amqp = require('amqplib/callback_api');

/*
var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}
*/

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
    channel.assertQueue('', {
        //for receive , q name = q.queue , generated by system
        exclusive: true
        }, 
        function(error2, q) {
            if (error2) {
                throw error2;
            }
            let correlationId = Math.round(Math.random()*1000000).toString();
      
            let num=6;
      
            channel.sendToQueue('rpc_queue',
                Buffer.from(num.toString()),{ 
                correlationId: correlationId, 
                replyTo: q.queue 
                //this is msg.properties for receive
                }
            );
                /*
                Message
                Exchange	(AMQP default)
                Routing Key	rpc_queue
                Redelivered	○
                Properties	
                            reply_to:	amq.gen-cyK3wYkuqsA_kX4qbfrX0w
                            correlation_id:	283026
                            headers:	
                Payload     6
                */
            

            console.log(' [x] Requesting fib(%d)', num);
            console.log('correlationId',correlationId)

            channel.consume(q.queue, function(msg) {
                if (msg.properties.correlationId == correlationId) {
                console.log(' [.] Got %s', msg.content.toString());
                setTimeout(function() { 
                    connection.close(); 
                    process.exit(0) 
                }, 500);
                }
            }, {
                noAck: true
            });

        
    });
  });
});

/*
function generateUuid() {
  return Math.round(Math.random()*1000000).toString()
         //Math.random().toString() +
         //Math.random().toString() +
         //Math.random().toString();
}
*/