// src/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting data seeding...');

  try {
    // Hash the password for the new user
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create a new business (tenant)
    const glambeauty = await prisma.business.create({
      data: {
        name: 'Glam Beauty',
        slug: 'glambeauty',
        contactEmail: 'contact@glambeauty.com',
        logoUrl: 'https://example.com/glambeauty-logo.png',
        brandColor: '#ff69b4', // A shade of pink for Glam Beauty
        website: 'https://www.glambeauty.com',
      },
    });

    // Output the created business info
    console.log(`Created business: ${glambeauty.name} with ID: ${glambeauty.id}`);

    // This section is commented out as it belongs to future milestones (users, billing, etc.)
    // For Milestone 1, we only have the business profile.
    /*
    const ownerUser = await prisma.user.create({
      data: {
        email: 'owner@glambeauty.com',
        passwordHash: hashedPassword,
        name: 'Glam Beauty Owner',
        // In a future milestone, we'll link this user to the business.
        // businesses: {
        //   create: {
        //     businessId: glambeauty.id,
        //     role: 'OWNER',
        //   },
        // },
      },
    });

    console.log(`Created user: ${ownerUser.name} for business: ${glambeauty.name}`);

    // Create another business to test the multi-tenant separation
    const citycuts = await prisma.business.create({
      data: {
        name: 'City Cuts',
        slug: 'citycuts',
        contactEmail: 'info@citycuts.com',
        logoUrl: 'https://example.com/citycuts-logo.png',
        brandColor: '#1a1a1a', // A dark color for City Cuts
        website: 'https://www.citycuts.com',
      },
    });

    console.log(`Created business: ${citycuts.name} with ID: ${citycuts.id}`);

    const citycutsUser = await prisma.user.create({
      data: {
        email: 'owner@citycuts.com',
        passwordHash: hashedPassword,
        name: 'City Cuts Owner',
        // In a future milestone, we'll link this user to the business.
        // businesses: {
        //   create: {
        //     businessId: citycuts.id,
        //     role: 'OWNER',
        //   },
        // },
      },
    });

    console.log(`Created user: ${citycutsUser.name} for business: ${citycuts.name}`);
    */
    
    console.log('Data seeding complete!');

  } catch (e) {
    console.error('Data seeding failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();