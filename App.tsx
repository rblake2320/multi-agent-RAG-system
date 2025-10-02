import React, { useState, useCallback } from 'react';
import { QueryInput } from './components/QueryInput';
import { ResponseDisplay } from './components/ResponseDisplay';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { Logo } from './components/icons';
import { ProcessingState, Stage, AppResponse } from './types';
import { processQuery } from './services/geminiService';

const initialState: ProcessingState = {
    stage: Stage.Idle,
    response: null,
    error: null,
    agent: null,
    confidence: null,
    lastActiveStageOnError: null,
};

const App: React.FC = () => {
    const [processingState, setProcessingState] = useState<ProcessingState>(initialState);

    const handleReset = useCallback(() => {
        setProcessingState(initialState);
    }, []);
    
    const handleSubmit = async (query: string) => {
        setProcessingState({ ...initialState, stage: Stage.Sanitization });
        
        const updateStateCallback = (update: { stage: Stage, agent?: string, response?: Partial<AppResponse>, error?: string }) => {
            setProcessingState(prev => {
                const isError = update.stage === Stage.Error;
                return {
                    ...prev,
                    stage: update.stage,
                    agent: update.agent ?? prev.agent,
                    response: update.response ? { ...(prev.response as AppResponse), ...update.response } : prev.response,
                    error: update.error ?? prev.error,
                    lastActiveStageOnError: isError ? prev.stage : null,
                };
            });
        };
        
        try {
            await processQuery(query, updateStateCallback);
        } catch (error) {
            console.error("Processing failed:", error);
            // State is updated via the callback in the service's catch block
        }
    };
    
    const isLoading = processingState.stage !== Stage.Idle && processingState.stage !== Stage.Complete && processingState.stage !== Stage.Error;

    return (
        <div className="bg-base-100 min-h-screen text-content-100 font-sans">
            <header className="p-4 border-b border-base-300">
                <div className="container mx-auto flex items-center gap-4">
                    <Logo className="w-8 h-8 text-brand-primary" />
                    <h1 className="text-2xl font-bold">AI Agentic Search</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <QueryInput onSubmit={handleSubmit} isLoading={isLoading} />
                        <ArchitectureVisualizer 
                            stage={processingState.stage} 
                            agent={processingState.agent} 
                            lastActiveStageOnError={processingState.lastActiveStageOnError}
                        />
                    </div>
                    <div>
                        <ResponseDisplay state={processingState} onReset={handleReset} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
