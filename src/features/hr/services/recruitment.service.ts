/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import recruitmentJson from '../../../mock/recruitment.json';
import { JobOpening, Candidate } from '../../../types/hr';

const STORAGE_KEY = 'saas-hr-recruitment';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recruitmentJson));
  }
};

export const recruitmentService = {
  getRecruitmentData: async (): Promise<{ jobs: JobOpening[]; candidates: Candidate[] }> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { jobs: [], candidates: [] };
  },

  getJobOpenings: async (): Promise<JobOpening[]> => {
    const data = await recruitmentService.getRecruitmentData();
    return data.jobs;
  },

  getCandidates: async (): Promise<Candidate[]> => {
    const data = await recruitmentService.getRecruitmentData();
    return data.candidates;
  },

  getCandidateById: async (id: string): Promise<Candidate | null> => {
    const list = await recruitmentService.getCandidates();
    return list.find((c) => c.id === id) || null;
  },

  updateCandidateStage: async (id: string, stage: Candidate['stage']): Promise<Candidate | null> => {
    initLocalStorage();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"jobs":[], "candidates":[]}');
    const idx = data.candidates.findIndex((c: Candidate) => c.id === id);
    if (idx !== -1) {
      data.candidates[idx].stage = stage;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data.candidates[idx];
    }
    return null;
  },

  updateCandidate: async (id: string, updateData: Partial<Candidate>): Promise<Candidate | null> => {
    initLocalStorage();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"jobs":[], "candidates":[]}');
    const idx = data.candidates.findIndex((c: Candidate) => c.id === id);
    if (idx !== -1) {
      data.candidates[idx] = { ...data.candidates[idx], ...updateData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data.candidates[idx];
    }
    return null;
  },

  createJobOpening: async (job: Partial<JobOpening>): Promise<JobOpening> => {
    initLocalStorage();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"jobs":[], "candidates":[]}');
    
    const newJob: JobOpening = {
      id: `JOB-${String(data.jobs.length + 1).padStart(3, '0')}`,
      title: job.title || 'New Job Opportunity',
      department: job.department || 'Engineering',
      status: 'Open',
      experience: job.experience || '3-5 Years',
      location: job.location || 'Noida HQ',
      candidatesCount: 0,
      postedDate: new Date().toISOString().split('T')[0]
    };

    data.jobs.unshift(newJob);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return newJob;
  },

  createCandidate: async (cand: Partial<Candidate>): Promise<Candidate> => {
    initLocalStorage();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"jobs":[], "candidates":[]}');
    
    const newCand: Candidate = {
      id: `CAN-${String(data.candidates.length + 1).padStart(3, '0')}`,
      name: cand.name || 'New Applicant',
      email: cand.email || 'applicant@gmail.com',
      phone: cand.phone || '+91 00000 00000',
      jobId: cand.jobId || 'JOB-001',
      jobTitle: cand.jobTitle || 'Senior Frontend Developer',
      experience: cand.experience || '5 Years',
      stage: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      resume: cand.resume || 'Resume.pdf',
      notes: cand.notes || [],
      documents: cand.documents || [],
      aiEvaluation: cand.aiEvaluation || 'Under evaluation by HR core cognitive models.'
    };

    data.candidates.unshift(newCand);
    
    // Update candidate count on job
    const jobIdx = data.jobs.findIndex((j: JobOpening) => j.id === newCand.jobId);
    if (jobIdx !== -1) {
      data.jobs[jobIdx].candidatesCount += 1;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return newCand;
  }
};
