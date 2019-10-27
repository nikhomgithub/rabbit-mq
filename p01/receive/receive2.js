
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'task_queue';

    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1);
    //need one at a time
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    
    channel.consume(queue, function(msg) {
      
    setTimeout(function() {
        console.log(" [x] Received %s", msg.content.toString());  
        channel.ack(msg);
    }, 4000);        //#1 receiver2.js
    //}, 1000);      //#2 receiver2.js

    }, {
      noAck: false
    });
  });
});



//this is work queue
//               consume            consume+ack    rusult
//noAck:true        0                    -       just consume 
//noAck:false    Unacked ^c ready        0
//=======================================================
//Ack:true       Unacked ^c ready        0
//========================================================

//Ensure message in queue no lost
//define just one time (second timer will error)
//need to define both consumer / provider queue is durable
//channel.assertQueue('hello', {durable: true});
//also make msg is persisitant
//channel.sendToQueue(queue, Buffer.from(msg), {persistent: true});
//channel.prefetch(1);
//Tell server , i want to consume one at a time

//If receiver is too busy, your queue memory will be fill up..
//system will error