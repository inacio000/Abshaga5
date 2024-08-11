"use client"

import { useRouter } from "next/navigation";
import ProblemDetails from "./components/problem-detail";

export default function ReportProblemPage() {
  const router = useRouter();
  const { reportProblemId } = router.query;

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <ProblemDetails problemId={reportProblemId} />
    </div>
  );
}
