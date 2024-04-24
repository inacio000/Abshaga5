import prismadb from "@/lib/prismadb";
import { ReportProblemForm } from "./components/reportProblemForm";

interface ReportProblemProps {
    params: {
        reportProblemId: string;
    };
};

const ReportProblemPage = async ({
    params
}: ReportProblemProps) => {
    // TODO: Check if is a Student or Technic
    
    const reportProblem = await prismadb.reportProblem.findUnique({
        where: {
            id: params.reportProblemId,
        }
    });

    const locationOfTheProblem = await prismadb.locationOfTheProblem.findMany();

    return (
        <ReportProblemForm 
            initialData={reportProblem}
            locationOfTheProblem={locationOfTheProblem}
        />
    )
};

export default ReportProblemPage;