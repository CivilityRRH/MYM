import { collection, doc, setDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-utils';
import {
  JobRequirement,
  CandidateProfile,
  TrainingSessionRecord,
  CrisisScenarioRecord,
  LinkedInAuthAccount,
  LinkedInScoutQuery,
  EmployeeJourneyRecord,
  RecentHireFeedItem,
  CompanyJobAd,
  AdApplication,
  CommissionInvoiceRecord
} from '../types';

const JOBS_COLLECTION = 'job_requirements';
const CANDIDATES_COLLECTION = 'candidates';
const TRAINING_SESSIONS_COLLECTION = 'training_sessions';
const CRISIS_SCENARIOS_COLLECTION = 'crisis_scenarios';
const LINKEDIN_SCOUTS_COLLECTION = 'linkedin_scouts';
const LINKEDIN_QUERIES_COLLECTION = 'linkedin_scout_queries';
const EMPLOYEE_JOURNEYS_COLLECTION = 'employee_journeys';
const RECENT_HIRES_COLLECTION = 'recent_hires_feed';
const COMPANY_ADS_COLLECTION = 'company_job_ads';
const AD_APPLICATIONS_COLLECTION = 'ad_applications';
const COMMISSION_INVOICES_COLLECTION = 'commission_invoices';

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
      try {
        handleFirestoreError(error, OperationType.GET, `/${JOBS_COLLECTION}`, auth.currentUser);
      } catch (err: any) {
        if (onError) onError(err);
      }
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
      try {
        handleFirestoreError(error, OperationType.GET, `/${CANDIDATES_COLLECTION}`, auth.currentUser);
      } catch (err: any) {
        if (onError) onError(err);
      }
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
      try {
        handleFirestoreError(error, OperationType.GET, `/${TRAINING_SESSIONS_COLLECTION}`, auth.currentUser);
      } catch (err: any) {
        if (onError) onError(err);
      }
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
      try {
        handleFirestoreError(error, OperationType.GET, `/${CRISIS_SCENARIOS_COLLECTION}`, auth.currentUser);
      } catch (err: any) {
        if (onError) onError(err);
      }
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
      try {
        handleFirestoreError(error, OperationType.GET, `/${LINKEDIN_SCOUTS_COLLECTION}/${scoutId}`, auth.currentUser);
      } catch (err: any) {
        if (onError) onError(err);
      }
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
      try {
        handleFirestoreError(error, OperationType.GET, `/${LINKEDIN_QUERIES_COLLECTION}`, auth.currentUser);
      } catch (err: any) {
        if (onError) onError(err);
      }
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

export const subscribeToEmployeeJourneys = (
  onSuccess: (journeys: EmployeeJourneyRecord[]) => void,
  onError?: (err: Error) => void
) => {
  const q = query(collection(db, EMPLOYEE_JOURNEYS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const journeys: EmployeeJourneyRecord[] = [];
      snapshot.forEach((docSnap) => {
        journeys.push({
          ...docSnap.data(),
          id: docSnap.id
        } as EmployeeJourneyRecord);
      });
      onSuccess(journeys);
    },
    (error) => {
      console.error('Firestore Employee Journeys subscription error:', error);
      try {
        handleFirestoreError(error, OperationType.GET, `/${EMPLOYEE_JOURNEYS_COLLECTION}`, auth.currentUser);
      } catch (err: any) {
        if (onError) onError(err);
      }
    }
  );
};

export const saveEmployeeJourneyToFirestore = async (
  journey: EmployeeJourneyRecord
): Promise<void> => {
  const docRef = doc(db, EMPLOYEE_JOURNEYS_COLLECTION, journey.id);
  try {
    await setDoc(docRef, sanitizeFirestoreData(journey), { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `/${EMPLOYEE_JOURNEYS_COLLECTION}/${journey.id}`, auth.currentUser);
  }
};

export const subscribeToRecentHiresFeed = (
  onSuccess: (items: RecentHireFeedItem[]) => void,
  onError?: (err: Error) => void
) => {
  const q = query(collection(db, RECENT_HIRES_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: RecentHireFeedItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({
          ...docSnap.data(),
          id: docSnap.id
        } as RecentHireFeedItem);
      });
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      onSuccess(items);
    },
    (error) => {
      console.error('Firestore Recent Hires Feed subscription error:', error);
      try {
        handleFirestoreError(error, OperationType.GET, `/${RECENT_HIRES_COLLECTION}`, auth.currentUser);
      } catch (err: any) {
        if (onError) onError(err);
      }
    }
  );
};

