// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../generated/prisma/client";

// const adapter = new PrismaPg({
//     host: process.env.DATABASE_HOST,
//     port: process.env.DATABASE_PORT,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME,
// });

// export const prisma = new PrismaClient({adapter});

// import { PrismaClient } from '../generated/prisma/client';
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Prisma 7 explicitly requires an adapter to connect to the database
const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL! 
})

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma