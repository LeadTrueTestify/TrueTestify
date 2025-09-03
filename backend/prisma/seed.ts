import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting data seeding...');

  try {
    // Hash the password for the new users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Glam Beauty business
    const glambeauty = await prisma.business.create({
      data: {
        name: 'Glam Beauty',
        slug: 'glambeauty',
        contactEmail: 'contact@glambeauty.com',
        logoUrl: 'https://s3.amazonaws.com/truetestify/glambeauty/logo.png',
        brandColor: '#ff69b4',
        website: 'https://www.glambeauty.com',
        settingsJson: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log(`Created business: ${glambeauty.name} with ID: ${glambeauty.id}`);

    // Create Glam Beauty owner user
    const glambeautyUser = await prisma.user.create({
      data: {
        email: 'owner@glambeauty.com',
        passwordHash: hashedPassword,
        name: 'Glam Beauty Owner',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        businessUsers: {
          create: {
            businessId: glambeauty.id,
            role: 'owner',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    });

    console.log(`Created user: ${glambeautyUser.name} for business: ${glambeauty.name}`);

    // Create City Cuts business
    const citycuts = await prisma.business.create({
      data: {
        name: 'City Cuts',
        slug: 'citycuts',
        contactEmail: 'info@citycuts.com',
        logoUrl: 'https://s3.amazonaws.com/truetestify/citycuts/logo.png',
        brandColor: '#1a1a1a',
        website: 'https://www.citycuts.com',
        settingsJson: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log(`Created business: ${citycuts.name} with ID: ${citycuts.id}`);

    // Create City Cuts owner user
    const citycutsUser = await prisma.user.create({
      data: {
        email: 'owner@citycuts.com',
        passwordHash: hashedPassword,
        name: 'City Cuts Owner',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        businessUsers: {
          create: {
            businessId: citycuts.id,
            role: 'owner',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    });

    console.log(`Created user: ${citycutsUser.name} for business: ${citycuts.name}`);

    console.log('Data seeding complete!');

  } catch (e) {
    console.error('Data seeding failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();