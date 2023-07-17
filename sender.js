import { connect } from "amqplib";
import Fastify from 'fastify' 
const fastify = Fastify({
  logger: true,
})
import fastifyFormBody from '@fastify/formbody';

fastify.register(fastifyFormBody);
fastify.get("/", (req, res) => {
    res.type('text/html').send(`
          <form action="/send" method="POST">
              <input type="text" name="message" />
              <button type="submit">Send</button> 
          </form>
      `);
});

fastify.post("/send", async (req, res) => {
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

    const message = req.body.message;

    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(message));
    console.log('Mensaje enviado:', message);

    res.send('Mensaje enviado correctamente');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
    res.send('Error al enviar el mensaje');
  }
});

fastify.listen({port: 3000}, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Sender app listening on port 3000");
});
