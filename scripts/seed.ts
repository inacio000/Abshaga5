const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
    try {
        // Criar andares
        for (let floorNumber = 1; floorNumber <= 9; floorNumber++) {
            
            // Verificar se o andar já existe
            let floor = await db.floor.findUnique({
                where: { number: floorNumber },
            });

            if (!floor) {
                floor = await db.floor.create({
                    data: { number: floorNumber },
                });
            }

            // Criar blocos para cada andar
            for (let blockNumber = 1; blockNumber <= 7; blockNumber++) {
                const fullBlockNumber = parseInt(`${floorNumber}${blockNumber}`);

                // Verificar se o bloco já existe
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

                // Criar quartos para cada bloco
                for (let roomNumber = 1; roomNumber <= 2; roomNumber++) {
                    const roomNumberString = `${fullBlockNumber}C${roomNumber}`;

                    // Verificar se o quarto já existe
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

                // Verificar se o WC já existe
                let wc = await db.toilet.findFirst({
                    where: {
                        blockId: block.id,
                    },
                });

                if (!wc) {
                    await db.toilet.create({
                        data: {
                            blockId: block.id,
                        },
                    });
                }
            }
        }

        // TODO: remove room or toilet from DB and change everywhere it include
        // Criar locais do problema
        const existingLocations = await db.locationOfTheProblem.findMany();
        if (existingLocations.length === 0) {
            await db.locationOfTheProblem.createMany({
                data: [
                    { name: "Toilet" },
                    { name: "Room" },
                    { name: "Block" },
                ]
            });
        }
    } catch (error) {
        console.error("Error seeding default problems", error);
    } finally {
        await db.$disconnect();
    }
}

main();
