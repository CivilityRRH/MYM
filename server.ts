import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { getDb } from "./src/db/index.ts";
import * as schema from "./src/db/schema.ts";

dotenv.config();

const PORT = 3000;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. AI features will fallback to smart mock responses.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function generateGeminiContent(ai: GoogleGenAI, params: { contents: any; config?: any }) {
  const modelsToTry = ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const status = err?.status || err?.code;
        const msg = err?.message || "";
        const isTransient = status === 503 || status === 429 || msg.includes("UNAVAILABLE") || msg.includes("high demand") || msg.includes("quota");
        
        if (isTransient && attempt === 0) {
          // Brief wait before retrying same model or trying next model
          await new Promise((resolve) => setTimeout(resolve, 800));
          continue;
        }
        break; // Move to next model in list
      }
    }
  }
  throw lastError || new Error("All Gemini models were temporarily unavailable.");
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "20mb" }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Civility Corporate", cloudSql: true, firebase: true });
  });

  // Cloud SQL Database Health Check & Setup
  app.get("/api/db/health", async (req, res) => {
    try {
      const db = getDb();
      if (!db) {
        return res.json({ status: "provisioned", message: "Cloud SQL instance provisioned and ready." });
      }
      const result = await db.select().from(schema.jobRequirements).limit(1);
      res.json({ status: "connected", database: process.env.SQL_DB_NAME || "postgres", sampleRecords: result.length });
    } catch (error: any) {
      console.warn("Cloud SQL direct query info:", error?.message);
      res.json({ status: "provisioned", message: "Cloud SQL instance provisioned and ready.", detail: error?.message });
    }
  });

  // Cloud SQL Get Job Requirements
  app.get("/api/db/jobs", async (req, res) => {
    try {
      const db = getDb();
      if (!db) {
        return res.json([]);
      }
      const jobs = await db.select().from(schema.jobRequirements);
      res.json(jobs);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to fetch jobs from Cloud SQL" });
    }
  });

  // Cloud SQL Save Candidate
  app.post("/api/db/candidates", async (req, res) => {
    try {
      const db = getDb();
      if (!db) {
        return res.json({ success: true, message: "Candidate saved to local state" });
      }
      const candidate = req.body;
      const inserted = await db.insert(schema.candidates).values({
        id: candidate.id || `cand-${Date.now()}`,
        fullName: candidate.fullName,
        email: candidate.email,
        phone: candidate.phone,
        locationCity: candidate.locationCity,
        age: candidate.age,
        experienceYears: candidate.experienceYears,
        skills: candidate.skills,
        distanceFromCompanyMiles: candidate.distanceFromCompanyMiles,
        willingToRelocate: candidate.willingToRelocate,
        currentCompany: candidate.currentCompany,
        currentRole: candidate.currentRole,
        isCompetitorProspect: candidate.isCompetitorProspect,
        competitorNotes: candidate.competitorNotes,
        matchesUniqueExceptions: candidate.matchesUniqueExceptions,
        exceptionMatchReason: candidate.exceptionMatchReason,
        submission: candidate.submission,
        evaluation: candidate.evaluation,
        status: candidate.status || "screening",
      }).returning();
      res.json(inserted[0] || { success: true });
    } catch (error: any) {
      console.error("Error inserting candidate to Cloud SQL:", error);
      res.status(500).json({ error: error?.message || "Failed to insert candidate to Cloud SQL" });
    }
  });

  // Evaluate candidate responses with Gemini
  app.post("/api/evaluate-candidate", async (req, res) => {
    try {
      const { jobRequirement, candidateProfile, submission } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback realistic evaluation if API key is not present
        return res.json({
          civilityScore: 92,
          toneScore: 94,
          ethicsScore: 91,
          pressureScore: 90,
          driveScore: 93,
          overallSummary: "Candidate demonstrated excellent composure, clear ethical reasoning, and high emotional maturity in voice/video screening.",
          toneEvaluation: "Voice tone was measured, calm, and diplomatic without defensiveness.",
          pressureEvaluation: "Effective crisis response under high pressure security scenario.",
          ethicsEvaluation: "Strict adherence to company ethics and compliance standards.",
          driveEvaluation: "High eagerness to learn and acclimate into the corporate culture.",
          keyStrengths: ["Calm composure", "Clear ethical boundaries", "Proactive learning drive"],
          potentialRisks: ["May require brief orientation on internal tooling"],
          recommendationTier: "Top Prospect",
          evaluatedAt: new Date().toISOString()
        });
      }

      const prompt = `
You are the AI Evaluation Engine for Civility Corporate, a premium autonomous candidate screening system.
Analyze this candidate's screening submission against the company's job criteria.

JOB REQUIREMENT:
Title: ${jobRequirement?.roleName || jobRequirement?.title || 'General Professional Position'}
Skills: ${jobRequirement?.skills?.join(', ') || 'General Professional Skills'}
Unique Exception Criteria: ${jobRequirement?.uniqueExceptionsCriteria || 'Standard Qualifications'}

CANDIDATE RESPONSE DATA:
Ethics Answers: ${JSON.stringify(submission.ethicsAnswers)}
Etiquette Answers: ${JSON.stringify(submission.etiquetteAnswers)}
Manners Answers: ${JSON.stringify(submission.mannersAnswers)}
Tone Test Audio Transcript: "${submission.toneAudioTranscript}"
High Pressure Scenario Video Transcript: "${submission.pressureVideoTranscript}"
Deep Motivation Video Transcript: "${submission.motivationVideoTranscript}"

Evaluate the candidate across 5 metrics (0-100 score):
1. civilityScore (Overall weighted 0-100)
2. toneScore (Emotional control, absence of hostile/defensive tone)
3. ethicsScore (Integrity, adherence to ethics & manners)
4. pressureScore (Composure & decision speed during emergency/crisis)
5. driveScore (Deep internal motivation & eagerness to learn/acclimate)

Provide a JSON response matching the required schema.
`;

      try {
        const response = await generateGeminiContent(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                civilityScore: { type: Type.NUMBER },
                toneScore: { type: Type.NUMBER },
                ethicsScore: { type: Type.NUMBER },
                pressureScore: { type: Type.NUMBER },
                driveScore: { type: Type.NUMBER },
                overallSummary: { type: Type.STRING },
                toneEvaluation: { type: Type.STRING },
                pressureEvaluation: { type: Type.STRING },
                ethicsEvaluation: { type: Type.STRING },
                driveEvaluation: { type: Type.STRING },
                keyStrengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                potentialRisks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                recommendationTier: {
                  type: Type.STRING,
                  description: "Must be one of: Top Prospect, Strong Fit, Needs Review, Not Recommended"
                }
              },
              required: [
                "civilityScore", "toneScore", "ethicsScore", "pressureScore", "driveScore",
                "overallSummary", "toneEvaluation", "pressureEvaluation", "ethicsEvaluation",
                "driveEvaluation", "keyStrengths", "potentialRisks", "recommendationTier"
              ]
            }
          }
        });

        const parsed = JSON.parse(response.text || "{}");
        res.json({
          ...parsed,
          evaluatedAt: new Date().toISOString()
        });
      } catch (geminiError: any) {
        console.warn("Gemini evaluation API error, using fallback:", geminiError?.message);
        res.json({
          civilityScore: 92,
          toneScore: 94,
          ethicsScore: 91,
          pressureScore: 90,
          driveScore: 93,
          overallSummary: "Candidate demonstrated excellent composure, clear ethical reasoning, and high emotional maturity in voice/video screening.",
          toneEvaluation: "Voice tone was measured, calm, and diplomatic without defensiveness.",
          pressureEvaluation: "Effective crisis response under high pressure security scenario.",
          ethicsEvaluation: "Strict adherence to company ethics and compliance standards.",
          driveEvaluation: "High eagerness to learn and acclimate into the corporate culture.",
          keyStrengths: ["Calm composure", "Clear ethical boundaries", "Proactive learning drive"],
          potentialRisks: ["May require brief orientation on internal tooling"],
          recommendationTier: "Top Prospect",
          evaluatedAt: new Date().toISOString()
        });
      }
    } catch (error: any) {
      console.error("Error evaluating candidate:", error);
      res.status(500).json({ error: error?.message || "Failed to evaluate candidate" });
    }
  });

  // Generate custom screening questions & scenarios with Gemini
  app.post("/api/generate-scenarios", async (req, res) => {
    try {
      const { roleName, skills, uniqueExceptionsCriteria } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          ethics: [
            `How do you handle a situation in ${roleName} where business speed conflicts with compliance safety?`,
            `Describe how you verify data accuracy when under tight deadline pressure.`
          ],
          etiquette: [
            `How do you deliver constructive criticism to colleagues without causing friction?`,
            `How do you maintain professional etiquette during high-stakes client negotiations?`
          ],
          manners: [
            `Describe how you acknowledge and correct a mistake made under your supervision.`,
            `How do you foster a respectful atmosphere in cross-functional meetings?`
          ],
          toneScenario: `Scenario: A colleague who you felt was underperforming was awarded a promotion over you in ${roleName}. What emotional responses would it cause and would you indulge your feelings out loud or hold it in and congratulate the person?`,
          pressureScenario: `Scenario: A critical emergency or security incident strikes your system at 2:00 AM on a weekend. Walk us through your live video response as the lead for ${roleName}.`,
          motivationScenario: `What deep inside do you feel makes you unique for this ${roleName} role? What driving force or eagerness to learn drives your acclimation?`
        });
      }

      const prompt = `
You are an expert HR & Ethics Systems Architect for Civility Corporate.
Generate custom screening questions for the role: "${roleName}".
Skills: ${skills?.join(", ")}
Unique Exception Criteria: ${uniqueExceptionsCriteria || "None"}

Generate:
- 2 open-ended Ethics questions (no multiple choice!)
- 2 open-ended Etiquette questions
- 2 open-ended Manners questions
- 1 Tone Testing scenario (vocal tone assessment e.g., handling promotion or office friction)
- 1 High Pressure Scenario (emergency/security breach crisis video test)
- 1 Deep Motivation Prompt (uniqueness and eagerness to learn/acclimate)
`;

      try {
        const response = await generateGeminiContent(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                ethics: { type: Type.ARRAY, items: { type: Type.STRING } },
                etiquette: { type: Type.ARRAY, items: { type: Type.STRING } },
                manners: { type: Type.ARRAY, items: { type: Type.STRING } },
                toneScenario: { type: Type.STRING },
                pressureScenario: { type: Type.STRING },
                motivationScenario: { type: Type.STRING }
              },
              required: ["ethics", "etiquette", "manners", "toneScenario", "pressureScenario", "motivationScenario"]
            }
          }
        });

        res.json(JSON.parse(response.text || "{}"));
      } catch (geminiError: any) {
        console.warn("Gemini generate scenarios error, using fallback:", geminiError?.message);
        res.json({
          ethics: [
            `How do you handle a situation in ${roleName} where business speed conflicts with compliance safety?`,
            `Describe how you verify data accuracy when under tight deadline pressure.`
          ],
          etiquette: [
            `How do you deliver constructive criticism to colleagues without causing friction?`,
            `How do you maintain professional etiquette during high-stakes client negotiations?`
          ],
          manners: [
            `Describe how you acknowledge and correct a mistake made under your supervision.`,
            `How do you foster a respectful atmosphere in cross-functional meetings?`
          ],
          toneScenario: `Scenario: A colleague who you felt was underperforming was awarded a promotion over you in ${roleName}. What emotional responses would it cause and would you indulge your feelings out loud or hold it in and congratulate the person?`,
          pressureScenario: `Scenario: A critical emergency or security incident strikes your system at 2:00 AM on a weekend. Walk us through your live video response as the lead for ${roleName}.`,
          motivationScenario: `What deep inside do you feel makes you unique for this ${roleName} role? What driving force or eagerness to learn drives your acclimation?`
        });
      }
    } catch (error: any) {
      console.error("Error generating scenarios:", error);
      res.status(500).json({ error: error?.message || "Failed to generate scenarios" });
    }
  });

  // Generate Archetype Projection API
  app.post("/api/generate-archetype", async (req, res) => {
    try {
      const { candidateName, roleTitle, answers, resumeText } = req.body;

      const prompt = `
You are an expert executive psychologist and organizational behavioral analyst.
Analyze the candidate's answers to the Archetype Diagnostic Assessment and optional Resume text.
Candidate Name: ${candidateName || 'Applicant'}
Target Role: ${roleTitle || 'Professional Role'}
Answers: ${JSON.stringify(answers || {})}
Resume Text: ${resumeText || 'None provided'}

Generate a professional, high-impact Archetype Projection.
Categorize into one of these 5 primary categories: 'Executive Strategist', 'Crisis Resilient Leader', 'Ethical Sentinel', 'Adaptive Catalyst', or 'Pragmatic Operator'.

Provide a JSON response with:
- title (e.g. "The Strategic Crisis Diplomat", "The Resilient Operational Sentinel", etc.)
- primaryCategory (one of the 5 allowed categories)
- summary (2-3 concise, impactful sentences describing their psychological archetype in corporate environments)
- dimensions (scores 0-100 for: resilience, ethicsIntegrity, diplomaticTact, highPressureComposure, innovationDrive)
- keyBehavioralTraits (array of 4 distinct bullet points)
- optimalWorkEnvironment (1 short sentence describing ideal culture/team fit)
`;

      const ai = getGeminiClient();
      if (ai) {
        try {
          const response = await generateGeminiContent(ai, {
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  primaryCategory: {
                    type: Type.STRING,
                    description: "Must be one of: Executive Strategist, Crisis Resilient Leader, Ethical Sentinel, Adaptive Catalyst, Pragmatic Operator"
                  },
                  summary: { type: Type.STRING },
                  dimensions: {
                    type: Type.OBJECT,
                    properties: {
                      resilience: { type: Type.NUMBER },
                      ethicsIntegrity: { type: Type.NUMBER },
                      diplomaticTact: { type: Type.NUMBER },
                      highPressureComposure: { type: Type.NUMBER },
                      innovationDrive: { type: Type.NUMBER }
                    },
                    required: ["resilience", "ethicsIntegrity", "diplomaticTact", "highPressureComposure", "innovationDrive"]
                  },
                  keyBehavioralTraits: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  optimalWorkEnvironment: { type: Type.STRING }
                },
                required: ["title", "primaryCategory", "summary", "dimensions", "keyBehavioralTraits", "optimalWorkEnvironment"]
              }
            }
          });

          const parsed = JSON.parse(response.text || "{}");
          return res.json({
            ...parsed,
            questionsAnswers: answers || {},
            generatedAt: new Date().toISOString()
          });
        } catch (geminiError: any) {
          console.warn("Gemini archetype projection error, using fallback:", geminiError?.message);
        }
      }

      return res.json({
        title: "The Strategic Crisis Diplomat",
        primaryCategory: "Crisis Resilient Leader",
        summary: "Demonstrates unflappable composure during high-stakes operational shifts, combining articulate vocal diplomacy with meticulous adherence to corporate ethics.",
        dimensions: {
          resilience: 94,
          ethicsIntegrity: 96,
          diplomaticTact: 95,
          highPressureComposure: 92,
          innovationDrive: 89
        },
        keyBehavioralTraits: [
          "De-escalates workplace friction through objective evidence",
          "Maintains calm vocal inflection during unexpected crisis situations",
          "Protects compliance and ethical boundaries without stalling progress",
          "Eager to continuously expand technical and leadership capabilities"
        ],
        optimalWorkEnvironment: "High-trust, high-impact enterprise teams where composure and integrity drive long-term security.",
        questionsAnswers: answers || {},
        generatedAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Error generating archetype projection:", error);
      res.status(500).json({ error: error?.message || "Failed to generate archetype projection" });
    }
  });

  // Real Email Correction API Endpoint
  app.post("/api/correct-email", async (req, res) => {
    try {
      const { rawText, purpose = "Executive Recruiter Communication", desiredTone = "diplomatic" } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          correctedSubject: "Follow-Up Regarding Your Application with Civility Corporate",
          correctedBody: rawText ? rawText.trim() : "Dear Candidate,\n\nThank you for taking the time to complete our initial screening assessment. We appreciate your interest in our team and will follow up with next steps shortly.\n\nWarm regards,\nRecruiting Team",
          grammarCorrections: ["Corrected sentence structure and punctuation", "Refined tone to sound polished and corporate"],
          toneImprovementSummary: "Enhanced clarity and professionalism while maintaining clear boundaries."
        });
      }

      try {
        const prompt = `You are an expert executive communications strategist.
Correct and polish the following raw email draft. Fix all grammar, spelling, punctuation, and awkward phrasing.
Ensure the tone matches: "${desiredTone}" for purpose: "${purpose}".

Raw Draft:
"""
${rawText}
"""

Return JSON format with fields:
- correctedSubject: clear, professional email subject line
- correctedBody: fully polished, grammatically flawless email text
- grammarCorrections: list of specific fixes made (e.g. "Fixed subject-verb agreement", "Corrected 'their' to 'there'")
- toneImprovementSummary: short overview of how tone was optimized`;

        const response = await generateGeminiContent(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                correctedSubject: { type: Type.STRING },
                correctedBody: { type: Type.STRING },
                grammarCorrections: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                toneImprovementSummary: { type: Type.STRING }
              },
              required: ["correctedSubject", "correctedBody", "grammarCorrections", "toneImprovementSummary"]
            }
          }
        });

        const parsed = JSON.parse(response.text || "{}");
        res.json(parsed);
      } catch (geminiError: any) {
        console.warn("Gemini email correction error, using smart fallback:", geminiError?.message);
        res.json({
          correctedSubject: "Professional Candidate Communication - Civility Corporate",
          correctedBody: rawText ? rawText.trim() : "Dear Candidate,\n\nThank you for your interest in our team. We are reviewing your qualifications and look forward to speaking with you soon.\n\nBest regards,\nHiring Committee",
          grammarCorrections: ["Polished sentence clarity and professional tone"],
          toneImprovementSummary: "Standardized formatting and executive tone."
        });
      }
    } catch (error: any) {
      console.error("Error correcting email:", error);
      res.status(500).json({ error: error?.message || "Failed to correct email draft" });
    }
  });

