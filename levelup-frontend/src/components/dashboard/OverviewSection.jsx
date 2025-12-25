// F:\gopro\levelup-frontend\src\components\dashboard\OverviewSection.jsx
import React, { useMemo, useState } from "react";

export default function OverviewSection({
  challengesForOverview,
  chLoading,
  chError,
  openChallengeDetails,
}) {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredChallenges = useMemo(() => {
    let list = [...challengesForOverview];

    //     
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((ch) => {
        const title = (ch.title || "").toLowerCase();
        const desc = (ch.description || "").toLowerCase();
        return title.includes(q) || desc.includes(q);
      });
    }

    //   
    if (typeFilter !== "all") {
      list = list.filter((ch) => ch.challenge_type === typeFilter);
    }

    //   
    if (difficultyFilter !== "all") {
      list = list.filter((ch) => {
        const d = (ch.difficulty || "").toLowerCase();
        return d === difficultyFilter;
      });
    }

    // 
    if (sortBy === "reward") {
      list.sort((a, b) => {
        const av = a.reward_amount != null ? Number(a.reward_amount) : 0;
        const bv = b.reward_amount != null ? Number(b.reward_amount) : 0;
        return bv - av;
      });
    } else if (sortBy === "credits") {
      list.sort((a, b) => {
        const av = a.reward_credits != null ? Number(a.reward_credits) : 0;
        const bv = b.reward_credits != null ? Number(b.reward_credits) : 0;
        return bv - av;
      });
    }
    // sortBy === "newest" —       (   ORDER BY created_at DESC)

    return list;
  }, [challengesForOverview, search, difficultyFilter, typeFilter, sortBy]);

  return (
    <section className="content-section">
      <div className="content-header">
        <div>
          <h1> </h1>
          <p>
                ,   
            .  ,   .
          </p>
        </div>
        <div className="content-header-meta">
          {chLoading && <span className="ch-badge">...</span>}
          {!chLoading && filteredChallenges.length > 0 && (
            <span className="ch-badge">
              {filteredChallenges.length} ()
            </span>
          )}
        </div>
      </div>

      {/*   /  /  */}
      <div className="content-filters">
        <div className="content-filters-row">
          <div className="filter-group">
            <label className="filter-label"></label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search by title or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label"></label>
            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all"></option>
              <option value="academic"> academic</option>
              <option value="company"> company</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Difficulty</label>
            <select
              className="filter-select"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="all"></option>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label"></label>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest"> </option>
              <option value="reward">  (€)</option>
              <option value="credits"> </option>
            </select>
          </div>
        </div>
      </div>

      {chError && (
        <div className="alert alert-error" style={{ marginTop: 8 }}>
          Error: {chError}
        </div>
      )}

      {!chLoading &&
        filteredChallenges.length === 0 &&
        !chError &&
        !search &&
        difficultyFilter === "all" &&
        typeFilter === "all" && (
          <div className="ch-empty">
               .
            <br />
            <span style={{ fontSize: 11, opacity: 0.85 }}>
                    —  
               <strong>«Create challenge»</strong>   
              .
            </span>
          </div>
        )}

      {!chLoading &&
        filteredChallenges.length === 0 &&
        !chError &&
        (search || difficultyFilter !== "all" || typeFilter !== "all") && (
          <div className="ch-empty">
                 .
            <br />
            <span style={{ fontSize: 11, opacity: 0.85 }}>
                   .
            </span>
          </div>
        )}

      <div className="ch-list">
        {filteredChallenges.map((ch) => (
          <div key={ch.id} className="ch-card">
            <div className="ch-card-header">
              <div>
                <h3>{ch.title}</h3>
                <p className="ch-desc">{ch.description}</p>
              </div>
              <span className="ch-type">{ch.challenge_type}</span>
            </div>
            <div className="ch-meta">
              {ch.difficulty && (
                <span className="ch-pill">
                  Difficulty: {ch.difficulty}
                </span>
              )}
              {ch.reward_credits != null && (
                <span className="ch-pill">
                  Credits: {ch.reward_credits}
                </span>
              )}
              {ch.reward_amount != null && (
                <span className="ch-pill">
                  Reward: {ch.reward_amount} €
                </span>
              )}
            </div>
            <div style={{ marginTop: 8 }}>
              <button
                className="btn btn-primary"
                onClick={() => openChallengeDetails(ch.id)}
              >
                
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
