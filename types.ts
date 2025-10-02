/**
 * Enumeration of all possible processing stages in the multi-agent RAG pipeline
 */
export enum Stage {
    /** Initial state - no processing active */
    Idle = "IDLE",
    /** Security validation stage - PII detection and prompt injection prevention */
    Sanitization = "SANITIZATION",
    /** Agent routing stage - determining which agent should handle the query */
    Routing = "ROUTING",
    /** Search and information retrieval stage */
    Searching = "SEARCHING",
    /** Initial response drafting stage */
    Drafting = "DRAFTING",
    /** Response refinement and fact-checking stage */
    Refining = "REFINING",
    /** Final validation and confidence scoring stage */
    Validating = "VALIDATING",
    /** Processing completed successfully */
    Complete = "COMPLETE",
    /** Error occurred during processing */
    Error = "ERROR",
}

/**
 * Represents a source used in grounding the response
 */
export interface Source {
    /** Unique identifier for the source */
    id: string;
    /** URI/URL of the source */
    uri: string;
    /** Title of the source document */
    title: string;
    /** Brief snippet/excerpt from the source */
    snippet: string;
}

/**
 * The final response object returned after processing
 */
export interface AppResponse {
    /** The final generated response text (HTML formatted) */
    text: string;
    /** Array of sources used to ground the response */
    sources: Source[];
    /** Name of the agent that handled the query */
    agentUsed: string;
    /** Confidence score between 0.0 and 1.0 for response quality */
    confidence: number;
}

/**
 * Current state of the processing pipeline
 */
export interface ProcessingState {
    /** Current stage of processing */
    stage: Stage;
    /** The generated response (available after drafting stage) */
    response: AppResponse | null;
    /** Error message if processing failed */
    error: string | null;
    /** Name of the currently active agent */
    agent: string | null;
    /** Current confidence score during processing */
    confidence: number | null;
    /** The last active stage before an error occurred (for error recovery) */
    lastActiveStageOnError: Stage | null;
}