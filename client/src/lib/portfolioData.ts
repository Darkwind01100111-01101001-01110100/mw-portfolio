// ═══════════════════════════════════════════════════════
// PORTFOLIO DATA — Mike Winters
// Terminal Clarity design system
// ═══════════════════════════════════════════════════════

export const METRICS = [
  { value: "15+", label: "Years Experience", sublabel: "Data & Operations" },
  { value: "29", label: "Dashboard Widgets", sublabel: "2 Production Dashboards" },
  { value: "15+", label: "SQL Queries", sublabel: "Production-Grade" },
  { value: "100+", label: "Hrs/Week Saved", sublabel: "Program-Wide" },
  { value: "290+", label: "Contractors Managed", sublabel: "6 Global Regions" },
];

export const SKILLS = {
  "Languages": ["SQL (Presto/Trino)", "Python", "R"],
  "Data Engineering": ["ETL Pipelines", "Data Modeling", "Multi-source Integration", "Dev→Prod Workflows"],
  "BI & Visualization": ["Tableau", "Looker", "Dashboard Design", "Plotly", "Google Sheets"],
  "Analytics": ["Statistical Testing", "KPI Tracking", "Anomaly Detection", "Capacity Planning"],
  "AI & Automation": ["Prompt Engineering", "LLM-augmented Dev", "Automated Reporting"],
  "Operations": ["Project/Program Management", "Workforce Management", "QA Frameworks", "Cross-functional Leadership"],
};

