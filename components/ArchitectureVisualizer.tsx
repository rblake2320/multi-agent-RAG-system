import React from 'react';
import { Stage } from '../types';
import {
  AgentIcon,
  ArrowDownIcon,
  BrainCircuitIcon,
  CheckCircleIcon,
  DatabaseIcon,
  FeatherIcon,
  ShieldIcon,
  ValidationIcon,
  XCircleIcon,
} from './icons';

interface ArchitectureVisualizerProps {
  stage: Stage;
  agent: string | null;
  lastActiveStageOnError: Stage | null;
}

const StageIndicator: React.FC<{
  icon: React.ReactNode;
  title: string;
  status: 'pending' | 'active' | 'complete' | 'error' | 'skipped';
  description?: string;
}> = ({ icon, title, status, description }) => {
  const statusClasses = {
    pending: 'border-base-300 text-content-300',
    active: 'border-brand-primary text-brand-primary animate-pulse-fast',
    complete: 'border-green-500 text-green-400',
    error: 'border-red-500 text-red-400',
    skipped: 'border-base-300 text-content-300 opacity-50',
  };
  const statusIcons = {
    pending: null,
    active: (
      <div className="w-3 h-3 bg-brand-primary rounded-full animate-ping absolute -top-1 -right-1"></div>
    ),
    complete: <CheckCircleIcon className="w-5 h-5 text-green-500 absolute -top-2 -right-2" />,
    error: <XCircleIcon className="w-5 h-5 text-red-500 absolute -top-2 -right-2" />,
    skipped: null,
  };

  return (
    <div
      className={`bg-base-200 p-4 rounded-lg border-2 relative transition-all duration-300 ${statusClasses[status]}`}
    >
      {statusIcons[status]}
      <div className="flex items-center gap-4">
        <div className="bg-base-300 p-2 rounded-md">{icon}</div>
        <div>
          <h3 className="font-semibold text-content-100">{title}</h3>
          {description && <p className="text-sm text-content-300">{description}</p>}
        </div>
      </div>
    </div>
  );
};

export const ArchitectureVisualizer: React.FC<ArchitectureVisualizerProps> = ({
  stage,
  agent,
  lastActiveStageOnError,
}) => {
  const getStatus = (targetStage: Stage): 'active' | 'complete' | 'pending' | 'error' => {
    if (stage === Stage.Error && targetStage === lastActiveStageOnError) {
      return 'error';
    }

    const stageOrder = [
      Stage.Idle,
      Stage.Sanitization,
      Stage.Routing,
      Stage.Searching,
      Stage.Drafting,
      Stage.Refining,
      Stage.Validating,
      Stage.Complete,
    ];
    const currentIndex = stageOrder.indexOf(stage);
    const targetIndex = stageOrder.indexOf(targetStage);

    if (targetIndex < currentIndex) return 'complete';
    if (targetIndex === currentIndex) return 'active';
    return 'pending';
  };

  if (stage === Stage.Idle) {
    return (
      <div className="bg-base-200 p-6 rounded-xl shadow-lg border border-base-300 text-center text-content-300 animate-fade-in">
        <BrainCircuitIcon className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2 text-content-100">AI Processing Pipeline</h2>
        <p>The step-by-step process of your query will be visualized here.</p>
      </div>
    );
  }

  const isSearchSkipped =
    agent === 'General Agent' &&
    (stage === Stage.Drafting ||
      stage === Stage.Refining ||
      stage === Stage.Validating ||
      stage === Stage.Complete);

  return (
    <div className="bg-base-200 p-6 rounded-xl shadow-lg border border-base-300 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 text-content-100">Processing Pipeline</h2>
      <div className="space-y-2">
        <StageIndicator
          icon={<ShieldIcon className="w-6 h-6" />}
          title="0. Security Layer"
          description="Sanitization, PII check, rate limiting."
          status={getStatus(Stage.Sanitization)}
        />
        <div className="flex justify-center">
          <ArrowDownIcon className="w-6 h-6 text-content-300" />
        </div>
        <StageIndicator
          icon={<AgentIcon className="w-6 h-6" />}
          title="1. Routing"
          description="Choosing the best agent for the query."
          status={getStatus(Stage.Routing)}
        />
        <div className="flex justify-center">
          <ArrowDownIcon className="w-6 h-6 text-content-300" />
        </div>
        <StageIndicator
          icon={<DatabaseIcon className="w-6 h-6" />}
          title="2. Search & Grounding"
          description={
            isSearchSkipped ? 'Not needed for this query' : 'Gathering up-to-date information.'
          }
          status={isSearchSkipped ? 'skipped' : getStatus(Stage.Searching)}
        />
        <div className="flex justify-center">
          <ArrowDownIcon className="w-6 h-6 text-content-300" />
        </div>
        <StageIndicator
          icon={<BrainCircuitIcon className="w-6 h-6" />}
          title="3. Drafting"
          description="Generating an initial answer from sources."
          status={getStatus(Stage.Drafting)}
        />
        <div className="flex justify-center">
          <ArrowDownIcon className="w-6 h-6 text-content-300" />
        </div>
        <StageIndicator
          icon={<FeatherIcon className="w-6 h-6" />}
          title="4. Refinement & Verification"
          description="Fact-checking and improving the draft."
          status={getStatus(Stage.Refining)}
        />
        <div className="flex justify-center">
          <ArrowDownIcon className="w-6 h-6 text-content-300" />
        </div>
        <StageIndicator
          icon={<ValidationIcon className="w-6 h-6" />}
          title="5. Validation"
          description="Checking for accuracy and confidence."
          status={getStatus(Stage.Validating)}
        />
      </div>
    </div>
  );
};
