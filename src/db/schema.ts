import { pgTable, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  fullName: text('full_name'),
  role: text('role').default('business'),
  createdAt: timestamp('created_at').defaultNow()
});

export const jobRequirements = pgTable('job_requirements', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  roleName: text('role_name').notNull(),
  ageRange: text('age_range'),
  minExperienceYears: integer('min_experience_years').default(0),
  skills: jsonb('skills').$type<string[]>(),
  uniqueExceptionsCriteria: text('unique_exceptions_criteria'),
  radiusMiles: integer('radius_miles').default(50),
  offerRelocationCost: boolean('offer_relocation_cost').default(false),
  relocationBudgetAmount: integer('relocation_budget_amount').default(0),
  locationCity: text('location_city'),
  customQuestions: jsonb('custom_questions'),
  status: text('status').default('active'),
  createdAt: timestamp('created_at').defaultNow()
});

export const candidates = pgTable('candidates', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  locationCity: text('location_city'),
  age: integer('age'),
  experienceYears: integer('experience_years'),
  skills: jsonb('skills').$type<string[]>(),
  distanceFromCompanyMiles: integer('distance_from_company_miles'),
  willingToRelocate: boolean('willing_to_relocate').default(false),
  currentCompany: text('current_company'),
  currentRole: text('current_role'),
  isCompetitorProspect: boolean('is_competitor_prospect').default(false),
  competitorNotes: text('competitor_notes'),
  matchesUniqueExceptions: boolean('matches_unique_exceptions').default(false),
  exceptionMatchReason: text('exception_match_reason'),
  submission: jsonb('submission'),
  evaluation: jsonb('evaluation'),
  status: text('status').default('screening'),
  createdAt: timestamp('created_at').defaultNow()
});

export const googleForms = pgTable('google_forms', {
  id: text('id').primaryKey(),
  formId: text('form_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  responderUri: text('responder_uri'),
  jobId: text('job_id'),
  createdAt: timestamp('created_at').defaultNow()
});

export const googleTasks = pgTable('google_tasks', {
  id: text('id').primaryKey(),
  taskId: text('task_id').notNull(),
  taskListId: text('task_list_id').default('@default'),
  title: text('title').notNull(),
  notes: text('notes'),
  status: text('status').default('needsAction'),
  due: text('due'),
  candidateId: text('candidate_id'),
  jobId: text('job_id'),
  createdAt: timestamp('created_at').defaultNow()
});
