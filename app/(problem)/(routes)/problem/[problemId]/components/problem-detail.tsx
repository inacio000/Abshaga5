"use client"

// import prismadb from "@/lib/prismadb";
// import { auth, redirectToSignIn } from "@clerk/nextjs";
// import { redirect } from "next/navigation";
// import ProblemDetails from "./components/problem-detail";

// interface ProblemIdProps {
//     params: {
//         problemId: string;
//     }
// }

// const ProblemDetailPage = async ({
//     params
// }: ProblemIdProps) => {
//     // const { userId } = auth();

//     // if (!userId) {
//     //     return redirectToSignIn();
//     // }

//     const problem = await prismadb.reportProblem.findUnique({
//         where: {
//             id: params.problemId
//         },
//         include: {
//             reportImage: true,
//             locationOfTheProblem: true,
//             floor: true,
//             room: true,
//         }
//     });

//     if (!problem) {
//         return redirect("/");
//     }
//     return (
//         <ProblemDetails problemId={problem.id} />
//     )
// }

// export default ProblemDetailPage;

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { ReportProblem } from '@prisma/client';

interface ProblemDetailsProps {
    problemId: string | any;
}

const ProblemDetails = ({ problemId }: ProblemDetailsProps) => {
    const [problem, setProblem] = useState<ReportProblem | any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await axios.get(`/api/reportProblemDetail/${problemId}`);
                setProblem(response.data);
            } catch (err) {
                setError('Error fetching problem details');
            }
        };

        fetchProblem();
    }, [problemId]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!problem) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{problem.problemTittle}</h1>
            <p>{problem.description}</p>
            <p>Reported by: {problem.userName}</p>
            <p>Location: {problem.locationOfTheProblem.name}</p>
            {problem.floorId && <p>Floor: {problem.floorId}</p>}
            {problem.blockId && <p>Block: {problem.blockId}</p>}
            {problem.roomId && <p>Room: {problem.roomId}</p>}
            {problem.reportImage.length > 0 && (
                <div>
                    <h2>Images:</h2>
                    {problem.reportImage.map((image: any) => (
                        <Image key={image.id} src={image.url} alt="Problem Image" width={500} height={500} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProblemDetails;
