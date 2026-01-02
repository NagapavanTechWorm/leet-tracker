"use client";

import { useState, useEffect } from "react";

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
}

interface AddProblemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editProblem?: Problem | null;
}

export default function AddProblemModal({
    isOpen,
    onClose,
    onSuccess,
    editProblem,
}: AddProblemModalProps) {
    const [name, setName] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const [code, setCode] = useState("");
    const [notes, setNotes] = useState("");
    const [leetcodeLink, setLeetcodeLink] = useState("");
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [newTopic, setNewTopic] = useState("");
    const [newLanguage, setNewLanguage] = useState("");
    const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
    const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchTopics();
            fetchLanguages();

            if (editProblem) {
                setName(editProblem.name);
                setDifficulty(editProblem.difficulty);
                setCode(editProblem.code);
                setNotes(editProblem.notes || "");
                setLeetcodeLink(editProblem.leetcodeLink || "");
                setSelectedTopics(editProblem.topics.map((t) => t.name));
                setSelectedLanguages(editProblem.languages.map((l) => l.name));
            } else {
                resetForm();
            }
        }
    }, [isOpen, editProblem]);

    const fetchTopics = async () => {
        try {
            const res = await fetch("/api/topics");
            if (res.ok) {
                const data = await res.json();
                setAvailableTopics(data);
            }
        } catch (error) {
            console.error("Error fetching topics:", error);
        }
    };

    const fetchLanguages = async () => {
        try {
            const res = await fetch("/api/languages");
            if (res.ok) {
                const data = await res.json();
                setAvailableLanguages(data);
            }
        } catch (error) {
            console.error("Error fetching languages:", error);
        }
    };

    const resetForm = () => {
        setName("");
        setDifficulty("Easy");
        setCode("");
        setNotes("");
        setLeetcodeLink("");
        setSelectedTopics([]);
        setSelectedLanguages([]);
        setNewTopic("");
        setNewLanguage("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editProblem
                ? `/api/problems/${editProblem.id}`
                : "/api/problems";
            const method = editProblem ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    difficulty,
                    code,
                    notes,
                    leetcodeLink,
                    topics: selectedTopics,
                    languages: selectedLanguages,
                }),
            });

            if (res.ok) {
                onSuccess();
                onClose();
                resetForm();
            } else {
                alert("Failed to save problem");
            }
        } catch (error) {
            console.error("Error saving problem:", error);
            alert("Failed to save problem");
        } finally {
            setLoading(false);
        }
    };

    const addTopic = () => {
        if (newTopic && !selectedTopics.includes(newTopic)) {
            setSelectedTopics([...selectedTopics, newTopic]);
            setNewTopic("");
        }
    };

    const removeTopic = (topic: string) => {
        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    };

    const addLanguage = () => {
        if (newLanguage && !selectedLanguages.includes(newLanguage)) {
            setSelectedLanguages([...selectedLanguages, newLanguage]);
            setNewLanguage("");
        }
    };

    const removeLanguage = (language: string) => {
        setSelectedLanguages(selectedLanguages.filter((l) => l !== language));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex justify-between items-start sm:items-center">
                    <div className="flex-1 pr-2">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                            {editProblem ? "✏️ Edit Problem" : "➕ Add New Problem"}
                        </h2>
                        <p className="text-blue-100 text-xs sm:text-sm">
                            {editProblem ? "Update your solution" : "Track your LeetCode solution"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 sm:p-2 rounded-lg transition-all flex-shrink-0"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-120px)]">
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1 sm:gap-2">
                                <span className="text-base sm:text-lg">📝</span>
                                Problem Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                placeholder="e.g., Two Sum"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1 sm:gap-2">
                                <span className="text-base sm:text-lg">⚡</span>
                                Difficulty *
                            </label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                required
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                            >
                                <option value="Easy">🟢 Easy</option>
                                <option value="Medium">🟡 Medium</option>
                                <option value="Hard">🔴 Hard</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-blue-200 dark:border-blue-800">
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                            <span className="text-base sm:text-lg">🏷️</span>
                            Topics
                        </label>
                        <div className="flex gap-2 mb-2 sm:mb-3">
                            <input
                                type="text"
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTopic())}
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                placeholder="e.g., Array, Hash Table"
                                list="topics-list"
                            />
                            <datalist id="topics-list">
                                {availableTopics.map((topic) => (
                                    <option key={topic.id} value={topic.name} />
                                ))}
                            </datalist>
                            <button
                                type="button"
                                onClick={addTopic}
                                className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedTopics.map((topic) => (
                                <span
                                    key={topic}
                                    className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-800 dark:text-blue-300 rounded-lg text-xs sm:text-sm font-semibold shadow-sm"
                                >
                                    {topic}
                                    <button
                                        type="button"
                                        onClick={() => removeTopic(topic)}
                                        className="hover:text-blue-600 dark:hover:text-blue-200 text-lg"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/10 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-green-200 dark:border-green-800">
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                            <span className="text-base sm:text-lg">⚙️</span>
                            Languages
                        </label>
                        <div className="flex gap-2 mb-2 sm:mb-3">
                            <input
                                type="text"
                                value={newLanguage}
                                onChange={(e) => setNewLanguage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                placeholder="e.g., Python, JavaScript"
                                list="languages-list"
                            />
                            <datalist id="languages-list">
                                {availableLanguages.map((language) => (
                                    <option key={language.id} value={language.name} />
                                ))}
                            </datalist>
                            <button
                                type="button"
                                onClick={addLanguage}
                                className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg sm:rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedLanguages.map((language) => (
                                <span
                                    key={language}
                                    className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 text-green-800 dark:text-green-300 rounded-lg text-xs sm:text-sm font-semibold shadow-sm"
                                >
                                    {language}
                                    <button
                                        type="button"
                                        onClick={() => removeLanguage(language)}
                                        className="hover:text-green-600 dark:hover:text-green-200 text-lg"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1 sm:gap-2">
                            <span className="text-base sm:text-lg">💻</span>
                            Solution Code *
                        </label>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            rows={8}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono transition-all"
                            placeholder="Paste your solution code here..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1 sm:gap-2">
                            <span className="text-base sm:text-lg">🔗</span>
                            LeetCode Link
                        </label>
                        <input
                            type="url"
                            value={leetcodeLink}
                            onChange={(e) => setLeetcodeLink(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                            placeholder="https://leetcode.com/problems/two-sum"
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1 sm:gap-2">
                            <span className="text-base sm:text-lg">📝</span>
                            Personal Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 text-gray-900 dark:text-white transition-all"
                            placeholder="Add notes, time/space complexity..."
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl"
                        >
                            {loading ? "💾 Saving..." : editProblem ? "✅ Update" : "➕ Add Problem"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-bold text-base sm:text-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
