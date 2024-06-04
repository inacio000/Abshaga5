import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rooms = await prisma.room.findMany();
    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
