import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const rooms = await prisma.room.findMany();
        const toilets = await prisma.toilet.findMany();
        return NextResponse.json([...rooms, ...toilets]);
    } catch (error) {
        console.error('Error fetching rooms and toilets:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
