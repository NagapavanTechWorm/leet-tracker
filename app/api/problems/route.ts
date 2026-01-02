import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const problems = await prisma.problem.findMany({
            where: { userId: user.id },
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
            orderBy: { createdAt: "desc" },
        });

        const formattedProblems = problems.map((problem: any) => ({
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
        }));

        return NextResponse.json(formattedProblems);
    } catch (error) {
        console.error("Error fetching problems:", error);
        return NextResponse.json(
            { error: "Failed to fetch problems" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const body = await req.json();
        const { name, difficulty, code, notes, leetcodeLink, topics, languages } = body;

        if (!name || !difficulty || !code) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

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

        const problem = await prisma.problem.create({
            data: {
                name,
                difficulty,
                code,
                notes: notes || null,
                leetcodeLink: leetcodeLink || null,
                userId: user.id,
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

        return NextResponse.json(formattedProblem, { status: 201 });
    } catch (error) {
        console.error("Error creating problem:", error);
        return NextResponse.json(
            { error: "Failed to create problem" },
            { status: 500 }
        );
    }
}
