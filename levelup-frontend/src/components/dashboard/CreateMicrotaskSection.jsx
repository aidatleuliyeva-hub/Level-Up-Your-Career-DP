// F:\gopro\levelup-frontend\src\components\dashboard\CreateMicrotaskSection.jsx
import React from "react";

export default function CreateMicrotaskSection({
  canCreate,
  mtTitle,
  setMtTitle,
  mtDescription,
  setMtDescription,
  mtDifficulty,
  setMtDifficulty,
  mtRewardCredits,
  setMtRewardCredits,
  mtRewardAmount,
  setMtRewardAmount,
  mtCreateLoading,
  mtCreateError,
  mtCreateSuccess,
  handleCreateMicrotask,
}) {
  return (
    <section className="content-section">
      <div className="content-header">
        <div>
          <h1>Create microtask</h1>
          <p>
              :   , -
               .
          </p>
        </div>
      </div>

      {!canCreate && (
        <div className="alert alert-error">
               .  
          Available for <strong>teacher / company / admin</strong>.
        </div>
      )}

      {canCreate && (
        <div className="form-layout">
          {/*   */}
          <div className="ch-card form-panel">
            <div className="form-panel-header">
              <h2> </h2>
              <p>
                 —    1–3 .  
                 —      ,   .
              </p>
            </div>

            <form className="auth-form" onSubmit={handleCreateMicrotask}>
              <div className="form-group">
                <label></label>
                <input
                  type="text"
                  value={mtTitle}
                  onChange={(e) => setMtTitle(e.target.value)}
                  placeholder="Example: Write an SQL query for a report"
                  required
                />
              </div>

              <div className="form-group">
                <label></label>
                <textarea
                  value={mtDescription}
                  onChange={(e) => setMtDescription(e.target.value)}
                  rows={4}
                  placeholder="Briefly describe the task, inputs, and what counts as the result."
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
                    value={mtDifficulty}
                    onChange={(e) => setMtDifficulty(e.target.value)}
                    placeholder="e.g., easy / medium / hard"
                  />
                </div>

                <div className="form-group">
                  <label>Credits ()</label>
                  <input
                    type="number"
                    min="0"
                    value={mtRewardCredits}
                    onChange={(e) => setMtRewardCredits(e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>, € ()</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={mtRewardAmount}
                    onChange={(e) => setMtRewardAmount(e.target.value)}
                    placeholder="e.g., 20"
                  />
                </div>
              </div>

              {mtCreateError && (
                <div className="alert alert-error">
                  Error: {mtCreateError}
                </div>
              )}

              {mtCreateSuccess && (
                <div className="alert success-soft">{mtCreateSuccess}</div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={mtCreateLoading}
                >
                  {mtCreateLoading ? "Creating..." : "Create microtask"}
                </button>
              </div>
            </form>
          </div>

          {/*   —  */}
          <aside className="ch-card form-aside">
            <div className="form-aside-title"> </div>
            <ul className="form-aside-list">
              <li>  1–3 .</li>
              <li> ,  .</li>
              <li>    .</li>
              <li>   / .</li>
            </ul>

            <div className="form-aside-note">
              Microtasks       
                   .
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