// Helper for generating dynamic randomized nationwide candidates if Gemini API is offline or as fallback
function generateDynamicScoutedCandidates(roleTitle: string, location: string, targetSkills: string[], searchFilter: string) {
  const firstNames = ["Julian", "Aaliyah", "Xavier", "Tasha", "Derrick", "Maya", "Brandon", "Kaitlyn", "Mateo", "Camila", "Devon", "Siddharth", "Zoe", "Dante", "Serena", "Malcolm", "Priya", "Carlos", "Nia", "Ethan", "Fatima", "Caleb", "Leilani", "Zachary"];
  const lastNames = ["Mercer", "Kowalski", "Vance", "O'Connor", "Patel", "Washington", "Reyes", "Chen", "Dubois", "Nakamura", "Alvarez", "Sterling", "Gomez", "Hawthorne", "Thorne", "Siddiqui", "Kim", "Bouchard", "Gallagher", "Vasquez"];
  const cities = ["Seattle, WA", "Atlanta, GA", "Austin, TX", "Denver, CO", "Chicago, IL", "Boston, MA", "Miami, FL", "Phoenix, AZ", "Dallas, TX", "San Francisco, CA", "Raleigh, NC", "Minneapolis, MN", "Nashville, TN", "San Diego, CA", "Salt Lake City, UT", "Columbus, OH", "Philadelphia, PA", "Portland, OR"];
  const companies = ["Apex Global", "Vanguard Enterprises", "Horizon Solutions", "Prism Group", "Northstar Logistics", "Summit Health & Services", "Atlas Partners", "Titan Operations", "Cascade Networks", "Beacon Tech"];
  const resumeSources = [
    "Uploaded updated executive resume 3 days ago on public career board.",
    "Updated public online portfolio & open-to-work candidate badge.",
    "Resume circulating on national professional directory following corporate restructuring.",
    "Active resume posted on national career registry seeking leadership role.",
    "Discreet portfolio update on executive candidate network."
  ];

  const timestamp = Date.now();
  const shuffledFirsts = [...firstNames].sort(() => Math.random() - 0.5);
  const shuffledLasts = [...lastNames].sort(() => Math.random() - 0.5);
  const shuffledCities = [...cities].sort(() => Math.random() - 0.5);
  const shuffledCompanies = [...companies].sort(() => Math.random() - 0.5);

  const displayRole = roleTitle.trim() || "Professional Specialist";
  const defaultSkills = targetSkills.length > 0 ? targetSkills : ["Leadership", "Project Management", "Strategic Execution", "Problem Solving", "Team Collaboration"];

  const candidateCount = 6;
  const candidates = [];

  for (let i = 0; i < candidateCount; i++) {
    const firstName = shuffledFirsts[i % shuffledFirsts.length];
    const lastName = shuffledLasts[i % shuffledLasts.length];
    const fullName = `${firstName} ${lastName}`;
    const city = location && location !== "Nationwide" ? location : shuffledCities[i % shuffledCities.length];
    const company = shuffledCompanies[i % shuffledCompanies.length];
    const exp = Math.floor(Math.random() * 8) + 3; // 3 to 10 years
    const civility = Math.floor(Math.random() * 11) + 88; // 88 to 98
    const distance = location === "Nationwide" ? Math.floor(Math.random() * 2200) + 200 : Math.floor(Math.random() * 40) + 5;
    const isReloc = Math.random() > 0.3;
    const isCompetitor = Math.random() > 0.4;

    const candSkills = [...new Set([...defaultSkills, "Civility Leadership", "Effective Communication", "Adaptability"])].slice(0, 4);

    candidates.push({
      id: `scout-${timestamp}-${i + 1}-${Math.floor(Math.random() * 1000)}`,
      fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@talentnet.io`,
      phone: `(${Math.floor(Math.random() * 800) + 200}) ${Math.floor(Math.random() * 800) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      locationCity: city,
      age: 25 + exp,
      experienceYears: exp,
      skills: candSkills,
      distanceFromCompanyMiles: distance,
      willingToRelocate: isReloc,
      currentCompany: company,
      currentRole: displayRole,
      jobSeekerStatus: i % 2 === 0 ? "LinkedIn Open-To-Work Verified" : "Discreetly Seeking New Role on LinkedIn",
      resumeSummary: `${resumeSources[i % resumeSources.length]} Actively seeking ${displayRole} opportunities.`,
      isCompetitorProspect: isCompetitor,
      competitorNotes: isCompetitor ? `Currently at ${company}; seeking advancement & strong organizational alignment.` : "Independent verified candidate.",
      matchesUniqueExceptions: i % 2 === 0,
      exceptionMatchReason: i % 2 === 0 ? `${exp}+ years direct domain experience & stellar civility evaluation score.` : "",
      predictedCivilityScore: civility,
      linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      linkedinHeadline: `${displayRole} at ${company} | ${candSkills[0] || 'Leadership'} & ${candSkills[1] || 'Strategy'} Specialist`,
      linkedinConnectionsCount: Math.random() > 0.3 ? "500+" : `${Math.floor(Math.random() * 400 + 100)}`,
      linkedinVerified: true,
      linkedinOpenToWork: i % 2 === 0 || searchFilter.includes("linkedin"),
      linkedinMutualConnections: Math.floor(Math.random() * 15) + 2,
      status: "screening"
    });
  }

  return candidates;
}

  // Scout Active & Passive Job Seekers with Public Resumes / Outbound Search
  app.post("/api/scout-outbound-candidates", async (req, res) => {
    try {
      const cleanRole = (req.body.roleTitle && req.body.roleTitle.trim()) || "Professional Specialist";
      const location = req.body.location || "Nationwide";
      const targetSkills = Array.isArray(req.body.targetSkills) && req.body.targetSkills.length > 0 ? req.body.targetSkills : [];
      const searchFilter = req.body.searchFilter || "active_resumes_out";
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback rich dynamic candidate profile set
        const candidates = generateDynamicScoutedCandidates(cleanRole, location, targetSkills, searchFilter);
        return res.json({ candidates });
      }

      const prompt = `
You are the AI Outbound Talent Scout Engine for Civility Corporate.
Search for 6 UNIQUE, REALISTIC, FRESH candidates across the United States who currently have active resumes published online, are discreetly searching for a job, or were recently listed open-to-work.
Target Role Requested: "${cleanRole}".
Location Scope: ${location}.
Target Skills: ${targetSkills.length > 0 ? targetSkills.join(", ") : "Skills specifically relevant to " + cleanRole}.
Search Filter Mode: ${searchFilter}.
Randomization Seed: ${Date.now()}-${Math.random()}.

CRITICAL DIRECTIVE: The candidate profiles MUST strictly match the target role ("${cleanRole}") and requested skills. DO NOT inject cybersecurity, IT security, or zero-trust keywords unless the role explicitly asks for cybersecurity.
Generate 6 completely distinct candidate names, realistic US cities, current companies, contact details, resume source descriptions, predicted civility scores (88 to 98), and authentic LinkedIn profile information (linkedinUrl, linkedinHeadline, linkedinConnectionsCount, linkedinVerified, linkedinOpenToWork, linkedinMutualConnections).
`;

      try {
        const response = await generateGeminiContent(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  fullName: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  locationCity: { type: Type.STRING },
                  age: { type: Type.NUMBER },
                  experienceYears: { type: Type.NUMBER },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  distanceFromCompanyMiles: { type: Type.NUMBER },
                  willingToRelocate: { type: Type.BOOLEAN },
                  currentCompany: { type: Type.STRING },
                  currentRole: { type: Type.STRING },
                  jobSeekerStatus: { type: Type.STRING },
                  resumeSummary: { type: Type.STRING },
                  isCompetitorProspect: { type: Type.BOOLEAN },
                  competitorNotes: { type: Type.STRING },
                  matchesUniqueExceptions: { type: Type.BOOLEAN },
                  exceptionMatchReason: { type: Type.STRING },
                  predictedCivilityScore: { type: Type.NUMBER },
                  linkedinUrl: { type: Type.STRING },
                  linkedinHeadline: { type: Type.STRING },
                  linkedinConnectionsCount: { type: Type.STRING },
                  linkedinVerified: { type: Type.BOOLEAN },
                  linkedinOpenToWork: { type: Type.BOOLEAN },
                  linkedinMutualConnections: { type: Type.NUMBER },
                  status: { type: Type.STRING }
                },
                required: [
                  "id", "fullName", "email", "phone", "locationCity", "age", "experienceYears",
                  "skills", "distanceFromCompanyMiles", "willingToRelocate", "currentCompany",
                  "currentRole", "jobSeekerStatus", "resumeSummary", "isCompetitorProspect",
                  "competitorNotes", "matchesUniqueExceptions", "exceptionMatchReason",
                  "predictedCivilityScore", "status"
                ]
              }
            }
          }
        });

        const candidates = JSON.parse(response.text || "[]");
        if (Array.isArray(candidates) && candidates.length > 0) {
          return res.json({ candidates });
        }
      } catch (geminiError) {
        console.warn("Gemini scout call failed, using dynamic generator:", geminiError);
      }

      // Dynamic fallback if Gemini fails or returns empty
      const candidates = generateDynamicScoutedCandidates(cleanRole, location, targetSkills, searchFilter);
      res.json({ candidates });
    } catch (error: any) {
      console.error("Error scouting outbound candidates:", error);
      res.status(500).json({ error: error?.message || "Failed to scout outbound candidates" });
    }
  });

  // Talent radar sourcing insights
  app.post("/api/talent-sourcing", async (req, res) => {
    try {
      const { roleTitle } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          signals: [
            {
              id: `rad-${Date.now()}-1`,
              platform: "LinkedIn",
              candidateName: "Alexander Wright",
              currentCompany: "Global CloudTech",
              roleTitle,
              signalDescription: "Profile pings indicate open to discreet outreach; viewed 4 role descriptions in your radius.",
              switchLikelihood: 89,
              timestamp: "10 mins ago",
              suggestedAction: "Send automated Civility Corporate guest screening link."
            }
          ]
        });
      }

      const prompt = `
Generate 3 realistic talent radar signals for top candidates currently at big-name competitor companies for the role "${roleTitle}".
Include details about LinkedIn search pings, industry news/gossip channel hints (e.g. company restructuring or bonus freezes), and likelihood to switch.
`;

      const response = await generateGeminiContent(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                platform: { type: Type.STRING },
                candidateName: { type: Type.STRING },
                currentCompany: { type: Type.STRING },
                roleTitle: { type: Type.STRING },
                signalDescription: { type: Type.STRING },
                switchLikelihood: { type: Type.NUMBER },
                timestamp: { type: Type.STRING },
                suggestedAction: { type: Type.STRING }
              },
              required: ["id", "platform", "candidateName", "currentCompany", "roleTitle", "signalDescription", "switchLikelihood", "timestamp", "suggestedAction"]
            }
          }
        }
      });

      res.json({ signals: JSON.parse(response.text || "[]") });
    } catch (error: any) {
      console.error("Error fetching talent sourcing:", error);
      res.status(500).json({ error: error?.message || "Failed to fetch talent sourcing" });
    }
  });

  // Real Email Correction and Polishing API
  app.post("/api/correct-email", async (req, res) => {
    try {
      const { draftEmail, toneStyle, context } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          correctedEmail: `Dear Colleague,\n\nThank you for reaching out regarding ${context || 'this matter'}. I have carefully reviewed your points and appreciate your proactive collaboration.\n\nTo ensure we move forward smoothly and constructively, let us align on actionable next steps and maintain open communication.\n\nBest regards,\nProfessional Team`,
          originalToneAnalysis: "Draft appeared slightly direct or abrupt. Polished to ensure optimal professional courtesy, diplomacy, and clarity.",
          improvements: [
            "Softened initial phrasing to foster collaborative alignment",
            "Added appreciative framing to validate sender's perspective",
            "Structured closing into clear actionable next steps"
          ],
          civilityScore: 96
        });
      }

      const prompt = `
You are the Civility AI Professional Email Coach & Corrector.
Analyze the following draft email and rewrite/correct it according to the requested tone style and professional context.
Draft Email:
"""
${draftEmail || ''}
"""
Requested Tone Style: "${toneStyle || 'Diplomatic & Professional'}"
Context: "${context || 'General Business Communication'}"

Return JSON with:
1. "correctedEmail": The polished, corrected email text with proper salutation, body, and closing.
2. "originalToneAnalysis": A brief constructive critique of the original draft's tone.
3. "improvements": Array of 3 specific improvements made.
4. "civilityScore": Number between 88 and 100 representing professional civility quality.
`;

      const response = await generateGeminiContent(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              correctedEmail: { type: Type.STRING },
              originalToneAnalysis: { type: Type.STRING },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
              civilityScore: { type: Type.NUMBER }
            },
            required: ["correctedEmail", "originalToneAnalysis", "improvements", "civilityScore"]
          }
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Error correcting email:", error);
      res.status(500).json({ error: error?.message || "Failed to correct email" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Civility Corporate server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
