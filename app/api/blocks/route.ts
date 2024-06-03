import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const blocks = await prisma.block.findMany();
        return NextResponse.json(blocks);
    } catch (error) {
        console.error('Error fetching blocks:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
