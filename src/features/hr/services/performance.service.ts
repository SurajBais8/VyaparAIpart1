/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import performanceJson from '../../../mock/performance.json';
import { PerformanceReview, PerformanceGoal, Promotion } from '../../../types/hr';

const STORAGE_KEY = 'saas-hr-performance';

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(performanceJson));
  }
};

export const performanceService = {
  getPerformanceData: async (): Promise<{ reviews: PerformanceReview[]; goals: PerformanceGoal[]; promotions: Promotion[] }> => {
    initLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { reviews: [], goals: [], promotions: [] };
  },

  getReviews: async (): Promise<PerformanceReview[]> => {
    const data = await performanceService.getPerformanceData();
    return data.reviews;
  },

  getGoals: async (): Promise<PerformanceGoal[]> => {
    const data = await performanceService.getPerformanceData();
    return data.goals;
  },

  getPromotions: async (): Promise<Promotion[]> => {
    const data = await performanceService.getPerformanceData();
    return data.promotions;
  },

  createGoal: async (goal: Partial<PerformanceGoal>): Promise<PerformanceGoal> => {
    initLocalStorage();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"reviews":[], "goals":[], "promotions":[]}');
    
    const newGoal: PerformanceGoal = {
      id: `GOL-${String(data.goals.length + 1).padStart(3, '0')}`,
      employeeId: goal.employeeId || 'EMP-001',
      employeeName: goal.employeeName || 'Unknown',
      title: goal.title || 'Continuous learning objectives',
      targetDate: goal.targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: goal.progress || 0,
      status: 'On Track'
    };

    data.goals.unshift(newGoal);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return newGoal;
  },

  updateGoalProgress: async (id: string, progress: number): Promise<PerformanceGoal | null> => {
    initLocalStorage();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"reviews":[], "goals":[], "promotions":[]}');
    const idx = data.goals.findIndex((g: PerformanceGoal) => g.id === id);
    if (idx !== -1) {
      data.goals[idx].progress = progress;
      if (progress === 100) data.goals[idx].status = 'Completed';
      else if (progress >= 80) data.goals[idx].status = 'Ahead';
      else if (progress >= 40) data.goals[idx].status = 'On Track';
      else data.goals[idx].status = 'Not Started';

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data.goals[idx];
    }
    return null;
  },

  createReview: async (review: Partial<PerformanceReview>): Promise<PerformanceReview> => {
    initLocalStorage();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"reviews":[], "goals":[], "promotions":[]}');
    
    const newReview: PerformanceReview = {
      id: `REV-${String(data.reviews.length + 1).padStart(3, '0')}`,
      employeeId: review.employeeId || 'EMP-001',
      employeeName: review.employeeName || 'Unknown',
      department: review.department || 'Engineering',
      reviewer: review.reviewer || 'Director',
      reviewPeriod: review.reviewPeriod || 'H2 2026',
      rating: review.rating || 4.5,
      selfRating: review.selfRating || 4.3,
      strengths: review.strengths || 'High ownership, great team player.',
      improvements: review.improvements || 'Focus on strategic initiatives.',
      status: 'Completed'
    };

    data.reviews.unshift(newReview);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return newReview;
  },

  createPromotion: async (promo: Partial<Promotion>): Promise<Promotion> => {
    initLocalStorage();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"reviews":[], "goals":[], "promotions":[]}');
    
    const newPromo: Promotion = {
      id: `PRM-${String(data.promotions.length + 1).padStart(3, '0')}`,
      employeeId: promo.employeeId || 'EMP-001',
      employeeName: promo.employeeName || 'Unknown',
      department: promo.department || 'General',
      currentDesignation: promo.currentDesignation || 'Associate',
      proposedDesignation: promo.proposedDesignation || 'Senior Associate',
      justification: promo.justification || 'Outstanding technical execution and metrics closure throughout the quarter.',
      status: 'Pending Review',
      effectiveDate: promo.effectiveDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    data.promotions.unshift(newPromo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return newPromo;
  },

  updatePromotionStatus: async (id: string, status: Promotion['status']): Promise<Promotion | null> => {
    initLocalStorage();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"reviews":[], "goals":[], "promotions":[]}');
    const idx = data.promotions.findIndex((p: Promotion) => p.id === id);
    if (idx !== -1) {
      data.promotions[idx].status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data.promotions[idx];
    }
    return null;
  }
};
