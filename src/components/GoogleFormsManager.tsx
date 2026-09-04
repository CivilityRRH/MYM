import React, { useState } from 'react';
import { JobRequirement } from '../types';
import { createGoogleForm, getGoogleFormResponses, GoogleFormResponse } from '../services/googleFormsService';
import { FileText, Plus, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

interface GoogleFormsManagerProps {
  jobRequirements: JobRequirement[];
  accessToken: string | null;
  onLoginClick: () => void;
}

interface SyncedForm {
  id: string;
  formId: string;
  title: string;
  responderUri: string;
  jobId: string;
  jobTitle: string;
  createdAt: string;
}

export const GoogleFormsManager: React.FC<GoogleFormsManagerProps> = ({
  jobRequirements,
  accessToken,
  onLoginClick,
}) => {
  const [syncedForms, setSyncedForms] = useState<SyncedForm[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(jobRequirements[0]?.id || 'custom');
  const [customPositionName, setCustomPositionName] = useState<string>('Custom Position Screening');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFormResponses, setSelectedFormResponses] = useState<{ formId: string; responses: GoogleFormResponse[] } | null>(null);
  const [isLoadingResponses, setIsLoadingResponses] = useState<boolean>(false);
  const [confirmDeleteForm, setConfirmDeleteForm] = useState<SyncedForm | null>(null);

  const handleCreateForm = async () => {
    if (!accessToken) {
      onLoginClick();
      return;
    }

    let roleName = 'Custom Position';
    let ethics = [
      'How do you handle discovering an unpatched security risk when fixing it breaches project deadlines?',
      'Describe how you handle requests to bypass compliance standards.'
    ];
    let etiquette = [
      'When delivering critical audit findings to executives, how do you structure your language to avoid defensiveness?',
      'What protocol do you follow when managing temporary elevated permissions?'
    ];
    let manners = [
      'In high-stress emergency response situations, how do you maintain respectful communication with junior responders?',
      'Describe how you take accountability when an operational oversight originates from your team.'
    ];

    if (selectedJobId !== 'custom') {
      const targetJob = jobRequirements.find((j) => j.id === selectedJobId) || jobRequirements[0];
      if (targetJob) {
        roleName = targetJob.roleName;
        ethics = targetJob.customQuestions.ethics;
        etiquette = targetJob.customQuestions.etiquette;
        manners = targetJob.customQuestions.manners;
      }
    } else {
      roleName = customPositionName.trim() || 'Custom Position';
    }

    setIsCreating(true);
    setError(null);

    try {
      const title = customTitle.trim() || `${roleName} - Autonomous Screening Form`;
      const questions = [
        `FullName (Candidate Name)`,
        `Email Address`,
        ...ethics,
        ...etiquette,
        ...manners,
      ];

      const created = await createGoogleForm(accessToken, title, questions);

      const newFormRecord: SyncedForm = {
        id: `form-rec-${Date.now()}`,
        formId: created.formId,
        title: created.info.title,
        responderUri: created.responderUri || `https://docs.google.com/forms/d/${created.formId}/viewform`,
        jobId: selectedJobId === 'custom' ? `job-custom-${Date.now()}` : selectedJobId,
        jobTitle: roleName,
        createdAt: new Date().toLocaleDateString(),
      };

      setSyncedForms((prev) => [newFormRecord, ...prev]);
      setCustomTitle('');
    } catch (err: any) {
      console.error('Error creating Google Form:', err);
      setError(err?.message || 'Failed to create Google Form. Please verify Google Forms permissions.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleFetchResponses = async (form: SyncedForm) => {
    if (!accessToken) {
      onLoginClick();
      return;
    }

    setIsLoadingResponses(true);
    try {
      const responses = await getGoogleFormResponses(accessToken, form.formId);
      setSelectedFormResponses({ formId: form.formId, responses });
    } catch (err: any) {
      console.error('Error fetching form responses:', err);
      setError(err?.message || 'Failed to fetch form responses');
    } finally {
      setIsLoadingResponses(false);
    }
  };

  const handleDeleteFormConfirmed = () => {
    if (!confirmDeleteForm) return;
    setSyncedForms((prev) => prev.filter((f) => f.id !== confirmDeleteForm.id));
    if (selectedFormResponses?.formId === confirmDeleteForm.formId) {
      setSelectedFormResponses(null);
    }
    setConfirmDeleteForm(null);
  };

  return (
    <div className="bg-[#121212] border border-white/10 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5">
              Google Forms API Workspace
            </span>
            <span className="text-white/40 text-xs font-mono">• Screening Integration</span>
          </div>
          <h2 className="font-serif italic text-2xl text-white mt-1">Autonomous Google Forms Generator</h2>
          <p className="text-xs text-white/60 mt-1 font-sans">
            Instantly create live Google Forms populated with custom job requirement ethics and scenario questions.
          </p>
        </div>

        {!accessToken ? (
          <button
            onClick={onLoginClick}
            className="bg-white text-black hover:bg-white/90 text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2 self-start"
          >
            <FileText className="w-4 h-4 text-purple-600" />
            <span>Connect Google Forms Workspace</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 self-start">
            <CheckCircle2 className="w-4 h-4" />
            <span>Google Forms API Authorized</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Generator Panel */}
      <div className="bg-[#0A0A0A] p-5 border border-white/10 space-y-4">
        <h3 className="font-serif italic text-lg text-white">Generate Screening Form for Role</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">
              Select or Fill In Position:
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full py-2 px-3 bg-[#121212] border border-white/20 text-white text-xs font-mono focus:border-white focus:outline-none"
            >
              {jobRequirements.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.roleName} ({job.locationCity})
                </option>
              ))}
              <option value="custom" className="bg-[#121212] text-amber-300 font-bold">
                + Fill In Custom Position Title...
              </option>
            </select>

            {selectedJobId === 'custom' && (
              <input
                type="text"
                value={customPositionName}
                onChange={(e) => setCustomPositionName(e.target.value)}
                placeholder="Type Position Title..."
                className="w-full mt-2 py-2 px-3 bg-[#121212] border border-amber-400 text-amber-200 text-xs font-mono focus:outline-none placeholder-amber-400/40"
              />
            )}
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">
              Custom Form Title (Optional):
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g., Senior Operations Screening Form"
              className="w-full py-2 px-3 bg-[#121212] border border-white/20 text-white text-xs font-sans focus:border-white focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleCreateForm}
          disabled={isCreating}
          className="bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isCreating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>{isCreating ? 'Creating Google Form...' : 'Generate Google Form'}</span>
        </button>
      </div>

      {/* List of Synced Forms */}
      <div className="space-y-3">
        <h3 className="font-mono text-xs uppercase tracking-wider text-white/70">
          Created Google Forms ({syncedForms.length})
        </h3>

        {syncedForms.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-white/10 text-white/40 text-xs font-mono">
            No Google Forms generated yet. Select a role above to generate your first live Google Form.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {syncedForms.map((form) => (
              <div key={form.id} className="bg-[#0A0A0A] border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-semibold text-white">{form.title}</h4>
                  </div>
                  <p className="text-xs text-white/50 mt-1 font-mono">
                    Position: <strong className="text-white/80">{form.jobTitle}</strong> • Form ID: {form.formId}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={form.responderUri}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/10 hover:bg-white/20 text-white text-xs font-mono px-3 py-1.5 flex items-center gap-1 transition-colors"
                  >
                    <span>Open Form</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleFetchResponses(form)}
                    className="bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-mono px-3 py-1.5 flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingResponses && selectedFormResponses?.formId === form.formId ? 'animate-spin' : ''}`} />
                    <span>View Responses</span>
                  </button>

                  <button
                    onClick={() => setConfirmDeleteForm(form)}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono p-1.5 transition-colors"
                    title="Delete Form Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Responses Modal / View */}
      {selectedFormResponses && (
        <div className="bg-[#050505] border border-purple-500/30 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="font-serif italic text-base text-purple-300">
              Live Responses for Form ({selectedFormResponses.responses.length})
            </h4>
            <button
              onClick={() => setSelectedFormResponses(null)}
              className="text-white/50 hover:text-white text-xs font-mono"
            >
              Close
            </button>
          </div>

          {(selectedFormResponses.responses || []).length === 0 ? (
            <p className="text-xs text-white/50 font-mono py-4">
              No submissions received yet for this Google Form.
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {(selectedFormResponses.responses || []).map((resp, idx) => (
                <div key={resp.responseId || idx} className="bg-[#121212] border border-white/10 p-3 text-xs font-mono text-white/80">
                  <div className="text-purple-400 font-bold mb-1">
                    Response #{idx + 1} • Submitted: {new Date(resp.createTime).toLocaleString()}
                  </div>
                  <pre className="text-[11px] text-white/60 overflow-x-auto whitespace-pre-wrap font-sans">
                    {JSON.stringify(resp.answers || {}, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Destructive Delete Operation */}
      {confirmDeleteForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] border border-rose-500/40 p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-serif italic text-lg">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Google Form Deletion</span>
            </div>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Are you sure you want to remove the form record <strong>"{confirmDeleteForm.title}"</strong>? This will detach the Google Form from this screening session.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteForm(null)}
                className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFormConfirmed}
                className="bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs px-4 py-2"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
