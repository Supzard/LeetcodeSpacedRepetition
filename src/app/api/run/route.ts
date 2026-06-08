import { NextRequest, NextResponse } from "next/server";
import { runPython } from "@/lib/piston";
import { problems } from "@/lib/problems";

export async function POST(req: NextRequest) {
  const { slug, code } = await req.json();
  const problem = problems.find((p) => p.slug === slug);
  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  try {
    const result = await runPython({
      userCode: code,
      functionName: problem.functionName,
      testCases: problem.testCases,
    });

    if (result.run.stderr && !result.run.stdout) {
      return NextResponse.json({ error: result.run.stderr });
    }

    try {
      const testResults = JSON.parse(result.run.stdout);
      return NextResponse.json({ testResults });
    } catch {
      return NextResponse.json({
        error: "Could not parse output",
        stdout: result.run.stdout,
        stderr: result.run.stderr,
      });
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}