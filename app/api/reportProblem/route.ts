import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const {
      reportImage,
      problemTittle,
      description,
      locationProblemId,
      floorId,
      blockId,
      roomId,
    } = body;

    if (!user || !user.id || !user.username) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!reportImage || !problemTittle || !description || !locationProblemId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const imageUrls = reportImage.map((image: { url: string }) => image);

    const reportProblem = await prismadb.reportProblem.create({
      data: {
        locationProblemId,
        userId: user.id,
        userName: user.username,
        reportImage: {
          createMany: {
            data: imageUrls,
          },
        },
        problemTittle,
        description,
        floorId,
        blockId,
        roomId,
      },
    });

    return NextResponse.json(reportProblem);
  } catch (error) {
    console.log("[REPORT_PROBLEM_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { reportProblemId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.username) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reportProblem = await prismadb.reportProblem.deleteMany({
      where: {
        id: params.reportProblemId,
        userId: user.id,
      },
    });

    return NextResponse.json(reportProblem);
  } catch (error) {
    console.log("[REPORT_IMAGE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
