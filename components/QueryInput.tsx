
import React, { useState } from 'react';
import { SendIcon } from './icons';

interface QueryInputProps {
    onSubmit: (query: string) => void;
    isLoading: boolean;
}

const exampleQueries = [
    "What are the legal implications of a breach of contract in California?",
    "Summarize the side effects of Lisinopril.",
    "Explain the force majeure clause in a standard SaaS agreement.",
    "What is the capital of Australia and what are its main industries?",
];

export const QueryInput: React.FC<QueryInputProps> = ({ onSubmit, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isLoading) {
            onSubmit(query.trim());
        }
    };

    const handleExampleClick = (example: string) => {
        setQuery(example);
        if (!isLoading) {
            onSubmit(example);
        }
    }

    return (
        <div className="bg-base-200 p-6 rounded-xl shadow-lg border border-base-300 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-content-100">Enter Your Query</h2>
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., What are the standard treatments for type 2 diabetes?"
                        className="w-full h-32 p-4 pr-12 bg-base-300 text-content-100 rounded-lg border border-gray-600 focus:ring-2 focus:ring-brand-primary focus:outline-none resize-none transition-colors"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full bg-brand-primary text-white disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-blue-600 transition-all duration-300"
                    >
                       <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </form>
             <div className="mt-4">
                <p className="text-sm text-content-300 mb-2">Or try an example:</p>
                <div className="flex flex-wrap gap-2">
                    {exampleQueries.map((ex, i) => (
                        <button key={i} onClick={() => handleExampleClick(ex)} disabled={isLoading} className="text-xs bg-base-300 px-3 py-1 rounded-full hover:bg-brand-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {ex.split(' ').slice(0,3).join(' ')}...
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
