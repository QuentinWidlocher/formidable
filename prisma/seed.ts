import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "admin@formidable.site";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("formidable", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const website = await prisma.website.create({
    data: {
      name: "Formidable",
      url: "formidable.site",
      userId: user.id,
    },
  });

  await prisma.message.create({
    data: {
      from: "test@example.com",
      object: "Sample mail",
      content: "lorem ipsum dolor sit amet ...",
      website: {
        connect: {
          id: {
            url: website.url,
            userId: website.userId,
          },
        }
      }
    }
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
