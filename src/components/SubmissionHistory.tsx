"use client";

export type SubmissionSummary = {
    id: string;
    code: string;
    passed: boolean;
    createdAt: string;
};

type Props = {
    submissions: SubmissionSummary[];
    selectedId: string | null;
    onSelect: (submission: SubmissionSummary) => void;
};

function timeAgo(iso: string): string {
    const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export function SubmissionHistory({ submissions, selectedId, onSelect}: Props) {
    if (submissions.length === 0) {
        return <p className="text-sm text-gray-500"> No attempts yet. Click Run to make your first one.</p>;
    }
    return (
        <ul className="divide-y border rounded">
            {submissions.map((s, i) => (
                <li key={s.id}>
                    <button
                        onClick={() => onSelect(s)}
                        className = {`w-full flex items-center justify-between px-3 py-2 text-sm text-left
                            hover:bg-gray-50 $ {
                                s.id ===selectedId ? "bg-blue-50" : ""
                            }`}
                            >
                                <span className = "font-mono">
                                    <span className={s.passed ? "text-green-700" : "text-red-700"}>
                                        {s.passed ? "✓ Passed" : "✗ Failed"}
                                    </span>
                                    <span className = "text-gray-500"> · Attempt {submissions.length - i}</span>
                                </span>
                                <span className="text-gray-500" title={new Date(s.createdAt).toLocaleString()}>
                                    {timeAgo(s.createdAt)}
                                </span>
                            </button>
                </li>
            ))}
        </ul>
    )
}