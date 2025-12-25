// src/components/dashboard/MicrotasksSection.jsx
import React, { useMemo, useState } from "react";
import Modal from "../ui/Modal";

export default function MicrotasksSection({
  isStudent,
  userRole,
  microtasks,
  mtLoading,
  mtError,
  myMicrotasks,
  myMtLoading,
  myMtError,
  applyMicrotaskId,
  setApplyMicrotaskId,
  applicationText,
  setApplicationText,
  applyLoading,
  applyError,
  applySuccess,
  handleApplySubmit,
  resultForAppId,
  setResultForAppId,
  resultText,
  setResultText,
  resultLink,
  setResultLink,
  resultLoading,
  resultError,
  resultSuccess,
  handleSubmitMicrotaskResult,
  selectedMicrotaskForApps,
  setSelectedMicrotaskForApps,
  mtApps,
  mtAppsLoading,
  mtAppsError,
  mtStatusLoadingId,
  mtStatusError,
  loadApplicationsForMicrotask,
  handleUpdateApplicationStatus,
  //    
  setApplyError,
  setApplySuccess,
  setResultError,
  setResultSuccess,
}) {
  // ----       (teacher/company/admin) ----
  const [selectedAppForManage, setSelectedAppForManage] = useState(null);

  //       ( ID)
  const microtaskForApplyModal = useMemo(
    () => microtasks.find((mt) => mt.id === applyMicrotaskId) || null,
    [microtasks, applyMicrotaskId]
  );

  //  /   "Submit result"
  const applicationForResultModal = useMemo(
    () =>
      myMicrotasks.find((item) => item.application_id === resultForAppId) ||
      null,
    [myMicrotasks, resultForAppId]
  );

  // Close  "Respond"
  const closeApplyModal = () => {
    setApplyMicrotaskId(null);
    setApplicationText("");
    if (setApplyError) setApplyError(null);
    if (setApplySuccess) setApplySuccess(null);
  };

  // Close  "Submit result"
  const closeResultModal = () => {
    setResultForAppId(null);
    setResultText("");
    setResultLink("");
    if (setResultError) setResultError(null);
    if (setResultSuccess) setResultSuccess(null);
  };

  // Close    (teacher/company/admin)
  const closeManageAppModal = () => {
    setSelectedAppForManage(null);
  };

  const isTeacherSide = userRole !== "student";

  return (
    <section className="content-section">
      <div className="content-header">
        <div>
          <h1>Microtasks</h1>
          <p>
                 .  —  —
               .
          </p>
        </div>
        <div className="content-header-meta">
          {mtLoading && <span className="ch-badge">...</span>}
          {!mtLoading && microtasks.length > 0 && (
            <span className="ch-badge">
              {microtasks.length} ()
            </span>
          )}
        </div>
      </div>

      {mtError && <div className="alert alert-error">Error: {mtError}</div>}

      {!mtLoading && microtasks.length === 0 && !mtError && (
        <div className="ch-empty">
             .      .
        </div>
      )}

      <div className="ch-list">
        {microtasks.map((mt) => {
          const myApp = isStudent
            ? myMicrotasks.find((a) => a.microtask_id === mt.id)
            : null;

          const alreadyApplied = !!myApp;

          return (
            <div key={mt.id} className="ch-card">
              <div className="ch-card-header">
                <div>
                  <h3>{mt.title}</h3>
                  <p className="ch-desc">{mt.description}</p>
                </div>
                <span className="ch-type">microtask</span>
              </div>

              <div className="ch-meta">
                {mt.difficulty && (
                  <span className="ch-pill">Difficulty: {mt.difficulty}</span>
                )}
                {mt.reward_credits != null && (
                  <span className="ch-pill">
                    Credits: {mt.reward_credits}
                  </span>
                )}
                {mt.reward_amount != null && (
                  <span className="ch-pill">
                    Reward: {mt.reward_amount} €
                  </span>
                )}
              </div>

              {isStudent && (
                <>
                  {alreadyApplied && (
                    <p
                      className="ch-desc"
                      style={{ marginTop: 6, fontSize: 12 }}
                    >
                           . :{" "}
                      <strong>{myApp.application_status}</strong>.
                    </p>
                  )}

                  {!alreadyApplied && (
                    <div style={{ marginTop: 8 }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setApplyMicrotaskId(mt.id);
                          setApplicationText("");
                          if (setApplyError) setApplyError(null);
                          if (setApplySuccess) setApplySuccess(null);
                        }}
                      >
                        Respond
                      </button>
                    </div>
                  )}
                </>
              )}

              {!isStudent && (
                <div style={{ marginTop: 10 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedMicrotaskForApps(mt);
                      loadApplicationsForMicrotask(mt.id);
                    }}
                  >
                     
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- My microtasks ( ) --- */}
      {isStudent && (
        <div className="challenges-section">
          <h3 style={{ marginTop: 18, marginBottom: 6 }}>My microtasks</h3>

          {myMtLoading && (
            <div className="ch-empty">  ...</div>
          )}

          {myMtError && (
            <div className="alert alert-error">Error: {myMtError}</div>
          )}

          {!myMtLoading && !myMtError && myMicrotasks.length === 0 && (
            <div className="ch-empty">
                   .
            </div>
          )}

          {!myMtLoading && myMicrotasks.length > 0 && (
            <div className="ch-list">
              {myMicrotasks.map((item) => (
                <div key={item.application_id} className="ch-card">
                  <div className="ch-card-header">
                    <div>
                      <h3>{item.title}</h3>
                      <p className="ch-desc">
                         : {item.application_status}
                      </p>
                    </div>
                  </div>

                  <div className="ch-meta">
                    {item.difficulty && (
                      <span className="ch-pill">
                        Difficulty: {item.difficulty}
                      </span>
                    )}
                    {item.reward_credits != null && (
                      <span className="ch-pill">
                        Credits: {item.reward_credits}
                      </span>
                    )}
                    {item.reward_amount != null && (
                      <span className="ch-pill">
                        Reward: {item.reward_amount} €
                      </span>
                    )}
                  </div>

                  {item.application_text && (
                    <p
                      className="ch-desc"
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        opacity: 0.9,
                      }}
                    >
                       : {item.application_text}
                    </p>
                  )}

                  {(item.result_text || item.result_link) && (
                    <p
                      className="ch-desc"
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        opacity: 0.9,
                      }}
                    >
                      <strong> :</strong>{" "}
                      {item.result_text && <span>{item.result_text} </span>}
                      {item.result_link && (
                        <a
                          href={item.result_link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#bfdbfe" }}
                        >
                           
                        </a>
                      )}
                    </p>
                  )}

                  {item.application_status === "accepted" && (
                    <div style={{ marginTop: 8 }}>
                      {resultForAppId !== item.application_id && (
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setResultForAppId(item.application_id);
                            setResultText("");
                            setResultLink("");
                            if (setResultError) setResultError(null);
                            if (setResultSuccess) setResultSuccess(null);
                          }}
                        >
                          Submit result
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---    teacher/company/admin --- */}
      {isTeacherSide && selectedMicrotaskForApps && (
        <div
          style={{
            marginTop: 20,
            paddingTop: 12,
            borderTop: "1px solid rgba(148,163,184,0.35)",
          }}
        >
          <h3>  : {selectedMicrotaskForApps.title}</h3>

          {mtAppsLoading && (
            <div className="ch-empty"> ...</div>
          )}

          {mtAppsError && (
            <div className="alert alert-error">Error: {mtAppsError}</div>
          )}

          {mtStatusError && (
            <div className="alert alert-error">
              Error : {mtStatusError}
            </div>
          )}

          {!mtAppsLoading && !mtAppsError && mtApps.length === 0 && (
            <div className="ch-empty">
                   .
            </div>
          )}

          {!mtAppsLoading && mtApps.length > 0 && (
            <div className="ch-list">
              {mtApps.map((app) => (
                <div key={app.application_id} className="ch-card">
                  <div className="ch-card-header">
                    <div>
                      <h3>{app.student_full_name}</h3>
                      <p className="ch-desc">
                        {app.student_email} · : {app.status}
                      </p>
                    </div>
                  </div>

                  {app.application_text && (
                    <p
                      className="ch-desc"
                      style={{ marginTop: 6, fontSize: 13 }}
                    >
                      : {app.application_text}
                    </p>
                  )}

                  {(app.result_text || app.result_link) && (
                    <p
                      className="ch-desc"
                      style={{ marginTop: 6, fontSize: 12, opacity: 0.9 }}
                    >
                      <strong> :</strong>{" "}
                      {app.result_text && <span>{app.result_text} </span>}
                      {app.result_link && (
                        <a
                          href={app.result_link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#bfdbfe" }}
                        >
                           
                        </a>
                      )}
                    </p>
                  )}

                  <div style={{ marginTop: 8 }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => setSelectedAppForManage(app)}
                    >
                       
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === :    (student) === */}
      <Modal
        open={!!applyMicrotaskId}
        onClose={closeApplyModal}
        title={
          microtaskForApplyModal
            ? ` : ${microtaskForApplyModal.title}`
            : "Response to microtask"
        }
        width={520}
      >
        <form className="auth-form" onSubmit={handleApplySubmit}>
          <div className="form-group">
            <label>  ,   </label>
            <textarea
              rows={4}
              value={applicationText}
              onChange={(e) => setApplicationText(e.target.value)}
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

          {applyError && (
            <div className="alert alert-error">Error: {applyError}</div>
          )}

          {applySuccess && (
            <div
              className="alert"
              style={{
                background: "rgba(34,197,94,0.12)",
                color: "#bbf7d0",
                border: "1px solid rgba(34,197,94,0.6)",
              }}
            >
              {applySuccess}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 4,
            }}
          >
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeApplyModal}
            >
              
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={applyLoading}
            >
              {applyLoading ? "Submitting..." : "Submit response"}
            </button>
          </div>
        </form>
      </Modal>

      {/* === :     (student) === */}
      <Modal
        open={!!resultForAppId}
        onClose={closeResultModal}
        title={
          applicationForResultModal
            ? ` : ${applicationForResultModal.title}`
            : "Submit result"
        }
        width={520}
      >
        <form className="auth-form" onSubmit={handleSubmitMicrotaskResult}>
          <div className="form-group">
            <label>   ()</label>
            <textarea
              rows={4}
              value={resultText}
              onChange={(e) => setResultText(e.target.value)}
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

          <div className="form-group">
            <label>   (GitHub / Figma / Drive)</label>
            <input
              type="text"
              value={resultLink}
              onChange={(e) => setResultLink(e.target.value)}
            />
          </div>

          {resultError && (
            <div className="alert alert-error">Error: {resultError}</div>
          )}

          {resultSuccess && (
            <div
              className="alert"
              style={{
                background: "rgba(34,197,94,0.12)",
                color: "#bbf7d0",
                border: "1px solid rgba(34,197,94,0.6)",
              }}
            >
              {resultSuccess}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 4,
            }}
          >
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeResultModal}
            >
              
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={resultLoading}
            >
              {resultLoading ? "Submitting..." : "Submit result"}
            </button>
          </div>
        </form>
      </Modal>

      {/* === :   (teacher/company/admin) === */}
      <Modal
        open={!!selectedAppForManage}
        onClose={closeManageAppModal}
        title={
          selectedAppForManage
            ? `: ${selectedAppForManage.student_full_name}`
            : "Student response"
        }
        width={540}
      >
        {selectedAppForManage && (
          <>
            <p className="ch-desc" style={{ marginBottom: 10 }}>
              {selectedAppForManage.student_email} · :{" "}
              <strong>{selectedAppForManage.status}</strong>
            </p>

            {selectedAppForManage.application_text && (
              <div style={{ marginBottom: 10 }}>
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    opacity: 0.7,
                    marginBottom: 4,
                  }}
                >
                  
                </div>
                <p
                  className="ch-desc"
                  style={{ maxHeight: 120, overflow: "auto" }}
                >
                  {selectedAppForManage.application_text}
                </p>
              </div>
            )}

            {(selectedAppForManage.result_text ||
              selectedAppForManage.result_link) && (
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    opacity: 0.7,
                    marginBottom: 4,
                  }}
                >
                   
                </div>
                <p
                  className="ch-desc"
                  style={{ maxHeight: 140, overflow: "auto" }}
                >
                  {selectedAppForManage.result_text && (
                    <span>{selectedAppForManage.result_text} </span>
                  )}
                  {selectedAppForManage.result_link && (
                    <a
                      href={selectedAppForManage.result_link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#bfdbfe" }}
                    >
                       
                    </a>
                  )}
                </p>
              </div>
            )}

            {mtStatusError && (
              <div className="alert alert-error" style={{ marginBottom: 10 }}>
                Error : {mtStatusError}
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 4,
              }}
            >
              <button
                className="btn btn-primary"
                disabled={
                  mtStatusLoadingId === selectedAppForManage.application_id
                }
                onClick={() =>
                  handleUpdateApplicationStatus(
                    selectedAppForManage.application_id,
                    "accepted"
                  )
                }
              >
                {mtStatusLoadingId === selectedAppForManage.application_id
                  ? "Saving..."
                  : "Accept"}
              </button>

              <button
                className="btn btn-ghost"
                disabled={
                  mtStatusLoadingId === selectedAppForManage.application_id
                }
                onClick={() =>
                  handleUpdateApplicationStatus(
                    selectedAppForManage.application_id,
                    "rejected"
                  )
                }
              >
                
              </button>

              <button
                className="btn btn-ghost"
                disabled={
                  mtStatusLoadingId === selectedAppForManage.application_id
                }
                onClick={() =>
                  handleUpdateApplicationStatus(
                    selectedAppForManage.application_id,
                    "completed"
                  )
                }
              >
                 
              </button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
