import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const floors = await prisma.floor.findMany();
        return NextResponse.json(floors);
    } catch (error) {
        console.error('Error fetching floors:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