export const DASHBOARDS = [
  {
    id: "productivity",
    title: "Productivity Dashboard",
    subtitle: "Sample View",
    description: "14-widget production dashboard tracking job lifecycle, completion rates, weekly volume trends, per-worker throughput, and team rollups. Covers 140+ task configurations, 15+ projects, 11 teams, and 6 global regions.",
    tags: ["SQL", "Plotly", "ETL", "Multi-team"],
    metrics: ["14 widgets", "140+ task configs", "11 teams", "6 regions"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663377531044/Mk9CrzRFiqrFcvXzQxxR5r/ProductivityDashboard-Sample_49aa0a8b.png",
  },
  {
    id: "quality",
    title: "Quality Dashboard",
    subtitle: "Sample View",
    description: "15-widget QA dashboard with pass rates, period-over-period trends, per-annotator scorecards, and QA coverage with statistical significance checks. Drove quality scores from 80% to 98–100% across 3 product verticals.",
    tags: ["SQL", "Statistical Validation", "QA", "Period Comparison"],
    metrics: ["15 widgets", "3 panels", "3 product verticals", "90→100% quality"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663377531044/Mk9CrzRFiqrFcvXzQxxR5r/QualityDashboard-Sample_0dc8ee37.png",
  },
  {
    id: "operational",
    title: "Operational Performance Matrix",
    subtitle: "Sample View",
    description: "Heat-map style daily goal attainment matrix by team, paired with a weekly KPI summary tracking Completion, Occupancy, Utilization, QA Pass Rate, and Handle Time against targets.",
    tags: ["KPI Tracking", "Heatmap", "Multi-metric", "Target Benchmarking"],
    metrics: ["8 teams tracked", "5 KPIs", "Daily granularity", "Target benchmarks"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663377531044/Mk9CrzRFiqrFcvXzQxxR5r/OperationalPerformanceMatrix-Sample_765413d8.png",
  },
];

export const SQL_QUERIES = [
  {
    id: "q1",
    title: "Job Lifecycle & Completion Tracker",
    panel: "Productivity → Overview",
    description: "Tracks work items from creation through completion — total jobs, completion rate, avg turnaround. CTE-based task selection, LEFT JOIN to preserve incomplete jobs, conditional aggregation.",
    patterns: ["CTE task selection", "LEFT JOIN preservation", "Conditional aggregation"],
    code: `-- =====================================================
-- JOB LIFECYCLE & COMPLETION TRACKER
-- Shows: total jobs, completion rate, avg turnaround
-- Grain: one row per project + task combination
-- =====================================================

-- Step 1: Define which tasks to track.
WITH task_selector AS (
    SELECT task_id FROM (
        VALUES (101), (102), (103), (104)
    ) AS t(task_id)
),

-- Step 2: Pull all work items for those tasks.
all_jobs AS (
    SELECT
        project_name, job_id, task_id, task_name,
        queue_name, created_date, status
    FROM {{jobs_table}}
    WHERE ds = '{{latest_partition}}'
        AND task_id IN (SELECT task_id FROM task_selector)
        AND is_deleted = FALSE
        AND queue_id IS NOT NULL
        AND created_date BETWEEN '{{start_date}}' AND '{{end_date}}'
),

-- Step 3: Pull completed responses.
all_responses AS (
    SELECT response_id, task_id, job_id, queue_id,
           queue_name, created_date, worker_id
    FROM {{responses_table}}
    WHERE ds = '{{latest_partition}}'
        AND task_id IN (SELECT task_id FROM task_selector)
),

-- Step 4: Join jobs to responses (LEFT JOIN — not all jobs are completed).
joined AS (
    SELECT
        j.project_name, j.task_name, j.task_id, j.job_id,
        r.response_id,
        j.created_date AS job_created,
        r.created_date AS response_created,
        r.worker_id
    FROM all_jobs j
    LEFT JOIN all_responses r ON j.job_id = r.job_id
)

-- Step 5: Aggregate to project + task level.
SELECT
    project_name, task_name, task_id,
    COUNT(job_id)                                    AS total_jobs_created,
    SUM(CASE WHEN response_id IS NOT NULL THEN 1
             ELSE 0 END)                             AS completed_jobs,
    ROUND(
        SUM(CASE WHEN response_id IS NOT NULL THEN 1
                 ELSE 0 END) * 100.0
        / COUNT(job_id), 2
    )                                                AS completion_pct,
    ROUND(AVG(
        DATE_DIFF('DAY',
            CAST(job_created AS DATE),
            CAST(response_created AS DATE))
    ), 1)                                            AS avg_days_to_complete
FROM joined
GROUP BY project_name, task_name, task_id`,
    sampleOutput: [
      { project_name: "Project Alpha", task_name: "English Review", total_jobs: "1,247", completed: "1,189", completion_pct: "95.35%", avg_days: "1.2" },
      { project_name: "Project Alpha", task_name: "Spanish Review", total_jobs: "834", completed: "791", completion_pct: "94.84%", avg_days: "1.4" },
      { project_name: "Project Beta", task_name: "Accuracy Audit", total_jobs: "2,103", completed: "2,001", completion_pct: "95.15%", avg_days: "0.8" },
    ],
    outputColumns: ["project_name", "task_name", "total_jobs", "completed", "completion_pct", "avg_days"],
  },
  {
    id: "q2",
    title: "Worker Throughput with Dynamic Team Classification",
    panel: "Productivity → Reviewer Throughput",
    description: "Per-worker performance with a dynamic team classification that maps worker IDs to named teams — solving the common problem where source data has no native team field. 100+ workers / 11 teams in production.",
    patterns: ["CASE-based team classification", "Worker dimension JOIN", "SET_AGG queue enumeration"],
    code: `-- =====================================================
-- WORKER THROUGHPUT WITH DYNAMIC TEAM MAPPING
-- Key pattern: CASE-based team classification
-- No upstream team field existed — this solves it.
-- In production: 100+ IDs mapped to 11 teams / 6 regions
-- =====================================================

WITH worker_info AS (
    SELECT
        w.worker_id,
        u.display_name AS worker_name
    FROM (
        SELECT DISTINCT
            CAST(external_id AS BIGINT) AS worker_id,
            user_system_id
        FROM {{worker_dimension}}
        WHERE ds = '{{latest_partition}}'
    ) w
    LEFT JOIN (
        SELECT DISTINCT name AS display_name,
            CAST(userid AS VARCHAR) AS userid
        FROM {{user_profiles}}
        WHERE ds = '{{latest_partition}}'
    ) u ON w.user_system_id = u.userid
),

all_responses AS (
    SELECT response_id, task_id, job_id, queue_name,
           created_date, worker_id
    FROM {{responses_table}}
    WHERE ds = '{{latest_partition}}'
        AND task_id IN ({{task_id_list}})
)

SELECT
    r.worker_id             AS "Worker ID",
    w.worker_name           AS "Worker Name",
    -- Dynamic team classification (no native team field in source)
    CASE
        WHEN r.worker_id IN (1001,1002,1003,1004) THEN 'Team Alpha - Region A'
        WHEN r.worker_id IN (2001,2002,2003)      THEN 'Team Beta - Region B'
        WHEN r.worker_id IN (3001,3002,3003,3004) THEN 'Team Gamma - Region C'
        WHEN r.worker_id IN (4001,4002)           THEN 'QA Specialists'
        ELSE 'Unclassified'
    END                     AS "Team",
    COUNT(*)                AS "Jobs Reviewed",
    ROUND(AVG(DATE_DIFF('day',
        CAST(j.created_date AS DATE),
        CAST(r.created_date AS DATE))), 1) AS "Avg Days",
    SET_AGG(r.queue_name)   AS "Queues Reviewed"
FROM all_responses r
LEFT JOIN worker_info w ON r.worker_id = w.worker_id
LEFT JOIN (
    SELECT job_id, created_date FROM {{jobs_table}}
    WHERE ds = '{{latest_partition}}'
) j ON r.job_id = j.job_id
WHERE r.worker_id IS NOT NULL
    AND r.created_date BETWEEN '{{start_date}}' AND '{{end_date}}'
GROUP BY 1, 2, 3`,
    sampleOutput: [
      { worker: "Sarah Chen", jobs: "342", avg_days: "0.9", team: "Team Alpha", queues: "English, Spanish" },
      { worker: "Marco Silva", jobs: "287", avg_days: "1.1", team: "Team Beta", queues: "Accuracy Audit" },
      { worker: "Priya Patel", jobs: "256", avg_days: "0.7", team: "Team Alpha", queues: "English Review" },
    ],
    outputColumns: ["worker", "jobs", "avg_days", "team", "queues"],
  },
  {
    id: "q6",
    title: "Category-Level Quality with QA Coverage",
    panel: "Quality → Category Summary Panels",
    description: "Category-level quality summary with QA coverage and month-over-month deltas. Uses the VALUES-based task mapping CTE — the key scalability pattern where new projects onboard by adding a single row.",
    patterns: ["VALUES-based configurable task mapping", "Production vs QA coverage", "Period delta computation"],
    code: `-- =====================================================
-- CATEGORY-LEVEL QUALITY SUMMARY WITH QA COVERAGE
-- Key pattern: VALUES-based configurable task mapping
-- New tasks/categories: add one row here, zero rewrites
-- =====================================================

WITH task_map AS (
    SELECT * FROM (
        VALUES
            (101, 'Task A - English',        'Category 1'),
            (102, 'Task A - Spanish',        'Category 1'),
            (103, 'Task A - French',         'Category 1'),
            (201, 'Task B - Accuracy',       'Category 2'),
            (202, 'Task B - Relevance',      'Category 2'),
            (301, 'Task C - Visual Quality', 'Category 3'),
            (302, 'Task C - Benchmark',      'Category 3')
    ) AS t(task_id, task_name, category)
),

current_period AS (
    SELECT
        tm.category,
        COUNT(DISTINCT qf.recipient_worker_id) AS active_workers,
        COUNT(DISTINCT qf.response_id)         AS total_qa_reviews,
        ROUND(AVG(CAST(qf.feedback_score AS DOUBLE)), 2) AS avg_qa_score,
        ROUND(100.0
            * COUNT(DISTINCT CASE WHEN qf.feedback_status = 'PASSED'
                THEN qf.response_id END)
            / NULLIF(COUNT(DISTINCT qf.response_id), 0), 2) AS pass_rate_pct
    FROM {{qa_feedback_table}} qf
    JOIN task_map tm ON CAST(qf.task_id AS BIGINT) = tm.task_id
    WHERE qf.ds = '{{latest_partition}}'
        AND qf.feedback_submit_time >= '{{current_period_start}}'
    GROUP BY 1
),

production_volume AS (
    SELECT
        tm.category,
        COUNT(DISTINCT fr.response_id) AS total_produced
    FROM {{fact_responses}} fr
    JOIN task_map tm ON CAST(fr.task_id AS BIGINT) = tm.task_id
    WHERE fr.ds >= '{{current_period_start}}'
    GROUP BY 1
),

previous_period AS (
    SELECT
        tm.category,
        ROUND(AVG(CAST(qf.feedback_score AS DOUBLE)), 2) AS avg_qa_score,
        ROUND(100.0
            * COUNT(DISTINCT CASE WHEN qf.feedback_status = 'PASSED'
                THEN qf.response_id END)
            / NULLIF(COUNT(DISTINCT qf.response_id), 0), 2) AS pass_rate_pct
    FROM {{qa_feedback_table}} qf
    JOIN task_map tm ON CAST(qf.task_id AS BIGINT) = tm.task_id
    WHERE qf.ds = '{{latest_partition}}'
        AND qf.feedback_submit_time >= '{{previous_period_start}}'
        AND qf.feedback_submit_time <  '{{current_period_start}}'
    GROUP BY 1
)

SELECT
    cp.category,
    cp.active_workers,
    cp.total_qa_reviews,
    pv.total_produced,
    ROUND(100.0 * cp.total_qa_reviews
        / NULLIF(pv.total_produced, 0), 2)    AS qa_coverage_pct,
    cp.pass_rate_pct,
    pp.pass_rate_pct                           AS prev_pass_rate,
    ROUND(cp.pass_rate_pct
        - COALESCE(pp.pass_rate_pct, 0), 2)   AS pass_rate_change_ppt
FROM current_period cp
LEFT JOIN production_volume pv ON cp.category = pv.category
LEFT JOIN previous_period pp   ON cp.category = pp.category
ORDER BY cp.category`,
    sampleOutput: [
      { category: "Category 1", workers: "18", qa_reviews: "312", produced: "3,240", coverage: "9.63%", pass_rate: "90.06%", prev: "80.12%", change: "+9.94pp" },
      { category: "Category 2", workers: "12", qa_reviews: "187", produced: "1,890", coverage: "9.89%", pass_rate: "98.40%", prev: "95.20%", change: "+3.20pp" },
      { category: "Category 3", workers: "8", qa_reviews: "94", produced: "945", coverage: "9.95%", pass_rate: "100.00%", prev: "97.50%", change: "+2.50pp" },
    ],
    outputColumns: ["category", "workers", "qa_reviews", "produced", "coverage", "pass_rate", "prev", "change"],
  },
];

export const POKEMON_DATA = {
  // Source: Kaggle "The Complete Pokemon Dataset" — Rounak Banik
  // Processed via Python/pandas from 801 Pokémon, 41 features
  totalCount: 801,
  legendaryCount: 70,
  dualTypePct: 52.1,

  umbreon: {
    name: 'Umbreon', type: 'Dark', hp: 95, attack: 65,
    defense: 110, sp_atk: 60, sp_def: 130, speed: 65, total: 525,
  },

  // Real type counts from df['type1'].value_counts()
  typeDistribution: [
    { type: 'water',    count: 114 }, { type: 'normal',   count: 105 },
    { type: 'grass',    count: 78  }, { type: 'bug',      count: 72  },
    { type: 'psychic',  count: 53  }, { type: 'fire',     count: 52  },
    { type: 'rock',     count: 45  }, { type: 'electric', count: 39  },
    { type: 'poison',   count: 32  }, { type: 'ground',   count: 32  },
    { type: 'dark',     count: 29  }, { type: 'fighting', count: 28  },
    { type: 'dragon',   count: 27  }, { type: 'ghost',    count: 27  },
    { type: 'steel',    count: 24  }, { type: 'ice',      count: 23  },
    { type: 'fairy',    count: 18  }, { type: 'flying',   count: 3   },
  ],

  // Real avg stats by type from df.groupby('type1')[stat_cols].mean()
  avgStatsByType: [
    { type: 'dragon',   total: 522.8, attack: 106.4, defense: 86.3,  speed: 76.1 },
    { type: 'steel',    total: 491.6, attack: 93.1,  defense: 120.2, speed: 56.6 },
    { type: 'psychic',  total: 461.3, attack: 65.6,  defense: 69.3,  speed: 75.2 },
    { type: 'flying',   total: 453.3, attack: 66.7,  defense: 65.0,  speed: 99.7 },
    { type: 'fire',     total: 450.6, attack: 81.5,  defense: 67.8,  speed: 73.3 },
    { type: 'dark',     total: 449.8, attack: 87.8,  defense: 70.5,  speed: 75.3 },
    { type: 'rock',     total: 447.3, attack: 90.7,  defense: 96.3,  speed: 57.4 },
    { type: 'electric', total: 436.2, attack: 70.8,  defense: 61.8,  speed: 85.4 },
    { type: 'ghost',    total: 434.7, attack: 72.7,  defense: 79.5,  speed: 58.3 },
    { type: 'ice',      total: 433.6, attack: 73.3,  defense: 71.9,  speed: 62.7 },
    { type: 'fairy',    total: 427.2, attack: 62.1,  defense: 68.2,  speed: 53.7 },
    { type: 'water',    total: 426.8, attack: 73.3,  defense: 73.5,  speed: 63.9 },
    { type: 'ground',   total: 426.1, attack: 94.8,  defense: 83.9,  speed: 60.0 },
    { type: 'fighting', total: 414.8, attack: 99.2,  defense: 66.4,  speed: 64.3 },
    { type: 'grass',    total: 412.6, attack: 73.8,  defense: 70.9,  speed: 59.0 },
    { type: 'normal',   total: 401.3, attack: 75.2,  defense: 59.7,  speed: 69.5 },
    { type: 'poison',   total: 399.6, attack: 72.7,  defense: 70.0,  speed: 64.2 },
    { type: 'bug',      total: 380.4, attack: 70.1,  defense: 70.8,  speed: 63.6 },
  ],

  // Real legendary vs non-legendary from df.groupby('is_legendary').mean()
  legendaryVsRegular: {
    legendary: { count: 70,  avgTotal: 615, avgHp: 95, avgAttack: 109 },
    regular:   { count: 731, avgTotal: 411, avgHp: 66, avgAttack: 75  },
  },

  // Real top Pokémon by base_total
  topPokemon: [
    { name: 'Mewtwo',    total: 780, type: 'psychic', legendary: true  },
    { name: 'Rayquaza',  total: 780, type: 'dragon',  legendary: true  },
    { name: 'Kyogre',    total: 770, type: 'water',   legendary: true  },
    { name: 'Groudon',   total: 770, type: 'ground',  legendary: true  },
    { name: 'Arceus',    total: 720, type: 'normal',  legendary: true  },
    { name: 'Zygarde',   total: 708, type: 'dragon',  legendary: true  },
    { name: 'Tyranitar', total: 700, type: 'rock',    legendary: false },
    { name: 'Salamence', total: 700, type: 'dragon',  legendary: false },
    { name: 'Metagross', total: 700, type: 'steel',   legendary: false },
    { name: 'Garchomp',  total: 700, type: 'dragon',  legendary: false },
  ],

  // Eevee family — all share BST 525, different stat spreads
  eeveelutions: [
    { name: 'Vaporeon', type: 'water',    hp: 130, attack: 65,  defense: 60,  sp_atk: 110, sp_def: 95,  speed: 65  },
    { name: 'Jolteon',  type: 'electric', hp: 65,  attack: 65,  defense: 60,  sp_atk: 110, sp_def: 95,  speed: 130 },
    { name: 'Flareon',  type: 'fire',     hp: 65,  attack: 130, defense: 60,  sp_atk: 95,  sp_def: 110, speed: 65  },
    { name: 'Espeon',   type: 'psychic',  hp: 65,  attack: 65,  defense: 60,  sp_atk: 130, sp_def: 95,  speed: 110 },
    { name: 'Umbreon',  type: 'dark',     hp: 95,  attack: 65,  defense: 110, sp_atk: 60,  sp_def: 130, speed: 65  },
    { name: 'Leafeon',  type: 'grass',    hp: 65,  attack: 110, defense: 130, sp_atk: 60,  sp_def: 65,  speed: 95  },
    { name: 'Glaceon',  type: 'ice',      hp: 65,  attack: 60,  defense: 110, sp_atk: 130, sp_def: 95,  speed: 65  },
    { name: 'Sylveon',  type: 'fairy',    hp: 95,  attack: 65,  defense: 65,  sp_atk: 110, sp_def: 130, speed: 60  },
  ],

  genCounts: { '1': 151, '2': 100, '3': 135, '4': 107, '5': 156, '6': 72, '7': 80 },

  totalDistribution: [
    { bucket: '<200',    count: 11  },
    { bucket: '200-300', count: 122 },
    { bucket: '300-400', count: 189 },
    { bucket: '400-500', count: 272 },
    { bucket: '500-600', count: 163 },
    { bucket: '600-700', count: 38  },
    { bucket: '700+',    count: 6   },
  ],

  typeColors: {
    water: '#6390F0', normal: '#A8A878', grass: '#78C850', bug: '#A8B820',
    psychic: '#F85888', fire: '#F08030', ground: '#E0C068', poison: '#A040A0',
    rock: '#B8A038', fighting: '#C03028', electric: '#F8D030', dragon: '#7038F8',
    steel: '#B8B8D0', dark: '#705848', ghost: '#705898', fairy: '#EE99AC',
    ice: '#98D8D8', flying: '#A890F0',
  } as Record<string, string>,
};

export const TECHNICAL_PATTERNS = [
  { pattern: "VALUES-based task mapping", usage: "Queries 1, 6", why: "New projects onboard without query rewrites" },
  { pattern: "CASE-based team classification", usage: "Queries 2, 3", why: "No native team field in source data" },
  { pattern: "Calendar dimension JOIN", usage: "Query 3", why: "Consistent ISO week numbering across years" },
  { pattern: "UNION ALL period stacking", usage: "Query 4", why: "Clean period-over-period comparison" },
  { pattern: "Production vs. QA coverage", usage: "Queries 5, 6", why: "Statistical significance of QA sample size" },
  { pattern: "Multi-level CTEs (4–6 deep)", usage: "All queries", why: "Readable, maintainable, debuggable SQL" },
  { pattern: "LEFT JOIN preservation", usage: "Queries 1, 2, 5", why: "Don't lose incomplete records" },
  { pattern: "Conditional aggregation", usage: "Queries 1, 4, 5, 6", why: "Multiple metrics in a single pass" },
];
