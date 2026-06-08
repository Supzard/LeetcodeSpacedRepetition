"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { problems } from "@/lib/problems";

type TestResult = {
  passed: boolean;
  actual?: unknown;
  expected: unknown;
  error?: string;
};

const problem = problems[0];

export default function Home() {
  const [code, setCode] = useState(problem.starterCode);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const[loading, setLoading] = useState(false);

  async function handleRun() {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({slug: problem.slug, code }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResults(data.testResults);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
      <p className="text-gray-700 mb-6">{problem.description}</p>

      <CodeEditor value={code} onChange={setCode} />

      <button
        onClick={handleRun}
        disabled={loading}
        className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Running..." : "Run"}
      </button>

      {error && (
        <pre className="mt-4 p-4 bg-red-50 text-red-800 rounded text-sm whitespace-pre-wrap">
          {error}
        </pre>
      )}

      {results && (
        <div className="mt-4 space-y-2">
          {results.map((r, i) => (
            <div
              key={i}
              className={`p-3 rounded text-sm ${
                r.passed ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"
              }`}
            >
              <div className="font-mono">
                Test {i + 1}: {r.passed ? "✓ Passed" : "✗ Failed"}
              </div>
              {!r.passed && (
                <div className="mt-1 font-mono text-xs">
                  expected: {JSON.stringify(r.expected)}
                  {r.actual !== undefined && (
                    <> | got: {JSON.stringify(r.actual)}</>
                  )}
                  {r.error && <> | {r.error}</>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}