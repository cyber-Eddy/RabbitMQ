import { connect } from "amqplib";

async function consume() {
  try {
    const connection = await connect({
        hostname: "localhost",
        username: "eddy",
        password: "1170170",
        port: 5672,
        vhost: "/",
        protocol: "amqp",
    });
    const channel = await connection.createChannel();
    const queue = 'colaMQ';

    await channel.assertQueue(queue);
    channel.consume(queue, (message) => {
      console.log('Mensaje recibido:', message.content.toString());
      channel.ack(message); //Borramos el mensaje que se recibe
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

consume();
