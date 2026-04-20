import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing database connection...');
  
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test creating a user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashed_password',
        firstName: 'Test',
        lastName: 'User',
      },
    });
    
    console.log('✅ Test user created:', testUser);
    
    // Test querying the user
    const users = await prisma.user.findMany();
    console.log('✅ Found users:', users.length);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
