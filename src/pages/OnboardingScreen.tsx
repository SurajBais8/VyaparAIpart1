/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input, Card, ProgressBar, Spinner } from '../components/ui';
import {
  Building2,
  MapPin,
  Upload,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  X,
  CreditCard,
  PlusCircle,
  ShieldCheck,
  Crop,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { TRANSLATIONS } from '../constants/languages';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, completeOnboarding } = useAuthStore();
  const {
    businessInfo, setBusinessInfo,
    companyInfo, setCompanyInfo,
    logoUrl, setLogoUrl,
    bankDetails, setBankDetails,
    teamInvites, addTeamInvite, removeTeamInvite,
    currentStep, setStep
  } = useOnboardingStore();

  const { language } = useAuthStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Local validation states per step
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [isCompleting, setIsCompleting] = useState(false);

  // Invite subform state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Member' | 'Manager' | 'Billing'>('Member');

  // Simulated Crop states
  const [showCropModal, setShowCropModal] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [cropScale, setCropScale] = useState(1);
  const [cropRotation, setCropRotation] = useState(0);

  // Step names & descriptions
  const steps = [
    { id: 1, title: t.businessInfo, desc: 'Establish legal identification parameters', icon: <Building2 className="w-5 h-5" /> },
    { id: 2, title: t.companyDetails, desc: 'Setup corporate geographic listings', icon: <MapPin className="w-5 h-5" /> },
    { id: 3, title: t.logoUpload, desc: 'Standardize brand asset components', icon: <Upload className="w-5 h-5" /> },
    { id: 4, title: t.bankDetails, desc: 'Configure clearing and payment channels', icon: <CreditCard className="w-5 h-5" /> },
    { id: 5, title: t.inviteTeam, desc: 'Delegate workspace administration links', icon: <UserPlus className="w-5 h-5" /> },
  ];

  // Secure route guard
  useEffect(() => {
    if (!user) {
      toast.error('Authentication session required for onboarding!');
      navigate('/login');
    }
  }, [user, navigate]);

  // Load registration params
  useEffect(() => {
    const biz = searchParams.get('biz');
    const bizType = searchParams.get('bizType');
    const gst = searchParams.get('gst');
    const pan = searchParams.get('pan');

    if (biz || bizType || gst || pan) {
      setBusinessInfo({
        businessName: biz || businessInfo.businessName,
        businessType: bizType || 'SaaS',
        gstNumber: gst || businessInfo.gstNumber,
        panNumber: pan || businessInfo.panNumber,
      });
      toast.success('Registration parameters loaded into profile!', {
        id: 'register-params-toast',
      });
    }
  }, [searchParams]);

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!businessInfo.businessName) errors.businessName = 'Business name is required';
      if (!businessInfo.gstNumber) {
        errors.gstNumber = 'GST Number is required';
      } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(businessInfo.gstNumber.toUpperCase())) {
        errors.gstNumber = 'Please enter a valid GST format (e.g. 22AAAAA1111A1Z1)';
      }
    } else if (step === 2) {
      if (!companyInfo.address) errors.address = 'Primary geographic address is required';
      if (!companyInfo.state) errors.state = 'State listing is required';
      if (!companyInfo.city) errors.city = 'City listing is required';
      if (!companyInfo.pincode) {
        errors.pincode = 'Pincode is required';
      } else if (!/^[1-9][0-9]{5}$/.test(companyInfo.pincode)) {
        errors.pincode = 'Please enter a valid 6-digit corporate pincode';
      }
    } else if (step === 4) {
      if (!bankDetails.accountName) errors.accountName = 'Account holder title is required';
      if (!bankDetails.accountNumber) {
        errors.accountNumber = 'Account identification number is required';
      } else if (bankDetails.accountNumber.length < 9) {
        errors.accountNumber = 'Account number must be at least 9 digits';
      }
      if (!bankDetails.ifsc) {
        errors.ifsc = 'IFSC identification code is required';
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifsc.toUpperCase())) {
        errors.ifsc = 'Please enter a valid IFSC code (e.g. SBIN0001234)';
      }
      if (bankDetails.upiId && !/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/.test(bankDetails.upiId)) {
        errors.upiId = 'Please enter a valid corporate UPI format (e.g. name@bank)';
      }
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    } else {
      toast.error('Please verify current step variables before proceeding.');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Skip/invite later trigger
  const handleSkipTeamStep = () => {
    handleCompleteSetup();
  };

  const handleCompleteSetup = () => {
    setIsCompleting(true);
    setTimeout(() => {
      completeOnboarding();
      setIsCompleting(false);
      toast.success(t.successTitle, {
        description: t.successDesc,
      });
      navigate('/dashboard');
    }, 1800);
  };

  // Logo file handlers
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setRawImage(event.target.result as string);
          setShowCropModal(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const applyCrop = () => {
    // In a fully featured app we use canvas cropping. Here we simulate the successfully cropped save.
    setLogoUrl(rawImage);
    setShowCropModal(false);
    toast.success('Brand asset cropped and applied successfully!');
  };

  const triggerUploadClick = () => {
    document.getElementById('logo-file-picker')?.click();
  };

  // Team Invite subform add
  const handleAddInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    if (!/\S+@\S+\.\S+/.test(inviteEmail)) {
      toast.error('Please provide a valid recipient email.');
      return;
    }
    addTeamInvite({ email: inviteEmail, role: inviteRole });
    setInviteEmail('');
    toast.success(`Invite scheduled for ${inviteEmail}`);
  };

  // Simulated auto autofill for fast demo-ing!
  const autofillCurrentStep = () => {
    if (currentStep === 1) {
      setBusinessInfo({
        businessName: 'Apex Enterprise Solutions',
        gstNumber: '22AAAAA1111A1Z1',
        panNumber: 'ABCDE1234F',
        businessType: 'SaaS',
      });
    } else if (currentStep === 2) {
      setCompanyInfo({
        address: '104 Corporate Boulevard, Technology District',
        state: 'Maharashtra',
        city: 'Mumbai',
        pincode: '400001',
      });
    } else if (currentStep === 3) {
      // Mock logo SVG
      setLogoUrl('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="%236366f1"/></svg>');
    } else if (currentStep === 4) {
      setBankDetails({
        accountName: 'Apex Solutions Private Limited',
        accountNumber: '91802055667788',
        ifsc: 'HDFC0000104',
        upiId: 'apex@hdfcbank',
      });
    } else if (currentStep === 5) {
      addTeamInvite({ email: 'cto@apex.io', role: 'Admin' });
      addTeamInvite({ email: 'billing@apex.io', role: 'Billing' });
    }
    toast.success('Step variables simulated successfully!');
  };

  const getPercentageProgress = () => {
    return Math.floor((currentStep / 5) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Header bar */}
      <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-900/50 px-6 py-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-base">C</span>
          </div>
          <span className="font-bold text-base text-slate-800 dark:text-white">CoreSaaS Setup</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={autofillCurrentStep}
            className="px-3.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 cursor-pointer flex items-center gap-1.5 transition-colors duration-300"
          >
            ⚡ Auto-Fill Variables
          </button>
          <div className="text-xs text-slate-400 dark:text-slate-500 font-mono hidden sm:block">
            STAGE: ONBOARDING_HANDSHAKE
          </div>
        </div>
      </header>

      {/* Main layout area */}
      <div className="flex-grow max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* Left Side: Step tracker (Vertical Rail on Desktop, horizontal pill banner on Mobile) */}
        <div className="w-full lg:w-1/4 flex-shrink-0">
          {/* Mobile step status banner */}
          <div className="lg:hidden bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-900/50 rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Setup Progress
              </span>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                Step {currentStep} of 5
              </span>
            </div>
            <ProgressBar progress={getPercentageProgress()} />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-3 flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500">
                {steps[currentStep - 1].icon}
              </span>
              {steps[currentStep - 1].title}
            </h3>
          </div>

          {/* Desktop Vertical Steps Rail */}
          <div className="hidden lg:flex flex-col gap-6 sticky top-24 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-900/50 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
              Onboarding Roadmap
            </h3>

            <div className="space-y-6 text-left relative pl-1">
              {/* Connecting line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-900 z-0" />

              {steps.map((s) => {
                const isActive = s.id === currentStep;
                const isCompleted = s.id < currentStep;

                return (
                  <div key={s.id} className="flex gap-4 relative z-10 items-start select-none">
                    <div
                      className={`w-9.5 h-9.5 rounded-full border flex items-center justify-center transition-all duration-300 text-sm font-bold
                        ${isActive
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                          : isCompleted
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500'}`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} /> : s.id}
                    </div>

                    <div className="text-left space-y-0.5">
                      <h4
                        className={`text-xs font-bold transition-colors duration-300
                          ${isActive
                            ? 'text-slate-850 dark:text-white'
                            : isCompleted
                              ? 'text-slate-500 dark:text-slate-400 line-through'
                              : 'text-slate-400 dark:text-slate-500'}`}
                      >
                        {s.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-550 leading-normal">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-900 pt-4 mt-2">
              <ProgressBar progress={getPercentageProgress()} className="mb-2" />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>SETUP LEVEL</span>
                <span>{getPercentageProgress()}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Step Content Cards */}
        <div className="w-full lg:w-3/4 flex flex-col">
          <Card variant="glass" className="p-6 sm:p-8 flex-grow shadow-md bg-white dark:bg-slate-950">
            <AnimatePresence mode="wait">
              {isCompleting ? (
                <motion.div
                  key="onboarding-completion"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <Spinner className="w-12 h-12 text-indigo-600" />
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Synchronizing Corporate Profile</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                      Provisioning clearing vaults, setting team permissions, and finalizing portal secure handshakes...
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 text-left"
                >
                  {/* Step title */}
                  <div className="border-b border-slate-100 dark:border-slate-900 pb-4">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500">
                        {steps[currentStep - 1].icon}
                      </span>
                      {steps[currentStep - 1].title}
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {steps[currentStep - 1].desc}
                    </p>
                  </div>

                  {/* ==================================== */}
                  {/* STEP 1: BUSINESS INFORMATION */}
                  {/* ==================================== */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <Input
                        label="Legal Business Name"
                        value={businessInfo.businessName}
                        onChange={(e) => setBusinessInfo({ businessName: e.target.value })}
                        error={stepErrors.businessName}
                        icon={<Building2 className="w-4 h-4" />}
                      />

                      <Input
                        label="GST Registration Number (Format: 22AAAAA1111A1Z1)"
                        value={businessInfo.gstNumber}
                        onChange={(e) => setBusinessInfo({ gstNumber: e.target.value.toUpperCase() })}
                        error={stepErrors.gstNumber}
                        icon={<ShieldCheck className="w-4 h-4" />}
                      />

                      <Input
                        label="PAN Identification (Optional)"
                        value={businessInfo.panNumber}
                        onChange={(e) => setBusinessInfo({ panNumber: e.target.value.toUpperCase() })}
                        maxLength={10}
                        icon={<ShieldCheck className="w-4 h-4" />}
                      />

                      <div className="relative mb-5 text-left">
                        <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 select-none ml-1">
                          Enterprise Business Category
                        </label>
                        <select
                          value={businessInfo.businessType}
                          onChange={(e) => setBusinessInfo({ businessType: e.target.value })}
                          className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none text-slate-800 dark:text-slate-100"
                        >
                          <option value="SaaS">SaaS Platform</option>
                          <option value="E-commerce">E-commerce Enterprise</option>
                          <option value="Healthcare">Healthcare Operations</option>
                          <option value="Fintech">Fintech Organization</option>
                        </select>
                      </div>

                      {/* Checkbox Section from Sleek Theme */}
                      <div className="flex items-start gap-3 p-4 bg-slate-100/40 dark:bg-slate-900/40 rounded-xl border border-slate-200/40 dark:border-slate-800/40 mt-4">
                        <input type="checkbox" className="mt-1 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700" defaultChecked readOnly />
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-left">
                          I confirm that the information provided is accurate and matches our legal documents for verification purposes.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ==================================== */}
                  {/* STEP 2: COMPANY GEOGRAPHICS */}
                  {/* ==================================== */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <Input
                        label="Primary Headquarters Street Address"
                        value={companyInfo.address}
                        onChange={(e) => setCompanyInfo({ address: e.target.value })}
                        error={stepErrors.address}
                        icon={<MapPin className="w-4 h-4" />}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="City / District"
                          value={companyInfo.city}
                          onChange={(e) => setCompanyInfo({ city: e.target.value })}
                          error={stepErrors.city}
                        />
                        <Input
                          label="State Listing"
                          value={companyInfo.state}
                          onChange={(e) => setCompanyInfo({ state: e.target.value })}
                          error={stepErrors.state}
                        />
                      </div>

                      <Input
                        label="Corporate Pincode"
                        type="tel"
                        maxLength={6}
                        value={companyInfo.pincode}
                        onChange={(e) => setCompanyInfo({ pincode: e.target.value.replace(/\D/g, '') })}
                        error={stepErrors.pincode}
                        icon={<MapPin className="w-4 h-4" />}
                      />
                    </div>
                  )}

                  {/* ==================================== */}
                  {/* STEP 3: BRAND LOGO UPLOAD */}
                  {/* ==================================== */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors duration-300 text-center bg-slate-50/50 dark:bg-slate-900/20">
                        <input
                          id="logo-file-picker"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoFileChange}
                        />

                        {logoUrl ? (
                          <div className="flex flex-col items-center space-y-4">
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white flex items-center justify-center shadow-lg">
                              <img referrerPolicy="no-referrer" src={logoUrl} alt="Company logo preview" className="max-w-full max-h-full object-contain p-2" />
                              <button
                                onClick={() => setLogoUrl(null)}
                                className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-xs"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" onClick={() => { setRawImage(logoUrl); setShowCropModal(true); }} className="py-2.5">
                                <Crop className="w-4 h-4 mr-1.5 text-indigo-500" /> Recrop Image
                              </Button>
                              <Button variant="outline" onClick={triggerUploadClick} className="py-2.5">
                                Change File
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="p-3.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 inline-flex">
                              <Upload className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                Drag and drop your brand asset, or{' '}
                                <button type="button" onClick={triggerUploadClick} className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-bold">
                                  browse files
                                </button>
                              </p>
                              <p className="text-[11px] text-slate-400">
                                Supports PNG, JPG, or SVG up to 5MB. Standard resolution recommended.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mock Cropping Dialog */}
                      {showCropModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
                          <div className="relative w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl z-10 text-left">
                            <button
                              onClick={() => setShowCropModal(false)}
                              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                            >
                              <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                              <Crop className="w-5 h-5 text-indigo-500" /> Simulated Image Cropper
                            </h3>

                            {/* Cropping visual sandbox */}
                            <div className="w-full aspect-square rounded-xl bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center relative border border-slate-200 dark:border-slate-800">
                              <div
                                className="relative border border-dashed border-indigo-500/80 w-[70%] aspect-square flex items-center justify-center"
                                style={{
                                  transform: `scale(${cropScale}) rotate(${cropRotation}deg)`,
                                  transition: 'transform 0.1s ease',
                                }}
                              >
                                {rawImage && (
                                  <img
                                    src={rawImage}
                                    alt="cropping src"
                                    className="max-w-full max-h-full object-contain opacity-80"
                                  />
                                )}
                                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-indigo-500" />
                                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-indigo-500" />
                                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-indigo-500" />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-indigo-500" />
                              </div>
                            </div>

                            {/* Sliders */}
                            <div className="space-y-3.5 mt-4">
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono flex justify-between">
                                  <span>Zoom Multiplier</span>
                                  <span>{cropScale.toFixed(2)}x</span>
                                </label>
                                <input
                                  type="range"
                                  min="0.5"
                                  max="2"
                                  step="0.05"
                                  value={cropScale}
                                  onChange={(e) => setCropScale(parseFloat(e.target.value))}
                                  className="w-full accent-indigo-600"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono flex justify-between">
                                  <span>Angular Rotation</span>
                                  <span>{cropRotation}°</span>
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="360"
                                  value={cropRotation}
                                  onChange={(e) => setCropRotation(parseInt(e.target.value))}
                                  className="w-full accent-indigo-600"
                                />
                              </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-6">
                              <Button variant="outline" onClick={() => setShowCropModal(false)} className="py-2.5">
                                Cancel
                              </Button>
                              <Button variant="primary" onClick={applyCrop} className="py-2.5">
                                Apply & Crop
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ==================================== */}
                  {/* STEP 4: BANK DETAILS */}
                  {/* ==================================== */}
                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <Input
                        label="Account Holder Name"
                        value={bankDetails.accountName}
                        onChange={(e) => setBankDetails({ accountName: e.target.value })}
                        error={stepErrors.accountName}
                        icon={<Building2 className="w-4 h-4" />}
                      />

                      <Input
                        label="Corporate Account Number"
                        type="tel"
                        value={bankDetails.accountNumber}
                        onChange={(e) => setBankDetails({ accountNumber: e.target.value.replace(/\D/g, '') })}
                        error={stepErrors.accountNumber}
                        icon={<CreditCard className="w-4 h-4" />}
                      />

                      <Input
                        label="IFSC Clearance Code"
                        value={bankDetails.ifsc}
                        onChange={(e) => setBankDetails({ ifsc: e.target.value.toUpperCase() })}
                        error={stepErrors.ifsc}
                        icon={<CreditCard className="w-4 h-4" />}
                      />

                      <Input
                        label="UPI ID (Optional, format: company@bank)"
                        value={bankDetails.upiId}
                        onChange={(e) => setBankDetails({ upiId: e.target.value })}
                        error={stepErrors.upiId}
                        icon={<CreditCard className="w-4 h-4" />}
                      />
                    </div>
                  )}

                  {/* ==================================== */}
                  {/* STEP 5: TEAM INVITES */}
                  {/* ==================================== */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <form onSubmit={handleAddInvite} className="p-4 rounded-xl border border-slate-200 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row gap-3 items-end">
                        <div className="flex-grow w-full text-left">
                          <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono ml-1">
                            Team Recipient Email
                          </label>
                          <input
                            type="email"
                            placeholder="colleague@enterprise.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none text-slate-800 dark:text-slate-100"
                          />
                        </div>

                        <div className="w-full sm:w-1/3 text-left">
                          <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono ml-1">
                            Authority Role
                          </label>
                          <select
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value as any)}
                            className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none text-slate-800 dark:text-slate-100"
                          >
                            <option value="Admin">Admin (Full Access)</option>
                            <option value="Member">Member (Developer)</option>
                            <option value="Manager">Manager (Product)</option>
                            <option value="Billing">Billing (Accounting)</option>
                          </select>
                        </div>

                        <Button type="submit" variant="outline" className="h-[46px] w-full sm:w-auto px-4 cursor-pointer">
                          <PlusCircle className="w-4 h-4 mr-1 text-indigo-500" /> Add
                        </Button>
                      </form>

                      {/* Invites list view */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                          Scheduled invites ({teamInvites.length})
                        </h4>

                        {teamInvites.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <AnimatePresence>
                              {teamInvites.map((invite) => (
                                <motion.div
                                  key={invite.email}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 flex justify-between items-center"
                                >
                                  <div className="truncate text-left space-y-0.5">
                                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{invite.email}</p>
                                    <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold uppercase">{invite.role}</p>
                                  </div>
                                  <button
                                    onClick={() => removeTeamInvite(invite.email)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <div className="text-center p-8 rounded-xl border border-slate-200 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-900/10">
                            <p className="text-xs text-slate-400 font-light">No team members added yet. You can invite colleagues now or configure this later.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Onboarding Nav Actions buttons footer */}
                  <div className="flex gap-4 border-t border-slate-100 dark:border-slate-900 pt-6 mt-6">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevStep}
                        leftIcon={<ArrowLeft className="w-4 h-4" />}
                      >
                        {t.previous}
                      </Button>
                    )}

                    <div className="ml-auto flex gap-3">
                      {currentStep === 5 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleSkipTeamStep}
                          className="font-semibold text-slate-500 hover:text-slate-600"
                        >
                          {t.skip}
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant={currentStep === 5 ? 'success' : 'primary'}
                        onClick={currentStep === 5 ? handleCompleteSetup : handleNextStep}
                        rightIcon={currentStep < 5 ? <ArrowRight className="w-4 h-4" /> : undefined}
                      >
                        {currentStep === 5 ? t.complete : t.next}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
};
