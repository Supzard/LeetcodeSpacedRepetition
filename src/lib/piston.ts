import { readFileSync } from "fs";
import { join } from "path";

const PISTON_URL = "http://localhost:2000/api/v2";

const pythonHarness = readFileSync(
  join(process.cwd(), "src/harnesses/python.py"),
  "utf-8"
);

export type PistonResult = {
    language: string;
    version: string;
    run: {
        stdout: string;
        stderr: string;
        code: number | null;
        signal: string | null;
        output: string;
    };
    compile?: {
        stdout: string;
        stderr: string;
        code: number | null;
    };
};

type RunPythonInput = {
  userCode: string;
  functionName: string;
  testCases: unknown;
};

export async function runPython({
  userCode,
  functionName,
  testCases,
}: RunPythonInput): Promise<PistonResult> {
  const res = await fetch(`${PISTON_URL}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "python",
      version: "3.12.0",
      files: [
        { name: "runner.py", content: pythonHarness },
        { name: "solution.py", content: userCode },
      ],
      stdin: JSON.stringify({ functionName, testCases }),
      run_timeout: 3000,
    }),
  });

  if (!res.ok) {
    throw new Error(`Piston returned ${res.status}: ${await res.text()}`);
  }

  return res.json();
}
