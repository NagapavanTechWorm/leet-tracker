"use client";

import { useState } from "react";

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

interface ProblemDetailProps {
    problem: Problem | null;
    onClose: () => void;
    onEdit: (problem: Problem) => void;
    onDelete: (problemId: string) => void;
}

export default function ProblemDetail({
    problem,
    onClose,
    onEdit,
    onDelete,
}: ProblemDetailProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    if (!problem) return null;

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

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/problems/${problem.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                onDelete(problem.id);
                onClose();
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
        navigator.clipboard.writeText(problem.code);
        alert("Code copied to clipboard!");
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {problem.name}
                            </h2>
                            <div className="flex flex-wrap items-center gap-3">
                                <span
                                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                                        problem.difficulty
                                    )}`}
                                >
                                    {problem.difficulty}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Added {new Date(problem.createdAt).toLocaleDateString()}
                                </span>
                                {problem.updatedAt !== problem.createdAt && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Updated {new Date(problem.updatedAt).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-4"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {problem.leetcodeLink && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                LeetCode Link
                            </h3>
                            <a
                                href={problem.leetcodeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View on LeetCode
                            </a>
                        </div>
                    )}

                    {problem.topics.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Topics
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {problem.topics.map((topic) => (
                                    <span
                                        key={topic.id}
                                        className="inline-flex px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                                    >
                                        {topic.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {problem.languages.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Languages
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {problem.languages.map((language) => (
                                    <span
                                        key={language.id}
                                        className="inline-flex px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                                    >
                                        {language.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Solution Code
                            </h3>
                            <button
                                onClick={copyCode}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy
                            </button>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-sm text-gray-900 dark:text-gray-100 font-mono whitespace-pre-wrap">
                                {problem.code}
                            </pre>
                        </div>
                    </div>

                    {problem.notes && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Personal Notes
                            </h3>
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {problem.notes}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => onEdit(problem)}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Problem
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Delete Problem?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Are you sure you want to delete "{problem.name}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
