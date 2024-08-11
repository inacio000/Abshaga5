// D:\abshaga5\app\api\reportProblem\details.ts

import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const problemDetail = await prismadb.reportProblem.findUnique({
            where: { id },
            include: {
                reportImage: true,
                locationOfTheProblem: true,
                // floor: true,
                // room: true,
            }
        });

        if (!problemDetail) {
            return new NextResponse("Problem not found", { status: 404 });
        }

        return NextResponse.json(problemDetail);
    } catch (error) {
        console.error("Error fetching problem:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
  