import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  MessageSquare, 
  Share2, 
  UserCheck, 
  Plus, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Send, 
  Building2, 
  MapPin, 
  Award,
  RefreshCw,
  Copy
} from 'lucide-react';
import { RecentHireFeedItem, CandidateProfile } from '../types';
import { saveRecentHireFeedItemToFirestore } from '../services/firestoreService';

interface RecentHiresFeedProps {
  feedItems: RecentHireFeedItem[];
  candidateProfiles?: CandidateProfile[];
  onSelectCandidate?: (candidate: CandidateProfile) => void;
  currentUserRole?: string;
}

export const RecentHiresFeed: React.FC<RecentHiresFeedProps> = ({
  feedItems,
  candidateProfiles = [],
  onSelectCandidate,
  currentUserRole = 'Corporate Recruiter'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCandidateName, setModalCandidateName] = useState('');
  const [modalCandidateRole, setModalCandidateRole] = useState('');
  const [modalPreviousCompany, setModalPreviousCompany] = useState('');
  const [modalLocationCity, setModalLocationCity] = useState('Austin, TX');
  const [modalLinkedinUrl, setModalLinkedinUrl] = useState('');
  const [modalHiredJobTitle, setModalHiredJobTitle] = useState('Senior Operations Lead');
  const [modalCivilityScore, setModalCivilityScore] = useState<number>(96);
  const [modalScoutedBy, setModalScoutedBy] = useState('Outbound Talent Scout');
  const [modalKeyStrength, setModalKeyStrength] = useState('Crisis Resilient Leader • Truest Grade');
  const [modalAnnouncementText, setModalAnnouncementText] = useState('');
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered feed items
  const filteredItems = feedItems.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.candidateName.toLowerCase().includes(q) ||
      item.candidateRole.toLowerCase().includes(q) ||
      item.hiredForJobTitle.toLowerCase().includes(q) ||
      (item.previousCompany && item.previousCompany.toLowerCase().includes(q))
    );
  });

  // Handle Like / Congratulate
  const handleToggleLike = async (item: RecentHireFeedItem) => {
    const currentLikedBy = item.likedByUsers || [];
    const isLiked = currentLikedBy.includes(currentUserRole);
    
    let updatedLikesCount = item.likesCount;
    let updatedLikedBy = [...currentLikedBy];

    if (isLiked) {
      updatedLikesCount = Math.max(0, item.likesCount - 1);
      updatedLikedBy = updatedLikedBy.filter((u) => u !== currentUserRole);
    } else {
      updatedLikesCount = item.likesCount + 1;
      updatedLikedBy.push(currentUserRole);
    }

    const updatedItem: RecentHireFeedItem = {
      ...item,
      likesCount: updatedLikesCount,
      likedByUsers: updatedLikedBy
    };

    try {
      await saveRecentHireFeedItemToFirestore(updatedItem);
      showToast(isLiked ? 'Removed celebration' : '🎉 Congratulated candidate in real-time!');
    } catch (err) {
      console.error('Failed to update likes:', err);
    }
  };

  // Handle Add Comment
  const handleAddComment = async (e: React.FormEvent, item: RecentHireFeedItem) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setIsSubmittingComment(true);
    const newComment = {
      id: `comment-${Date.now()}`,
      authorName: currentUserRole || 'Corporate Recruiter',
      authorRole: 'Talent Acquisition Team',
      text: newCommentText.trim(),
      timestamp: 'Just now'
    };

    const updatedComments = [...(item.comments || []), newComment];
    const updatedItem: RecentHireFeedItem = {
      ...item,
      comments: updatedComments
    };

    try {
      await saveRecentHireFeedItemToFirestore(updatedItem);
      setNewCommentText('');
      showToast('💬 Note posted to live hire feed!');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle Share / Copy Announcement
  const handleShareToLinkedIn = (item: RecentHireFeedItem) => {
    const shareText = `Excited to announce that ${item.candidateName} has been officially hired as ${item.hiredForJobTitle}! Verified via T.H.I.S. Civility Score (${item.civilityScore || 95}% Truest Grade). Welcome to the team! 🚀`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      showToast('📋 Copied celebratory announcement to clipboard!');
    }
  };

  // Submit New Hire Announcement Modal
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalCandidateName.trim() || !modalCandidateRole.trim()) {
      showToast('⚠️ Candidate name and role are required.');
      return;
    }

    const newItem: RecentHireFeedItem = {
      id: `hire-feed-${Date.now()}`,
      candidateName: modalCandidateName.trim(),
      candidateRole: modalCandidateRole.trim(),
      previousCompany: modalPreviousCompany.trim() || 'Scouted Enterprise',
      locationCity: modalLocationCity.trim() || 'Austin, TX',
      linkedinUrl: modalLinkedinUrl.trim() || `https://linkedin.com/in/${modalCandidateName.toLowerCase().replace(/\s+/g, '-')}`,
      hiredDate: new Date().toISOString().split('T')[0],
      civilityScore: modalCivilityScore,
      hiredForJobTitle: modalHiredJobTitle.trim() || modalCandidateRole.trim(),
      scoutedBy: modalScoutedBy,
      keyStrengthBadge: modalKeyStrength.trim() || 'Verified T.H.I.S. Candidate',
      likesCount: 1,
      likedByUsers: [currentUserRole],
      comments: [],
      announcementText: modalAnnouncementText.trim() || `🎉 Official Hire Announcement: ${modalCandidateName} has accepted the role of ${modalHiredJobTitle}!`,
      timestamp: new Date().toISOString()
    };

    try {
      await saveRecentHireFeedItemToFirestore(newItem);
      setIsModalOpen(false);
      setModalCandidateName('');
      setModalCandidateRole('');
      setModalPreviousCompany('');
      setModalAnnouncementText('');
      showToast('🌟 Broadcasted new LinkedIn hire announcement to real-time feed!');
    } catch (err) {
      console.error('Failed to create announcement:', err);
      showToast('⚠️ Error broadcasting new hire announcement.');
    }
  };

  // Sync any candidates marked 'hired' into the feed if not already present
  const handleSyncHiredCandidatesToFeed = async () => {
    const hiredCandidates = candidateProfiles.filter((c) => c.status === 'hired');
    let addedCount = 0;

    for (const cand of hiredCandidates) {
      const exists = feedItems.some((f) => f.candidateId === cand.id || f.candidateName.toLowerCase() === cand.fullName.toLowerCase());
      if (!exists) {
        const newItem: RecentHireFeedItem = {
          id: `hire-feed-sync-${cand.id}`,
          candidateId: cand.id,
          candidateName: cand.fullName,
          candidateRole: cand.currentRole || 'Scouted Specialist',
          previousCompany: cand.currentCompany || 'Previous Enterprise',
          locationCity: cand.locationCity || 'Nationwide',
          linkedinUrl: cand.linkedinUrl || `https://linkedin.com/in/${cand.fullName.toLowerCase().replace(/\s+/g, '-')}`,
          hiredDate: new Date().toISOString().split('T')[0],
          civilityScore: cand.evaluation?.civilityScore || 94,
          hiredForJobTitle: cand.currentRole || 'Senior Team Member',
          scoutedBy: 'Outbound LinkedIn Scout',
          keyStrengthBadge: cand.evaluation?.keyStrengths?.[0] || 'T.H.I.S. Verified Candidate',
          likesCount: 5,
          likedByUsers: ['Recruiter Scout'],
          comments: [
            {
              id: `c-sync-${cand.id}`,
              authorName: 'Talent Scout Team',
              authorRole: 'Automated Sync',
              text: 'Candidate converted from candidate ledger to official verified hire status!',
              timestamp: 'Just now'
            }
          ],
          announcementText: `🎉 Verified Hire Sync: ${cand.fullName} has been officially onboarded! Overall Civility Score: ${cand.evaluation?.civilityScore || 94}%.`,
          timestamp: new Date().toISOString()
        };
        await saveRecentHireFeedItemToFirestore(newItem);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      showToast(`Synced ${addedCount} hired candidates to live social feed!`);
    } else {
      showToast('All hired candidates are already up to date in the live feed!');
    }
  };

  // Calculate statistics
  const avgCivility = Math.round(
    feedItems.reduce((acc, curr) => acc + (curr.civilityScore || 95), 0) / (feedItems.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-sky-950/90 border border-sky-400 text-sky-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fade-in">
          <Sparkles className="w-5 h-5 text-sky-400 animate-pulse" />
          <span className="text-xs font-mono font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Social Feed Header Card */}
      <div className="bg-[#121215] border border-sky-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
                <UserCheck className="w-3.5 h-3.5" />
                Outbound Talent Network
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Firestore Synced
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
              Recent Hires Social Feed
              <Sparkles className="w-5 h-5 text-sky-400" />
            </h2>
            <p className="text-sm text-white/60 max-w-2xl font-sans">
              Real-time updates from scouted candidate profiles, candidate conversions, and verified hires. Like, congratulate, and share candidate milestones across your team.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSyncHiredCandidatesToFeed}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border border-white/15 rounded-xl text-xs font-mono font-medium uppercase tracking-wider flex items-center gap-2 transition-all hover:border-sky-400/40"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>Sync Ledger Hires</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Announce New Hire</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-xs font-mono uppercase text-white/50">Total Recent Hires</div>
            <div className="text-xl font-bold font-mono text-white mt-1">{feedItems.length} Candidates</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-xs font-mono uppercase text-white/50">Avg T.H.I.S. Score</div>
            <div className="text-xl font-bold font-mono text-sky-400 mt-1">{avgCivility}% Truest Grade</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-xs font-mono uppercase text-white/50">Source Network</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">LinkedIn Recruiter</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-xs font-mono uppercase text-white/50">Team Interactions</div>
            <div className="text-xl font-bold font-mono text-purple-300 mt-1">
              {feedItems.reduce((acc, curr) => acc + curr.likesCount + (curr.comments?.length || 0), 0)} Reactions
            </div>
          </div>
        </div>
      </div>

      {/* Search & Feed Filter */}
      <div className="flex items-center justify-between gap-4 bg-[#121215] border border-white/10 rounded-xl p-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recent hires by name, role, or previous company..."
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-sky-400"
          />
        </div>
        <div className="text-xs font-mono text-white/50 pr-2">
          Showing {filteredItems.length} of {feedItems.length} Posts
        </div>
      </div>

      {/* Feed Posts List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-[#121215] border border-white/10 rounded-2xl p-12 text-center space-y-3">
            <UserCheck className="w-10 h-10 text-sky-400/60 mx-auto" />
            <h3 className="text-lg font-semibold text-white">No Recent Hires Found</h3>
            <p className="text-xs text-white/60 max-w-md mx-auto">
              {searchQuery ? 'No posts match your search query.' : 'Click "Announce New Hire" or "Sync Ledger Hires" above to broadcast live LinkedIn hire announcements.'}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isLikedByMe = (item.likedByUsers || []).includes(currentUserRole);
            const isCommentDrawerOpen = activeCommentPostId === item.id;
            const matchingCandidate = candidateProfiles.find(
              (c) => c.id === item.candidateId || c.fullName.toLowerCase() === item.candidateName.toLowerCase()
            );

            return (
              <div
                key={item.id}
                className="bg-[#121215] border border-sky-500/20 hover:border-sky-500/40 rounded-2xl p-6 transition-all duration-200 shadow-lg relative overflow-hidden group"
              >
                {/* Subtle sky background glow on hover */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/10 transition-all" />

                {/* Candidate & Post Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-start gap-3.5">
                    {/* Avatar Badge */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 flex items-center justify-center text-white font-bold text-base shadow-md">
                        {(item.candidateName || 'Candidate').split(' ').map((n) => n[0] || '').join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-sky-500 text-slate-950 p-0.5 rounded-full border-2 border-[#121215]" title="Verified Candidate">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-semibold text-white flex items-center gap-1.5">
                          {item.candidateName}
                          <CheckCircle2 className="w-4 h-4 text-sky-400 fill-sky-400/20" />
                        </h4>
                        
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                          Officially Hired
                        </span>
                      </div>

                      <p className="text-xs text-sky-300 font-mono">
                        {item.hiredForJobTitle}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-white/50 pt-1 flex-wrap">
                        {item.previousCompany && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-white/40" />
                            Prev: {item.previousCompany}
                          </span>
                        )}
                        {item.locationCity && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-white/40" />
                            {item.locationCity}
                          </span>
                        )}
                        <span className="text-white/30">•</span>
                        <span className="text-white/40 font-mono">
                          {item.scoutedBy}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Profile Link */}
                  {item.linkedinUrl && (
                    <a
                      href={item.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/15 hover:bg-sky-500/30 text-sky-300 border border-sky-400/40 rounded-lg text-xs font-mono transition-colors self-start sm:self-center"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Verified Profile</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                    </a>
                  )}
                </div>

                {/* Announcement Content & Civility Highlights */}
                <div className="py-4 space-y-3">
                  <p className="text-sm text-white/90 leading-relaxed font-sans bg-black/30 p-4 rounded-xl border border-white/5">
                    {item.announcementText}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    {item.civilityScore && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-sky-500/10 text-sky-300 border border-sky-400/30">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                        T.H.I.S. Score: {item.civilityScore}/100
                      </span>
                    )}

                    {item.keyStrengthBadge && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
                        <Award className="w-3.5 h-3.5 text-purple-400" />
                        {item.keyStrengthBadge}
                      </span>
                    )}

                    {matchingCandidate && onSelectCandidate && (
                      <button
                        onClick={() => onSelectCandidate(matchingCandidate)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors ml-auto"
                      >
                        <span>View Ledger Record</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Social Actions Row */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleLike(item)}
                      className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                        isLikedByMe
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                          : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLikedByMe ? 'fill-rose-400 text-rose-400' : ''}`} />
                      <span>{isLikedByMe ? 'Congratulated' : 'Congratulate'}</span>
                      <span className="bg-black/40 px-1.5 py-0.2 rounded-md text-[10px] font-mono ml-0.5">
                        {item.likesCount}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPostId(isCommentDrawerOpen ? null : item.id)}
                      className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                        isCommentDrawerOpen
                          ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                          : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10 hover:text-white'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                      <span>Comments</span>
                      <span className="bg-black/40 px-1.5 py-0.2 rounded-md text-[10px] font-mono ml-0.5">
                        {item.comments?.length || 0}
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleShareToLinkedIn(item)}
                    className="px-3 py-1.5 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/40 text-[#70B5F9] border border-[#0A66C2]/40 rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Announcement</span>
                  </button>
                </div>

                {/* Comment Section Drawer */}
                {isCommentDrawerOpen && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3 bg-black/20 p-4 rounded-xl">
                    <h5 className="text-xs font-mono uppercase text-white/60 tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                      Team Congratulatory Notes ({item.comments?.length || 0})
                    </h5>

                    {/* Comment List */}
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {(!item.comments || item.comments.length === 0) ? (
                        <p className="text-xs text-white/40 italic">No notes posted yet. Be the first to congratulate!</p>
                      ) : (
                        item.comments.map((comment) => (
                          <div key={comment.id} className="bg-white/5 border border-white/10 rounded-lg p-2.5 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-sky-300">{comment.authorName}</span>
                              <span className="text-white/40 text-[10px] font-mono">{comment.timestamp}</span>
                            </div>
                            <p className="text-xs text-white/80 font-sans">{comment.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Comment Form */}
                    <form onSubmit={(e) => handleAddComment(e, item)} className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Write a congratulatory note to the team..."
                        className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-sky-400"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingComment || !newCommentText.trim()}
                        className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 transition-all"
                      >
                        <Send className="w-3 h-3" />
                        <span>Post</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Announce New Hire Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-sky-500/30 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-400" />
                Broadcast New Hire Announcement
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/50 hover:text-white text-xs font-mono uppercase px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-white/70 mb-1">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  value={modalCandidateName}
                  onChange={(e) => setModalCandidateName(e.target.value)}
                  placeholder="e.g., Sarah Connor"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Hired Position Title *</label>
                  <input
                    type="text"
                    required
                    value={modalCandidateRole}
                    onChange={(e) => setModalCandidateRole(e.target.value)}
                    placeholder="e.g., Senior Security Engineer"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Previous Enterprise</label>
                  <input
                    type="text"
                    value={modalPreviousCompany}
                    onChange={(e) => setModalPreviousCompany(e.target.value)}
                    placeholder="e.g., The Future Corp."
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Location City</label>
                  <input
                    type="text"
                    value={modalLocationCity}
                    onChange={(e) => setModalLocationCity(e.target.value)}
                    placeholder="e.g., Austin, TX"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">T.H.I.S. Score (80 - 100)</label>
                  <input
                    type="number"
                    min={80}
                    max={100}
                    value={modalCivilityScore}
                    onChange={(e) => setModalCivilityScore(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/70 mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={modalLinkedinUrl}
                  onChange={(e) => setModalLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/candidate-profile"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-white/70 mb-1">Announcement Message *</label>
                <textarea
                  required
                  rows={3}
                  value={modalAnnouncementText}
                  onChange={(e) => setModalAnnouncementText(e.target.value)}
                  placeholder="e.g., 🎉 Thrilled to announce that Sarah Connor has joined our cybersecurity team after passing live crisis de-escalation drills with 98% honors!"
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Broadcast Announcement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
