"use client"

import qs from "query-string"

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { LocationOfTheProblem } from "@prisma/client";

interface TypeProblemProps {
    data: LocationOfTheProblem[];
};

export const LocationOfTheProblems = ({
    data
}: TypeProblemProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const locationProblemId = searchParams.get("locationProblemId");

    const onClick = (id: string | undefined) => {
        const query = { locationProblemId: id };

        const url = qs.stringifyUrl({
            url: window.location.href,
            query,
        }, { skipNull: true });

        router.push(url);
    }

    return (
        <div className="w-full overflow-x-auto space-x-2 flex p-1">
            <button
                onClick={() => onClick(undefined)}
                className={cn(`
                    flex
                    items-center
                    text-center
                    text-xs
                    md:text-sm
                    px-2
                    md:px-4
                    py-2
                    md:py-3
                    rounded-md
                    bg-primary/10
                    hover:opacity-75
                    transition
                `,
                    !locationProblemId ? "bg-primary/25" : "bg-primary/10"
                )}
            >
                All Problems Reported
            </button>

            {data.map((item) => (
                <button
                    onClick={() => onClick(item.id)}
                    key={item.id}
                    className={cn(`
                                flex
                                items-center
                                text-center
                                text-xs
                                md:text-sm
                                px-2
                                md:px-4
                                py-2
                                md:py-3
                                rounded-md
                                bg-primary/10
                                hover:opacity-75
                                transition
                            `,
                        item.id === locationProblemId ? "bg-primary/25" : "bg-primary/10"
                    )}
                >
                    {item.name}
                </button>
            ))}
        </div>
    )
}