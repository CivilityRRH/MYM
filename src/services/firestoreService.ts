import { collection, doc, setDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-utils';
import { JobRequirement, CandidateProfile, TrainingSessionRecord, CrisisScenarioRecord, LinkedInAuthAccount, LinkedInScoutQuery } from '../types';

const JOBS_COLLECTION = 'job_requirements';
const CANDIDATES_COLLECTION = 'candidates';
const TRAINING_SESSIONS_COLLECTION = 'training_sessions';
const CRISIS_SCENARIOS_COLLECTION = 'crisis_scenarios';
const LINKEDIN_SCOUTS_COLLECTION = 'linkedin_scouts';
const LINKEDIN_QUERIES_COLLECTION = 'linkedin_scout_queries';

export const subscribeToJobRequirements = (
  onSuccess: (jobs: JobRequirement[]) => void,
  onError?: (err: Error) => void
) => {
  const q = query(collection(db, JOBS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const jobs: JobRequirement[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        jobs.push({
          ...data,
          id: docSnap.id
        } as JobRequirement);
      });
      onSuccess(jobs);
    },
    (error) => {
      console.error('Firestore jobs subscription error:', error);
      if (onError) onError(error);
    }
  );
};

export const subscribeToCandidateProfiles = (
  onSuccess: (candidates: CandidateProfile[]) => void,
  onError?: (err: Error) => void
) => {
  const q = query(collection(db, CANDIDATES_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const candidates: CandidateProfile[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        candidates.push({
          ...data,
          id: docSnap.id
        } as CandidateProfile);
      });
      onSuccess(candidates);
    },
    (error) => {
      console.error('Firestore candidates subscription error:', error);
      if (onError) onError(error);
    }
  );
};

export const subscribeToTrainingSessions = (
  onSuccess: (sessions: TrainingSessionRecord[]) => void,
  onError?: (err: Error) => void
) => {
  const q = query(collection(db, TRAINING_SESSIONS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const sessions: TrainingSessionRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        sessions.push({
          ...data,
          id: docSnap.id
        } as TrainingSessionRecord);
      });
      onSuccess(sessions);
    },
    (error) => {
      console.error('Firestore training sessions subscription error:', error);
      if (onError) onError(error);
    }
  );
};

export const subscribeToCrisisScenarios = (
  onSuccess: (scenarios: CrisisScenarioRecord[]) => void,
  onError?: (err: Error) => void
) => {
  const q = query(collection(db, CRISIS_SCENARIOS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const scenarios: CrisisScenarioRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        scenarios.push({
          ...data,
          id: docSnap.id
        } as CrisisScenarioRecord);
      });
      onSuccess(scenarios);
    },
    (error) => {
      console.error('Firestore crisis scenarios subscription error:', error);
      if (onError) onError(error);
    }
  );
};

export function sanitizeFirestoreData<T>(obj: T): T {
  if (obj === undefined) return null as any;
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeFirestoreData) as any;
  }
  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleanObj[key] = sanitizeFirestoreData(value);
    }
  }
  return cleanObj as T;
}

export const saveJobRequirementToFirestore = async (job: JobRequirement): Promise<void> => {
  const docRef = doc(db, JOBS_COLLECTION, job.id);
  try {
    await setDoc(docRef, sanitizeFirestoreData(job), { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `/${JOBS_COLLECTION}/${job.id}`, auth.currentUser);
  }
};

export const deleteJobRequirementFromFirestore = async (jobId: string): Promise<void> => {
  const docRef = doc(db, JOBS_COLLECTION, jobId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `/${JOBS_COLLECTION}/${jobId}`, auth.currentUser);
  }
};

export const saveCandidateProfileToFirestore = async (candidate: CandidateProfile): Promise<void> => {
  const docRef = doc(db, CANDIDATES_COLLECTION, candidate.id);
  try {
    await setDoc(docRef, sanitizeFirestoreData(candidate), { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `/${CANDIDATES_COLLECTION}/${candidate.id}`, auth.currentUser);
  }
};

export const updateCandidateStatusInFirestore = async (
  candidateId: string,
  status: CandidateProfile['status']
): Promise<void> => {
  const docRef = doc(db, CANDIDATES_COLLECTION, candidateId);
  try {
    await setDoc(docRef, sanitizeFirestoreData({ status }), { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `/${CANDIDATES_COLLECTION}/${candidateId}`, auth.currentUser);
  }
};

export const deleteCandidateFromFirestore = async (candidateId: string): Promise<void> => {
  const docRef = doc(db, CANDIDATES_COLLECTION, candidateId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `/${CANDIDATES_COLLECTION}/${candidateId}`, auth.currentUser);
  }
};

export const saveTrainingSessionToFirestore = async (session: TrainingSessionRecord): Promise<void> => {
  const docRef = doc(db, TRAINING_SESSIONS_COLLECTION, session.id);
  try {
    await setDoc(docRef, sanitizeFirestoreData(session), { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `/${TRAINING_SESSIONS_COLLECTION}/${session.id}`, auth.currentUser);
  }
};

export const saveCrisisScenarioToFirestore = async (scenario: CrisisScenarioRecord): Promise<void> => {
  const docRef = doc(db, CRISIS_SCENARIOS_COLLECTION, scenario.id);
  try {
    await setDoc(docRef, sanitizeFirestoreData(scenario), { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `/${CRISIS_SCENARIOS_COLLECTION}/${scenario.id}`, auth.currentUser);
  }
};

export const subscribeToLinkedInAuthAccount = (
  scoutId: string = 'default_scout',
  onSuccess: (account: LinkedInAuthAccount | null) => void,
  onError?: (err: Error) => void
) => {
  const docRef = doc(db, LINKEDIN_SCOUTS_COLLECTION, scoutId);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onSuccess({ ...docSnap.data(), id: docSnap.id } as LinkedInAuthAccount);
      } else {
        onSuccess(null);
      }
    },
    (error) => {
      console.error('Firestore LinkedIn Scout Auth subscription error:', error);
      if (onError) onError(error);
    }
  );
};

export const saveLinkedInAuthAccountToFirestore = async (
  account: LinkedInAuthAccount,
  scoutId: string = 'default_scout'
): Promise<void> => {
  const docRef = doc(db, LINKEDIN_SCOUTS_COLLECTION, scoutId);
  try {
    await setDoc(docRef, sanitizeFirestoreData(account), { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `/${LINKEDIN_SCOUTS_COLLECTION}/${scoutId}`, auth.currentUser);
  }
};

export const subscribeToLinkedInScoutQueries = (
  onSuccess: (queries: LinkedInScoutQuery[]) => void,
  onError?: (err: Error) => void
) => {
  const q = query(collection(db, LINKEDIN_QUERIES_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const queriesList: LinkedInScoutQuery[] = [];
      snapshot.forEach((docSnap) => {
        queriesList.push({
          ...docSnap.data(),
          id: docSnap.id
        } as LinkedInScoutQuery);
      });
      queriesList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      onSuccess(queriesList);
    },
    (error) => {
      console.error('Firestore LinkedIn Scout queries subscription error:', error);
      if (onError) onError(error);
    }
  );
};

export const saveLinkedInScoutQueryToFirestore = async (
  queryRecord: LinkedInScoutQuery
): Promise<void> => {
  const docRef = doc(db, LINKEDIN_QUERIES_COLLECTION, queryRecord.id);
  try {
    await setDoc(docRef, sanitizeFirestoreData(queryRecord), { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `/${LINKEDIN_QUERIES_COLLECTION}/${queryRecord.id}`, auth.currentUser);
  }
};


