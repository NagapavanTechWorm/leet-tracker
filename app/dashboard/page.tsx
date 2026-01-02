"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import AddProblemModal from "@/components/AddProblemModal";
import ProblemList from "@/components/ProblemList";

interface Topic {
    id: string;
    name: string;
}

interface Language {
    id: string;
    name: string;
}

interface Problem {
    id: string;
    name: string;
    difficulty: string;
    code: string;
    notes: string;
    leetcodeLink: string;
    topics: Topic[];
    languages: Language[];
    createdAt: string;
    updatedAt: string;
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchProblems();
        }
    }, [status]);

    const fetchProblems = async () => {
        try {
            const res = await fetch("/api/problems");
            if (res.ok) {
                const data = await res.json();
                setProblems(data);
            }
        } catch (error) {
            console.error("Error fetching problems:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProblem = () => {
        setEditingProblem(null);
        setIsModalOpen(true);
    };

    const handleSelectProblem = (problem: Problem) => {
        router.push(`/dashboard/problems/${problem.id}`);
    };

    const handleModalSuccess = () => {
        fetchProblems();
    };

    const stats = {
        total: problems.length,
        easy: problems.filter((p) => p.difficulty === "Easy").length,
        medium: problems.filter((p) => p.difficulty === "Medium").length,
        hard: problems.filter((p) => p.difficulty === "Hard").length,
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-lg text-gray-600 dark:text-gray-300">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">LT</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                LeetTracker
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                {session.user?.image && (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                )}
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {session.user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {session.user?.email}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            My Problems
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Track your LeetCode solutions and progress
                        </p>
                    </div>
                    <button
                        onClick={handleAddProblem}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Problem
                    </button>
                </div>

                <ProblemList
                    problems={problems}
                    onSelectProblem={handleSelectProblem}
                    onRefresh={fetchProblems}
                />
            </main>

            <AddProblemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                editProblem={editingProblem}
            />
        </div>
    );
}
