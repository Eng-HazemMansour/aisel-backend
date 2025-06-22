const App = require('./app');

async function bootstrap() {
  const app = new App();
  await app.initialize();
  app.start();
}

bootstrap().catch(console.error); 