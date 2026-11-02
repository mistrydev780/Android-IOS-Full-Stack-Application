import { app } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { env } from './config/env';

async function start() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error('❌ Could not connect to MongoDB:', (error as Error).message);
    console.error('   Check MONGODB_URI in .env and your Atlas Network Access (IP allowlist).');
    process.exit(1);
  }

  // 0.0.0.0 makes the API reachable from phones on the same Wi-Fi network
  const server = app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`🚀 API running on http://localhost:${env.PORT}/api/v1 (${env.NODE_ENV})`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${env.PORT} is already in use — another API server is still running.`);
      console.error(`   Windows:  netstat -ano | findstr :${env.PORT}   then   taskkill /F /PID <pid>`);
      console.error(`   macOS/Linux:  lsof -ti :${env.PORT} | xargs kill`);
    } else {
      console.error('❌ Server error:', error.message);
    }
    process.exit(1);
  });

  const shutdown = (signal: string) => {
    console.log(`\n${signal} received, shutting down...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

void start();
