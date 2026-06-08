"use client";

import Editor from "@monaco-editor/react";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

export function CodeEditor({ value, onChange }: Props) {
    return (
        <div className="border rounded overflow-hidden">
            <Editor
                height="400px"
                language="python"
                value={value}
                onChange={(v) => onChange(v ?? "")}
                theme="vs-dark"
                options={{
                    minimap: {enabled:false},
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                }}
            />
        </div>
    );
}