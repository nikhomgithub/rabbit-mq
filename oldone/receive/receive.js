//https://www.youtube.com/watch?v=Dcz8L1DAvQM
//https://computingforgeeks.com/how-to-install-latest-rabbitmq-server-on-ubuntu-18-04-lts/
const express = require('express');
const app=express();
const amqp=require('amqplib/callback_api');

const port = 4002;

amqp.connect('amqp://localhost', function(err, conn) { 
    conn.createChannel((err,ch)=>{
        const queue='FirstQueue';
        ch.assertQueue(queue,{durable:false});
        console.log(`Waiting for message in ${queue}`);
        ch.consume(queue,(message)=>{
            console.log(`Receive:${message.content}`)
        });
    },{noAck:true});
});

app.listen(port,()=>console.log(`App listen on port ${port}`));