import { SearchInput } from "@/components/search-input";
import { LocationOfTheProblems } from "@/components/locationOfTheProblems";
import prismadb from "@/lib/prismadb";

const RootPage = async () => {
    const typeProblem = await prismadb.locationOfTheProblem.findMany();

    return (
        <div className="h-full p-4 space-y-2 border">
            <SearchInput />
            <LocationOfTheProblems data={typeProblem}/>
        </div>
    );
}

export default RootPage;