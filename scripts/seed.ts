const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    for (let floorNumber = 1; floorNumber <= 9; floorNumber++) {
      let floor = await db.floor.findUnique({
        where: { number: floorNumber },
      });

      if (!floor) {
        floor = await db.floor.create({
          data: { number: floorNumber },
        });
      }

      for (let blockNumber = 1; blockNumber <= 7; blockNumber++) {
        const fullBlockNumber = parseInt(`${floorNumber}${blockNumber}`);

        let block = await db.block.findFirst({
          where: {
            number: fullBlockNumber,
            floorId: floor.id,
          },
        });

        if (!block) {
          block = await db.block.create({
            data: {
              number: fullBlockNumber,
              floorId: floor.id,
            },
          });
        }

        for (let roomNumber = 1; roomNumber <= 2; roomNumber++) {
          const roomNumberString = `${fullBlockNumber}C${roomNumber}`;

          let room = await db.room.findFirst({
            where: { number: roomNumberString, blockId: block.id },
          });

          if (!room) {
            await db.room.create({
              data: {
                number: roomNumberString,
                blockId: block.id,
              },
            });
          }
        }
      }
    }

    const existingLocations = await db.locationOfTheProblem.findMany();
    if (existingLocations.length === 0) {
      await db.locationOfTheProblem.createMany({
        data: [{ name: "Toilet" }, { name: "Room" }, { name: "Block" }],
      });
    }
  } catch (error) {
    console.error("Error seeding default problems", error);
  } finally {
    await db.$disconnect();
  }
}

main();
