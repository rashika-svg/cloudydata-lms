/* ============================================================
   Course catalogue.

   Titles, durations and prices mirror cloudydata.in. The public site
   lists tools and outcomes but not a lesson-level syllabus, so each
   module below is derived from the tools that course advertises — it
   gives the LMS real material to render and track progress against.

   Authoring format: modules are written as compact tuples and expanded
   at load. Keeps ~600 lessons declarative instead of 600 object literals.
   ============================================================ */

export type LessonKind = 'video' | 'lab' | 'project' | 'quiz'

export interface Lesson {
  id: string
  title: string
  minutes: number
  kind: LessonKind
}

export interface Module {
  id: string
  title: string
  summary: string
  lessons: Lesson[]
}

export type Accent = 'cyan' | 'violet' | 'lime' | 'amber' | 'rose'

export interface Course {
  slug: string
  title: string
  short: string
  category: 'Data' | 'Engineering' | 'Marketing' | 'Security' | 'Business'
  durationLabel: string
  months: number | null
  priceINR: number
  /** Struck-through anchor price. Presentational only — same ratio for every course. */
  mrpINR: number
  level: 'Beginner' | 'Beginner → Intermediate' | 'Intermediate' | 'Intermediate → Advanced' | 'Advanced'
  mode: string
  rating: number
  learners: number
  projects: number
  accent: Accent
  tagline: string
  description: string
  tools: string[]
  outcomes: string[]
  curriculum: Module[]
}

/* ---- Authoring helpers ----------------------------------- */

type LessonTuple = [title: string, minutes: number, kind?: LessonKind]
type ModuleTuple = [title: string, summary: string, lessons: LessonTuple[]]

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

function buildCurriculum(courseSlug: string, mods: ModuleTuple[]): Module[] {
  return mods.map(([title, summary, lessons], mi) => ({
    id: `${courseSlug}-m${mi + 1}`,
    title,
    summary,
    lessons: lessons.map(([lt, minutes, kind = 'video'], li) => ({
      id: `${courseSlug}-m${mi + 1}-l${li + 1}-${slugify(lt).slice(0, 24)}`,
      title: lt,
      minutes,
      kind,
    })),
  }))
}

/* ---- Reusable module blocks -----------------------------
   Several programmes genuinely share foundations (Python, SQL, the
   career track). Defining them once keeps the catalogue honest about
   that overlap — and keeps this file a fraction of the size. */

const PYTHON_BLOCK: ModuleTuple = [
  'Python for Data',
  'From syntax to the analysis stack — the language you will use in every later module.',
  [
    ['Setting up Python, Jupyter & VS Code', 18],
    ['Types, control flow and functions', 42],
    ['Lists, dicts, sets and comprehensions', 38],
    ['NumPy arrays and vectorised thinking', 46],
    ['pandas: Series, DataFrames, indexing', 55],
    ['Cleaning messy real-world data', 50, 'lab'],
    ['Group-by, merge and reshape', 44],
    ['Lab: wrangle a 1M-row sales extract', 60, 'lab'],
    ['Module checkpoint', 12, 'quiz'],
  ],
]

const SQL_BLOCK: ModuleTuple = [
  'SQL — Basic to Advanced',
  'The single most-tested skill in data interviews, taken all the way to window functions.',
  [
    ['Relational modelling and schema reading', 26],
    ['SELECT, WHERE, ORDER BY, LIMIT', 34],
    ['Joins: inner, outer, self and anti', 48],
    ['Aggregations, GROUP BY and HAVING', 36],
    ['Subqueries and CTEs', 42],
    ['Window functions: rank, lag, running totals', 54],
    ['Query performance and indexes', 38],
    ['Lab: 30 interview SQL problems', 90, 'lab'],
    ['Module checkpoint', 12, 'quiz'],
  ],
]

const EXCEL_BLOCK: ModuleTuple = [
  'Advanced Excel',
  'Still the fastest tool in the room for a quick answer — used the way analysts actually use it.',
  [
    ['Tables, named ranges and clean structure', 24],
    ['VLOOKUP, XLOOKUP and INDEX/MATCH', 38],
    ['Pivot tables and slicers', 40],
    ['Power Query for repeatable cleaning', 46],
    ['Dashboarding in Excel', 42, 'lab'],
    ['Macros and light VBA automation', 36],
  ],
]

const VIZ_BLOCK: ModuleTuple = [
  'Data Visualisation',
  'Tableau, Power BI and Looker Studio — plus the design judgement to know what to build.',
  [
    ['What makes a chart readable', 28],
    ['Tableau: connect, blend, build', 52],
    ['Power BI: data model, DAX basics', 55],
    ['Looker Studio for shareable reporting', 34],
    ['Designing an executive dashboard', 44],
    ['Lab: ship a stakeholder-ready dashboard', 75, 'lab'],
  ],
]

