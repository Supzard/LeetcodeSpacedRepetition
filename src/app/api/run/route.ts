import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runPython } from "@/lib/piston";
import { Prisma } from "@/generated/prisma/client";

type TestResult = {
  passed : boolean;
  actual? : unknown;
  expected : unknown;
  error ?: string;
  stdout : string;
};

type RunOutcome = 
  | {testResults: TestResult[]}
  | {error : string; stdout?: string; stderr?: string};

export async function POST(req: NextRequest) {
  const { slug, code } = await req.json();

  //Loads the problem from the prisma database
  const problem = await prisma.problem.findUnique({ where : { slug }});
  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  //Run the code in Piston and turn the result into one outcome object
  let outcome : RunOutcome;
  try {
    const result = await runPython({
      userCode: code,
      functionName: problem.functionName,
      testCases: problem.testCases,
    });

    if (result.run.signal === "SIGKILL") {
      outcome = { error: "Time Limit exceeded 3 seconds. Check for infinite loops."};
    } else if (result.run.stderr && !result.run.stdout) {
      outcome = { error: result.run.stderr };
    } else {
      try {
        outcome = { testResults: JSON.parse(result.run.stdout) };
      } catch {
        outcome = {
          error: "Could not parse output",
          stdout: result.run.stdout,
          stderr: result.run.stderr,
        };
      }
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
  const passed =
    "testResults" in outcome &&
    outcome.testResults.length > 0 &&
    outcome.testResults.every((r) => r.passed);
  const submission = await prisma.submission.create({
    data: {
      problemId: problem.id,
      code,
      passed,
      results: outcome as unknown as Prisma.InputJsonValue,
    },
  });
  return NextResponse.json({...outcome, submissionId: submission.id });
}