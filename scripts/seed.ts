const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
    try {
        await db.locationOfTheProblem.createMany({
            data: [
                { name: "Toilet" },
                { name: "Room" },
                { name: "Block" },
            ]
        })
    } catch (error) {
        console.error("Error seeding default problems", error);
    } finally {
        await db.$disconnect();
    }
};

main();