
//https://www.youtube.com/watch?v=Dcz8L1DAvQM
//https://computingforgeeks.com/how-to-install-latest-rabbitmq-server-on-ubuntu-18-04-lts/
const express = require('express');
const app=express();
const amqp = require('amqplib/callback_api');
const port =4001;


amqp.connect('amqp://localhost', function(err, conn) { 
    conn.createChannel((err,ch)=>{
        const queue='FirstQueue';
        const msg="Hello MG"
        //const msg={type:'2',content:'Hello RabbitMQ'}
        ch.assertQueue(queue,{durable:false});
        ch.sendToQueue(queue,Buffer.from(JSON.stringify(msg)));
        console.log('Message was sent')
    });
    setTimeout(()=>{
        conn.close();
        process.exit(0);
    }, 500);
});


app.listen(port,()=>console.log(`App listening on port ${port}`))