export const saveRecentHireFeedItemToFirestore = async (
  item: RecentHireFeedItem
): Promise<void> => {
  const docRef = doc(db, RECENT_HIRES_COLLECTION, item.id);
  try {
    await setDoc(docRef, sanitizeFirestoreData(item), { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `/${RECENT_HIRES_COLLECTION}/${item.id}`, auth.currentUser);
  }
};

// ==================== COMPANY FREE ADS & COMMISSION SYSTEM ====================

export const subscribeToCompanyAds = (
  onSuccess: (ads: CompanyJobAd[]) => void,
  onError?: (err: Error) => void
) => {
  const q = query(collection(db, COMPANY_ADS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const ads: CompanyJobAd[] = [];
      snapshot.forEach((docSnap) => {
        ads.push({
          ...docSnap.data(),
          id: docSnap.id
        } as CompanyJobAd);
      });
      ads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onSuccess(ads);
    },
    (error) => {
      console.error('Firestore company ads subscription error:', error);
      try {
        handleFirestoreError(error, OperationType.GET, `/${COMPANY_ADS_COLLECTION}`, auth.currentUser);
      } catch (err: any) {
        if (onError) onError(err);
      }
    }
  );
};

export const saveCompanyAdToFirestore = async (
  ad: CompanyJobAd
): Promise<void> => {
  const docRef = doc(db, COMPANY_ADS_COLLECTION, ad.id);
  try {
    await setDoc(docRef, sanitizeFirestoreData(ad), { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `/${COMPANY_ADS_COLLECTION}/${ad.id}`, auth.currentUser);
  }
};

export const deleteCompanyAdFromFirestore = async (
  adId: string
): Promise<void> => {
  const docRef = doc(db, COMPANY_ADS_COLLECTION, adId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `/${COMPANY_ADS_COLLECTION}/${adId}`, auth.currentUser);
  }
};

export const subscribeToAdApplications = (
  onSuccess: (apps: AdApplication[]) => void,
  onError?: (err: Error) => void
) => {
  const q = query(collection(db, AD_APPLICATIONS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const apps: AdApplication[] = [];
      snapshot.forEach((docSnap) => {
        apps.push({
          ...docSnap.data(),
          id: docSnap.id
        } as AdApplication);
      });
      apps.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
      onSuccess(apps);
    },
    (error) => {
      console.error('Firestore ad applications subscription error:', error);
      try {
        handleFirestoreError(error, OperationType.GET, `/${AD_APPLICATIONS_COLLECTION}`, auth.currentUser);
      } catch (err: any) {
        if (onError) onError(err);
      }
    }
  );
};

export const saveAdApplicationToFirestore = async (
  app: AdApplication
): Promise<void> => {
  const docRef = doc(db, AD_APPLICATIONS_COLLECTION, app.id);
  try {
    await setDoc(docRef, sanitizeFirestoreData(app), { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `/${AD_APPLICATIONS_COLLECTION}/${app.id}`, auth.currentUser);
  }
};

export const subscribeToCommissionInvoices = (
  onSuccess: (invoices: CommissionInvoiceRecord[]) => void,
  onError?: (err: Error) => void
) => {
  const q = query(collection(db, COMMISSION_INVOICES_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const invoices: CommissionInvoiceRecord[] = [];
      snapshot.forEach((docSnap) => {
        invoices.push({
          ...docSnap.data(),
          id: docSnap.id
        } as CommissionInvoiceRecord);
      });
      invoices.sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime());
      onSuccess(invoices);
    },
    (error) => {
      console.error('Firestore commission invoices subscription error:', error);
      try {
        handleFirestoreError(error, OperationType.GET, `/${COMMISSION_INVOICES_COLLECTION}`, auth.currentUser);
      } catch (err: any) {
        if (onError) onError(err);
      }
    }
  );
};

export const saveCommissionInvoiceToFirestore = async (
  invoice: CommissionInvoiceRecord
): Promise<void> => {
  const docRef = doc(db, COMMISSION_INVOICES_COLLECTION, invoice.id);
  try {
    await setDoc(docRef, sanitizeFirestoreData(invoice), { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `/${COMMISSION_INVOICES_COLLECTION}/${invoice.id}`, auth.currentUser);
  }
};




