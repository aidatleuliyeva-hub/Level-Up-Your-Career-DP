// F:\gopro\levelup-frontend\src\components\dashboard\CreateChallengeSection.jsx
import React from "react";

export default function CreateChallengeSection({
  canCreate,
  chTitle,
  setChTitle,
  chDescription,
  setChDescription,
  chType,
  setChType,
  chDifficulty,
  setChDifficulty,
  chRewardCredits,
  setChRewardCredits,
  chRewardAmount,
  setChRewardAmount,
  createLoading,
  createError,
  createSuccess,
  handleCreateChallenge,
}) {
  return (
    <section className="content-section">
      <div className="content-header">
        <div>
          <h1>Create challenge</h1>
          <p>
            Challenge description for students: a theoretical module, a project
            assignment, or a real company case.
          </p>
        </div>
      </div>

      {!canCreate && (
        <div className="alert alert-error">
          Your role cannot create challenges.  
          Available for <strong>teacher / company / admin</strong>.
        </div>
      )}

      {canCreate && (
        <div className="form-layout">
          {/*   */}
          <div className="ch-card form-panel">
            <div className="form-panel-header">
              <h2>Challenge parameters</h2>
              <p>
                Write a short, clear challenge for the student: what
                they need to do and what result is expected.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleCreateChallenge}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Challenge title</label>
                  <input
                    type="text"
                    value={chTitle}
                    onChange={(e) => setChTitle(e.target.value)}
                    placeholder="Example: Backend challenge: REST API in Go"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Challenge type</label>
                  <select
                    value={chType}
                    onChange={(e) => setChType(e.target.value)}
                  >
                    <option value="academic">academic (coursework)</option>
                    <option value="company">company (industry)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Task description</label>
                <textarea
                  value={chDescription}
                  onChange={(e) => setChDescription(e.target.value)}
                  rows={5}
                  placeholder="Briefly describe the context, what needs to be done, and success criteria. Keep it concise."
                  style={{
                    resize: "vertical",
                    borderRadius: 9,
                    border: "1px solid rgba(148,163,184,0.55)",
                    background: "rgba(15,23,42,0.98)",
                    padding: "7px 9px",
                    fontSize: 13,
                    color: "var(--text-main)",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Difficulty</label>
                  <input
                    type="text"
                    value={chDifficulty}
                    onChange={(e) => setChDifficulty(e.target.value)}
                    placeholder="e.g., easy / medium / hard"
                  />
                </div>

                <div className="form-group">
                  <label>Credits ()</label>
                  <input
                    type="number"
                    min="0"
                    value={chRewardCredits}
                    onChange={(e) => setChRewardCredits(e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>, € ()</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={chRewardAmount}
                    onChange={(e) => setChRewardAmount(e.target.value)}
                    placeholder="e.g., 150"
                  />
                </div>
              </div>

              {createError && (
                <div className="alert alert-error">Error: {createError}</div>
              )}

              {createSuccess && (
                <div className="alert success-soft">{createSuccess}</div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createLoading}
                >
                  {createLoading ? "Creating..." : "Create challenge"}
                </button>
              </div>
            </form>
          </div>

          {/*   —  */}
          <aside className="ch-card form-aside">
            <div className="form-aside-title">   </div>
            <ul className="form-aside-list">
              <li>1–2  ,   .</li>
              <li>  : , , .</li>
              <li>  :   «».</li>
              <li>    1–2 .</li>
            </ul>

            <div className="form-aside-note">
                    
              - .
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
