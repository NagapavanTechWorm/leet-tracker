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

interface ProblemListProps {
    problems: Problem[];
    onSelectProblem: (problem: Problem) => void;
    onRefresh: () => void;
}

export default function ProblemList({
    problems,
    onSelectProblem,
    onRefresh,
}: ProblemListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
    const [topicFilter, setTopicFilter] = useState<string>("All");

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy":
                return "text-green-600 dark:text-green-400";
            case "Medium":
                return "text-yellow-600 dark:text-yellow-400";
            case "Hard":
                return "text-red-600 dark:text-red-400";
            default:
                return "text-gray-600 dark:text-gray-400";
        }
    };

    const getDifficultyBgColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy":
                return "bg-green-100 dark:bg-green-900/30";
            case "Medium":
                return "bg-yellow-100 dark:bg-yellow-900/30";
            case "Hard":
                return "bg-red-100 dark:bg-red-900/30";
            default:
                return "bg-gray-100 dark:bg-gray-900/30";
        }
    };

    const allTopics = Array.from(
        new Set(problems.flatMap((p) => p.topics.map((t) => t.name)))
    ).sort();

    const filteredProblems = problems.filter((problem) => {
        const matchesSearch = problem.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesDifficulty =
            difficultyFilter === "All" || problem.difficulty === difficultyFilter;
        const matchesTopic =
            topicFilter === "All" ||
            problem.topics.some((t) => t.name === topicFilter);

        return matchesSearch && matchesDifficulty && matchesTopic;
    });

    const stats = {
        total: problems.length,
        easy: problems.filter((p) => p.difficulty === "Easy").length,
        medium: problems.filter((p) => p.difficulty === "Medium").length,
        hard: problems.filter((p) => p.difficulty === "Hard").length,
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search problems..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <svg
                            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

                <select
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value="All">All Topics</option>
                    {allTopics.map((topic) => (
                        <option key={topic} value={topic}>
                            {topic}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.total}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="text-sm text-green-600 dark:text-green-400">Easy</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.easy}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">Medium</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.medium}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="text-sm text-red-600 dark:text-red-400">Hard</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.hard}
                    </div>
                </div>
            </div>

            {filteredProblems.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <svg
                        className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                        {searchQuery || difficultyFilter !== "All" || topicFilter !== "All"
                            ? "No problems match your filters"
                            : "No problems yet"}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        {searchQuery || difficultyFilter !== "All" || topicFilter !== "All"
                            ? "Try adjusting your search or filters"
                            : "Click 'Add Problem' to get started"}
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Problem
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Difficulty
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                                        Topics
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                                        Languages
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredProblems.map((problem) => (
                                    <tr
                                        key={problem.id}
                                        onClick={() => onSelectProblem(problem)}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {problem.name}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {new Date(problem.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getDifficultyBgColor(
                                                    problem.difficulty
                                                )} ${getDifficultyColor(problem.difficulty)}`}
                                            >
                                                {problem.difficulty}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {problem.topics.slice(0, 3).map((topic) => (
                                                    <span
                                                        key={topic.id}
                                                        className="inline-flex px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs"
                                                    >
                                                        {topic.name}
                                                    </span>
                                                ))}
                                                {problem.topics.length > 3 && (
                                                    <span className="inline-flex px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                                                        +{problem.topics.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {problem.languages.map((language) => (
                                                    <span
                                                        key={language.id}
                                                        className="inline-flex px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs"
                                                    >
                                                        {language.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
