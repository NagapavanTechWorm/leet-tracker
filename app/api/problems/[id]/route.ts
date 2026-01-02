import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const problem = await prisma.problem.findFirst({
            where: {
                id,
                userId: user.id,
            },
            include: {
                topics: {
                    include: {
                        topic: true,
                    },
                },
                languages: {
                    include: {
                        language: true,
                    },
                },
            },
        });

        if (!problem) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        const formattedProblem = {
            id: problem.id,
            name: problem.name,
            difficulty: problem.difficulty,
            code: problem.code,
            notes: problem.notes,
            leetcodeLink: problem.leetcodeLink,
            createdAt: problem.createdAt,
            updatedAt: problem.updatedAt,
            topics: problem.topics.map((pt: any) => ({
                id: pt.topic.id,
                name: pt.topic.name,
            })),
            languages: problem.languages.map((pl: any) => ({
                id: pl.language.id,
                name: pl.language.name,
            })),
        };

        return NextResponse.json(formattedProblem);
    } catch (error) {
        console.error("Error fetching problem:", error);
        return NextResponse.json(
            { error: "Failed to fetch problem" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const existingProblem = await prisma.problem.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!existingProblem) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        const body = await req.json();
        const { name, difficulty, code, notes, leetcodeLink, topics, languages } = body;

        await prisma.problemTopic.deleteMany({
            where: { problemId: id },
        });

        await prisma.problemLanguage.deleteMany({
            where: { problemId: id },
        });

        const topicIds = await Promise.all(
            (topics || []).map(async (topicName: string) => {
                const topic = await prisma.topic.upsert({
                    where: { name: topicName },
                    update: {},
                    create: { name: topicName },
                });
                return topic.id;
            })
        );

        const languageIds = await Promise.all(
            (languages || []).map(async (languageName: string) => {
                const language = await prisma.language.upsert({
                    where: { name: languageName },
                    update: {},
                    create: { name: languageName },
                });
                return language.id;
            })
        );

        const problem = await prisma.problem.update({
            where: { id },
            data: {
                name,
                difficulty,
                code,
                notes: notes || null,
                leetcodeLink: leetcodeLink || null,
                topics: {
                    create: topicIds.map((topicId) => ({
                        topicId,
                    })),
                },
                languages: {
                    create: languageIds.map((languageId) => ({
                        languageId,
                    })),
                },
            },
            include: {
                topics: {
                    include: {
                        topic: true,
                    },
                },
                languages: {
                    include: {
                        language: true,
                    },
                },
            },
        });

        const formattedProblem = {
            id: problem.id,
            name: problem.name,
            difficulty: problem.difficulty,
            code: problem.code,
            notes: problem.notes,
            leetcodeLink: problem.leetcodeLink,
            createdAt: problem.createdAt,
            updatedAt: problem.updatedAt,
            topics: problem.topics.map((pt: any) => ({
                id: pt.topic.id,
                name: pt.topic.name,
            })),
            languages: problem.languages.map((pl: any) => ({
                id: pl.language.id,
                name: pl.language.name,
            })),
        };

        return NextResponse.json(formattedProblem);
    } catch (error) {
        console.error("Error updating problem:", error);
        return NextResponse.json(
            { error: "Failed to update problem" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const problem = await prisma.problem.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!problem) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        await prisma.problem.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting problem:", error);
        return NextResponse.json(
            { error: "Failed to delete problem" },
            { status: 500 }
        );
    }
}
