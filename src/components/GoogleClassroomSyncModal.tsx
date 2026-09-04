import React, { useState, useEffect } from 'react';
import { JobRequirement, CandidateProfile } from '../types';
import {
  ClassroomCourse,
  listClassroomCourses,
  syncClassroomCourseToCandidates,
  ClassroomCandidateSyncResult,
} from '../services/googleClassroomService';
import {
  GraduationCap,
  X,
  RefreshCw,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  ExternalLink,
  BookOpen,
  Volume2,
  Lock,
  Flame,
  TrendingUp,
} from 'lucide-react';

interface GoogleClassroomSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobRequirements: JobRequirement[];
  existingCandidates: CandidateProfile[];
  accessToken: string | null;
  onLoginClick: () => void;
  onCandidatesSynced: (result: ClassroomCandidateSyncResult) => void;
}

export const GoogleClassroomSyncModal: React.FC<GoogleClassroomSyncModalProps> = ({
  isOpen,
  onClose,
  jobRequirements,
  existingCandidates,
  accessToken,
  onLoginClick,
  onCandidatesSynced,
}) => {
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<string>(jobRequirements[0]?.id || '');
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<ClassroomCandidateSyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && accessToken) {
      loadCourses();
    }
  }, [isOpen, accessToken]);

  const loadCourses = async () => {
    if (!accessToken) return;
    setIsLoadingCourses(true);
    setError(null);
    try {
      const fetchedCourses = await listClassroomCourses(accessToken);
      setCourses(fetchedCourses);
      if (fetchedCourses.length > 0 && !selectedCourseId) {
        setSelectedCourseId(fetchedCourses[0].id);
      }
    } catch (err: any) {
      console.warn('Failed to load Classroom courses:', err);
      setError(err.message || 'Could not fetch Google Classroom courses. Please ensure Classroom permissions are granted.');
    } finally {
      setIsLoadingCourses(false);
    }
  };

  if (!isOpen) return null;

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const targetJob = jobRequirements.find((j) => j.id === selectedJobId) || jobRequirements[0];

  const handleStartSync = async () => {
    if (!accessToken) {
      onLoginClick();
      return;
    }

    if (!selectedCourse) {
      setError('Please select a Google Classroom course to sync.');
      return;
    }

    setIsSyncing(true);
    setError(null);
    try {
      const result = await syncClassroomCourseToCandidates(
        accessToken,
        selectedCourse,
        targetJob,
        existingCandidates
      );

      setSyncResult(result);
      onCandidatesSynced(result);
    } catch (err: any) {
      console.error('Failed to sync Google Classroom course:', err);
      setError(err.message || 'An error occurred while syncing Classroom roster and grades.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div
      id="modal-google-classroom-sync"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="bg-[#0D0D0D] border border-emerald-500/40 rounded-none w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl font-sans text-white my-auto">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif italic text-xl text-white font-bold">Sync with Google Classroom</h3>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  T.H.I.S. Protocol Engine
                </span>
              </div>
              <p className="text-xs text-white/50">
                Fetch course rosters, automatically invite learners as candidate profiles, and map assignment scores to T.H.I.S. civility criteria.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Auth Check */}
          {!accessToken ? (
            <div className="bg-amber-500/10 border border-amber-500/30 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold font-mono uppercase text-sm">
                <Lock className="w-4 h-4" /> Google Authentication Required
              </div>
              <p className="text-white/70">
                Connect your Google Workspace / Google Classroom account to access live class rosters, coursework assignments, and student submission grades.
              </p>
              <button
                type="button"
                onClick={onLoginClick}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold uppercase tracking-wider text-xs flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Connect Google Classroom Account</span>
              </button>
            </div>
          ) : (
            <>
              {/* Error Banner */}
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <X className="w-4 h-4 text-rose-400" /> Error
                  </div>
                  <p>{error}</p>
                </div>
              )}

              {/* Step 1 & 2: Course & Target Job Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Selection */}
                <div className="bg-[#141414] p-4 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-white/60 font-semibold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> 1. Select Google Classroom Course
                    </label>
                    <button
                      type="button"
                      onClick={loadCourses}
                      disabled={isLoadingCourses}
                      className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingCourses ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {isLoadingCourses ? (
                    <div className="py-4 text-center text-white/40 font-mono flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Scanning Google Classroom courses...</span>
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="p-3 bg-[#1B1B1B] border border-dashed border-white/15 text-center space-y-2">
                      <p className="text-white/60">No active Google Classroom courses detected.</p>
                      <p className="text-[11px] text-emerald-400/80">
                        You can create or connect a course in the "Google Classroom" tab.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <select
                        id="select-classroom-course-sync"
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full p-2.5 bg-[#1B1B1B] border border-white/15 text-xs text-white focus:border-emerald-400 focus:outline-none font-sans"
                      >
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name} {course.section ? `(${course.section})` : ''}
                          </option>
                        ))}
                      </select>

                      {selectedCourse && (
                        <div className="p-2.5 bg-[#1A1A1A] border border-white/5 space-y-1 text-[11px]">
                          <div className="flex justify-between text-white/40 font-mono">
                            <span>Course ID: {selectedCourse.id}</span>
                            {selectedCourse.enrollmentCode && (
                              <span className="text-emerald-300 font-bold">Code: {selectedCourse.enrollmentCode}</span>
                            )}
                          </div>
                          {selectedCourse.descriptionHeading && (
                            <p className="text-white/70 italic">{selectedCourse.descriptionHeading}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Target Job Requirement */}
                <div className="bg-[#141414] p-4 border border-white/10 space-y-3">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-white/60 font-semibold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" /> 2. Map Enrolled Students to Job Requisition
                  </label>

                  <select
                    id="select-target-job-sync"
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full p-2.5 bg-[#1B1B1B] border border-white/15 text-xs text-white focus:border-amber-400 focus:outline-none font-sans"
                  >
                    {jobRequirements.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.roleName} — {job.locationCity} ({job.minExperienceYears}+ yrs exp)
                      </option>
                    ))}
                  </select>

                  {targetJob && (
                    <div className="p-2.5 bg-[#1A1A1A] border border-white/5 space-y-1 text-[11px]">
                      <div className="text-amber-300 font-semibold">{targetJob.title}</div>
                      <div className="text-white/50">Required Skills: {targetJob.skills.slice(0, 4).join(', ')}</div>
                      <div className="text-white/40">Location: {targetJob.locationCity} • Radius: {targetJob.radiusMiles} mi</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: T.H.I.S. Criteria Mapping Architecture */}
              <div className="bg-[#121212] border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>T.H.I.S. Civility Evaluation Protocol Mapping</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">Autonomous Rubric Scoring</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#181818] border border-blue-500/20 space-y-1">
                    <div className="flex items-center justify-between text-blue-400 font-mono font-bold text-xs">
                      <span className="flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5" /> <strong>T</strong> — Tone
                      </span>
                      <span>25%</span>
                    </div>
                    <p className="text-[10px] text-white/60 leading-relaxed">
                      Graded from vocal pitches, respectful phrasing, and tone calibration coursework assignments.
                    </p>
                  </div>

                  <div className="p-3 bg-[#181818] border border-emerald-500/20 space-y-1">
                    <div className="flex items-center justify-between text-emerald-400 font-mono font-bold text-xs">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> <strong>H</strong> — Honesty
                      </span>
                      <span>25%</span>
                    </div>
                    <p className="text-[10px] text-white/60 leading-relaxed">
                      Graded from ethics modules, institutional honor compliance, and conflict-of-interest assessments.
                    </p>
                  </div>

                  <div className="p-3 bg-[#181818] border border-purple-500/20 space-y-1">
                    <div className="flex items-center justify-between text-purple-400 font-mono font-bold text-xs">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" /> <strong>I</strong> — Impress
                      </span>
                      <span>25%</span>
                    </div>
                    <p className="text-[10px] text-white/60 leading-relaxed">
                      Graded from crisis chamber simulations, outage responses, and high-pressure de-escalation.
                    </p>
                  </div>

                  <div className="p-3 bg-[#181818] border border-amber-500/20 space-y-1">
                    <div className="flex items-center justify-between text-amber-400 font-mono font-bold text-xs">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> <strong>S</strong> — Sustain
                      </span>
                      <span>25%</span>
                    </div>
                    <p className="text-[10px] text-white/60 leading-relaxed">
                      Graded from coursework completion rate, sustained cohort engagement, and motivation milestones.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sync Success Summary Card */}
              {syncResult && (
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/40 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-300 font-mono font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Successfully Synced Course Roster with Candidate Ledger!</span>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {syncResult.courseName}
                    </span>
                  </div>

                  {/* Summary Metric Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                    <div className="p-3 bg-[#0E0E0E] border border-white/10">
                      <div className="text-[10px] uppercase text-white/40">Total Synced</div>
                      <div className="text-xl font-bold text-white">{syncResult.syncedCount} Candidates</div>
                    </div>
                    <div className="p-3 bg-[#0E0E0E] border border-white/10">
                      <div className="text-[10px] uppercase text-white/40">Newly Invited</div>
                      <div className="text-xl font-bold text-emerald-400">+{syncResult.newlyInvitedCount}</div>
                    </div>
                    <div className="p-3 bg-[#0E0E0E] border border-white/10">
                      <div className="text-[10px] uppercase text-white/40">Avg Civility Score</div>
                      <div className="text-xl font-bold text-amber-300">
                        {syncResult.mappedTHISSummary.averageCivilityScore}%
                      </div>
                    </div>
                    <div className="p-3 bg-[#0E0E0E] border border-white/10">
                      <div className="text-[10px] uppercase text-white/40">Top Prospects</div>
                      <div className="text-xl font-bold text-purple-400">
                        {syncResult.mappedTHISSummary.topProspectsCount}
                      </div>
                    </div>
                  </div>

                  {/* Synced Candidate Snippets */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-white/60 font-semibold">
                      Synced Candidate Profiles & T.H.I.S. Ratings:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {syncResult.candidates.slice(0, 4).map((cand) => (
                        <div key={cand.id} className="p-3 bg-[#111111] border border-white/10 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">{cand.fullName}</span>
                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                              {cand.evaluation?.civilityScore || 90}% Civility
                            </span>
                          </div>
                          <div className="text-[11px] text-white/50 truncate">{cand.email}</div>
                          <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/60">
                            <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-300">
                              T: {cand.evaluation?.toneScore}%
                            </span>
                            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-300">
                              H: {cand.evaluation?.ethicsScore}%
                            </span>
                            <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-300">
                              I: {cand.evaluation?.pressureScore}%
                            </span>
                            <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-300">
                              S: {cand.evaluation?.driveScore}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#121212]">
          <div className="text-[11px] font-mono text-white/40 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-bit encrypted integration with Google Classroom REST API v1</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 border border-white/20 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors"
            >
              {syncResult ? 'Close & View Ledger' : 'Cancel'}
            </button>

            {accessToken && (
              <button
                type="button"
                id="btn-confirm-classroom-sync"
                disabled={isSyncing || (!selectedCourse && courses.length === 0)}
                onClick={handleStartSync}
                className="flex-1 sm:flex-initial px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing Roster & Scores...</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4" />
                    <span>Sync & Auto-Invite to Ledger</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
