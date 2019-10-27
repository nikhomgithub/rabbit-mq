//https://www.youtube.com/watch?v=Dcz8L1DAvQM
//https://computingforgeeks.com/how-to-install-latest-rabbitmq-server-on-ubuntu-18-04-lts/
const amqp=require('amqplib/callback_api');

// amqp://localhost   default port 15672
amqp.connect('amqp://localhost', function(err, conn) { 
    conn.createChannel((err,ch)=>{
        const queue='FirstQueue';

        ch.assertQueue(queue,{durable:false});
        // Declaring a queue is idempotent 
        console.log(`Waiting for message in ${queue}`);
        

        ch.consume(queue,(message)=>{
            ch.ack(message);
            console.log(`Receive:${message.content}`)
        });
    },{noAck:false});
    //acknowledgement true => consumer will send ack to 
    //server after consume.. 
    //message will be move from queue
});


//This is name queue
// use receive.js & send.js
// receive will start by connection with 

