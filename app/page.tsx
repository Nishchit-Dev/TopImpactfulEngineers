"use client";

import { useEffect, useState } from "react";

type Engineer = {
  login: string;
  github_url: string;
  pr_search_url: string;
  pr_count: number;
  composite: number;
  review_depth: number;
  unblock_speed: number;
  cross_area: number;
  avg_depth_raw: number;
  med_hours_raw: number;
  reach_raw: number;
};

type DashboardData = {
  generated_at: string;
  days_analyzed: number;
  total_prs_analyzed: number;
  qualified_authors: number;
  top5: Engineer[];
};

const proofPoints: Array<(e: Engineer) => React.ReactNode> = [
  (e) => (
    <>
      Averaged{" "}
      <strong className="text-[#999]">
        {e.avg_depth_raw} substantive comments
      </strong>{" "}
      per review across {e.pr_count} PRs. Reviews often caught edge-cases and
      prompted architectural discussion.
    </>
  ),
  (e) => (
    <>
      Median first-review time of{" "}
      <strong className="text-[#999]">{e.med_hours_raw}h</strong> — consistently
      one of the fastest to unblock teammates across {e.pr_count} merged PRs.
    </>
  ),
  (e) => (
    <>
      Touched{" "}
      <strong className="text-[#999]">{e.reach_raw} distinct areas</strong> of
      the codebase — frontend, backend, and infra — showing broad ownership
      across {e.pr_count} PRs.
    </>
  ),
  (e) => (
    <>
      Contributed{" "}
      <strong className="text-[#999]">{e.pr_count} merged PRs</strong> spanning{" "}
      {e.reach_raw} top-level directories with strong review participation.
    </>
  ),
  (e) => (
    <>
      Balanced author and reviewer:{" "}
      <strong className="text-[#999]">{e.pr_count} PRs merged</strong>, median
      review turnaround of {e.med_hours_raw}h, covering {e.reach_raw} code areas.
    </>
  ),
];

const bars = [
  { key: "review_depth" as const, label: "Review Depth", color: "bg-[#f5a623]" },
  { key: "unblock_speed" as const, label: "Unblock Speed", color: "bg-[#4a9eff]" },
  { key: "cross_area" as const, label: "Cross-Area Reach", color: "bg-[#7ed321]" },
];

