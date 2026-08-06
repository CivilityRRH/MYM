import { JobRequirement, CandidateProfile, TalentRadarSignal } from '../types';

export const INITIAL_JOB_REQUIREMENTS: JobRequirement[] = [
  {
    id: 'job-cyber-01',
    title: 'Senior Cybersecurity Threat Operations Engineer',
    roleName: 'Senior Cybersecurity Threat Operations Engineer',
    ageRange: '21 - 65',
    minExperienceYears: 4,
    skills: ['Incident Response', 'Zero Trust Architecture', 'Cloud Security', 'Python', 'Threat Intelligence'],
    uniqueExceptionsCriteria: 'Candidates with 4+ years active military cyber defense operations or major CVE disclosures qualify regardless of CS degree.',
    radiusMiles: 100,
    offerRelocationCost: true,
    relocationBudgetAmount: 15000,
    locationCity: 'Austin, TX',
    status: 'active',
    createdAt: new Date().toISOString(),
    customQuestions: {
      ethics: [
        'How do you handle discovering an unpatched zero-day vulnerability when fixing it immediately will breach client SLAs?',
        'Describe how you handle requests from business executives to bypass security protocols during high-urgency releases.'
      ],
      etiquette: [
        'When delivering critical vulnerability findings to senior executive leadership, how do you structure your language to avoid defensiveness?',
        'What is your protocol for managing temporary elevated system permissions for third-party audit vendors?'
      ],
      manners: [
        'In a high-pressure 2 AM incident response room, how do you maintain respectful communication with junior engineers?',
        'Describe how you take personal accountability when an operational security oversight originates from your team.'
      ],
      toneScenario: 'Scenario: A peer colleague who was not performing their full share of duties was promoted ahead of you. How do you respond in voice?',
      pressureScenario: 'Scenario: At 2:00 AM on a weekend, a high-severity security breach occurs threatening client data. Walk us through your live video response.',
      motivationScenario: 'What deep inside do you feel makes you unique as a candidate? What driving force drives your commitment to fully acclimate into our company?'
    }
  },
  {
    id: 'job-fin-02',
    title: 'Corporate Compliance & Operations Lead',
    roleName: 'Corporate Compliance & Operations Lead',
    ageRange: '21 - 65',
    minExperienceYears: 3,
    skills: ['FCRA Compliance', 'Audit Oversight', 'Enterprise Risk Management', 'Financial Protocol'],
    uniqueExceptionsCriteria: 'Demonstrated experience leading enterprise compliance audits or legal paralegal operations qualifies in lieu of standard MBA.',
    radiusMiles: 50,
    offerRelocationCost: false,
    relocationBudgetAmount: 0,
    locationCity: 'New York, NY',
    status: 'active',
    createdAt: new Date().toISOString(),
    customQuestions: {
      ethics: [
        'What steps do you take when discovering an accounting discrepancy in a closed quarterly report?',
        'How do you manage confidentiality when handling sensitive executive board disclosures?'
      ],
      etiquette: [
        'How do you address non-compliant vendor communication without disrupting partner relationships?',
        'What protocol do you enforce when conducting mandatory staff compliance reviews?'
      ],
      manners: [
        'How do you maintain professional poise when a business unit leader rejects compliance findings?',
        'Describe a time you de-escalated a heated disagreement during an audit.'
      ],
      toneScenario: 'Scenario: A client representative aggressively challenges your compliance report during a live conference call. Demonstrate your voice response.',
      pressureScenario: 'Scenario: Regulatory auditors arrive unannounced while your department head is traveling. Walk us through your live video response.',
      motivationScenario: 'What core personal value drives your dedication to absolute integrity and operational excellence?'
    }
  },
  {
    id: 'job-dev-03',
    title: 'Lead AI & Full-Stack Systems Architect',
    roleName: 'Lead AI & Full-Stack Systems Architect',
    ageRange: '21 - 65',
    minExperienceYears: 5,
    skills: ['TypeScript', 'React', 'Node.js', 'LLM Integration', 'System Design'],
    uniqueExceptionsCriteria: 'Shipped high-scale open source AI systems or autonomous agent architectures with 1,000+ GitHub stars.',
    radiusMiles: 250,
    offerRelocationCost: true,
    relocationBudgetAmount: 20000,
    locationCity: 'Seattle, WA',
    status: 'active',
    createdAt: new Date().toISOString(),
    customQuestions: {
      ethics: [
        'How do you prevent data leaks when deploying third-party generative AI models in production?',
        'What is your ethical stance on AI code generation tools and open-source attribution?'
      ],
      etiquette: [
        'How do you communicate technical refactoring needs to non-technical product managers?',
        'What code review etiquette do you enforce across distributed development teams?'
      ],
      manners: [
        'How do you give constructive feedback on pull requests without discouraging junior developers?',
        'How do you handle admitting a architectural flaw in code you previously championed?'
      ],
      toneScenario: 'Scenario: A production deployment breaks during peak traffic due to a merge conflict. Demonstrate your calm vocal response.',
      pressureScenario: 'Scenario: Live database latency spikes by 400% during an enterprise customer presentation. Walk us through your video response.',
      motivationScenario: 'What fuels your passion to continuously master emerging AI technologies and build enduring software?'
    }
  }
];

