var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = 'task_queue';
    //let msg = process.argv.slice(2).join(' ') || "Hello World!";

    channel.assertQueue(queue, {
      durable: true
    });
    
    for (let i=1;i<30;i=i+1){
        
        msg="xxxx "+i.toString()
        channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        });
        console.log(" [x] Sent '%s'", msg);
    }    
    
  

});
  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});