const AI_TOOLS_BLOCK: ModuleTuple = [
  'AI Tools for Analysts',
  'Using LLMs as a working accelerator — with the judgement to catch when they are wrong.',
  [
    ['Prompting patterns that work on real data', 32],
    ['LLM-assisted EDA and query drafting', 40],
    ['Automating documentation and handovers', 28],
    ['Verifying AI output — the failure modes', 30],
    ['Lab: build an AI-assisted analysis workflow', 55, 'lab'],
  ],
]

const CAREER_BLOCK: ModuleTuple = [
  'Career Launch',
  'Runs alongside the course from day one, not bolted on at the end.',
  [
    ['Building a GitHub portfolio that reads well', 34],
    ['Crafting a data CV that passes screening', 30],
    ['LinkedIn profile enhancement', 26],
    ['Case-study and take-home interviews', 48],
    ['Mock technical interview', 60, 'lab'],
    ['Job search strategy and referrals', 32],
  ],
]

/* ---- Catalogue ------------------------------------------- */

interface CourseSeed extends Omit<Course, 'curriculum'> {
  modules: ModuleTuple[]
}

const SEEDS: CourseSeed[] = [
  {
    slug: 'data-science',
    title: 'Data Science Live Classes',
    short: 'Data Science',
    category: 'Data',
    durationLabel: '6 months',
    months: 6,
    priceINR: 82000,
    mrpINR: 124000,
    level: 'Beginner → Intermediate',
    mode: 'Live cohort · 2 sessions/week',
    rating: 4.9,
    learners: 1840,
    projects: 10,
    accent: 'cyan',
    tagline: 'Launch your career as a Data Scientist.',
    description:
      'A 6-month live training program that equips you with the essential tools and skills to launch your career as a Data Scientist — from Python and statistics through machine learning and model deployment on the cloud.',
    tools: [
      'Python',
      'SQL',
      'Excel',
      'Tableau',
      'Power BI',
      'Google Data Studio',
      'AI Tools',
      'scikit-learn',
      'AWS',
      'GCP',
      'GitHub',
    ],
    outcomes: [
      '10 real-life projects in a GitHub portfolio',
      'Statistics and mathematics for machine learning',
      'End-to-end model deployment on AWS/GCP',
      'Interview preparation, CV crafting and LinkedIn enhancement',
      'Job search assistance until you are placed',
    ],
    modules: [
      PYTHON_BLOCK,
      SQL_BLOCK,
      EXCEL_BLOCK,
      [
        'Statistics & Mathematics',
        'The reasoning layer under every model — taught with data, not proofs.',
        [
          ['Descriptive statistics and distributions', 44],
          ['Probability for data scientists', 46],
          ['Sampling, confidence intervals', 40],
          ['Hypothesis testing and p-values', 48],
          ['Linear algebra intuition for ML', 42],
          ['Calculus: gradients, in plain terms', 36],
          ['Module checkpoint', 12, 'quiz'],
        ],
      ],
      [
        'Exploratory Data Analysis',
        'The habit that separates analysts who find the story from those who miss it.',
        [
          ['Framing the business question first', 30],
          ['Univariate and bivariate exploration', 44],
          ['Outliers, skew and transformations', 40],
          ['Feature relationships and leakage', 38],
          ['Project: full EDA writeup', 80, 'project'],
        ],
      ],
      VIZ_BLOCK,
      [
        'Machine Learning',
        'Supervised and unsupervised learning, evaluated the way production teams evaluate.',
        [
          ['Train/test discipline and cross-validation', 42],
          ['Linear and logistic regression', 50],
          ['Decision trees and random forests', 48],
          ['Gradient boosting: XGBoost & LightGBM', 52],
          ['Clustering and dimensionality reduction', 46],
          ['Model evaluation beyond accuracy', 44],
          ['Hyper-parameter tuning', 38],
          ['Project: end-to-end predictive model', 120, 'project'],
          ['Module checkpoint', 15, 'quiz'],
        ],
      ],
      AI_TOOLS_BLOCK,
      [
        'Cloud & Model Deployment',
        'Getting a model out of the notebook and in front of a user.',
        [
          ['Cloud fundamentals on AWS and GCP', 44],
          ['Packaging a model with FastAPI', 48],
          ['Containers and reproducible environments', 42],
          ['Deploying and monitoring a live endpoint', 50, 'lab'],
          ['Capstone: deploy your portfolio model', 150, 'project'],
        ],
      ],
      CAREER_BLOCK,
    ],
  },

  {
    slug: 'data-analytics-one-on-one',
    title: 'Data Analytics One-on-One Live Classes',
    short: 'Data Analytics 1:1',
    category: 'Data',
    durationLabel: '4 months',
    months: 4,
    priceINR: 20000,
    mrpINR: 34000,
    level: 'Beginner',
    mode: 'One-on-one live · schedule with your mentor',
    rating: 4.9,
    learners: 2260,
    projects: 5,
    accent: 'lime',
    tagline: 'Personalised, one-on-one, and the most affordable way in.',
    description:
      '4 months of personalised live training designed to help you launch a career in Data Analytics or Data Science. Every session is one-on-one, so the pace is yours and no question goes unasked.',
    tools: [
      'Python',
      'SQL',
      'Advanced Excel',
      'Tableau',
      'Power BI',
      'Google Data Studio',
      'AI Tools',
      'GitHub',
    ],
    outcomes: [
      'Truly one-on-one mentorship — never a recorded class',
      '5 real-life projects in a GitHub portfolio',
      'Personalised job guidance for your background',
      'Interview prep, CV and LinkedIn enhancement',
      'Certification on completion',
    ],
    modules: [
      PYTHON_BLOCK,
      SQL_BLOCK,
      EXCEL_BLOCK,
      VIZ_BLOCK,
      AI_TOOLS_BLOCK,
      [
        'Applied Analytics Projects',
        'Five projects, each one chosen with your mentor to match the roles you want.',
        [
          ['Project 1: retail sales performance', 90, 'project'],
          ['Project 2: customer churn analysis', 90, 'project'],
          ['Project 3: marketing funnel report', 85, 'project'],
          ['Project 4: operations KPI dashboard', 85, 'project'],
          ['Project 5: your own domain dataset', 110, 'project'],
        ],
      ],
      CAREER_BLOCK,
    ],
  },

  {
    slug: 'ai-driven-data-analytics',
    title: 'AI Driven Data Analytics Live Classes',
    short: 'AI-Driven Analytics',
    category: 'Data',
    durationLabel: '4 months',
    months: 4,
    priceINR: 27000,
    mrpINR: 42000,
    level: 'Beginner → Intermediate',
    mode: 'Live cohort · 2 sessions/week',
    rating: 4.8,
    learners: 1420,
    projects: 5,
    accent: 'violet',
    tagline: 'Become a Data Analyst who works at AI speed.',
    description:
      'A 4-month live training program that equips you with the essential tools and skills to launch your career as a Data Analyst — with AI tooling woven through every module rather than tacked on at the end.',
    tools: ['Python', 'SQL', 'Excel', 'Tableau', 'Power BI', 'Google Data Studio', 'AI Tools', 'GitHub'],
    outcomes: [
      '5 real-life projects in a GitHub portfolio',
      'AI-assisted analysis workflows you can defend in an interview',
      'Interview preparation and CV crafting',
      'LinkedIn enhancement and job search guidance',
      'Certification on completion',
    ],
    modules: [
      PYTHON_BLOCK,
      SQL_BLOCK,
      EXCEL_BLOCK,
      AI_TOOLS_BLOCK,
      VIZ_BLOCK,
      [
        'Analytics Storytelling',
        'The last mile: turning a correct answer into a decision someone acts on.',
        [
          ['Structuring an insight narrative', 34],
          ['Writing findings for non-technical readers', 32],
          ['Presenting to stakeholders', 38],
          ['Project: insight deck from raw data', 95, 'project'],
        ],
      ],
      CAREER_BLOCK,
    ],
  },

  {
    slug: 'data-engineering',
    title: 'Data Engineering',
    short: 'Data Engineering',
    category: 'Engineering',
    durationLabel: '6 months',
    months: 6,
    priceINR: 36000,
    mrpINR: 58000,
    level: 'Intermediate',
    mode: 'Live cohort · 2 sessions/week',
    rating: 4.8,
    learners: 960,
    projects: 10,
    accent: 'cyan',
    tagline: 'Build the pipelines everyone else depends on.',
    description:
      '6 months of live training in the tools and skills you need to build a strong Data Engineering profile — warehousing, orchestration, and production pipelines on modern cloud platforms.',
    tools: ['Python', 'SQL', 'BigQuery', 'Snowflake', 'Airflow', 'dbt', 'GCP', 'AWS', 'Spark'],
    outcomes: [
      '10 real-world pipeline projects',
      'Warehouse design and dimensional modelling',
      'Production-grade orchestration with Airflow',
      'Cloud fundamentals across GCP and AWS',
      'Interview prep, resume building and certification',
    ],
    modules: [
      PYTHON_BLOCK,
      SQL_BLOCK,
      [
        'Data Warehousing',
        'How analytical storage differs from the transactional databases you already know.',
        [
          ['OLTP vs OLAP, and why it matters', 30],
          ['Dimensional modelling: facts and dimensions', 48],
          ['Star and snowflake schemas', 42],
          ['Slowly changing dimensions', 44],
          ['Partitioning and clustering strategies', 40],
          ['Module checkpoint', 12, 'quiz'],
        ],
      ],
      [
        'ETL / ELT Pipelines',
        'Moving data reliably — including what to do when it breaks at 3am.',
        [
          ['ETL vs ELT and when each wins', 28],
          ['Extraction: APIs, files, CDC', 46],
          ['Transformation patterns with dbt', 55],
          ['Idempotency, retries and backfills', 44],
          ['Data quality tests and contracts', 42],
          ['Lab: build a resilient ingestion job', 80, 'lab'],
        ],
      ],
      [
        'BigQuery & Snowflake',
        'The two warehouses you are most likely to be hired to run.',
        [
          ['BigQuery architecture and pricing model', 40],
          ['Snowflake: virtual warehouses, storage separation', 44],
          ['Performance tuning and cost control', 46],
          ['Lab: migrate a dataset between warehouses', 70, 'lab'],
        ],
      ],
      [
        'Orchestration with Airflow',
        'Turning a folder of scripts into a scheduled, observable system.',
        [
          ['DAGs, operators and the scheduler', 44],
          ['Dependencies, sensors and branching', 46],
          ['Testing and local development', 38],
          ['Monitoring, alerting and SLAs', 40],
          ['Project: orchestrate a multi-source pipeline', 130, 'project'],
        ],
      ],
      [
        'Cloud Fundamentals',
        'Enough infrastructure to be dangerous — and to pass the systems round.',
        [
          ['Compute, storage and IAM concepts', 44],
          ['Object storage as a data lake', 40],
          ['Infrastructure as code basics', 42],
          ['Cost awareness for data teams', 30],
          ['Capstone: end-to-end cloud platform', 160, 'project'],
        ],
      ],
      CAREER_BLOCK,
    ],
  },

  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    short: 'Digital Marketing',
    category: 'Marketing',
    durationLabel: '3 months',
    months: 3,
    priceINR: 25000,
    mrpINR: 40000,
    level: 'Beginner',
    mode: 'Live cohort · 2 sessions/week',
    rating: 4.7,
    learners: 780,
    projects: 6,
    accent: 'amber',
    tagline: 'Run campaigns that you can prove worked.',
    description:
      '3 months of live training to build a strong Digital Marketing profile — from fundamentals and SEO through paid acquisition, funnels and the analytics that prove performance.',
    tools: ['SEO', 'SEM', 'Google Ads', 'Meta Ads', 'GA4', 'Search Console', 'Email', 'Content'],
    outcomes: [
      'Real campaigns run on real budgets',
      'Performance marketing and funnel design',
      'GA4 and Search Console measurement',
      'Interview prep, resume building and job search',
      'Certification on completion',
    ],
    modules: [
      [
        'Digital Marketing Fundamentals',
        'The map before the tools — channels, audiences and how money actually moves.',
        [
          ['The channel landscape in 2026', 30],
          ['Audience research and positioning', 38],
          ['Marketing funnels end to end', 40],
          ['Budgeting and unit economics', 36],
        ],
      ],
      [
        'SEO & SEM',
        'Earning attention and buying it — and knowing which one your client needs.',
        [
          ['How search engines rank pages', 34],
          ['Keyword research that finds intent', 44],
          ['On-page and technical SEO', 50],
          ['Link building and off-page signals', 40],
          ['SEM fundamentals and auction dynamics', 42],
          ['Lab: full SEO audit of a live site', 75, 'lab'],
        ],
      ],
      [
        'Google Ads & Meta Ads',
        'Building, launching and — the part most courses skip — cutting what is not working.',
        [
          ['Google Ads account structure', 46],
          ['Search, Display, Performance Max', 48],
          ['Meta Ads Manager and audiences', 46],
          ['Creative testing frameworks', 40],
          ['Bid strategies and budget pacing', 42],
          ['Project: launch and optimise a live campaign', 120, 'project'],
        ],
      ],
      [
        'Social, Content & Email',
        'The compounding channels that make paid media cheaper over time.',
        [
          ['Organic social strategy by platform', 40],
          ['Content calendars that survive contact', 34],
          ['Email lifecycle and automation', 44],
          ['Copywriting for conversion', 38],
        ],
      ],
      [
        'Analytics & Performance',
        'Attribution, measurement, and reporting that a CFO would accept.',
        [
          ['GA4 events and conversions', 48],
          ['Search Console diagnostics', 36],
          ['Attribution models and their lies', 40],
          ['Building a performance dashboard', 46, 'lab'],
          ['Capstone: quarterly growth report', 110, 'project'],
        ],
      ],
      CAREER_BLOCK,
    ],
  },

  {
    slug: 'data-super-star',
    title: 'Data Super Star',
    short: 'Data Super Star',
    category: 'Data',
    durationLabel: '8 months',
    months: 8,
    priceINR: 54000,
    mrpINR: 96000,
    level: 'Beginner → Intermediate',
    mode: 'Live cohort · 3 sessions/week',
    rating: 5.0,
    learners: 640,
    projects: 12,
    accent: 'violet',
    tagline: 'Master of Data — analytics, science and engineering in one track.',
    description:
      'An 8-month program and a combination of Data Science, Analytics and Data Engineering. It is the widest track we run, and it makes you a MASTER OF DATA — able to move between the analyst, scientist and engineer seats.',
    tools: [
      'Python',
      'SQL',
      'Excel',
      'Statistics',
      'Machine Learning',
      'AI Tools',
      'BigQuery',
      'Snowflake',
      'Airflow',
      'Tableau',
      'Power BI',
    ],
    outcomes: [
      '12+ real-world projects across all three disciplines',
      'A GitHub portfolio that covers analysis, modelling and pipelines',
      'The breadth to interview for three different job titles',
      'Interview prep, resume building and job search assistance',
      'Certification on completion',
    ],
    modules: [
      PYTHON_BLOCK,
      SQL_BLOCK,
      EXCEL_BLOCK,
      [
        'Statistics & Mathematics',
        'Shared foundation for everything modelling-related that follows.',
        [
          ['Descriptive statistics and distributions', 44],
          ['Probability and Bayes in practice', 46],
          ['Hypothesis testing and experiment design', 52],
          ['Linear algebra intuition for ML', 42],
          ['Module checkpoint', 12, 'quiz'],
        ],
      ],
      VIZ_BLOCK,
      [
        'Machine Learning & AI',
        'The data-science half of the track.',
        [
          ['Supervised learning end to end', 54],
          ['Tree ensembles and boosting', 50],
          ['Unsupervised learning and segmentation', 46],
          ['Evaluation, drift and monitoring', 44],
          ['LLMs in an analytics stack', 42],
          ['Project: production-shaped ML model', 130, 'project'],
        ],
      ],
      [
        'Warehousing & Pipelines',
        'The data-engineering half of the track.',
        [
          ['Dimensional modelling', 46],
          ['ETL/ELT with dbt', 52],
          ['BigQuery, Snowflake and cost control', 48],
          ['Airflow orchestration', 50],
          ['Project: multi-source warehouse build', 140, 'project'],
        ],
      ],
      AI_TOOLS_BLOCK,
      [
        'Master Capstone',
        'One brief, carried through analysis, modelling and a production pipeline.',
        [
          ['Scoping the brief with stakeholders', 40],
          ['Build: ingestion and warehouse layer', 150, 'project'],
          ['Build: modelling and evaluation', 150, 'project'],
          ['Build: dashboard and handover', 120, 'project'],
          ['Defence: present to a review panel', 60, 'lab'],
        ],
      ],
      CAREER_BLOCK,
    ],
  },

  {
    slug: 'data-engineering-gen-ai',
    title: 'Data Engineering Program + GEN AI',
    short: 'Data Engineering + Gen AI',
    category: 'Engineering',
    durationLabel: 'Flexible schedule',
    months: null,
    priceINR: 36000,
    mrpINR: 58000,
    level: 'Intermediate → Advanced',
    mode: 'Live cohort · flexible batches',
    rating: 4.8,
    learners: 520,
    projects: 8,
    accent: 'cyan',
    tagline: 'Big data infrastructure, plus the Gen-AI layer on top.',
    description:
      'A comprehensive program covering Big Data infrastructure — the Hadoop ecosystem including HDFS, MapReduce and YARN — data processing with Apache Spark, Pig and Hive, and cloud platforms across AWS, Azure Databricks and Google Cloud, with hands-on training in data pipelines and Snowflake architecture.',
    tools: [
      'SQL',
      'Python',
      'Hadoop',
      'HDFS',
      'MapReduce',
      'YARN',
      'Apache Spark',
      'Hive',
      'Pig',
      'Snowflake',
      'Databricks',
      'AWS',
      'Azure',
      'GCP',
    ],
    outcomes: [
      'Hands-on work across the Hadoop ecosystem',
      'Distributed processing with Apache Spark',
      'Snowflake architecture in depth',
      'Gen-AI applied to pipeline and documentation work',
      '8 hands-on data pipeline projects',
    ],
    modules: [
      SQL_BLOCK,
      PYTHON_BLOCK,
      [
        'Big Data Infrastructure',
        'The Hadoop ecosystem — still running the storage layer at a surprising number of enterprises.',
        [
          ['Why distributed storage exists', 30],
          ['HDFS architecture and replication', 48],
          ['MapReduce programming model', 50],
          ['YARN resource management', 42],
          ['Lab: run a job on a multi-node cluster', 75, 'lab'],
        ],
      ],
      [
        'Data Processing at Scale',
        'Spark, Hive and Pig — and knowing which one a problem calls for.',
        [
          ['Spark RDDs, DataFrames and lazy evaluation', 56],
          ['Spark SQL and the Catalyst optimiser', 48],
          ['Partitioning, shuffles and skew', 50],
          ['Hive for SQL over big data', 42],
          ['Pig for dataflow scripting', 34],
          ['Project: batch processing pipeline', 120, 'project'],
        ],
      ],
      [
        'Snowflake Architecture',
        'Separation of storage and compute, and what that changes about your design.',
        [
          ['Virtual warehouses and scaling', 44],
          ['Micro-partitions and clustering keys', 46],
          ['Time travel, cloning and streams', 42],
          ['Cost governance', 36],
        ],
      ],
      [
        'Cloud Platforms',
        'AWS, Azure Databricks and Google Cloud — the three you will meet in job descriptions.',
        [
          ['AWS data services tour', 46],
          ['Azure Databricks workspaces and jobs', 50],
          ['Google Cloud: Dataflow and BigQuery', 48],
          ['Lab: deploy the same pipeline on two clouds', 90, 'lab'],
        ],
      ],
      [
        'Gen AI for Data Engineers',
        'Where LLMs genuinely help a pipeline team — and where they quietly cost you a weekend.',
        [
          ['LLM-assisted pipeline and SQL authoring', 40],
          ['Automated data documentation and lineage notes', 38],
          ['Embeddings and vector stores in a data platform', 48],
          ['Building a RAG service over your warehouse', 60, 'lab'],
          ['Capstone: Gen-AI augmented data platform', 150, 'project'],
        ],
      ],
      CAREER_BLOCK,
    ],
  },

  {
    slug: 'advanced-digital-marketing-gen-ai',
    title: 'Advanced Digital Marketing + GEN AI',
    short: 'Advanced Digital Marketing',
    category: 'Marketing',
    durationLabel: 'Flexible schedule',
    months: null,
    priceINR: 36000,
    mrpINR: 58000,
    level: 'Beginner → Intermediate',
    mode: 'Live cohort · flexible batches',
    rating: 4.7,
    learners: 610,
    projects: 7,
    accent: 'amber',
    tagline: 'Job-oriented, hands-on, and built around live projects.',
    description:
      'A job-oriented, hands-on training program designed to master the digital landscape — from building the website itself through SEO, paid media, social and video, with live projects, internship opportunities and certification.',
    tools: [
      'HTML5',
      'CSS3',
      'JavaScript',
      'WordPress',
      'SEO',
      'Google Ads',
      'Facebook',
      'Instagram',
      'LinkedIn',
      'Twitter',
      'Quora',
      'Google Analytics',
    ],
    outcomes: [
      'Build and ship a real website before you market it',
      'On-page and off-page SEO in depth',
      'Paid and organic across six platforms',
      'Live projects plus internship opportunities',
      'Industry-recognised certification',
    ],
    modules: [
      [
        'Website Creation',
        'You market better when you can change the page yourself.',
        [
          ['HTML5 structure and semantics', 44],
          ['CSS3 layout and responsive design', 52],
          ['JavaScript essentials for marketers', 46],
          ['WordPress: themes, plugins, speed', 50],
          ['Lab: build and deploy a landing page', 80, 'lab'],
        ],
      ],
      [
        'Search Engine Optimisation',
        'On-page and off-page, taken past the checklist stage.',
        [
          ['Technical SEO and crawlability', 48],
          ['On-page optimisation', 44],
          ['Off-page and digital PR', 42],
          ['Local and e-commerce SEO', 38],
          ['Project: rank a real page', 100, 'project'],
        ],
      ],
      [
        'Google Ads',
        'Campaign types, structure and the discipline of cutting losers early.',
        [
          ['Account and campaign architecture', 46],
          ['Keyword and audience targeting', 44],
          ['Ad copy and extensions', 38],
          ['Conversion tracking setup', 42],
          ['Optimisation cadence', 40],
        ],
      ],
      [
        'Social Media Marketing',
        'Facebook, Instagram, LinkedIn, Twitter and Quora — each with a different job.',
        [
          ['Facebook & Instagram organic and paid', 52],
          ['LinkedIn for B2B pipeline', 44],
          ['Twitter/X and community building', 34],
          ['Quora and answer-led acquisition', 30],
          ['Project: multi-platform campaign', 105, 'project'],
        ],
      ],
      [
        'Video Marketing',
        'The format that now carries most of the reach.',
        [
          ['YouTube strategy and SEO', 44],
          ['Short-form video that performs', 38],
          ['Editing basics for marketers', 42, 'lab'],
        ],
      ],
      [
        'Analytics & Gen AI',
        'Measurement, plus the AI layer that makes a small team look large.',
        [
          ['Google Analytics deep dive', 48],
          ['AI for creative and copy generation', 42],
          ['AI-assisted keyword and content research', 40],
          ['Reporting automation', 38],
          ['Capstone: full funnel campaign', 130, 'project'],
        ],
      ],
      CAREER_BLOCK,
    ],
  },

  {
    slug: 'cyber-security-ethical-hacking',
    title: 'Advanced Cyber Security & Ethical Hacking',
    short: 'Cyber Security',
    category: 'Security',
    durationLabel: 'Flexible schedule',
    months: null,
    priceINR: 38000,
    mrpINR: 62000,
    level: 'Intermediate → Advanced',
    mode: 'Live cohort · lab-heavy',
    rating: 4.8,
    learners: 430,
    projects: 9,
    accent: 'rose',
    tagline: 'From offensive technique to courtroom-grade forensics.',
    description:
      'A comprehensive industrial training program built to transform learners into expert security professionals — offensive security, digital forensics, malware analysis and defensive strategy, delivered through live simulations and aligned to the Indian IT Act, 2000.',
    tools: [
      'Kali Linux',
      'Wireshark',
      'Burp Suite',
      'Metasploit',
      'Nmap',
      'Autopsy',
      'Volatility',
      'SIEM',
      'OSINT',
    ],
    outcomes: [
      'Offensive security across network and web targets',
      'Digital forensics on Windows, mobile and memory',
      'Malware and dark-web investigation technique',
      'SOC operations and defensive strategy',
      'Practice aligned to the Indian IT Act, 2000',
    ],
    modules: [
      [
        'Security Foundations & Law',
        'Scope, authorisation and the legal frame — the part that keeps this a career.',
        [
          ['The CIA triad and threat modelling', 34],
          ['Networking refresher for security', 46],
          ['Linux and Windows internals', 48],
          ['Indian IT Act 2000 and lawful authorisation', 44],
          ['Rules of engagement and scoping', 36],
        ],
      ],
      [
        'Offensive Security — Network',
        'Reconnaissance through exploitation, in an isolated lab you are authorised to attack.',
        [
          ['Reconnaissance and OSINT', 44],
          ['Scanning and enumeration with Nmap', 48],
          ['Vulnerability assessment', 46],
          ['Exploitation fundamentals', 52],
          ['Post-exploitation and privilege escalation', 50],
          ['Lab: authorised internal network assessment', 110, 'lab'],
        ],
      ],
      [
        'Offensive Security — Web',
        'The OWASP classes that still account for most real incidents.',
        [
          ['HTTP, sessions and the browser model', 40],
          ['Injection and SQLi', 50],
          ['XSS, CSRF and client-side flaws', 48],
          ['Authentication and access control failures', 46],
          ['Burp Suite workflow', 44],
          ['Project: web application penetration test report', 120, 'project'],
        ],
      ],
      [
        'Digital Forensics',
        'Acquisition and analysis that holds up under scrutiny.',
        [
          ['Forensic soundness and chain of custody', 40],
          ['Data acquisition and imaging', 46],
          ['Windows artefact analysis', 52],
          ['Mobile device forensics', 48],
          ['Memory analysis with Volatility', 50],
          ['Dark web and network forensics', 44],
          ['Project: full forensic case writeup', 130, 'project'],
        ],
      ],
      [
        'Malware Analysis',
        'Static and dynamic triage in a contained environment.',
        [
          ['Safe analysis environments', 38],
          ['Static triage and strings', 44],
          ['Dynamic behavioural analysis', 50],
          ['Persistence and evasion patterns', 46],
        ],
      ],
      [
        'Defensive Strategy & SOC',
        'The blue-team seat — where most security jobs actually are.',
        [
          ['SOC roles, tiers and workflow', 40],
          ['SIEM, log sources and detection rules', 52],
          ['Incident response lifecycle', 48],
          ['Threat hunting basics', 44],
          ['Live simulation: contain a breach', 120, 'lab'],
        ],
      ],
      CAREER_BLOCK,
    ],
  },

  {
    slug: 'business-analytics-gen-ai',
    title: 'Business Analytics + GEN AI',
    short: 'Business Analytics',
    category: 'Business',
    durationLabel: 'Flexible schedule',
    months: null,
    priceINR: 36000,
    mrpINR: 58000,
    level: 'Beginner → Intermediate',
    mode: 'Live cohort · flexible batches',
    rating: 4.8,
    learners: 890,
    projects: 6,
    accent: 'lime',
    tagline: 'The BI stack, end to end, with Gen AI on top.',
    description:
      'A professional program designed to equip learners with the essential tools for modern business intelligence — SQL, advanced Excel, Power BI and Tableau, with ETL, Power Query and DAX taken far enough to build genuinely interactive dashboards.',
    tools: ['MySQL', 'Advanced Excel', 'Power BI', 'Tableau', 'Power Query', 'DAX', 'ETL', 'Gen AI'],
    outcomes: [
      'SQL on MySQL from query to optimisation',
      'Advanced Excel including macros and pivot modelling',
      'Power BI data modelling with DAX',
      'Interactive dashboards in Power BI and Tableau',
      'Gen AI applied to reporting workflows',
    ],
    modules: [
      [
        'SQL with MySQL',
        'The query layer under every dashboard you will build.',
        [
          ['MySQL setup and schema design', 34],
          ['Core querying and filtering', 40],
          ['Joins and set operations', 46],
          ['Aggregation and window functions', 50],
          ['Stored procedures and views', 42],
          ['Lab: reporting queries from a live schema', 70, 'lab'],
        ],
      ],
      EXCEL_BLOCK,
      [
        'ETL & Power Query',
        'Getting messy source data into a shape a model can trust.',
        [
          ['ETL concepts for BI teams', 34],
          ['Power Query transformations', 50],
          ['Merging and appending sources', 44],
          ['Refresh strategy and error handling', 40],
        ],
      ],
      [
        'Power BI & DAX',
        'Where most BI work in industry actually happens.',
        [
          ['The Power BI data model', 46],
          ['Relationships and star schemas', 44],
          ['DAX: calculated columns vs measures', 52],
          ['Time intelligence in DAX', 48],
          ['Row-level security', 36],
          ['Project: interactive executive dashboard', 110, 'project'],
        ],
      ],
      [
        'Tableau',
        'The second tool worth knowing, and how it thinks differently.',
        [
          ['Tableau data connections', 38],
          ['Calculations and level-of-detail expressions', 48],
          ['Dashboard actions and interactivity', 46],
          ['Project: comparative dashboard build', 95, 'project'],
        ],
      ],
      [
        'Gen AI for Business Analytics',
        'Copilot-era BI — faster drafts, same accountability for the numbers.',
        [
          ['Natural-language querying over a model', 40],
          ['AI-assisted DAX and measure authoring', 42],
          ['Automated insight summaries', 38],
          ['Capstone: AI-augmented BI report', 120, 'project'],
        ],
      ],
      CAREER_BLOCK,
    ],
  },
]

export const COURSES: Course[] = SEEDS.map(({ modules, ...rest }) => ({
  ...rest,
  curriculum: buildCurriculum(rest.slug, modules),
}))

/* ---- Derived lookups & helpers --------------------------- */

export const COURSE_BY_SLUG = new Map(COURSES.map((c) => [c.slug, c]))

export const CATEGORIES = ['All', ...new Set(COURSES.map((c) => c.category))] as const
export type CategoryFilter = (typeof CATEGORIES)[number]

export function getCourse(slug: string | undefined): Course | undefined {
  return slug ? COURSE_BY_SLUG.get(slug) : undefined
}

export function allLessons(course: Course): Lesson[] {
  return course.curriculum.flatMap((m) => m.lessons)
}

export function lessonCount(course: Course): number {
  return course.curriculum.reduce((n, m) => n + m.lessons.length, 0)
}

export function totalMinutes(course: Course): number {
  return course.curriculum.reduce(
    (n, m) => n + m.lessons.reduce((s, l) => s + l.minutes, 0),
    0,
  )
}

export function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}
