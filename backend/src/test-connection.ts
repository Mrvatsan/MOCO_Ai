import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
    console.log('Loading @prisma/client...');
    const { PrismaClient } = require('@prisma/client');
    console.log('PrismaClient loaded successfully.');

    const dbPath = path.resolve(__dirname, '../dev.db');
    console.log(`Database path: ${dbPath}`);

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: `file:${dbPath}`
            }
        }
    });

    console.log('Instantiated PrismaClient. Attempting $connect...');
    await prisma.$connect();
    console.log('Successfully connected to database.');

    const count = await prisma.session.count();
    console.log(`Current session count: ${count}`);

    await prisma.$disconnect();
    console.log('Disconnected successfully.');
} catch (error: any) {
    console.error('TEST FAILED:');
    console.error(error);
    process.exit(1);
}
