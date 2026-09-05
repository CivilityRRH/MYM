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
      toneScenario: 'Scenario: A peer colleague who was not performing their full share of duties was promoted ahead of you. How do you respond in voice to your department director?',
      pressureScenario: 'Scenario: At 2:00 AM on a weekend, a high-severity security breach occurs threatening client data. Walk us through your live video response.',
      motivationScenario: 'What deep inside do you feel makes you unique as a candidate? What driving force drives your commitment to fully acclimate into our company?',
      toneRubric: {
        scenarioTitle: 'Professional Growth & Merit Recognition Under Organizational Friction',
        scenarioContext: 'Evaluates your executive demeanor when handling career disappointment. Tests whether you maintain civility, eliminate toxicity, and advocate for advancement using objective milestones.',
        targetCompetencies: ['Cross-Functional Civility', 'Executive Self-Advocacy', 'Emotional Composure', 'Mission Alignment'],
        evaluationDimensions: [
          { name: 'Civility & Positive Light', weightPercent: 30, description: 'Zero toxicity, gossip, or belittling of peers; celebrates company progress while holding personal boundaries.' },
          { name: 'Objective Self-Advocacy', weightPercent: 30, description: 'Requests clear performance metrics, KPIs, and developmental mentorship rather than complaining.' },
          { name: 'Acoustic Demeanor & Composure', weightPercent: 25, description: 'Measured downward inflection, absence of bitter vocal tremolo, steady cadence (120-150 WPM).' },
          { name: 'Operational Commitment', weightPercent: 15, description: 'Affirms continued top-tier execution and collaborative team leadership.' }
        ],
        passingCriteria80: [
          'Acknowledges the director respectfully without attacking the promoted colleague',
          'Shifts conversation constructively toward personal milestones and concrete career goals',
          'Maintains steady acoustic pitch stability (>88%) and clear breath support'
        ],
        exemplarCriteria100: [
          'Proactively suggests high-impact stretch initiatives to prove readiness for the next promotion tier',
          'Exhibits genuine organizational empathy while establishing unambiguous future review check-ins',
          'Delivers flawless acoustic poise with low hesitation (<12%) and resonant vocal warmth'
        ],
        criticalFailureTraps: [
          'Insulting, demeaning, or attacking the colleague who was promoted (Instant Civility Breach)',
          'Threatening quiet-quitting, slowdowns, or passive-aggressive resistance',
          'Audible contempt, defensive vocal attacks, or hostile scoffing'
        ],
        responseFramework: [
          { step: '1. Poised Acknowledgment', action: 'Respect the leadership decision and affirm dedication to team success.', vocalDelivery: 'Calm, grounded opening tone (130 WPM)' },
          { step: '2. Metric-Driven Inquest', action: 'Ask for specific developmental criteria and gaps needed to reach the next tier.', vocalDelivery: 'Objective, steady pitch modulation' },
          { step: '3. Reaffirm Commitment', action: 'Set a concrete 60-day milestone check-in to review demonstrated readiness.', vocalDelivery: 'Decisive downward cadence' }
        ]
      },
      pressureRubric: {
        scenarioTitle: '2:00 AM Crisis Incident Command & Zero-Trust Containment',
        scenarioContext: 'Evaluates immediate crisis ownership, technical rigor, and unflinching camera composure when systems fail under emergency conditions.',
        targetCompetencies: ['Crisis Ownership', 'Zero-Trust Protocol Execution', 'Postural Gravitas', 'Stakeholder Transparency'],
        evaluationDimensions: [
          { name: 'Containment & Triage Rigor', weightPercent: 35, description: 'Immediate network isolation, token revocation, and forensic log preservation.' },
          { name: 'Executive Transparency', weightPercent: 30, description: 'Proactive, unhurried escalation without panic, cover-ups, or deflection.' },
          { name: 'Kinesic & Postural Stability', weightPercent: 20, description: 'Anchored camera eye contact (>90%), minimal nervous sway (<12 index), open shoulders.' },
          { name: 'Cross-Functional Incident Leadership', weightPercent: 15, description: 'Clear role assignment across triage, containment, and client communications.' }
        ],
        passingCriteria80: [
          'Identifies immediate containment actions before attempting destructive fixes',
          'States clear communication cadence for executive stakeholders',
          'Maintains centered visual presence with firm eye contact into the camera lens'
        ],
        exemplarCriteria100: [
          'Executes structured incident command system (ICS) triage with zero blame-shifting',
          'Balances aggressive containment with forensic evidence preservation for regulatory compliance',
          'Displays unflinching physical composure with under 8.0 postural sway index'
        ],
        criticalFailureTraps: [
          'Deflecting duty by claiming it is outside working hours or someone else’s fault (Dereliction of Duty)',
          'Concealing the incident from management or trying to cover up logs',
          'Shifting eyes frantically, nervous laughter, or visibly agitated body language'
        ],
        responseFramework: [
          { step: '1. Immediate Containment', action: 'Isolate affected subnets, invalidate session keys, and lock perimeter.', vocalDelivery: 'Authoritative, calm declaration' },
          { step: '2. Triage & Preservation', action: 'Capture volatile RAM artifacts and initiate root-cause log tracing.', vocalDelivery: 'Methodical, measured pace' },
          { step: '3. Stakeholder Cadence', action: 'Open bridge, brief executive leadership, and schedule 30-min updates.', vocalDelivery: 'Reassuring executive closure' }
        ]
      },
      motivationRubric: {
        scenarioTitle: 'Intrinsic Drive, Resilience & Authentic Self-Differentiation',
        scenarioContext: 'Evaluates authentic self-awareness, genuine core values, and what fuels your commitment to excel in mission-critical environments.',
        targetCompetencies: ['Authentic Motivation', 'Resilience & Grit', 'Integrity & Ethics', 'Role Dedication'],
        evaluationDimensions: [
          { name: 'Genuineness & Self-Awareness', weightPercent: 35, description: 'Authentic personal history rather than generic corporate buzzwords.' },
          { name: 'Resilience Under Adversity', weightPercent: 30, description: 'Evidence of overcoming major obstacles through dedication and grit.' },
          { name: 'Alignment with Company Mission', weightPercent: 20, description: 'Clear understanding of why this specific organization and culture matter.' },
          { name: 'Acoustic Sincerity', weightPercent: 15, description: 'Natural inflection, heartfelt vocal warmth, and authentic cadence.' }
        ],
        passingCriteria80: [
          'Articulates a clear personal narrative beyond superficial compensation',
          'Demonstrates how past challenges forged resilience and work ethic',
          'Speaks with authentic, unforced tone and sincere vocal cadence'
        ],
        exemplarCriteria100: [
          'Connects personal mission directly to the company’s long-term civility and technical vision',
          'Shares a vulnerable, high-integrity moment demonstrating uncompromising work ethic',
          'Exhibits deep executive resonance and compelling inspirational presence'
        ],
        criticalFailureTraps: [
          'Delivering hollow AI-generated clichés with zero personal specificity',
          'Stating purely transactional or cynical motivations',
          'Disengaged, monotone, or detached vocal delivery'
        ],
        responseFramework: [
          { step: '1. The Core Catalyst', action: 'Share the defining experience that forged your passion for technical excellence.', vocalDelivery: 'Warm, sincere opening' },
          { step: '2. The Proving Ground', action: 'Explain a crucible moment where grit and integrity triumphed over easy shortcuts.', vocalDelivery: 'Grounded, authentic delivery' },
          { step: '3. Shared Destiny', action: 'Articulate why you are committed to elevating this team to global leadership.', vocalDelivery: 'Inspirational forward cadence' }
        ]
      }
    }
  },
  {
    id: 'job-fin-02',
    title: 'Corporate Compliance & Operations Lead',
    roleName: 'Corporate Compliance & Operations Lead',
    ageRange: '21 - 65',
    minExperienceYears: 3,
    skills: ['Regulatory Compliance', 'Audit Oversight', 'Enterprise Risk Management', 'Financial Protocol'],
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
      motivationScenario: 'What core personal value drives your dedication to absolute integrity and operational excellence?',
      toneRubric: {
        scenarioTitle: 'Live Client Conflict & Compliance Boundary Defense',
        scenarioContext: 'Tests your ability to defend non-negotiable regulatory standards while preserving valuable client relationships under aggressive challenge.',
        targetCompetencies: ['Regulatory Integrity', 'De-escalation', 'Professional Diplomacy', 'Acoustic Gravitas'],
        evaluationDimensions: [
          { name: 'Boundary Steadfastness', weightPercent: 35, description: 'Refuses to dilute compliance standards despite client pushback or threats.' },
          { name: 'Empathetic De-escalation', weightPercent: 30, description: 'Validates client commercial concerns without becoming defensive or argumentative.' },
          { name: 'Acoustic Poise & Downward Cadence', weightPercent: 20, description: 'Steady, resonant vocal delivery with zero pitch shakiness or aggressive volume spikes.' },
          { name: 'Collaborative Resolution Track', weightPercent: 15, description: 'Offers constructive remediation paths and audit support.' }
        ],
        passingCriteria80: [
          'Affirms compliance requirements clearly without conceding legal standards',
          'Avoids matching the client’s hostile volume or confrontational tone',
          'Proposes a structured remediation review'
        ],
        exemplarCriteria100: [
          'De-escalates tension within the first 15 seconds through psychological mirroring and calm executive phrasing',
          'Articulates regulatory protections as safeguards for the client’s long-term business value',
          'Maintains pristine acoustic resonance (HNR > 18 dB, hesitation < 10%)'
        ],
        criticalFailureTraps: [
          'Capitulating or agreeing to alter audit findings under pressure (Compliance Breach)',
          'Shouting, insulting, or engaging in a personal argument with the client',
          'Nervous laughter, stalling, or admitting incompetence'
        ],
        responseFramework: [
          { step: '1. Neutralize Conflict', action: 'Acknowledge client concern calmly and clarify that audit rigor protects both parties.', vocalDelivery: 'Low, centered vocal tone' },
          { step: '2. Ground in Regulation', action: 'Cite the exact regulatory standard and non-negotiable compliance obligations.', vocalDelivery: 'Measured, objective articulation' },
          { step: '3. Remediation Runway', action: 'Offer a concrete remediation pathway with actionable timeline support.', vocalDelivery: 'Supportive, reassuring closure' }
        ]
      },
      pressureRubric: {
        scenarioTitle: 'Unannounced Regulatory Audit Execution Under Leadership Absence',
        scenarioContext: 'Tests executive composure and immediate procedural compliance when government auditors demand instant records while leadership is away.',
        targetCompetencies: ['Audit Protocol Compliance', 'Procedural Calm', 'Data Safeguards', 'Executive Presence'],
        evaluationDimensions: [
          { name: 'Procedural Protocol Rigor', weightPercent: 40, description: 'Immediate credential verification, escrow room escort, and document custody logs.' },
          { name: 'Poised Non-Panicked Delivery', weightPercent: 30, description: 'Maintains quiet authority without fluster, defensive pushback, or unauthorized document leaks.' },
          { name: 'Lens Anchoring & Presence', weightPercent: 20, description: 'Direct gaze, steady respiratory cadence, and balanced posture.' },
          { name: 'Chain-of-Custody Discipline', weightPercent: 10, description: 'Logging of all requested materials and notifying general counsel.' }
        ],
        passingCriteria80: [
          'Follows standard visitor escort and credentials inspection protocols',
          'Notifies legal and compliance leadership immediately without obstructing auditors',
          'Demonstrates professional, unflinching video demeanor'
        ],
        exemplarCriteria100: [
          'Executes complete regulatory staging protocol: credential verification, secure audit room assignment, legal notification, and strict log tracking',
          'Projects unwavering executive competence and transparency',
          'Demonstrates masterclass posture and zero nervous mannerisms'
        ],
        criticalFailureTraps: [
          'Refusing entry or obstructing lawful auditors (Regulatory Violation)',
          'Handing over unrestricted server or filing access without logging or counsel oversight',
          'Panicking on camera, stammering, or expressing fear of legal trouble'
        ],
        responseFramework: [
          { step: '1. Professional Welcome & ID', action: 'Welcome auditors, inspect credentials, and escort to the secure audit room.', vocalDelivery: 'Warm, professional composure' },
          { step: '2. Legal & Counsel Escalation', action: 'Notify General Counsel and department head with immediate notice.', vocalDelivery: 'Crisp, structured delivery' },
          { step: '3. Regulated Intake', action: 'Provide document request forms and maintain unbroken custody logs.', vocalDelivery: 'Decisive, compliant finish' }
        ]
      },
      motivationRubric: {
        scenarioTitle: 'Ethical Anchor & The Philosophy of Uncompromising Compliance',
        scenarioContext: 'Evaluates what drives your moral compass and commitment to organizational protection.',
        targetCompetencies: ['Ethical Fortitude', 'Long-Term Stewardship', 'Systemic Integrity', 'Authentic Voice'],
        evaluationDimensions: [
          { name: 'Moral Philosophy', weightPercent: 40, description: 'Clear personal ethos of honesty, accountability, and fiduciary duty.' },
          { name: 'Real-World Testing', weightPercent: 30, description: 'Demonstrated consistency when ethical choices carried personal or professional cost.' },
          { name: 'Vocal Authenticity', weightPercent: 30, description: 'Heartfelt, grounded vocal delivery without superficial posturing.' }
        ],
        passingCriteria80: ['Defines ethics with personal specificity', 'Avoids generic jargon', 'Projects sincere vocal conviction'],
        exemplarCriteria100: ['Articulates compliance as moral stewardship of stakeholder trust', 'Demonstrates uncompromising integrity under pressure', 'Vocal resonance reflects profound personal grounding'],
        criticalFailureTraps: ['Cynical view of compliance as mere paperwork', 'Vague or evasive answers', 'Apathetic tone'],
        responseFramework: [
          { step: '1. My Anchor', action: 'State your non-negotiable standard for corporate ethics.', vocalDelivery: 'Resonant and firm' },
          { step: '2. The Crucible', action: 'Describe a moment where integrity took precedence over convenience.', vocalDelivery: 'Grounded and reflective' },
          { step: '3. My Contribution', action: 'Affirm how this standard elevates organizational safety.', vocalDelivery: 'Decisive closing' }
        ]
      }
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
      motivationScenario: 'What fuels your passion to continuously master emerging AI technologies and build enduring software?',
      toneRubric: {
        scenarioTitle: 'P1 Production Outage Leadership & Blameless Post-Mortem',
        scenarioContext: 'Evaluates architectural leadership and emotional grounding when a critical deployment fails during peak commercial load.',
        targetCompetencies: ['Incident Command', 'Blameless Problem Solving', 'Technical Composure', 'Rapid Rollback Protocol'],
        evaluationDimensions: [
          { name: 'Immediate Rollback Action', weightPercent: 35, description: 'Instant restoration of green build / canary rollback before debugging in prod.' },
          { name: 'Blameless Civility', weightPercent: 30, description: 'Zero finger-pointing or blaming individual developers; focuses entirely on process and telemetry.' },
          { name: 'Acoustic Calm Under Fire', weightPercent: 20, description: 'Low, steady vocal cadence (125-145 WPM) that prevents team panic.' },
          { name: 'Prevention Safeguards', weightPercent: 15, description: 'Establishes automated merge gate tests to prevent recurrence.' }
        ],
        passingCriteria80: ['Initiates rollback immediately', 'Maintains respectful, composed voice tone', 'Focuses on systems rather than blame'],
        exemplarCriteria100: ['Executes instant blue-green traffic diversion, establishes blameless post-mortem framework, and outlines CI/CD gating improvements with unflinching calm', 'Vocal pitch stability > 94% with zero erratic cadence shifts'],
        criticalFailureTraps: ['Blaming the engineer who merged the PR (Civility Breach)', 'Debugging live in production while users suffer downtime', 'Shouting, panic, or dismissing team members'],
        responseFramework: [
          { step: '1. Containment First', action: 'Issue immediate rollback to the previous verified hash.', vocalDelivery: 'Calm, authoritative command' },
          { step: '2. Triage & Transparency', action: 'Verify customer traffic stabilization and update status page.', vocalDelivery: 'Steady, unhurried cadence' },
          { step: '3. Blameless Root Cause', action: 'Convene blameless retro to fortify automated CI/CD gating.', vocalDelivery: 'Constructive forward tone' }
        ]
      },
      pressureRubric: {
        scenarioTitle: 'High-Stakes Live Enterprise Latency Crisis',
        scenarioContext: 'Tests candidate ability to diagnose and mitigate catastrophic latency spikes in real time during a multi-million-dollar customer demonstration.',
        targetCompetencies: ['Systems Diagnosis', 'Grace Under Pressure', 'Customer Confidence', 'Graceful Degradation'],
        evaluationDimensions: [
          { name: 'Graceful Degradation Protocol', weightPercent: 35, description: 'Enables caching fallbacks and throttles non-essential background jobs.' },
          { name: 'Customer Communication Poise', weightPercent: 30, description: 'Addresses client with transparency and confidence without defensive excuses.' },
          { name: 'Camera Presence & Posture', weightPercent: 20, description: 'Firm, relaxed shoulder alignment and steady eye contact.' },
          { name: 'Root Cause Isolation', weightPercent: 15, description: 'Identifies connection pooling exhaustion or query lock contention.' }
        ],
        passingCriteria80: ['Enables fallback mechanisms', 'Communicates honestly without panic', 'Maintains steady camera presence'],
        exemplarCriteria100: ['Demonstrates masterclass systems command: sheds non-critical query load, shifts to read-replica cache, transparently briefs client on self-healing architecture, and maintains immaculate postural composure (<7 sway)'],
        criticalFailureTraps: ['Denying the problem or gaslighting the client', 'Panicking or restarting the production database recklessly', 'Defensive anger or fidgeting on camera'],
        responseFramework: [
          { step: '1. Transparent Acknowledgment', action: 'Acknowledge latency calmly and trigger automated failover.', vocalDelivery: 'Smooth, unflappable executive composure' },
          { step: '2. Load Shedding & Cache', action: 'Divert heavy analytics queries to read replicas and isolate primary.', vocalDelivery: 'Technical precision, steady pitch' },
          { step: '3. Resilient Delivery', action: 'Continue demo seamlessly on cached tier while background resolves.', vocalDelivery: 'Confident, reassuring finish' }
        ]
      },
      motivationRubric: {
        scenarioTitle: 'Architectural Vision, Craftsmanship & The Pursuit of Enduring Systems',
        scenarioContext: 'Evaluates your passion for technical excellence, systems integrity, and enduring engineering craftsmanship.',
        targetCompetencies: ['Engineering Passion', 'Long-Term Systems Thinking', 'Technical Curiosity', 'Culture of Craft'],
        evaluationDimensions: [
          { name: 'Dedication to Craft', weightPercent: 40, description: 'Commitment to maintainable, elegant code over quick disposable hacks.' },
          { name: 'Continuous Mastery', weightPercent: 30, description: 'Active engagement with frontier AI research and autonomous architectures.' },
          { name: 'Authentic Vocal Resonance', weightPercent: 30, description: 'Inspiring, heartfelt delivery demonstrating genuine love of building.' }
        ],
        passingCriteria80: ['Articulates genuine love of systems building', 'Discusses continuous learning habits', 'Speaks with natural enthusiasm'],
        exemplarCriteria100: ['Articulates a compelling vision for human-centered, resilient AI architectures with profound intellectual depth and contagious passion'],
        criticalFailureTraps: ['Cynical view of coding or technology', 'Transactional indifference', 'Flat, uninspired monotone'],
        responseFramework: [
          { step: '1. The Spark', action: 'Share what initially ignited your obsession with software creation.', vocalDelivery: 'Warm, energized opening' },
          { step: '2. The Craft', action: 'Explain your engineering philosophy regarding simplicity and durability.', vocalDelivery: 'Deep, deliberate articulation' },
          { step: '3. The Horizon', action: 'Outline how you intend to push the frontier of intelligent systems here.', vocalDelivery: 'Inspirational forward cadence' }
        ]
      }
    }
  }
];

