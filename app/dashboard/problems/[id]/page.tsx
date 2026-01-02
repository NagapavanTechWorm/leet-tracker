"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddProblemModal from "@/components/AddProblemModal";

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

export default function ProblemDetailPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated" && params.id) {
            fetchProblem();
        }
    }, [status, params.id]);

    const fetchProblem = async () => {
        try {
            const res = await fetch(`/api/problems/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setProblem(data);
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Error fetching problem:", error);
            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/problems/${params.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/dashboard");
            } else {
                alert("Failed to delete problem");
            }
        } catch (error) {
            console.error("Error deleting problem:", error);
            alert("Failed to delete problem");
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const copyCode = () => {
        if (problem) {
            navigator.clipboard.writeText(problem.code);
            alert("Code copied to clipboard!");
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy":
                return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
            case "Medium":
                return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
            case "Hard":
                return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
            default:
                return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30";
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!problem) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="mb-4 sm:mb-6 inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Back to Dashboard</span>
                    <span className="sm:hidden">Back</span>
                </button>

                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 break-words">
                                    {problem.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <span
                                        className={`inline-flex px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg ${getDifficultyColor(
                                            problem.difficulty
                                        )}`}
                                    >
                                        {problem.difficulty}
                                    </span>
                                    <span className="text-xs sm:text-sm text-white/90 bg-white/10 px-2 sm:px-3 py-1 rounded-full">
                                        📅 {new Date(problem.createdAt).toLocaleDateString()}
                                    </span>
                                    {problem.updatedAt !== problem.createdAt && (
                                        <span className="text-xs sm:text-sm text-white/90 bg-white/10 px-2 sm:px-3 py-1 rounded-full">
                                            🔄 {new Date(problem.updatedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <span className="text-xl sm:text-2xl">💻</span>
                                            <span className="hidden sm:inline">Solution Code</span>
                                            <span className="sm:hidden">Code</span>
                                        </h3>
                                        <button
                                            onClick={copyCode}
                                            className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-medium"
                                        >
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            Copy
                                        </button>
                                    </div>
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 overflow-x-auto shadow-2xl border border-gray-700">
                                        <pre className="text-xs sm:text-sm text-gray-100 font-mono leading-relaxed">
                                            <code>{problem.code}</code>
                                        </pre>
                                    </div>
                                </div>

                                {problem.notes && (
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                                            <span className="text-xl sm:text-2xl">📝</span>
                                            <span className="hidden sm:inline">Personal Notes</span>
                                            <span className="sm:hidden">Notes</span>
                                        </h3>
                                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-r-lg sm:rounded-r-xl p-4 sm:p-6 shadow-lg">
                                            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                                {problem.notes}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg sm:rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        {problem.leetcodeLink && (
                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                                    <span className="text-xl sm:text-2xl">🔗</span>
                                    <span className="hidden sm:inline">Problem Link</span>
                                    <span className="sm:hidden">Link</span>
                                </h3>
                                <a
                                    href={problem.leetcodeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 rounded-lg sm:rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    View on LeetCode
                                </a>
                            </div>
                        )}

                        {problem.topics.length > 0 && (
                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                                    <span className="text-xl sm:text-2xl">🏷️</span>
                                    Topics
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {problem.topics.map((topic) => (
                                        <span
                                            key={topic.id}
                                            className="inline-flex px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-800 dark:text-blue-300 rounded-lg text-xs sm:text-sm font-semibold shadow-sm"
                                        >
                                            {topic.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {problem.languages.length > 0 && (
                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                                    <span className="text-xl sm:text-2xl">⚙️</span>
                                    Languages
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {problem.languages.map((language) => (
                                        <span
                                            key={language.id}
                                            className="inline-flex px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 text-green-800 dark:text-green-300 rounded-lg text-xs sm:text-sm font-semibold shadow-sm"
                                        >
                                            {language.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Delete Problem?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Are you sure you want to delete <span className="font-semibold">"{problem.name}"</span>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
                            >
                                {deleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AddProblemModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={() => {
                    setIsEditModalOpen(false);
                    fetchProblem();
                }}
                editProblem={problem}
            />
        </div>
    );
}
