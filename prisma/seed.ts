import "dotenv/config";
import { prisma } from "../src/lib/db";
import { problems } from "../src/lib/problems";
import type { Prisma } from "../src/generated/prisma/client";

async function main() {
    for (const p of problems) {
        const data = {
            title: p.title,
            description: p.description,
            functionName: p.functionName,
            starterCode: p.starterCode,
            testCases: p.testCases as unknown as Prisma.InputJsonValue,
        };
        await prisma.problem.upsert({
            where: { slug: p.slug},
            update: data,
            create: { slug: p.slug, ...data},
        });
        console.log('Seeded: ${p.slug}');
    }
}
main()
    .catch((e)=> {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());