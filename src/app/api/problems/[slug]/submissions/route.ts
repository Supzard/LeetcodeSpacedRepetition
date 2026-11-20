import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string}> }
) {
    const { slug } = await params;

    const problem = await prisma.problem.findUnique({
        where: { slug },
        select: {
            _count: {
                select: { submissions: true } },
            submissions: {
                orderBy: { createdAt: "desc" },
                take: 50,
                select: { id: true, code: true, passed: true, createdAt: true },
            },
        },
    });

    if (!problem) {
        return NextResponse.json({ error: "Problem not found" }, {status: 404});
    }
    return NextResponse.json({submissions: problem.submissions, 
        total: problem._count.submissions,});
}