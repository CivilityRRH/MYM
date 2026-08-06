import React, { useState, useEffect } from 'react';
import { CandidateProfile } from '../types';
import { getGoogleTasks, createGoogleTask, updateGoogleTaskStatus, deleteGoogleTask, GoogleTask } from '../services/googleTasksService';
import { CheckSquare, Plus, Trash2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface GoogleTasksManagerProps {
  candidates: CandidateProfile[];
  accessToken: string | null;
  onLoginClick: () => void;
}

export const GoogleTasksManager: React.FC<GoogleTasksManagerProps> = ({
  candidates,
  accessToken,
  onLoginClick,
}) => {
  const [tasks, setTasks] = useState<GoogleTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New task inputs
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskNotes, setTaskNotes] = useState<string>('');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.id || '');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Confirmation modal state for deletion
  const [taskToDelete, setTaskToDelete] = useState<GoogleTask | null>(null);

  const fetchTasks = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError(null);
    try {
      const fetched = await getGoogleTasks(accessToken);
      setTasks(fetched);
    } catch (err: any) {
      console.error('Error fetching Google Tasks:', err);
      setError(err?.message || 'Failed to load Google Tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchTasks();
    }
  }, [accessToken]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      onLoginClick();
      return;
    }

    if (!taskTitle.trim()) return;

    setIsCreating(true);
    setError(null);

    try {
      const targetCandidate = candidates.find((c) => c.id === selectedCandidateId);
      const fullNotes = targetCandidate
        ? `Candidate: ${targetCandidate.fullName} (${targetCandidate.currentRole})\n${taskNotes}`
        : taskNotes;

      const created = await createGoogleTask(accessToken, taskTitle, fullNotes);
      setTasks((prev) => [created, ...prev]);
      setTaskTitle('');
      setTaskNotes('');
    } catch (err: any) {
      console.error('Error creating task:', err);
      setError(err?.message || 'Failed to create Google Task');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (task: GoogleTask) => {
    if (!accessToken) return;

    const newStatus = task.status === 'completed' ? 'needsAction' : 'completed';
    try {
      const updated = await updateGoogleTaskStatus(accessToken, task.id, newStatus);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err: any) {
      console.error('Error updating task status:', err);
      setError(err?.message || 'Failed to update Google Task');
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!accessToken || !taskToDelete) return;

    try {
      await deleteGoogleTask(accessToken, taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    } catch (err: any) {
      console.error('Error deleting task:', err);
      setError(err?.message || 'Failed to delete task');
    }
  };

  return (
    <div className="bg-[#121212] border border-white/10 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="border border-blue-500/30 bg-blue-500/10 text-blue-300 text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5">
              Google Tasks API Sync
            </span>
            <span className="text-white/40 text-xs font-mono">• Hiring Task Management</span>
          </div>
          <h2 className="font-serif italic text-2xl text-white mt-1">Autonomous Hiring Tasks</h2>
          <p className="text-xs text-white/60 mt-1 font-sans">
            Schedule candidate review follow-ups, interview tasks, and ethics checks directly synchronized to your Google Tasks account.
          </p>
        </div>

        {!accessToken ? (
          <button
            onClick={onLoginClick}
            className="bg-white text-black hover:bg-white/90 text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2 self-start"
          >
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <span>Connect Google Tasks Workspace</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 self-start">
            <CheckCircle2 className="w-4 h-4" />
            <span>Google Tasks API Authorized</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Task Creation Form */}
      <form onSubmit={handleCreateTask} className="bg-[#0A0A0A] p-5 border border-white/10 space-y-4">
        <h3 className="font-serif italic text-lg text-white">Create New Hiring Task</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">
              Task Title:
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Conduct Ethics & Manners Review for Top Prospect"
              className="w-full py-2 px-3 bg-[#121212] border border-white/20 text-white text-xs font-sans focus:border-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">
              Associate Candidate:
            </label>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="w-full py-2 px-3 bg-[#121212] border border-white/20 text-white text-xs font-mono focus:border-white focus:outline-none"
            >
              {candidates.map((cand) => (
                <option key={cand.id} value={cand.id}>
                  {cand.fullName} ({cand.currentRole})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">
            Task Notes / Checklist:
          </label>
          <textarea
            value={taskNotes}
            onChange={(e) => setTaskNotes(e.target.value)}
            rows={2}
            placeholder="Add specific follow-up items or interview notes..."
            className="w-full py-2 px-3 bg-[#121212] border border-white/20 text-white text-xs font-sans focus:border-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isCreating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>{isCreating ? 'Creating Google Task...' : 'Add Task to Google Workspace'}</span>
        </button>
      </form>

      {/* Task List Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-wider text-white/70">
            Synced Google Tasks ({tasks.length})
          </h3>
          {accessToken && (
            <button
              onClick={fetchTasks}
              className="text-white/40 hover:text-white text-xs font-mono flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          )}
        </div>

        {!accessToken ? (
          <div className="text-center py-8 border border-dashed border-white/10 text-white/40 text-xs font-mono">
            Connect your Google Workspace above to view and synchronize your hiring tasks.
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-white/10 text-white/40 text-xs font-mono">
            No active Google Tasks found. Create a task above to sync with Google Tasks.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {tasks.map((task) => {
              const isCompleted = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`p-4 border transition-colors flex items-start justify-between gap-4 ${
                    isCompleted
                      ? 'bg-[#0A0A0A] border-white/5 text-white/40'
                      : 'bg-[#0A0A0A] border-white/10 text-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className={`mt-0.5 p-0.5 border rounded transition-colors ${
                        isCompleted
                          ? 'border-emerald-500 bg-emerald-500 text-black'
                          : 'border-white/30 hover:border-white text-transparent'
                      }`}
                      title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
                    >
                      <CheckSquare className="w-4 h-4" />
                    </button>

                    <div>
                      <h4 className={`text-sm font-semibold ${isCompleted ? 'line-through text-white/50' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      {task.notes && (
                        <p className="text-xs text-white/50 mt-1 font-sans whitespace-pre-wrap">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setTaskToDelete(task)}
                    className="text-white/30 hover:text-rose-400 transition-colors p-1"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Destructive Delete Operation */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] border border-rose-500/40 p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-serif italic text-lg">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Google Task Deletion</span>
            </div>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Are you sure you want to delete task <strong>"{taskToDelete.title}"</strong> from Google Tasks? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs px-4 py-2"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
