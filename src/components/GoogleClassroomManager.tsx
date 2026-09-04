import React, { useState, useEffect } from 'react';
import { JobRequirement, CandidateProfile, EmployeeJourneyRecord } from '../types';
import {
  ClassroomCourse,
  ClassroomCourseWork,
  ClassroomAnnouncement,
  ClassroomStudent,
  listClassroomCourses,
  createClassroomCourse,
  listCourseWork,
  createCourseWork,
  createAnnouncement,
  listAnnouncements,
  listCourseStudents,
} from '../services/googleClassroomService';
import {
  GraduationCap,
  Plus,
  BookOpen,
  Send,
  Users,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  Award,
  Layers,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

interface GoogleClassroomManagerProps {
  jobRequirements: JobRequirement[];
  candidates?: CandidateProfile[];
  employeeJourneys?: EmployeeJourneyRecord[];
  accessToken: string | null;
  onLoginClick: () => void;
  onOpenClassroomSync?: () => void;
}

export const GoogleClassroomManager: React.FC<GoogleClassroomManagerProps> = ({
  jobRequirements,
  candidates = [],
  employeeJourneys = [],
  accessToken,
  onLoginClick,
  onOpenClassroomSync,
}) => {
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ClassroomCourse | null>(null);
  const [courseWorkList, setCourseWorkList] = useState<ClassroomCourseWork[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<ClassroomAnnouncement[]>([]);
  const [studentsList, setStudentsList] = useState<ClassroomStudent[]>([]);

  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'coursework' | 'announcements' | 'roster' | 'create-course' | 'quick-publish'>('coursework');
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New Course Form State
  const [newCourseName, setNewCourseName] = useState<string>('Mind Your Manners: Executive Etiquette & Civility Mastery');
  const [newCourseSection, setNewCourseSection] = useState<string>('2026 Cohort - Executive Leadership');
  const [newCourseHeading, setNewCourseHeading] = useState<string>('Workplace Demeanor, Crisis De-escalation & Ethics');
  const [newCourseDesc, setNewCourseDesc] = useState<string>(
    'Comprehensive corporate syllabus covering vocal calm during outages, ethical compliance escalation, polite peer collaboration, and customer diplomacy.'
  );
  const [isCreatingCourse, setIsCreatingCourse] = useState<boolean>(false);

  // New Assignment Form State
  const [newAssignmentTitle, setNewAssignmentTitle] = useState<string>('Simulation: Handling Critical Production Outages Under Pressure');
  const [newAssignmentDesc, setNewAssignmentDesc] = useState<string>(
    'Access the Mind Your Manners Crisis Chamber. Record your 60-second video response addressing cross-functional stakeholders when a severe incident delays the quarterly release.'
  );
  const [newAssignmentPoints, setNewAssignmentPoints] = useState<number>(100);
  const [selectedCurriculumPreset, setSelectedCurriculumPreset] = useState<string>('crisis-chamber');
  const [isPublishingAssignment, setIsPublishingAssignment] = useState<boolean>(false);

  // New Announcement Form State
  const [announcementText, setAnnouncementText] = useState<string>(
    'Welcome to the Civility & Workplace Etiquette Cohort. Please complete the Initial Demeanor Calibration Assignment before Friday.'
  );
  const [isPostingAnnouncement, setIsPostingAnnouncement] = useState<boolean>(false);

  // Fetch courses when accessToken is available
  useEffect(() => {
    if (accessToken) {
      loadCourses();
    }
  }, [accessToken]);

  // Load details when selectedCourse changes
  useEffect(() => {
    if (accessToken && selectedCourse) {
      loadCourseDetails(selectedCourse.id);
    }
  }, [selectedCourse, accessToken]);

  const loadCourses = async () => {
    if (!accessToken) return;
    setIsLoadingCourses(true);
    setError(null);
    try {
      const data = await listClassroomCourses(accessToken);
      setCourses(data);
      if (data.length > 0 && !selectedCourse) {
        setSelectedCourse(data[0]);
      }
    } catch (err: any) {
      console.error('Failed to load Classroom courses:', err);
      setError(err.message || 'Failed to load Google Classroom courses. Please re-authenticate.');
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const loadCourseDetails = async (courseId: string) => {
    if (!accessToken) return;
    setIsLoadingDetails(true);
    setError(null);
    try {
      const [cw, ann, st] = await Promise.all([
        listCourseWork(accessToken, courseId).catch(() => []),
        listAnnouncements(accessToken, courseId).catch(() => []),
        listCourseStudents(accessToken, courseId).catch(() => []),
      ]);
      setCourseWorkList(cw);
      setAnnouncementsList(ann);
      setStudentsList(st);
    } catch (err: any) {
      console.error('Failed to load course details:', err);
      setError(err.message || 'Error fetching course details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      onLoginClick();
      return;
    }
    if (!newCourseName.trim()) {
      setError('Course name is required');
      return;
    }

    setIsCreatingCourse(true);
    setError(null);
    try {
      const created = await createClassroomCourse(
        accessToken,
        newCourseName.trim(),
        newCourseSection.trim(),
        newCourseHeading.trim(),
        newCourseDesc.trim()
      );
      setCourses((prev) => [created, ...prev]);
      setSelectedCourse(created);
      setActiveSubTab('coursework');
      setSuccessToast(`Classroom course "${created.name}" created successfully!`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      console.error('Failed to create classroom course:', err);
      setError(err.message || 'Failed to create course in Google Classroom.');
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const handlePublishAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !selectedCourse) return;
    if (!newAssignmentTitle.trim()) {
      setError('Assignment title is required');
      return;
    }

    setIsPublishingAssignment(true);
    setError(null);
    try {
      const appUrl = window.location.origin;
      const created = await createCourseWork(
        accessToken,
        selectedCourse.id,
        newAssignmentTitle.trim(),
        newAssignmentDesc.trim(),
        newAssignmentPoints,
        appUrl
      );
      setCourseWorkList((prev) => [created, ...prev]);
      setSuccessToast(`Assignment "${created.title}" published to Google Classroom!`);
      setTimeout(() => setSuccessToast(null), 4000);
      setNewAssignmentTitle('');
      setNewAssignmentDesc('');
    } catch (err: any) {
      console.error('Failed to publish assignment:', err);
      setError(err.message || 'Failed to publish coursework assignment.');
    } finally {
      setIsPublishingAssignment(false);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !selectedCourse) return;
    if (!announcementText.trim()) return;

    setIsPostingAnnouncement(true);
    setError(null);
    try {
      const appUrl = window.location.origin;
      const created = await createAnnouncement(
        accessToken,
        selectedCourse.id,
        announcementText.trim(),
        appUrl
      );
      setAnnouncementsList((prev) => [created, ...prev]);
      setSuccessToast('Announcement posted to Google Classroom stream!');
      setTimeout(() => setSuccessToast(null), 4000);
      setAnnouncementText('');
    } catch (err: any) {
      console.error('Failed to post announcement:', err);
      setError(err.message || 'Failed to post announcement.');
    } finally {
      setIsPostingAnnouncement(false);
    }
  };

  const handleApplyCurriculumPreset = (presetKey: string) => {
    setSelectedCurriculumPreset(presetKey);
    if (presetKey === 'crisis-chamber') {
      setNewAssignmentTitle('Crisis Chamber: High-Pressure Outage Communication');
      setNewAssignmentDesc(
        'Launch the Mind Your Manners Crisis Simulator. Record your video response explaining an outage delay to an upset client with extreme vocal composure, non-defensive empathy, and clear remediation action steps.'
      );
      setNewAssignmentPoints(100);
    } else if (presetKey === 'tone-calibration') {
      setNewAssignmentTitle('Vocal Demeanor & Pitch Calibration Lab');
      setNewAssignmentDesc(
        'Submit a 45-second audio sample delivering constructive performance feedback to a direct report. Maintain steady pitch, eliminate passive-aggressive inflection, and affirm peer respect.'
      );
      setNewAssignmentPoints(50);
    } else if (presetKey === 'ethics-compliance') {
      setNewAssignmentTitle('Ethics Escalation: Bypassing Protocol Dilemma');
      setNewAssignmentDesc(
        'Analyze the corporate ethics prompt: A senior director asks you to quietly approve a non-compliant deployment before a quarterly audit. Detail your step-by-step reporting protocol.'
      );
      setNewAssignmentPoints(100);
    } else if (presetKey === 'workplace-manners') {
      setNewAssignmentTitle('Modern Workplace Etiquette & Asynchronous Respect');
      setNewAssignmentDesc(
        'Review standard practices for respectful Slack/Email communication across distributed global timezones. Submit your revision of three poorly phrased executive escalations.'
      );
      setNewAssignmentPoints(75);
    }
  };

  if (!accessToken) {
    return (
      <div className="bg-[#0D0D0D] border border-white/10 p-8 sm:p-12 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div className="max-w-xl mx-auto space-y-2">
          <h3 className="font-serif italic text-2xl text-white">Google Classroom LMS Integration</h3>
          <p className="text-xs text-white/60 font-sans leading-relaxed">
            Synchronize your Mind Your Manners civility curriculum, crisis simulation assignments, and employee cohort scorecards directly into Google Classroom.
          </p>
        </div>
        <div className="flex justify-center">
          <button
            id="btn-google-classroom-connect"
            type="button"
            onClick={onLoginClick}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold uppercase tracking-wider text-xs rounded-full transition-all flex items-center gap-2 shadow-lg hover:scale-105 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Connect Google Classroom Account</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-white/10 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif italic text-2xl text-white">Google Classroom Civility Hub</h3>
              <span className="text-[10px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 uppercase tracking-wider">
                Active OAuth Connected
              </span>
            </div>
            <p className="text-xs text-white/60 font-sans mt-0.5">
              Publish workplace etiquette assignments, manage student cohorts, and broadcast leadership announcements.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {onOpenClassroomSync && (
            <button
              id="btn-classroom-sync-modal-trigger"
              type="button"
              onClick={onOpenClassroomSync}
              className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Sync course roster and map assignment scores to T.H.I.S. criteria"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sync with Candidate Ledger (T.H.I.S.)</span>
            </button>
          )}
          <button
            id="btn-refresh-classroom"
            type="button"
            onClick={loadCourses}
            disabled={isLoadingCourses}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCourses ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            id="btn-new-course-tab"
            type="button"
            onClick={() => setActiveSubTab('create-course')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 rounded-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successToast && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Course Selector & Active Course Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Course Selector & Quick Stats */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#121212] border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Your Classroom Courses ({courses.length})
              </h4>
            </div>

            {isLoadingCourses ? (
              <div className="py-8 text-center text-xs font-mono text-white/40">Loading courses...</div>
            ) : courses.length === 0 ? (
              <div className="p-6 bg-[#0A0A0A] border border-white/5 text-center space-y-2">
                <p className="text-xs text-white/60 font-sans">No Google Classroom courses found.</p>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('create-course')}
                  className="text-xs font-mono text-emerald-400 hover:underline uppercase"
                >
                  + Create your first course
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {courses.map((course) => {
                  const isSelected = selectedCourse?.id === course.id;
                  return (
                    <div
                      key={course.id}
                      onClick={() => {
                        setSelectedCourse(course);
                        if (activeSubTab === 'create-course') setActiveSubTab('coursework');
                      }}
                      className={`p-3 border transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-400/60 text-white'
                          : 'bg-[#0A0A0A] border-white/10 hover:border-white/30 text-white/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold font-sans line-clamp-1 text-white">{course.name}</span>
                        {course.enrollmentCode && (
                          <span className="text-[9px] font-mono bg-white/10 px-1.5 py-0.5 text-white/60 flex-shrink-0">
                            Code: {course.enrollmentCode}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-white/50 flex items-center justify-between">
                        <span>{course.section || 'All Cohorts'}</span>
                        <span className="text-emerald-400">{course.courseState || 'ACTIVE'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Publish Civility Presets Card */}
          <div className="bg-[#121212] border border-white/10 p-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Fast Curriculum Modules
            </h4>
            <p className="text-[11px] text-white/60 font-sans">
              Select an autonomous training template to populate assignments instantly:
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'crisis-chamber', name: 'Crisis Chamber Simulation', tag: 'High Pressure' },
                { id: 'tone-calibration', name: 'Vocal Demeanor Calibration', tag: 'Vocal AI' },
                { id: 'ethics-compliance', name: 'Compliance Escalation Protocol', tag: 'Ethics' },
                { id: 'workplace-manners', name: 'Modern Workplace Etiquette', tag: 'Collaboration' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    handleApplyCurriculumPreset(preset.id);
                    setActiveSubTab('coursework');
                  }}
                  className={`w-full p-2 text-left border text-xs flex items-center justify-between transition-all cursor-pointer ${
                    selectedCurriculumPreset === preset.id
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                      : 'bg-[#0A0A0A] border-white/10 hover:border-white/20 text-white/70'
                  }`}
                >
                  <span className="font-medium font-sans">{preset.name}</span>
                  <span className="text-[9px] font-mono bg-white/10 px-1.5 py-0.5 text-emerald-300">
                    {preset.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Course Management & Tabs */}
        <div className="lg:col-span-8 space-y-4">
          {activeSubTab === 'create-course' ? (
            <div className="bg-[#121212] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h4 className="font-serif italic text-xl text-white">Create New Google Classroom Course</h4>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('coursework')}
                  className="text-xs font-mono text-white/50 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block font-mono uppercase text-white/60 mb-1 text-[11px]">Course Name *</label>
                  <input
                    type="text"
                    required
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="e.g. Mind Your Manners: Executive Etiquette & Civility Mastery"
                    className="w-full bg-[#0A0A0A] border border-white/20 p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono uppercase text-white/60 mb-1 text-[11px]">Section / Cohort</label>
                    <input
                      type="text"
                      value={newCourseSection}
                      onChange={(e) => setNewCourseSection(e.target.value)}
                      placeholder="e.g. Q3 New Hire Onboarding"
                      className="w-full bg-[#0A0A0A] border border-white/20 p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-mono uppercase text-white/60 mb-1 text-[11px]">Heading / Topic</label>
                    <input
                      type="text"
                      value={newCourseHeading}
                      onChange={(e) => setNewCourseHeading(e.target.value)}
                      placeholder="e.g. Corporate Etiquette & Crisis Response"
                      className="w-full bg-[#0A0A0A] border border-white/20 p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono uppercase text-white/60 mb-1 text-[11px]">Course Syllabus & Description</label>
                  <textarea
                    rows={3}
                    value={newCourseDesc}
                    onChange={(e) => setNewCourseDesc(e.target.value)}
                    placeholder="Describe the modules, expectations, and goals of this training course..."
                    className="w-full bg-[#0A0A0A] border border-white/20 p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('coursework')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingCourse}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase flex items-center gap-2 cursor-pointer"
                  >
                    {isCreatingCourse ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>Publish Course to Google Classroom</span>
                  </button>
                </div>
              </form>
            </div>
          ) : selectedCourse ? (
            <div className="bg-[#121212] border border-white/10 overflow-hidden">
              {/* Selected Course Banner */}
              <div className="bg-[#161616] p-5 border-b border-white/10 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                      Course ID: {selectedCourse.id}
                    </span>
                    <h3 className="text-lg font-bold text-white font-sans">{selectedCourse.name}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedCourse.alternateLink && (
                      <a
                        href={selectedCourse.alternateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono flex items-center gap-1.5 border border-white/20 transition-all"
                      >
                        <ExternalLink className="w-3 h-3 text-emerald-400" />
                        <span>Open in Google Classroom</span>
                      </a>
                    )}
                  </div>
                </div>

                {selectedCourse.description && (
                  <p className="text-xs text-white/60 font-sans line-clamp-2">{selectedCourse.description}</p>
                )}
              </div>

              {/* Sub Navigation for Course */}
              <div className="border-b border-white/10 px-4 bg-[#0E0E0E] flex space-x-6 text-xs font-mono uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('coursework')}
                  className={`py-3 border-b-2 flex items-center gap-1.5 transition-all ${
                    activeSubTab === 'coursework'
                      ? 'border-emerald-400 text-emerald-300 font-bold'
                      : 'border-transparent text-white/50 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Assignments ({courseWorkList.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('announcements')}
                  className={`py-3 border-b-2 flex items-center gap-1.5 transition-all ${
                    activeSubTab === 'announcements'
                      ? 'border-emerald-400 text-emerald-300 font-bold'
                      : 'border-transparent text-white/50 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Stream / Announcements ({announcementsList.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('roster')}
                  className={`py-3 border-b-2 flex items-center gap-1.5 transition-all ${
                    activeSubTab === 'roster'
                      ? 'border-emerald-400 text-emerald-300 font-bold'
                      : 'border-transparent text-white/50 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Class Roster ({studentsList.length})</span>
                </button>
              </div>

              {/* Course Tab Contents */}
              <div className="p-6 space-y-6">
                {/* 1. Assignments Tab */}
                {activeSubTab === 'coursework' && (
                  <div className="space-y-6">
                    {/* Assignment Publisher Form */}
                    <div className="bg-[#0A0A0A] border border-white/10 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5" /> Publish New CourseWork Assignment
                        </h4>
                        <span className="text-[10px] font-mono text-white/40">Directly syncs to students' Google Classroom</span>
                      </div>

                      <form onSubmit={handlePublishAssignment} className="space-y-3 font-sans text-xs">
                        <div>
                          <label className="block font-mono uppercase text-white/60 mb-1 text-[10px]">Assignment Title *</label>
                          <input
                            type="text"
                            required
                            value={newAssignmentTitle}
                            onChange={(e) => setNewAssignmentTitle(e.target.value)}
                            placeholder="e.g. Crisis Chamber: Escalation & Vocal Demeanor"
                            className="w-full bg-[#141414] border border-white/20 p-2 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-mono uppercase text-white/60 mb-1 text-[10px]">Max Points</label>
                            <input
                              type="number"
                              value={newAssignmentPoints}
                              onChange={(e) => setNewAssignmentPoints(Number(e.target.value))}
                              className="w-full bg-[#141414] border border-white/20 p-2 text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block font-mono uppercase text-white/60 mb-1 text-[10px]">Attached Interactive Link</label>
                            <input
                              type="text"
                              disabled
                              value={window.location.origin}
                              className="w-full bg-[#141414] border border-white/10 p-2 text-white/50 font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono uppercase text-white/60 mb-1 text-[10px]">Instructions & Grading Rubric</label>
                          <textarea
                            rows={2}
                            value={newAssignmentDesc}
                            onChange={(e) => setNewAssignmentDesc(e.target.value)}
                            placeholder="Provide steps for the students to complete their assessment..."
                            className="w-full bg-[#141414] border border-white/20 p-2 text-white focus:outline-none"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isPublishingAssignment}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                          >
                            {isPublishingAssignment ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            <span>Publish Assignment</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* List of Published Assignments */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                        Published CourseWork Items ({courseWorkList.length})
                      </h4>

                      {isLoadingDetails ? (
                        <div className="py-6 text-center text-xs font-mono text-white/40">Loading assignments...</div>
                      ) : courseWorkList.length === 0 ? (
                        <div className="p-6 bg-[#0A0A0A] border border-white/5 text-center text-xs font-mono text-white/50">
                          No coursework published in this Google Classroom course yet.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {courseWorkList.map((item) => (
                            <div key={item.id} className="bg-[#0A0A0A] border border-white/10 p-4 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-white font-sans">{item.title}</span>
                                  {item.description && (
                                    <p className="text-[11px] text-white/60 font-sans">{item.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 border border-emerald-500/30">
                                    {item.maxPoints || 100} Pts
                                  </span>
                                  {item.alternateLink && (
                                    <a
                                      href={item.alternateLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-white/40 hover:text-white p-1"
                                      title="Open in Google Classroom"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Announcements Tab */}
                {activeSubTab === 'announcements' && (
                  <div className="space-y-6">
                    {/* Announcement Form */}
                    <div className="bg-[#0A0A0A] border border-white/10 p-5 space-y-3 font-sans text-xs">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Post Announcement to Stream
                      </h4>
                      <textarea
                        rows={2}
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        placeholder="Share an update or reminder with your classroom cohort..."
                        className="w-full bg-[#141414] border border-white/20 p-2.5 text-white focus:outline-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handlePostAnnouncement}
                          disabled={isPostingAnnouncement || !announcementText.trim()}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {isPostingAnnouncement ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                          <span>Post to Stream</span>
                        </button>
                      </div>
                    </div>

                    {/* Announcement Feed */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                        Stream Announcements ({announcementsList.length})
                      </h4>

                      {announcementsList.length === 0 ? (
                        <div className="p-6 bg-[#0A0A0A] border border-white/5 text-center text-xs font-mono text-white/50">
                          No stream announcements posted yet.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {announcementsList.map((ann) => (
                            <div key={ann.id} className="bg-[#0A0A0A] border border-white/10 p-4 space-y-1">
                              <p className="text-xs text-white font-sans whitespace-pre-wrap">{ann.text}</p>
                              <div className="text-[10px] font-mono text-white/40 flex items-center justify-between pt-2 border-t border-white/5">
                                <span>{ann.creationTime ? new Date(ann.creationTime).toLocaleDateString() : 'Recent'}</span>
                                {ann.alternateLink && (
                                  <a
                                    href={ann.alternateLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 hover:underline flex items-center gap-1"
                                  >
                                    <span>View Post</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Class Roster Tab */}
                {activeSubTab === 'roster' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0A0A0A] p-3 border border-white/10">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                          Enrolled Students ({studentsList.length})
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedCourse.enrollmentCode && (
                          <div className="text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2.5 py-1">
                            Invite Code: <strong className="text-white">{selectedCourse.enrollmentCode}</strong>
                          </div>
                        )}

                        {onOpenClassroomSync && (
                          <button
                            type="button"
                            onClick={onOpenClassroomSync}
                            className="px-3 py-1 bg-emerald-400 hover:bg-emerald-300 text-black font-mono font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Sync Roster to Ledger</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {studentsList.length === 0 ? (
                      <div className="p-8 bg-[#0A0A0A] border border-white/10 text-center space-y-3 font-sans">
                        <Users className="w-8 h-8 text-white/30 mx-auto" />
                        <p className="text-xs text-white/70">No students enrolled directly yet.</p>
                        <p className="text-[11px] text-white/40">
                          Share your course enrollment code <strong className="text-white font-mono">{selectedCourse.enrollmentCode || 'N/A'}</strong> with your candidate cohort or new hires to enroll them into this Google Classroom.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {studentsList.map((student) => (
                          <div key={student.userId} className="bg-[#0A0A0A] border border-white/10 p-3 flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300">
                              {student.profile?.name?.fullName?.charAt(0) || 'S'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-white truncate">
                                {student.profile?.name?.fullName || 'Enrolled Student'}
                              </div>
                              <div className="text-[10px] text-white/50 truncate font-mono">
                                {student.profile?.emailAddress || student.userId}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-[#121212] border border-white/10 text-center space-y-2 text-white/50 font-mono text-xs">
              Select or create a Google Classroom course on the left to manage coursework and stream announcements.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
