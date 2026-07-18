/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import automationJson from '../../../mock/automation.json';
import { AutomationWorkflow, AutomationStep } from '../../../types/marketing';

const STORAGE_KEY = 'saas-marketing-automation';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(automationJson));
  }
};

export const automationService = {
  getWorkflows: async (): Promise<AutomationWorkflow[]> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getWorkflowById: async (id: string): Promise<AutomationWorkflow | null> => {
    const list = await automationService.getWorkflows();
    return list.find((w) => w.id === id) || null;
  },

  createWorkflow: async (workflow: Partial<AutomationWorkflow>): Promise<AutomationWorkflow> => {
    initLocalStorage();
    const list = await automationService.getWorkflows();
    const newId = `FLOW-${String(list.length + 1).padStart(3, '0')}`;
    const newWorkflow: AutomationWorkflow = {
      id: newId,
      name: workflow.name || 'New Custom Automation',
      status: workflow.status || 'Inactive',
      trigger: workflow.trigger || 'Manual Trigger',
      conditions: workflow.conditions || 'None',
      actions: workflow.actions || [],
      steps: workflow.steps || [
        {
          id: 'step-1',
          type: 'trigger',
          name: 'Manual Start',
          description: 'Launches this trigger manually from the CRM portal.',
          config: {}
        }
      ]
    };
    list.unshift(newWorkflow);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newWorkflow;
  },

  updateWorkflow: async (id: string, data: Partial<AutomationWorkflow>): Promise<AutomationWorkflow> => {
    initLocalStorage();
    const list = await automationService.getWorkflows();
    const idx = list.findIndex((w) => w.id === id);
    if (idx < 0) throw new Error('Workflow not found');
    list[idx] = { ...list[idx], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list[idx];
  },

  deleteWorkflow: async (id: string): Promise<void> => {
    initLocalStorage();
    const list = await automationService.getWorkflows();
    const filtered = list.filter((w) => w.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  addStep: async (workflowId: string, step: Partial<AutomationStep>): Promise<AutomationWorkflow> => {
    initLocalStorage();
    const workflow = await automationService.getWorkflowById(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    const newStep: AutomationStep = {
      id: `step-${Date.now()}`,
      type: step.type || 'action',
      name: step.name || 'New Step',
      description: step.description || 'Action description',
      config: step.config || {}
    };

    workflow.steps.push(newStep);
    
    // update triggers/actions summaries based on steps
    if (newStep.type === 'trigger') workflow.trigger = newStep.name;
    if (newStep.type === 'action') workflow.actions.push(newStep.name);

    return await automationService.updateWorkflow(workflowId, workflow);
  },

  removeStep: async (workflowId: string, stepId: string): Promise<AutomationWorkflow> => {
    initLocalStorage();
    const workflow = await automationService.getWorkflowById(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    workflow.steps = workflow.steps.filter((s) => s.id !== stepId);
    return await automationService.updateWorkflow(workflowId, workflow);
  }
};