export const PIONEER_RONNIE_HILL_PROFILE: CandidateProfile = {
  id: 'pioneer-ronnie-hill-01',
  fullName: 'Ronnie Hill',
  email: 'ronniehillsugc@gmail.com',
  phone: '+1 (512) 840-2910',
  locationCity: 'Austin, TX',
  coordinates: {
    lat: 30.2672,
    lng: -97.7431
  },
  geohash: '9v6s42u',
  age: 38,
  experienceYears: 14,
  skills: [
    'Systems Architecture',
    'AI Kinesics & Acoustic DSP',
    'Civility Framework Design',
    'Organizational Psychology',
    'Autonomous Recruitment Design',
    'Cross-Functional Leadership'
  ],
  distanceFromCompanyMiles: 12,
  willingToRelocate: true,
  bgCheckConsented: true,
  bgCheckSignedAt: new Date().toISOString(),
  bgCheckSsnLast4: '7704',
  currentCompany: 'Mind Your Manners Global',
  currentRole: 'Platform Founder & Lead Pioneer Architect',
  isCompetitorProspect: false,
  matchesUniqueExceptions: true,
  exceptionMatchReason: 'Platform Pioneer & Inventor: Conceptualized zero-interview autonomous hiring, positive archetype calibration, and lifelong civility ecosystem.',
  status: 'top_prospect',
  archetypeProjection: {
    title: 'The Resilient Pioneer & Systems Luminary',
    primaryCategory: 'Executive Strategist',
    summary: 'Ronnie operates as an uncommon visionary who synthesizes deep human empathy, ethical steadfastness, and structural systems logic to build transformative platforms. Where others see friction, he engineers enduring harmony.',
    dimensions: {
      resilience: 99,
      ethicsIntegrity: 100,
      diplomaticTact: 98,
      highPressureComposure: 97,
      innovationDrive: 100
    },
    keyBehavioralTraits: [
      'Pioneering Vision: Architects foundational ecosystems where none existed before',
      'Radical Empathy & Compassion: Channels personal life adversity into empowering platforms for others',
      'Uncompromising Ethical Anchor: Establishes fair, objective, and unbiased standards',
      'Relentless Perseverance: Builds life\'s palace with unwavering dedication and craftsman precision'
    ],
    optimalWorkEnvironment: 'High-impact visionary leadership, groundbreaking venture ecosystems, and organizations dedicated to human elevation.',
    questionsAnswers: {
      'Work Leadership Style': 'Lead by quiet exemplary integrity, empowering every individual to realize their truest potential.',
      'Conflict Vector': 'De-escalate friction into unifying momentum through active listening and shared purpose.',
      'Crisis Temperament': 'Rock-solid calm equilibrium that grounds teams during high-stakes uncertainty.',
      'Ethical Stance': 'Integrity is absolute and non-negotiable; true honor is built when nobody is watching.',
      'Innovation & Drive': 'Fueled by an unquenchable drive to solve deep human challenges and leave a lasting legacy.'
    },
    generatedAt: new Date().toISOString()
  },
  submission: {
    jobId: 'job-dev-03',
    candidateName: 'Ronnie Hill',
    candidateEmail: 'ronniehillsugc@gmail.com',
    candidateCity: 'Austin, TX',
    bgCheckConsented: true,
    bgCheckSignedAt: new Date().toISOString(),
    bgCheckSsnLast4: '7704',
    ethicsAnswers: {
      'Ethics Q1': 'Integrity is the bedrock of everything. When facing ethical dilemmas, transparency and protective accountability come before short-term convenience.',
      'Ethics Q2': 'I proactively advocate for ethical standards and psychological safety, creating environments where everyone thrives with dignity.'
    },
    etiquetteAnswers: {
      'Etiquette Q1': 'I deliver feedback and communicate findings with precision, warm diplomatic poise, and constructive solutions.',
      'Etiquette Q2': 'Confidentiality and system trust are safeguarded with rigorous personal and operational discipline.'
    },
    mannersAnswers: {
      'Manners Q1': 'Under intense pressure, true character shines through respectful words, steady breath, and gratitude toward fellow team members.',
      'Manners Q2': 'When mistakes happen, I take full personal ownership immediately and turn the event into an institutional learning milestone.'
    },
    toneAudioTranscript: 'When challenges arise, my commitment is to keep everyone calm, focused, and aligned on our mission with unconditional respect.',
    toneAudioDurationSec: 32,
    toneAudioUrl: '',
    vocalEvaluation: {
      overallVocalScore: 98.4,
      pitchModulationScore: 97.5,
      emotionalComposureScore: 99.0,
      cadencePacingScore: 98.0,
      verbalSubstanceScore: 99.2,
      exactGrade: '98.4% - Executive Sovereign Poise • Pioneer Standard',
      isPassing: true,
      ladderStatus: 'Pioneer Apex Standard • Gold Honor Roll',
      acousticMetrics: {
        pitchStabilityPercent: 98.6,
        decibelSteadiness: 'Optimal Dynamic Resonance (58 - 66 dB)',
        speechPacingWpm: 134,
        silenceHesitationRatioPercent: 4.2,
        inflectionWarmthRating: 'Warm Sovereign Diplomatic'
      },
      vocalToneFeedback: 'Exceptional resonance, stable acoustic cadence, and authentic vocal warmth that inspires confidence.',
      verbalResponseFeedback: 'Articulate, grounded, and deeply principled communication.',
      whatNeedsImprovementToReach100: 'Continue leading as the beacon of vocal composure.',
      whatShouldHaveBeenDoneInstead: 'Exemplary delivery achieved.',
      exemplarVocalDelivery: 'Maintain this measured sovereign tone across all executive engagements.',
      keyStrengths: ['Sovereign pitch equilibrium', 'Vocal warmth and resonance', 'Zero defensive tremor'],
      coachingTipsForPerfection: ['Continue inspiring teams with steady cadences.'],
      evaluatedAt: new Date().toISOString()
    },
    pressureVideoTranscript: 'In moments of crisis, we step into the breach. We isolate the problem, protect our people, communicate transparently, and execute the containment protocol step-by-step.',
    pressureVideoDurationSec: 45,
    pressureVideoUrl: '',
    videoEvaluation: {
      overallVideoScore: 98.8,
      bodyLanguageScore: 99.0,
      responseToneScore: 98.5,
      crisisResponseSubstanceScore: 99.0,
      genuineResponseScore: 99.2,
      exactGrade: '98.8% - Certified Sovereign Kinesics • Zero Panic Anchor',
      isPassing: true,
      ladderStatus: 'Pioneer Benchmark Passed (98.8%)',
      scientificKinesics: {
        presenceDetected: true,
        presenceConfidencePercent: 99.5,
        diagnosticMessage: 'Pioneer Subject Verified',
        oculometrics: {
          fixationRatioPercent: 96.5,
          saccadeFrequencyPerMin: 14.0,
          gazeAversionPattern: 'direct_anchored',
          cognitiveVsNervousAnalysis: 'Masterful lens anchoring with natural cognitive lateral pauses.',
          blinkRatePerMin: 16.0,
          blinkStressClassification: 'normal_relaxed'
        },
        kinesicMovements: {
          posturalSwayIndex: 8.0,
          adaptorFrequency: 'Minimal / Grounded',
          illustratorEffectiveness: 'High Speech-Gesture Synchrony',
          nervousSystemState: 'regulated_ventral',
          shoulderTensionScore: 12
        },
        developmentalTrainingPlan: {
          candidateField: 'Executive Systems Pioneer',
          primaryGrowthArea: 'Global Scaling & Leadership Amplification',
          scientificBehavioralInsight: 'Natural ventral vagal regulation inspires visceral security across teams.',
          dailyDrills: [
            {
              title: 'Visionary Horizon Calibration',
              objective: 'Expand strategic reach across global networks.',
              protocol: 'Deliver inspiring executive addresses with unwavering cadence.',
              scientificRationale: 'Synchronizes cross-functional teams around visionary goals.'
            }
          ],
          careerProjectionAdvantage: 'Exemplifies world-class executive poise and mission-driven conviction.'
        }
      },
      bodyLanguageMetrics: {
        eyeContactConsistencyPercent: 96.5,
        postureSteadinessPercent: 98.0,
        facialComposureRating: 'Commanding Executive Poise',
        fidgetingIndex: 'Minimal / Grounded',
        gesturePoise: 'Purposeful & Sovereign'
      },
      bodyLanguageFeedback: 'Exemplary upright posture with unwavering lens lock and calm respiratory cadence.',
      responseToneFeedback: 'Measured, warm, authoritative vocal timbre with natural empathetic inflection.',
      crisisMitigationFeedback: 'Flawless strategic alignment, rapid prioritization, and calm stakeholder reassurance.',
      whatNeedsImprovementToReach100: 'Continue expanding global visionary reach.',
      whatShouldHaveBeenDoneInstead: 'Candidate executed optimal pioneer benchmark response.',
      exemplarCrisisResponse: 'Maintain centered eye focus and articulate step-by-step organizational alignment.',
      keyStrengths: [
        '96.5% Optical Lens Lock',
        'Ventral Vagal Regulated Composure',
        'Visionary Executive Conviction'
      ],
      coachingTipsForPerfection: [
        'Maintain current sovereign cadence across all international boardrooms'
      ],
      evaluatedAt: new Date().toISOString()
    },
    callingVideoPrompt: 'Introduce yourself to the self you know you\'ve always been. What\'s your passion and your life experience endeavors that formed you as a person. Have you had a chance to build your lifes palace built by that passion and how has compassion fueled the path to now form to your truest potential?.',
    callingVideoTranscript: 'I introduce myself to the self I have always known inside: a builder, a protector, and a tireless visionary who believes every human deserves a fair chance to show who they truly are. Through life endeavors filled with both intense fire and profound learning, compassion became the compass that directed my passion. I have dedicated myself to building this palace—a platform where character, manners, and true human spirit rise above superficial noise and bring people together until retirement.',
    callingVideoDurationSec: 62,
    callingVideoUrl: '',
    trueCallingEvaluation: {
      overallCallingScore: 99.4,
      callingSummary: 'Ronnie Hill embodies the rare archetype of the Compassionate Pioneer Architect. His life endeavors have forged an inner self anchored in profound empathy, craftsmanship, and visionary execution. His passion is grounded in the noble pursuit of building enduring palaces of opportunity for others.',
      passionHighestPointAnalysis: {
        currentZenithScore: 99,
        isAtPeak: true,
        howToFuelToHighestPoint: 'His passion is operating at its maximum zenith—deploying Mind Your Manners globally to eradicate hiring friction and unlock human civility worldwide.',
        acceleratorConditions: [
          'Global institutional adoption across corporate enterprises',
          'Empowering millions of overlooked candidates to shine on their truest merits',
          'Continuous innovation in autonomous behavioral and acoustic evaluation'
        ]
      },
      innerSelfAttributes: {
        compassionGravityScore: 100,
        authenticConvictionScore: 99,
        resilientIntegrityScore: 100,
        visionaryPalaceScore: 99,
        unshakablePurposeScore: 100
      },
      lifesPalaceArchitecture: {
        foundationLifeEndeavors: 'Forged in real-world perseverance, deep human observation, and relentless commitment to building lasting platforms.',
        compassionFuelDescription: 'Compassion is the foundational mortar that binds every system together, turning cold technology into an uplifting human sanctuary.',
        truestPotentialManifesto: 'To lead a global movement that replaces adversarial workplace dynamics with lifelong mutual respect, honor, and continuous growth.'
      },
      unseenCallingOpportunities: [
        {
          title: 'Global Civility & Human Potential Ambassador',
          reasoning: 'Your unique ability to articulate the dignity of human work positions you to lead international symposiums on the future of ethical labor.',
          whyPreviouslyUnseen: 'Often obscured by day-to-day technical execution, yet your spoken word carries profound moral authority.',
          actionableFirstStep: 'Author the foundational Mind Your Manners Civility Manifesto for Fortune 500 boardrooms.'
        },
        {
          title: 'Venture Architect for Ethical AI & Autonomous Systems',
          reasoning: 'You possess the rare dual intuition of engineering rigorous technical architectures while preserving human warmth.',
          whyPreviouslyUnseen: 'Most AI leaders prioritize speed over human dignity; your synthesis creates a new category of technology.',
          actionableFirstStep: 'Expand the patent-ready T.H.I.S. Truest Grade scoring engine into enterprise education.'
        }
      ],
      keyStrengths: [
        'Unshakable Moral Compass',
        'Palace-Building Craftsmanship',
        'Profound Compassionate Gravity',
        'Enduring Resilience Under Fire'
      ],
      candidateReflectivePitch: '"I am a pioneer who transforms adversity into enduring architecture. My life is dedicated to building systems where compassion and excellence elevate humanity."',
      evaluatedAt: new Date().toISOString()
    },
    motivationVideoTranscript: 'My driving force is to leave this world better than I found it, providing millions of people with a pathway to dignified work and lifelong fulfillment.',
    motivationVideoDurationSec: 40,
    motivationVideoUrl: '',
    submittedAt: new Date().toISOString()
  },
  evaluation: {
    civilityScore: 98.6,
    toneScore: 98.4,
    ethicsScore: 100,
    pressureScore: 98.8,
    driveScore: 99.5,
    overallSummary: 'Pioneer Benchmark: Exemplifies supreme ethical alignment, calm sovereign composure, and unmatched visionary drive.',
    toneEvaluation: 'Measured, warm, and diplomatically resonant under all conversational contexts.',
    pressureEvaluation: 'Zero panic kinesic baseline; instantly establishes calm structural command.',
    ethicsEvaluation: 'Absolute 100/100 integrity standard with uncompromising adherence to human dignity.',
    driveEvaluation: 'Visionary pioneer motivation fueled by genuine compassion and generational ambition.',
    keyStrengths: [
      'Pioneer Sovereign Leadership',
      'Deep Compassion & High-EQ Gravity',
      'Systems Architecture Mastery',
      'Unflinching Ethical Resilience'
    ],
    potentialRisks: [],
    recommendationTier: 'Top Prospect',
    evaluatedAt: new Date().toISOString()
  }
};