export const INITIAL_CANDIDATES: CandidateProfile[] = [
  {
    id: 'cand-01',
    fullName: 'Jordan Taylor',
    email: 'j.taylor@apextech.io',
    phone: '+1 (512) 771-9920',
    locationCity: 'Austin, TX',
    coordinates: { lat: 30.2672, lng: -97.7431 },
    geohash: '9v6khp2',
    age: 31,
    experienceYears: 6,
    skills: ['Incident Response', 'Zero Trust Architecture', 'Cloud Security', 'Python'],
    distanceFromCompanyMiles: 18,
    willingToRelocate: true,
    bgCheckConsented: true,
    bgCheckSignedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    bgCheckSsnLast4: '8812',
    currentCompany: 'Apex Security Systems',
    currentRole: 'Senior Cyber Defense Lead',
    isCompetitorProspect: true,
    competitorNotes: 'Top engineer from primary regional competitor. Highly sought after.',
    matchesUniqueExceptions: true,
    exceptionMatchReason: 'Verified 4 years active threat defense and lead CVE responder.',
    status: 'top_prospect',
    resume: {
      fileName: 'Jordan_Taylor_Cybersecurity_Lead_Resume.pdf',
      fileSize: 245000,
      parsedText: 'JORDAN TAYLOR - Senior Cybersecurity Engineer & Threat Response Lead. 6+ years experience in Zero Trust, incident response, SIEM, and cloud infrastructure security. Led emergency response for 14 major CVE incidents across AWS and GCP environments.',
      summaryHighlights: [
        '6+ years in high-stakes cyber defense & threat modeling',
        'Built automated zero-trust authorization pipeline handling 5M daily requests',
        'Certified Information Systems Security Professional (CISSP) & CEH'
      ],
      uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    archetypeProjection: {
      title: 'The Strategic Crisis Diplomat',
      primaryCategory: 'Crisis Resilient Leader',
      summary: 'Maintains unshakeable composure in high-pressure scenarios, blending calm diplomatic vocal clarity with rigorous ethical security protocols.',
      dimensions: {
        resilience: 96,
        ethicsIntegrity: 95,
        diplomaticTact: 98,
        highPressureComposure: 94,
        innovationDrive: 91
      },
      keyBehavioralTraits: ['Unflappable vocal cadence', 'Protocol-first crisis triage', 'De-escalation leader', 'Blameless post-mortem driver'],
      optimalWorkEnvironment: 'High-stakes security engineering teams where quick crisis resolution and high integrity are paramount.',
      questionsAnswers: {
        'Work Leadership Style': 'Calm, authoritative, and empowering during high-severity system incidents.',
        'Conflict Vector': 'De-escalates by separating emotional reactions from objective data facts.',
        'Crisis Temperament': 'Maintains steady vocal tone, isolates threat vectors systematically, and communicates clearly.'
      },
      generatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    submission: {
      jobId: 'job-cyber-01',
      bgCheckConsented: true,
      bgCheckSignedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      bgCheckSsnLast4: '8812',
      ethicsAnswers: {
        'ethics_0': 'I isolate the zero-day immediately, implement temporary runtime safeguards, and notify both security ops and account executives in parallel.',
        'ethics_1': 'I politely decline executive bypass requests, document the risk assessment in writing, and offer an expedited compliance audit pathway instead.'
      },
      etiquetteAnswers: {
        'etiquette_0': 'I present audit findings using objective risk impact metrics rather than accusatory statements, emphasizing shared security goals.',
        'etiquette_1': 'All elevated third-party permissions expire within 4 hours, require MFA token approval, and are recorded in immutable audit logs.'
      },
      mannersAnswers: {
        'manners_0': 'I maintain a firm, reassuring tone during incidents, assigning clear tasks and keeping emotion out of crisis triage.',
        'manners_1': 'I take direct ownership of team oversights, conduct a blameless post-mortem, and implement automated prevention controls.'
      },
      toneAudioTranscript: 'When a colleague is promoted ahead of me, I acknowledge my initial disappointment internally, keep my composure, and genuinely congratulate them while setting up a 1-on-1 with my manager to discuss my personal growth trajectory.',
      toneAudioDurationSec: 28,
      pressureVideoTranscript: 'It is 2:00 AM. I immediately confirm the intrusion indicators, isolate affected network segments to prevent data exfiltration, verify backup integrity, and initiate our emergency communication tree.',
      pressureVideoDurationSec: 42,
      motivationVideoTranscript: 'My deep driving force is building resilient systems that protect human privacy. I am eager to master new defense protocols and fully dedicate my skills to Civility.',
      motivationVideoDurationSec: 35,
      submittedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    evaluation: {
      civilityScore: 96,
      toneScore: 98,
      ethicsScore: 95,
      pressureScore: 94,
      driveScore: 97,
      overallSummary: 'Exceptional candidate demonstrating near-perfect emotional composure under pressure, airtight ethics protocols, and a clear leadership voice.',
      toneEvaluation: 'Vocal inflection was remarkably steady, empathetic, and professional during promotional conflict prompts.',
      pressureEvaluation: 'Decisive 2 AM crisis triage with structured logic and zero signs of panic.',
      ethicsEvaluation: 'Uncompromising adherence to compliance protocols and blameless post-mortem culture.',
      driveEvaluation: 'Proactive commitment to mastery and team alignment.',
      keyStrengths: ['Calm Voice Composure', 'Airtight Ethics', 'Active Threat Triage', 'FCRA Verified'],
      potentialRisks: ['High market demand - requires competitive offer'],
      recommendationTier: 'Top Prospect',
      evaluatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  },
  {
    id: 'cand-02',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@globalcompliance.org',
    phone: '+1 (212) 409-3321',
    locationCity: 'New York, NY',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    geohash: 'dr5regw',
    age: 29,
    experienceYears: 5,
    skills: ['FCRA Compliance', 'Audit Oversight', 'Enterprise Risk Management', 'Financial Protocol'],
    distanceFromCompanyMiles: 12,
    willingToRelocate: false,
    bgCheckConsented: true,
    bgCheckSignedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    bgCheckSsnLast4: '4190',
    currentCompany: 'Metropolitan Financial Services',
    currentRole: 'Senior Audit & Regulatory Specialist',
    isCompetitorProspect: false,
    competitorNotes: 'Direct financial audit background with spotless regulatory record.',
    matchesUniqueExceptions: true,
    exceptionMatchReason: 'Led enterprise FINRA/FCRA audits for 3 consecutive years.',
    status: 'top_prospect',
    resume: {
      fileName: 'Elena_Rostova_Compliance_Audit_Resume.pdf',
      fileSize: 198000,
      parsedText: 'ELENA ROSTOVA - Senior Audit & Regulatory Specialist. 5+ years experience directing FINRA, SEC, and FCRA regulatory compliance audits. Designed automated risk assessment matrices for tier-1 financial institutions.',
      summaryHighlights: [
        '5+ years in tier-1 financial audit & compliance leadership',
        'Direct experience liaising with SEC/FINRA regulatory oversight boards',
        'Certified Anti-Money Laundering Specialist (CAMS)'
      ],
      uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    archetypeProjection: {
      title: 'The Ethical Sentinel',
      primaryCategory: 'Ethical Sentinel',
      summary: 'Demonstrates uncompromising ethical integrity and regulatory precision under direct executive scrutiny.',
      dimensions: {
        resilience: 92,
        ethicsIntegrity: 99,
        diplomaticTact: 95,
        highPressureComposure: 93,
        innovationDrive: 88
      },
      keyBehavioralTraits: ['Airtight regulatory precision', 'Methodical documentation', 'Objective de-escalation', 'Zero tolerance for shortcuts'],
      optimalWorkEnvironment: 'Highly regulated enterprise environments requiring impeccable audit trails and legal compliance.',
      questionsAnswers: {
        'Work Leadership Style': 'Methodical, principle-driven, and highly detailed.',
        'Conflict Vector': 'Aligns disputing parties around transparent regulatory guidelines.',
        'Crisis Temperament': 'Remains calm and composed when receiving unexpected audit teams or regulatory inquiries.'
      },
      generatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    submission: {
      jobId: 'job-fin-02',
      bgCheckConsented: true,
      bgCheckSignedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      bgCheckSsnLast4: '4190',
      ethicsAnswers: {
        'ethics_0': 'I document the discrepancy, flag it for immediate audit committee review, and adjust the internal control framework to prevent recurrence.',
        'ethics_1': 'Executive board disclosures are strictly protected behind encrypted access controls with signed NDA verification.'
      },
      etiquetteAnswers: {
        'etiquette_0': 'I frame compliance non-conformances as operational risk reductions, providing actionable remediation steps for partners.',
        'etiquette_1': 'Compliance reviews are scheduled with clear agendas, objective benchmark scorecards, and constructive feedback loops.'
      },
      mannersAnswers: {
        'manners_0': 'I listen attentively to objections, provide regulatory precedent, and keep discussions focused on risk mitigation.',
        'manners_1': 'I de-escalate heated audit debates by focusing on factual evidence and joint solution building.'
      },
      toneAudioTranscript: 'When challenged aggressively during a conference call, I maintain a measured tone, pause to absorb the feedback, and reference clear regulatory guidelines to align expectations.',
      toneAudioDurationSec: 32,
      pressureVideoTranscript: 'Unannounced audit arrival: I immediately greet the auditors, verify credentials, escort them to our secure conference suite, and notify our legal team while pulling the pre-verified audit packet.',
      pressureVideoDurationSec: 45,
      motivationVideoTranscript: 'I am deeply motivated by creating transparent, trustworthy organizations where compliance serves as a competitive advantage.',
      motivationVideoDurationSec: 30,
      submittedAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    evaluation: {
      civilityScore: 94,
      toneScore: 95,
      ethicsScore: 97,
      pressureScore: 92,
      driveScore: 92,
      overallSummary: 'High-integrity compliance professional with authoritative poise, strong vocal composure, and deep legal audit experience.',
      toneEvaluation: 'Diplomatic, unflappable voice tone under confrontational scenario prompts.',
      pressureEvaluation: 'Extremely organized emergency auditor reception protocol.',
      ethicsEvaluation: 'Top tier compliance rigor with zero tolerance for corner-cutting.',
      driveEvaluation: 'Strong personal dedication to enterprise transparency.',
      keyStrengths: ['FCRA & Legal Audit Expertise', 'Diplomatic De-escalation', 'Rigorous Ethics'],
      potentialRisks: ['Prefers East Coast location'],
      recommendationTier: 'Top Prospect',
      evaluatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  },
  {
    id: 'cand-03',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@cloudnative.dev',
    phone: '+1 (206) 882-1044',
    locationCity: 'Seattle, WA',
    coordinates: { lat: 47.6062, lng: -122.3321 },
    geohash: 'c23nb62',
    age: 34,
    experienceYears: 7,
    skills: ['TypeScript', 'React', 'Node.js', 'LLM Integration', 'System Design'],
    distanceFromCompanyMiles: 24,
    willingToRelocate: true,
    bgCheckConsented: true,
    bgCheckSignedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    bgCheckSsnLast4: '2209',
    currentCompany: 'Frontier AI Systems',
    currentRole: 'Principal Staff Architect',
    isCompetitorProspect: true,
    competitorNotes: 'Authored multi-agent orchestration engine with 2,500+ GitHub stars.',
    matchesUniqueExceptions: true,
    exceptionMatchReason: 'Shipped major open-source AI infrastructure used by 500+ orgs.',
    status: 'screening',
    resume: {
      fileName: 'Marcus_Vance_Staff_Architect_Resume.pdf',
      fileSize: 310000,
      parsedText: 'MARCUS VANCE - Principal Staff Systems Architect. 7+ years building high-concurrency cloud distributed systems, TS/Node microservices, and agentic AI pipelines. Created widely adopted open-source orchestration tool with 2,500+ stars.',
      summaryHighlights: [
        '7+ years architecting distributed systems & multi-agent AI frameworks',
        '2,500+ GitHub stars on open-source cloud orchestration framework',
        'Expert in high-throughput Node.js & React streaming architectures'
      ],
      uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    archetypeProjection: {
      title: 'The Adaptive Catalyst',
      primaryCategory: 'Adaptive Catalyst',
      summary: 'High-energy innovator who rapidly converts high-stress architectural bottlenecks into scalable product breakthroughs.',
      dimensions: {
        resilience: 91,
        ethicsIntegrity: 93,
        diplomaticTact: 90,
        highPressureComposure: 95,
        innovationDrive: 99
      },
      keyBehavioralTraits: ['Architectural velocity', 'Pragmatic outage mitigation', 'Open-source community leader', 'Eagerness to pioneer new AI paradigms'],
      optimalWorkEnvironment: 'Fast-paced AI development teams building cutting-edge agentic workflows and real-time systems.',
      questionsAnswers: {
        'Work Leadership Style': 'Pioneering, collaborative, and hands-on architectural leadership.',
        'Conflict Vector': 'Resolves engineering debates through rapid prototyping and empirical benchmark tests.',
        'Crisis Temperament': 'Switches instantly to fail-safe cached states and resolves production bottlenecks with minimal disruption.'
      },
      generatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    submission: {
      jobId: 'job-dev-03',
      bgCheckConsented: true,
      bgCheckSignedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      bgCheckSsnLast4: '2209',
      ethicsAnswers: {
        'ethics_0': 'We enforce client-side PII scrubbing and deploy self-hosted model gateway proxies to guarantee no sensitive data touches vendor training logs.',
        'ethics_1': 'Open-source licenses must be respected strictly. Code generation tools should augment developer velocity while preserving architectural integrity.'
      },
      etiquetteAnswers: {
        'etiquette_0': 'I translate technical debt into business metrics like latency reduction, cost savings, and feature delivery velocity.',
        'etiquette_1': 'Code reviews must focus on code quality, security standards, and scalability rather than stylistic preferences.'
      },
      mannersAnswers: {
        'manners_0': 'I highlight what was done well first, explain the architectural rationale for suggested changes, and offer pair-programming support.',
        'manners_1': 'I openly admit design flaws, document lessons learned, and refactor swiftly without ego.'
      },
      toneAudioTranscript: 'In a production outage, I stay calm, focus on rolling back to the last known stable state, and coordinate clear status updates for stakeholders every 15 minutes.',
      toneAudioDurationSec: 30,
      pressureVideoTranscript: 'Database latency spike during live presentation: I instantly switch traffic to our cached read-replicas, ping the database team, and keep the presentation moving seamlessly on cached state.',
      pressureVideoDurationSec: 38,
      motivationVideoTranscript: 'My passion is building tools that empower developers and solve real-world automation challenges with elegance.',
      motivationVideoDurationSec: 32,
      submittedAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    evaluation: {
      civilityScore: 92,
      toneScore: 90,
      ethicsScore: 93,
      pressureScore: 94,
      driveScore: 91,
      overallSummary: 'Staff-level AI architect with impressive crisis management instincts, clean communication skills, and top technical credentials.',
      toneEvaluation: 'Steady, pragmatic vocal demeanor during crisis simulations.',
      pressureEvaluation: 'Fast, pragmatic problem solving during live customer presentation degradation.',
      ethicsEvaluation: 'Strong focus on AI privacy controls and data leakage prevention.',
      driveEvaluation: 'High intrinsic motivation to craft enduring software.',
      keyStrengths: ['AI Systems Architecture', 'Rapid Crisis Triage', 'Open Source Leader'],
      potentialRisks: ['May require high compensation package'],
      recommendationTier: 'Strong Fit',
      evaluatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  }
];

export const INITIAL_TALENT_RADAR_SIGNALS: TalentRadarSignal[] = [
  {
    id: 'signal-01',
    platform: 'Competitor Watch',
    candidateName: 'Dr. Sarah Jenkins',
    currentCompany: 'Apex Security Systems',
    roleTitle: 'VP of AI Threat Intelligence',
    signalDescription: 'Apex Security recently announced organizational restructuring. Sarah updated her profile status to "Open to Strategic Advisory & Executive Leadership".',
    switchLikelihood: 88,
    timestamp: '2 hours ago',
    suggestedAction: 'Send Outbound Executive Civility Invitation'
  },
  {
    id: 'signal-02',
    platform: 'LinkedIn',
    candidateName: 'David Chen',
    currentCompany: 'Metropolitan Financial',
    roleTitle: 'Head of Compliance Engineering',
    signalDescription: 'David published a article detailing dissatisfaction with traditional legacy hiring processes and praising zero-manpower automated screening tools.',
    switchLikelihood: 79,
    timestamp: '5 hours ago',
    suggestedAction: 'Import to Candidate Ledger & Send Assessment'
  },
  {
    id: 'signal-03',
    platform: 'Industry News / Gossip',
    candidateName: 'Rachel Miller',
    currentCompany: 'Frontier AI Systems',
    roleTitle: 'Lead AI Engineer',
    signalDescription: 'Frontier AI delay on stock option vesting reported in industry news. Multiple senior engineers actively updating public portfolios.',
    switchLikelihood: 85,
    timestamp: '1 day ago',
    suggestedAction: 'Trigger Outbound Scout for Seattle Region'
  }
];

