const amqp = require('amqplib');
const express = require('express');
const app=express();

//publishing("xxx");

async function publishing (msg){ 
    let connection = await amqp.connect({ host: 'localhost', port: 5672 });
    let channel = await connection.createConfirmChannel();
    await channel.assertExchange("processing", "direct", { durable: true });
    await publishToChannel(channel, { routingKey: "request", exchangeName: "processing", msg });

}

// utility function to publish messages to a channel
function publishToChannel(channel, { routingKey, exchangeName, msg }) {
    return new Promise((resolve, reject) => {
      channel.publish(exchangeName, 
                      routingKey, 
                      Buffer.from(msg), 
                      { persistent: true }, 
                      function (err, ok) {
                            if (err) {return reject(err);}
                            resolve();
                      }
      )
    })
}

//listenForResults();

async function listenForResults() {
    // connect to Rabbit MQ
    //let connection = await amqp.connect(messageQueueConnectionString);
    let connection = await amqp.connect({ host: 'localhost', port: 5672 });
    // create a channel and prefetch 1 message at a time
    let channel = await connection.createChannel();
    await channel.prefetch(1);
    // start consuming messages
    let result =  await consume({ connection, channel });
    //channel.close();
    //connection.close();
    
    return result
  }
  
  
  // consume messages from RabbitMQ
  function consume({ connection, channel, resultsChannel }) {
    return new Promise((resolve, reject) => {
      channel.consume("processing.requests", async function (msg) {
        // parse message
        let msgBody = msg.content.toString();
        //let data = JSON.parse(msgBody);
        //let requestId = data.requestId;
        //let processingResults = data.processingResults;
        //console.log("Received a result message, requestId:", requestId, "processingResults:", processingResults);   
        // acknowledge message as received
        await channel.ack(msg);


        resolve(msgBody);    
      });
  
      // handle connection closed
      connection.on("close", (err) => {
        return reject(err);
      });
  
      // handle errors
      connection.on("error", (err) => {
        return reject(err);
      });
    });
  }

app.get('/',async (req,res)=>{
    console.log("api request");
    //const result=await listenForResults()
    console.log(result)
    res.send({data:result})
});


app.listen(3000,()=>console.log('Server at 3000'));