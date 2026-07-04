// @vitest-environment jsdom
import type { WorkflowRunState } from '@mastra/core/workflows';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { WorkflowRunContext } from '../../context/workflow-run-context';
import type { WorkflowRunContextType } from '../../context/workflow-run-context';
import { WorkflowRunDetail } from '../workflow-run-details';

afterEach(() => cleanup());

const noopWorkflowActions = {
  createWorkflowRun: vi.fn(),
  streamWorkflow: vi.fn(),
  resumeWorkflow: vi.fn(),
  streamResult: null,
  isStreamingWorkflow: false,
  isCancellingWorkflowRun: false,
  cancelWorkflowRun: vi.fn(),
};

function renderRunDetail(runSnapshot: WorkflowRunState) {
  const observeWorkflowStream = vi.fn();
  const contextValue = {
    runSnapshot,
    isLoadingRunExecutionResult: false,
    debugMode: false,
  } as WorkflowRunContextType;

  render(
    <WorkflowRunContext.Provider value={contextValue}>
      <WorkflowRunDetail
        workflowId="workflow-a"
        runId={runSnapshot.runId}
        observeWorkflowStream={observeWorkflowStream}
        {...noopWorkflowActions}
      />
    </WorkflowRunContext.Provider>,
  );

  return { observeWorkflowStream };
}

describe('WorkflowRunDetail', () => {
  describe('when a running run has no persisted step snapshot', () => {
    it('shows an empty snapshot explanation instead of observing an empty stream', () => {
      const { observeWorkflowStream } = renderRunDetail({
        runId: 'run-without-snapshot',
        status: 'running',
        context: { input: { city: 'Paris' } },
      } as WorkflowRunState);

      expect(screen.getByText('No workflow snapshot available')).not.toBeNull();
      expect(screen.getByText(/This run is still active, but Studio has no persisted step snapshot/)).not.toBeNull();
      expect(observeWorkflowStream).not.toHaveBeenCalled();
    });
  });
});
