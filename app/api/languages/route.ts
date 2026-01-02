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

        const languages = await prisma.language.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json(languages);
    } catch (error) {
        console.error("Error fetching languages:", error);
        return NextResponse.json(
            { error: "Failed to fetch languages" },
            { status: 500 }
        );
    }
}
