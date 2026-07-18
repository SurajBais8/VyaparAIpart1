/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, PenTool, Check, RefreshCw, Cpu, AlignLeft, 
  Smile, ShieldCheck, Zap, MessageSquare, ArrowUpRight, BarChart2 
} from 'lucide-react';
import { toast } from 'sonner';

export default function AIMarketing() {
  const [tone, setTone] = useState<'Technical' | 'Bold' | 'Playful' | 'Professional'>('Technical');
  const [platform, setPlatform] = useState<'Email' | 'WhatsApp' | 'SMS'>('Email');
  const [prompt, setPrompt] = useState('UPI Auto-Pay failed due to SLA thresholds. Recommend update.');
  const [generatedCopy, setGeneratedCopy] = useState<{
    subject?: string;
    body: string;
    variables: string[];
    actionButton?: string;
  } | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please input copy prompt directives.');
      return;
    }
    setGenerating(true);
    toast.info('AI is generating copy variants...');

    setTimeout(() => {
      setGenerating(false);
      let subject = '';
      let body = '';
      let variables = ['name'];
      let actionButton = '';

      if (platform === 'Email') {
        variables = ['name', 'account_id', 'retry_link'];
        if (tone === 'Technical') {
          subject = '⚠️ CRITICAL: UPI SLA Autopay retry failed';
          body = `Hello {{name}},\n\nWe detected a structural SLA timeout during your scheduled UPI transaction for account {{account_id}}.\n\nTo prevent compliance degradation, manually override our gateway nodes here: {{retry_link}}\n\nSecure Ledger Node,\nEngineering Operations Team`;
          actionButton = 'OVERRIDE GATEWAY GATE';
        } else if (tone === 'Bold') {
          subject = '⚡ Action Required: Your payment didn\'t clear';
          body = `Hi {{name}},\n\nYour scheduled UPI subscription failed to clear gateway checks today. Let\'s keep your cluster online.\n\nResolve this immediately at: {{retry_link}}\n\nCheers,\nSaaS Support Core`;
          actionButton = 'RETRY UPI AUTO-PAY';
        } else {
          subject = 'Sync required on your account status';
          body = `Dear {{name}},\n\nThis is an automated communication regarding account {{account_id}}. Our Billing service flagged a failure in your scheduled autopay cycle.\n\nPlease check your credentials and retry here: {{retry_link}}\n\nWarm regards,\nCustomer Success Desk`;
          actionButton = 'UPDATE CREDIT CARD';
        }
      } else if (platform === 'WhatsApp') {
        variables = ['name', 'discount_code'];
        if (tone === 'Playful') {
          body = `Hey {{name}}! 🚀 Quick heads-up: our servers missed your payment today. Don\'t lose your 15% discount! Use code {{discount_code}} and retry now. We are standing by!`;
        } else {
          body = `Hello {{name}}, this is an automated billing update. Your UPI Autopay SLA threshold was breached. Click the check below to update payment parameters.`;
        }
      } else {
        // SMS
        variables = ['name', 'ref_id'];
        body = `[SAASIO] Hello {{name}}, transaction {{ref_id}} failed to clear. Retry at https://saas.io/pay to prevent account lockout.`;
      }

      setGeneratedCopy({ subject, body, variables, actionButton });
      toast.success('Generative copy variants compiled!');
    }, 1200);
  };

  const handleCopyToClipboard = () => {
    if (!generatedCopy) return;
    const copyString = `${generatedCopy.subject ? `Subject: ${generatedCopy.subject}\n\n` : ''}${generatedCopy.body}${generatedCopy.actionButton ? `\n\nButton: ${generatedCopy.actionButton}` : ''}`;
    navigator.clipboard.writeText(copyString);
    toast.success('Copy saved to clipboard buffer.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 text-left">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
            <Sparkles className="w-4 h-4 animate-spin-slow" /> AI Intelligence Suite
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Cognitive Marketing Desk
          </h1>
        </div>
      </div>

      {/* Main double column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Input Form Prompt Builder */}
        <div className="p-5 bg-white border border-slate-150 rounded-2xl space-y-4">
          <h3 className="text-sm font-black font-mono uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Cpu className="w-4.5 h-4.5 text-indigo-500" />
            AI Copywriter Assistant
          </h3>

          <div className="space-y-4 text-left">
            {/* Tone selector */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">Voice Tone Parameters</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Technical', 'Bold', 'Playful', 'Professional'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`text-[10px] py-1.5 font-bold font-mono uppercase rounded-lg border tracking-wider transition-all cursor-pointer ${
                      tone === t ? 'bg-indigo-650 text-white border-indigo-650' : 'bg-slate-50 text-slate-550 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform channel selector */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">Target Channel Format</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Email', 'WhatsApp', 'SMS'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`text-[10px] py-1.5 font-bold font-mono uppercase rounded-lg border tracking-wider transition-all cursor-pointer ${
                      platform === p ? 'bg-indigo-650 text-white border-indigo-650' : 'bg-slate-50 text-slate-550 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Directives */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">Copy Directives & Context</label>
              <textarea
                rows={4}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe campaign objective or target variables..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-sans text-slate-800 leading-normal"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Compiling neural copy...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Formulize copy variants
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Outputs Display */}
        <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black font-mono uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
              Compiled AI copy outputs
            </h3>

            <AnimatePresence mode="wait">
              {generatedCopy ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-4 text-left"
                >
                  <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-3 relative shadow-xs">
                    
                    {generatedCopy.subject && (
                      <div className="pb-2.5 border-b border-slate-100">
                        <span className="block text-[8px] font-mono font-bold uppercase text-slate-400">Subject line</span>
                        <p className="text-xs font-bold text-indigo-600 mt-0.5">{generatedCopy.subject}</p>
                      </div>
                    )}

                    <div>
                      <span className="block text-[8px] font-mono font-bold uppercase text-slate-400">Message Body</span>
                      <p className="text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-wrap mt-1">{generatedCopy.body}</p>
                    </div>

                    {generatedCopy.actionButton && (
                      <div className="pt-2 border-t border-slate-100 flex justify-center">
                        <span className="px-3.5 py-1.5 bg-indigo-600 text-white font-mono uppercase font-black text-[9px] rounded-lg tracking-wider">
                          {generatedCopy.actionButton}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Variables listing */}
                  <div className="bg-white p-3 rounded-lg border border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-400">Parsed variables:</span>
                    {generatedCopy.variables.map(v => (
                      <span key={v} className="text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-650 px-1.5 py-0.5 rounded">
                        {"{{"}{v}{"}}"}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={handleCopyToClipboard}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold uppercase font-mono cursor-pointer"
                  >
                    Copy Output Buffer
                  </button>
                </motion.div>
              ) : (
                <div className="p-12 text-center text-slate-400 border border-dashed border-slate-250 rounded-xl space-y-3 bg-white">
                  <PenTool className="w-8 h-8 text-slate-350 mx-auto" />
                  <p className="text-xs font-bold uppercase font-mono tracking-wider text-slate-400">Output terminal idle</p>
                  <p className="text-[11px] font-normal text-slate-450 max-w-xs mx-auto">Select tone parameter models on the left to invoke dynamic copywriting assistants.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Retention insights card widget */}
          <div className="bg-gradient-to-r from-indigo-500 to-violet-600 p-4 rounded-xl text-white mt-6">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider font-mono flex items-center">
              <BarChart2 className="w-4 h-4 mr-1.5" /> Retention Optimization Insights
            </h4>
            <p className="text-[11px] text-indigo-100 leading-relaxed font-light mt-1 text-left">
              Our churn prediction model indicates targeting SLA expiration groups with customized SMS notifications will reduce contract cancellation spikes by 8% over the next 45 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
