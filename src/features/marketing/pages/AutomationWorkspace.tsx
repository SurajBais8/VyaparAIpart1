/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { automationService } from '../services/automation.service';
import { templateService } from '../services/template.service';
import { AutomationWorkflow, MarketingTemplate } from '../../../types/marketing';
import { AutomationCard } from '../components/AutomationCard';
import { 
  Sparkles, GitBranch, PlusCircle, Search, HelpCircle, ArrowLeft,
  Play, Pause, Trash2, CheckCircle, Clock, Zap, Settings, BookOpen,
  MousePointer, AlertCircle, ChevronRight, MessageSquare, Mail, Phone, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export default function AutomationWorkspace() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected workflow for visual builder
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null);
  
  // Create workflow modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    triggerEvent: 'On User Signup' as AutomationWorkflow['triggerEvent'],
    stepsCount: 3,
    status: 'Active' as AutomationWorkflow['status']
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await automationService.getWorkflows();
      const temps = await templateService.getTemplates();
      setWorkflows(list);
      setTemplates(temps);

      if (selectedWorkflow) {
        const refreshed = list.find(w => w.id === selectedWorkflow.id);
        if (refreshed) setSelectedWorkflow(refreshed);
      }
    } catch (err) {
      toast.error('Failed to sync automated flows.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflow.name) {
      toast.error('Workflow title is required.');
      return;
    }
    try {
      const created = await automationService.createWorkflow({
        ...newWorkflow,
        steps: [
          { id: 'step-1', type: 'trigger', title: 'Trigger Event Node', config: { event: newWorkflow.triggerEvent }, nextStepId: 'step-2' },
          { id: 'step-2', type: 'action', title: 'Dispatch Email Welcome', config: { templateId: 'tpl-1', delay: 'Instant' }, nextStepId: 'step-3' },
          { id: 'step-3', type: 'condition', title: 'Check Read status', config: { field: 'opened', operator: 'Equals', value: 'true' } }
        ]
      });
      toast.success(`Workflow "${created.name}" configured!`);
      setShowCreateModal(false);
      setNewWorkflow({
        name: '',
        triggerEvent: 'On User Signup',
        stepsCount: 3,
        status: 'Active'
      });
      loadData();
    } catch (err) {
      toast.error('Formulation failed.');
    }
  };

  const handleToggleStatus = async (id: string, current: AutomationWorkflow['status']) => {
    try {
      const target = current === 'Active' ? 'Inactive' : 'Active';
      await automationService.updateWorkflow(id, { status: target });
      toast.success(`Workflow is now ${target}.`);
      loadData();
    } catch (err) {
      toast.error('Failed to transition status.');
    }
  };

  const handleDeleteWorkflow = async (id: string) => {
    if (!window.confirm('Delete this automated workflow permanently? This will halt active loops.')) return;
    try {
      await automationService.deleteWorkflow(id);
      toast.success('Workflow purged.');
      loadData();
      if (selectedWorkflow?.id === id) {
        setSelectedWorkflow(null);
      }
    } catch (err) {
      toast.error('Purge failure.');
    }
  };

  // Node editing functions inside Visual Builder Canvas
  const handleAddStepToCanvas = () => {
    if (!selectedWorkflow) return;
    const steps = [...selectedWorkflow.steps];
    const lastStep = steps[steps.length - 1];
    const newStepId = `step-${Date.now()}`;
    
    // update link in previous step
    if (lastStep) {
      lastStep.nextStepId = newStepId;
    }

    steps.push({
      id: newStepId,
      type: 'action',
      title: 'Wait 24 Hours & Dispatch Followup',
      config: { type: 'SMS', text: 'Hello, SLA update complete.' }
    });

    const updated = {
      ...selectedWorkflow,
      steps,
      stepsCount: steps.length
    };

    automationService.updateWorkflow(updated.id, updated).then(() => {
      setSelectedWorkflow(updated);
      toast.success('Appended action step to operational workflow.');
      loadData();
    });
  };

  const handleRemoveStepFromCanvas = (stepId: string) => {
    if (!selectedWorkflow) return;
    let steps = selectedWorkflow.steps.filter(s => s.id !== stepId);
    
    // fix connection link chains
    steps = steps.map((s, idx) => {
      const next = steps[idx + 1];
      return {
        ...s,
        nextStepId: next ? next.id : undefined
      };
    });

    const updated = {
      ...selectedWorkflow,
      steps,
      stepsCount: steps.length
    };

    automationService.updateWorkflow(updated.id, updated).then(() => {
      setSelectedWorkflow(updated);
      toast.success('Node removed and connection channels repaired.');
      loadData();
    });
  };

  const filteredWorkflows = workflows.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.triggerEvent || w.trigger).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left">
      <AnimatePresence mode="wait">
        {!selectedWorkflow ? (
          // WORKFLOWS DIRECTORY MATRIX
          <motion.div
            key="directory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Cognitive Engines
                </span>
                <h1 className="text-2xl font-black tracking-tight text-slate-800">
                  Workflows & Automation Flows
                </h1>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Initialize Flow
              </button>
            </div>

            {/* Filter Search */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search automated workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Matrix */}
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400 font-mono animate-pulse">Syncing workflow threads...</div>
            ) : filteredWorkflows.length === 0 ? (
              <div className="p-12 bg-white border border-slate-100 rounded-xl text-center space-y-3">
                <GitBranch className="w-8 h-8 text-slate-350 mx-auto animate-bounce" />
                <p className="text-sm font-semibold text-slate-700">No active workflows</p>
                <p className="text-xs text-slate-400 font-normal">Formulate trigger pathways to engage users automatically on transactions.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {filteredWorkflows.map(flow => (
                  <AutomationCard
                    key={flow.id}
                    workflow={flow}
                    onToggleStatus={() => handleToggleStatus(flow.id, flow.status)}
                    onDelete={() => handleDeleteWorkflow(flow.id)}
                    onEdit={() => { setSelectedWorkflow(flow); }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          // VISUAL BLOCK NODE CONNECTIONS BUILDER
          <motion.div
            key="builder"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Visual Builder Header */}
            <div className="flex items-center justify-between border-b border-slate-105 pb-5">
              <div className="flex items-center space-x-3 text-left">
                <button
                  onClick={() => { setSelectedWorkflow(null); loadData(); }}
                  className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
                  title="Back to list"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-600" />
                </button>
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    Live Flow Engine: {selectedWorkflow.id}
                  </span>
                  <h1 className="text-xl font-black text-slate-800 flex items-center gap-2 mt-1">
                    {selectedWorkflow.name}
                  </h1>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => handleToggleStatus(selectedWorkflow.id, selectedWorkflow.status)}
                  className={`px-3.5 py-1.5 rounded-xl border font-mono uppercase tracking-wider text-[10px] font-black flex items-center gap-1.5 cursor-pointer ${
                    selectedWorkflow.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {selectedWorkflow.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {selectedWorkflow.status === 'Active' ? 'Pause Automation' : 'Activate Flow'}
                </button>
              </div>
            </div>

            {/* Visual Workspace Canvas Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 border border-slate-150 rounded-2xl bg-white shadow-xs overflow-hidden h-[540px]">
              
              {/* Left Toolbox */}
              <div className="lg:col-span-1 border-r border-slate-150 p-4 bg-slate-50/50 flex flex-col justify-between text-left">
                <div className="space-y-4">
                  <div>
                    <span className="block text-[9px] font-mono font-black uppercase text-slate-400 tracking-wider mb-2">Workspace Nodes</span>
                    <p className="text-[11px] text-slate-500 leading-normal mb-4 font-normal">
                      Flows execute in strict downward sequence. Trigger conditions parse incoming webhook parameters before actions dispatch.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-3 bg-white border border-slate-155 rounded-xl flex items-center space-x-2.5 shadow-2xs">
                      <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <span className="block text-[10px] font-mono font-bold uppercase text-slate-400 leading-none">Trigger node</span>
                        <span className="text-[11px] font-bold text-slate-800 mt-1 block">{selectedWorkflow.triggerEvent}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleAddStepToCanvas}
                      className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                    >
                      + Action Node
                    </button>
                  </div>
                </div>

                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-indigo-800 leading-relaxed font-normal">
                    This automation executes inside sandboxed microservice containers with pre-established API retry queues.
                  </p>
                </div>
              </div>

              {/* Middle Builder Canvas */}
              <div className="lg:col-span-3 bg-slate-50 p-6 flex flex-col items-center overflow-y-auto scrollbar-thin relative justify-start">
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-xs px-2 py-1 rounded border border-slate-150 font-mono text-[9px] text-slate-400 font-bold uppercase">
                  Interactive Drag-And-Block Workspace
                </div>

                <div className="space-y-6 w-full max-w-sm pt-8">
                  {selectedWorkflow.steps.map((step, idx) => (
                    <div key={step.id} className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full bg-white border border-slate-200 p-4 rounded-xl shadow-xs relative hover:border-indigo-400 transition-all text-left"
                      >
                        {/* Remove node */}
                        {idx > 0 && (
                          <button
                            onClick={() => handleRemoveStepFromCanvas(step.id)}
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded"
                            title="Purge node"
                          >
                            ✕
                          </button>
                        )}

                        <div className="flex items-start space-x-3">
                          <span className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 h-5 w-5 rounded-full flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          
                          <div className="min-w-0 flex-1">
                            <span className={`text-[9px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              step.type === 'trigger' ? 'bg-amber-50 text-amber-700' :
                              step.type === 'action' ? 'bg-indigo-50 text-indigo-700' :
                              'bg-purple-50 text-purple-700'
                            }`}>
                              {step.type} node
                            </span>
                            
                            <h4 className="text-xs font-bold text-slate-800 mt-2">{step.title}</h4>
                            
                            {step.type === 'trigger' && (
                              <p className="text-[10px] text-slate-500 font-mono mt-1">Triggers on: {step.config?.event}</p>
                            )}
                            {step.type === 'action' && (
                              <p className="text-[10px] text-slate-500 font-mono mt-1">Action: Dispatch welcome variables template</p>
                            )}
                            {step.type === 'condition' && (
                              <p className="text-[10px] text-slate-500 font-mono mt-1">Branch condition: {step.config?.field} {step.config?.operator} {step.config?.value}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>

                      {/* Connection Line */}
                      {idx < selectedWorkflow.steps.length - 1 && (
                        <div className="h-6 w-0.5 bg-indigo-300 relative my-0.5">
                          <ChevronRight className="w-3.5 h-3.5 text-indigo-400 rotate-90 absolute -bottom-1 -left-[6px]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORMULATE WORKFLOW MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-6 shadow-2xl text-left"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-150 mb-4">
              <h3 className="text-sm font-black font-mono uppercase tracking-wider text-slate-800">
                Configure Automated Trigger
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Workflow Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Welcome onboard sequence"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:border-indigo-500 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Triggering Event</label>
                <select
                  value={newWorkflow.triggerEvent}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, triggerEvent: e.target.value as any }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="On User Signup">On User Signup (Webhook)</option>
                  <option value="On Payment Failure">On Payment Failure (Billing Alert)</option>
                  <option value="On SLA Expired">On SLA Expired (Cron Job)</option>
                  <option value="Custom API Call">Custom API Call (Intercom)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-bold uppercase font-mono rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase font-mono rounded-lg cursor-pointer"
                >
                  Confirm Flow
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
