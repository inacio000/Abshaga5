import { SearchInput } from "@/components/search-input";
import { LocationOfTheProblems } from "@/components/locationOfTheProblems";
import prismadb from "@/lib/prismadb";
import { ReportedProblems } from "@/components/reported-problems";

interface RootProblemsProps {
    searchParams: {
        locationId: string;
        name: string;
    }
}

const RootPage = async ({
    searchParams
}: RootProblemsProps) => {
    const typeProblem = await prismadb.locationOfTheProblem.findMany();

    const data = await prismadb.reportProblem.findMany({
        where: {
            locationProblemId: searchParams.locationId,
            problemTittle: {
                search: searchParams.name
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return (
        <div className="h-full p-4 space-y-2 border">
            <SearchInput />
            <LocationOfTheProblems data={typeProblem}/>
            <ReportedProblems data={data}/>
        </div>
    );
}

export default RootPage;