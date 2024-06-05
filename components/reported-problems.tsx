"use client"

import { ReportProblem, Floor } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface ReportedProblemsProps {
    data: ReportProblem[];
}

export const ReportedProblems = ({
    data
}: ReportedProblemsProps) => {
    const [floors, setFloors] = useState<Floor[]>([]);

    useEffect(() => {
        const fetchFloors = async () => {
            try {
                const response = await axios.get('/api/floors');
                setFloors(response.data);
            } catch (error) {
                console.error('Error fetching floors:', error);
            }
        };

        fetchFloors();
    }, []);

    if (data.length === 0) {
        return (
            <div className="pt-10 flex flex-col items-center justify-center space-y-3">
                <div className="relative w-60 h-60">
                    <Image
                        fill
                        className="grayscale"
                        alt="Empty"
                        src="/empty.png"
                    />
                </div>
                <p className="text-sm text-muted-foreground">
                    No Problem Reported
                </p>
            </div>
        );
    }

    return (
        <div>
            <h1>Problems to solve</h1>
            {data.map((problem) => {
                const floor = floors.find(floor => floor.id === problem.floorId);

                return (
                    <div key={problem.id}>
                        <Link href={`/reportProblem/${problem.id}`}>
                            <p>{problem.problemTittle}</p>
                            {/* <p>{problem.description}</p> */}
                            {floor && <p>Floor: {floor.number}</p>}
                        </Link>
                    </div>
                );
            })}

            <h1>Problems solved</h1>
            {/* TODO: Show all problems solved */}
        </div>
    );
}
