import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const user = await currentUser();
      const { src, problemTittle, description, locationProblemId } = body;

      if (!user || !user.id || !user.username) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      if (!src || !problemTittle || !description || !locationProblemId) {
        return new NextResponse("Missing required fields", { status: 400 });
      }

      // TODO: check if is Student or Technician

      const reportProblem = await prismadb.reportProblem.create({
        data: {
            locationProblemId,
            userId: user.id,
            userName: user.username,
            src,
            problemTittle,
            description,
        }
      });

      return NextResponse.json(reportProblem);
        
    } catch (error) {
        console.log("[REPORT_PROBLEM_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}