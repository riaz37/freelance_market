import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@repo/database';
import * as bcrypt from 'bcrypt';

// Load environment variables from server's .env file (fallback to root if not found)
config({ path: resolve(__dirname, '../.env') }) || config({ path: resolve(__dirname, '../../../.env') });

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isVerified: true,
        bio: 'System Administrator',
        skills: ['System Administration', 'User Management'],
      }
    });

    console.log('Admin user created successfully:', {
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