function EngineerCard({ eng, rank }: { eng: Engineer; rank: number }) {
  return (
    <div className="bg-[#141414] border border-[#222] rounded-[10px] p-4 hover:border-[#444] transition-colors flex flex-col">
      <div className="text-[11px] font-semibold text-[#555] uppercase tracking-[0.5px] mb-2">
        Rank <span className="text-[#f5a623]">#{rank}</span>
      </div>

      <div className="text-[15px] font-bold text-white mb-0.5">
        <a
          href={eng.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#f5a623] transition-colors"
        >
          @{eng.login}
        </a>
      </div>

      <div className="text-[11px] text-[#555] mb-3.5">{eng.pr_count} merged PRs</div>

      <div className="text-[32px] font-extrabold text-white tracking-[-1px] leading-none mb-1">
        {eng.composite}
      </div>
      <div className="text-[10px] text-[#555] uppercase tracking-[0.5px] mb-4">
        Impact Score
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {bars.map(({ key, label, color }) => (
          <div key={key} className="flex flex-col gap-[3px]">
            <div className="flex justify-between text-[10px] text-[#666]">
              <span>{label}</span>
              <span className="text-[#999]">{eng[key]}</span>
            </div>
            <div className="h-[5px] bg-[#222] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${color}`}
                style={{ width: `${eng[key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#1e1e1e] pt-3 text-[11px] text-[#666] leading-[1.5] mt-auto">
        <strong className="text-[#999] block mb-1">Why they rank here</strong>
        {proofPoints[rank - 1](eng)}
        <br />
        <br />
        <a
          href={eng.pr_search_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4a9eff] text-[10px] hover:underline"
        >
          → View their PRs on GitHub
        </a>
      </div>
    </div>
  );
}

function Methodology() {
  return (
    <details className="group bg-[#141414] border border-[#1e1e1e] rounded-[10px] px-5 py-4 text-[12px] text-[#666] leading-[1.7]">
      <summary className="cursor-pointer list-none flex items-center gap-1.5 font-semibold text-[#555] uppercase tracking-[0.5px] select-none">
        <span className="text-[8px] group-open:hidden">▶</span>
        <span className="text-[8px] hidden group-open:inline">▼</span>
        Methodology
      </summary>

      <div className="grid grid-cols-3 gap-4 mt-3.5">
        <div>
          <strong className="block text-[#888] mb-1 text-[12px]">
            🟠 Review Depth (40%)
          </strong>
          Measures the average number of substantive comments left per code
          review. One-liners like &ldquo;LGTM&rdquo; or emoji-only responses are
          filtered out. Higher = more thorough reviewer who catches real issues.
        </div>
        <div>
          <strong className="block text-[#888] mb-1 text-[12px]">
            🔵 Unblocking Speed (35%)
          </strong>
          Median hours from when a PR was opened to when this engineer left
          their first review. Lower hours = faster at unblocking teammates.
          Score is inverted so higher = faster.
        </div>
        <div>
          <strong className="block text-[#888] mb-1 text-[12px]">
            🟢 Cross-Area Reach (25%)
          </strong>
          Count of distinct top-level repository directories this engineer
          touched across all their merged PRs. Higher = more versatile, works
          across the whole codebase rather than being siloed.
        </div>
      </div>

      <p className="mt-3.5 text-[11px] text-[#444]">
        All three raw scores are normalized to a 0–100 percentile rank within
        the qualified engineer pool, then combined using the weights above into
        a single composite score. Only engineers with ≥3 merged PRs in the
        window are ranked. Bots and external accounts are filtered out.
      </p>

      <div className="mt-5 pt-5 border-t border-[#1e1e1e]">
        <p className="text-[12px] font-semibold text-[#555] uppercase tracking-[0.5px] mb-3">
          Why these signals — not commit count or PR volume?
        </p>
        <div className="grid grid-cols-3 gap-4 text-[11px] text-[#555] leading-[1.7]">
          <div>
            <strong className="block text-[#666] mb-1">Reviews over commits</strong>
            Commit count measures activity, not impact. An engineer can push
            50 trivial fixes or one architectural change that ships a feature.
            Volume is noise. Reviews, by contrast, are where knowledge spreads
            and bugs get caught before they hit production — that&apos;s leverage.
          </div>
          <div>
            <strong className="block text-[#666] mb-1">Speed as a team signal</strong>
            Every hour a PR sits waiting is dead time for a teammate. Fast
            reviewers compress the feedback loop for everyone around them.
            A decent review delivered in 2 hours beats a thorough one delivered
            in 3 days — flow matters more than perfection in most cases.
          </div>
          <div>
            <strong className="block text-[#666] mb-1">Breadth as resilience</strong>
            Engineers siloed in one area create bottlenecks. When someone
            touches frontend, backend, and infra they reduce single points of
            failure, make the codebase legible to more people, and can
            unblock teammates anywhere — not just in their lane.
          </div>
        </div>
        <p className="mt-4 text-[11px] text-[#3a3a3a] italic">
          Note: the weights (40 / 35 / 25) reflect a deliberate priority — review quality
          is weighted highest because it compounds across every engineer the reviewer touches,
          not just their own output.
        </p>
      </div>
    </details>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-[#555] text-sm">
        Loading…
      </div>
    );
  }

  const updated = new Date(data.generated_at).toLocaleDateString();

  return (
    <div className="bg-[#0d0d0d] text-[#e8e8e8] min-h-screen px-8 py-7 font-sans">
      {/* Header */}
      <header className="flex justify-between items-start mb-6 border-b border-[#222] pb-5">
        <div>
          <h1 className="text-[22px] font-bold text-white tracking-[-0.3px]">
            PostHog · Engineering Impact Dashboard
          </h1>
          <p className="mt-1.5 text-[13px] text-[#888] max-w-xl leading-[1.5]">
            Impact is measured by{" "}
            <strong className="text-[#bbb]">
              how much an engineer makes the team better
            </strong>{" "}
            — not by how much code they write. We score on three dimensions: the
            depth of their code reviews, how fast they unblock teammates, and
            how broadly they contribute across the codebase.
          </p>
        </div>

        <div className="text-[12px] text-[#555] text-right leading-[1.8] shrink-0 ml-8">
          <div>{data.days_analyzed}-day window</div>
          <div>{data.total_prs_analyzed.toLocaleString()} PRs analyzed</div>
          <div>{data.qualified_authors} qualified engineers</div>
          <div className="text-[#333]">Updated {updated}</div>
        </div>
      </header>

      {/* Legend */}
      <div className="flex gap-5 mb-4 text-[12px] text-[#666]">
        {[
          { color: "bg-[#f5a623]", label: "Review Depth (40%)" },
          { color: "bg-[#4a9eff]", label: "Unblocking Speed (35%)" },
          { color: "bg-[#7ed321]", label: "Cross-Area Reach (25%)" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-[2px] ${color}`} />
            {label}
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-5 gap-3.5 mb-5">
        {data.top5.map((eng, i) => (
          <EngineerCard key={eng.login} eng={eng} rank={i + 1} />
        ))}
      </div>

      {/* Methodology */}
      <Methodology />
    </div>
  );
}
