import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Create PostgreSQL pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Create PrismaClient with adapter
const prisma = new PrismaClient({ adapter });

async function seedCertifications() {
  try {
    console.log('🌱 Starting certification seeding...');

    // Read the certification JSON file
    const certificationsPath = path.join(__dirname, 'Certification.json');
    const certificationsData = JSON.parse(fs.readFileSync(certificationsPath, 'utf-8'));

    console.log(`📋 Found ${certificationsData.length} certifications to seed`);

    // Seed each certification
    for (const cert of certificationsData) {
      const result = await prisma.certification.upsert({
        where: { id: cert.id },
        update: {
          name: cert.name,
          description: cert.description,
        },
        create: {
          id: cert.id,
          name: cert.name,
          description: cert.description,
        },
      });

      console.log(`✅ Seeded: ${result.name}`);
    }

    console.log('🎉 Certification seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding certifications:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedCertifications();