export const INITIAL_CANDIDATES: CandidateProfile[] = [];

export const INITIAL_TALENT_RADAR_SIGNALS: TalentRadarSignal[] = [
  {
    id: 'signal-01',
    platform: 'Competitor Watch',
    candidateName: 'Dr. Sarah Jenkins',
    currentCompany: 'The Future Corp.',
    roleTitle: 'VP of AI Threat Intelligence',
    signalDescription: 'The Future Corp. recently announced organizational restructuring. Sarah updated her profile status to "Open to Strategic Advisory & Executive Leadership".',
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

export const INITIAL_EMPLOYEE_JOURNEYS: import('../types').EmployeeJourneyRecord[] = [
  {
    id: 'emp-001',
    employeeName: 'Jordan Taylor',
    email: 'jordan.taylor@mindyourmanners.io',
    role: 'Staff AI Systems Architect',
    department: 'Engineering & AI Ethics',
    hireDate: '2025-03-15',
    certificationLevel: 'Senior Ethics Certified',
    overallCurrentScore: 94,
    lastAssessedAt: '2026-07-10',
    assignedRefresherModules: [
      'Q3 2026 De-escalation Under Live Outage Pressure',
      'AI Privacy & Data Leakage Prevention 2026'
    ],
    scorecardHistory: [
      {
        id: 'sc-101',
        employeeId: 'emp-001',
        employeeName: 'Jordan Taylor',
        evaluationDate: '2025-03-15',
        assessmentType: 'Baseline Hire',
        civilityScore: 82,
        toneScore: 80,
        ethicsScore: 86,
        pressureScore: 81,
        driveScore: 83,
        overallScore: 82,
        deltaImprovementPercent: 0,
        managerNotes: 'Strong initial technical foundation; baseline composure during crisis interview was solid.',
        keyImprovements: ['Initial Civility Onboarding', 'Ethics Protocol Familiarization'],
        focusAreasForNextQuarter: ['Vocal Tone Moderation during Live Incident Outages'],
        completedModulesCount: 1,
        status: 'verified'
      },
      {
        id: 'sc-102',
        employeeId: 'emp-001',
        employeeName: 'Jordan Taylor',
        evaluationDate: '2025-10-12',
        assessmentType: 'Q3 Review',
        civilityScore: 88,
        toneScore: 86,
        ethicsScore: 91,
        pressureScore: 87,
        driveScore: 89,
        overallScore: 88,
        deltaImprovementPercent: 7,
        managerNotes: 'Demonstrated notable composure during production database latency incident. Vocal tone stayed calm and objective.',
        keyImprovements: ['Crisis Tone Control (+6)', 'Team De-escalation'],
        focusAreasForNextQuarter: ['Cross-functional Ethics Mentorship'],
        completedModulesCount: 3,
        status: 'verified'
      },
      {
        id: 'sc-103',
        employeeId: 'emp-001',
        employeeName: 'Jordan Taylor',
        evaluationDate: '2026-07-10',
        assessmentType: 'Q2 Review',
        civilityScore: 94,
        toneScore: 93,
        ethicsScore: 97,
        pressureScore: 92,
        driveScore: 95,
        overallScore: 94,
        deltaImprovementPercent: 7,
        managerNotes: 'Exceptional journey growth! Spearheaded AI safety gateway proxies and maintains near-perfect composure scores.',
        keyImprovements: ['AI Safety Protocols', 'Airtight Crisis Composure', 'Leadership Voice'],
        focusAreasForNextQuarter: ['Executive Board Communication'],
        completedModulesCount: 6,
        status: 'verified'
      }
    ]
  },
  {
    id: 'emp-002',
    employeeName: 'Alex Mercer',
    email: 'alex.mercer@mindyourmanners.io',
    role: 'Senior Ethics Compliance Officer',
    department: 'Legal & Regulatory Affairs',
    hireDate: '2025-06-01',
    certificationLevel: 'Master Ambassador',
    overallCurrentScore: 96,
    lastAssessedAt: '2026-06-20',
    assignedRefresherModules: [
      '2026 T.H.I.S. Compliance & Protocol Guidelines'
    ],
    scorecardHistory: [
      {
        id: 'sc-201',
        employeeId: 'emp-002',
        employeeName: 'Alex Mercer',
        evaluationDate: '2025-06-01',
        assessmentType: 'Baseline Hire',
        civilityScore: 85,
        toneScore: 84,
        ethicsScore: 90,
        pressureScore: 82,
        driveScore: 84,
        overallScore: 85,
        deltaImprovementPercent: 0,
        managerNotes: 'Legal acumen is top tier; baseline manners and tone during challenging scenarios was high.',
        keyImprovements: ['T.H.I.S. Audit Training'],
        focusAreasForNextQuarter: ['High-Stress Executive Deposition Simulations'],
        completedModulesCount: 1,
        status: 'verified'
      },
      {
        id: 'sc-202',
        employeeId: 'emp-002',
        employeeName: 'Alex Mercer',
        evaluationDate: '2026-06-20',
        assessmentType: 'Annual Refresher',
        civilityScore: 96,
        toneScore: 95,
        ethicsScore: 99,
        pressureScore: 94,
        driveScore: 93,
        overallScore: 96,
        deltaImprovementPercent: 13,
        managerNotes: 'Mastery level performance across all regulatory and interpersonal dimensions.',
        keyImprovements: ['Regulatory Precision', 'Unflappable Deposition Demeanor'],
        focusAreasForNextQuarter: ['Company-wide Civility Workshops'],
        completedModulesCount: 5,
        status: 'verified'
      }
    ]
  },
  {
    id: 'emp-003',
    employeeName: 'Elena Vance',
    email: 'elena.vance@mindyourmanners.io',
    role: 'Lead Customer Relations Director',
    department: 'Client Success & Relations',
    hireDate: '2025-09-10',
    certificationLevel: 'Executive Crisis Master',
    overallCurrentScore: 92,
    lastAssessedAt: '2026-05-15',
    assignedRefresherModules: [
      'Q3 Enterprise Customer Incident Escalations'
    ],
    scorecardHistory: [
      {
        id: 'sc-301',
        employeeId: 'emp-003',
        employeeName: 'Elena Vance',
        evaluationDate: '2025-09-10',
        assessmentType: 'Baseline Hire',
        civilityScore: 78,
        toneScore: 76,
        ethicsScore: 82,
        pressureScore: 75,
        driveScore: 79,
        overallScore: 78,
        deltaImprovementPercent: 0,
        managerNotes: 'Strong customer empathy; initial pressure response showed slight hesitation when escalated.',
        keyImprovements: ['Customer Success Onboarding'],
        focusAreasForNextQuarter: ['Escalated Client Conflict De-escalation'],
        completedModulesCount: 1,
        status: 'verified'
      },
      {
        id: 'sc-302',
        employeeId: 'emp-003',
        employeeName: 'Elena Vance',
        evaluationDate: '2026-05-15',
        assessmentType: 'Q1 Review',
        civilityScore: 92,
        toneScore: 91,
        ethicsScore: 94,
        pressureScore: 90,
        driveScore: 93,
        overallScore: 92,
        deltaImprovementPercent: 18,
        managerNotes: 'Outstanding progress! Elena has transformed client dispute resolution into a key corporate strength.',
        keyImprovements: ['Active De-escalation Mastery (+15)', 'Calm Vocal Cadence'],
        focusAreasForNextQuarter: ['Mentoring Junior Client Leads'],
        completedModulesCount: 4,
        status: 'verified'
      }
    ]
  }
];

export const INITIAL_RECENT_HIRES_FEED: import('../types').RecentHireFeedItem[] = [
  {
    id: 'hire-feed-01',
    candidateName: 'Sarah Connor, CISSP',
    candidateRole: 'Senior Cybersecurity Threat Operations Engineer',
    previousCompany: 'The Future Corp.',
    locationCity: 'Austin, TX',
    linkedinUrl: 'https://linkedin.com/in/sarah-connor-cyber',
    hiredDate: '2026-08-15',
    civilityScore: 98,
    hiredForJobTitle: 'Senior Cybersecurity Threat Operations Engineer',
    scoutedBy: 'Outbound LinkedIn Scout (Recruiter OAuth)',
    keyStrengthBadge: 'Zero Trust Crisis Diplomat • Truest Grade (98/100)',
    likesCount: 14,
    likedByUsers: ['Recruiter Scout', 'Chief Talent Officer'],
    comments: [
      {
        id: 'c-01',
        authorName: 'Sarah Lin',
        authorRole: 'VP of Cyber Engineering',
        text: 'Extremely impressed by Sarah’s unflappable vocal cadence during 2 AM threat triage drills!',
        timestamp: '1 day ago'
      },
      {
        id: 'c-02',
        authorName: 'Marcus Vance',
        authorRole: 'Chief Talent Officer',
        text: 'Scouted directly via LinkedIn Open to Work network. Seamless onboarding complete!',
        timestamp: '18 hours ago'
      }
    ],
    announcementText: '🎉 Official Hire Announcement: Sarah Connor has joined our cybersecurity operations unit after excelling in live vocal de-escalation and crisis management scenarios!',
    timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString()
  },
  {
    id: 'hire-feed-02',
    candidateName: 'David Chen',
    candidateRole: 'Head of Regulatory Audit & Corporate Compliance',
    previousCompany: 'Metropolitan Financial Group',
    locationCity: 'New York, NY',
    linkedinUrl: 'https://linkedin.com/in/david-chen-compliance',
    hiredDate: '2026-08-12',
    civilityScore: 96,
    hiredForJobTitle: 'Corporate Compliance & Operations Lead',
    scoutedBy: 'LinkedIn Executive Talent Radar',
    keyStrengthBadge: 'Ethical Sentinel • Master Auditor',
    likesCount: 19,
    likedByUsers: ['Executive Committee', 'Legal Compliance Lead'],
    comments: [
      {
        id: 'c-03',
        authorName: 'Alex Mercer',
        authorRole: 'Senior Ethics Officer',
        text: 'Spotless regulatory audit history. Thrilled to have David leading our compliance team!',
        timestamp: '3 days ago'
      }
    ],
    announcementText: '💼 Executive Scout Success: David Chen was imported from LinkedIn and scored 96% on T.H.I.S. ethical integrity & diplomatic conflict resolution!',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'hire-feed-03',
    candidateName: 'Rachel Miller',
    candidateRole: 'Lead AI & Full-Stack Systems Architect',
    previousCompany: 'Frontier AI Systems',
    locationCity: 'Seattle, WA',
    linkedinUrl: 'https://linkedin.com/in/rachel-miller-ai',
    hiredDate: '2026-08-08',
    civilityScore: 95,
    hiredForJobTitle: 'Lead AI & Full-Stack Systems Architect',
    scoutedBy: 'LinkedIn Outbound Resume Scout',
    keyStrengthBadge: 'Adaptive Catalyst • Open Source Contributor',
    likesCount: 27,
    likedByUsers: ['Engineering Lead', 'Recruiter Scout'],
    comments: [
      {
        id: 'c-04',
        authorName: 'Jordan Taylor',
        authorRole: 'Staff Architect',
        text: 'Rachel brings 2,500+ GitHub stars on distributed AI orchestration. Huge win for engineering!',
        timestamp: '6 days ago'
      }
    ],
    announcementText: '🚀 High Velocity Hire: Rachel Miller accepted our offer for Lead AI Systems Architect after passing our live outage pressure simulation with top honors!',
    timestamp: new Date(Date.now() - 86400000 * 8).toISOString()
  }
];

export const INITIAL_COMPANY_ADS: import('../types').CompanyJobAd[] = [];

export const INITIAL_AD_APPLICATIONS: import('../types').AdApplication[] = [];

export const INITIAL_COMMISSION_INVOICES: import('../types').CommissionInvoiceRecord[] = [];


