export enum Stage {
    Idle = "IDLE",
    Sanitization = "SANITIZATION",
    Routing = "ROUTING",
    Searching = "SEARCHING",
    Drafting = "DRAFTING",
    Refining = "REFINING",
    Validating = "VALIDATING",
    Complete = "COMPLETE",
    Error = "ERROR",
}

export interface Source {
    id: string;
    uri: string;
    title: string;
    snippet: string;
}

export interface AppResponse {
    text: string;
    sources: Source[];
    agentUsed: string;
    confidence: number;
}

export interface ProcessingState {
    stage: Stage;
    response: AppResponse | null;
    error: string | null;
    agent: string | null;
    confidence: number | null;
    lastActiveStageOnError: Stage | null;
}