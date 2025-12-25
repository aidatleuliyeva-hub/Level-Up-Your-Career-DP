// src/components/dashboard/ChallengeDetailsSection.jsx
import React from "react";
import Modal from "../ui/Modal";

export default function ChallengeDetailsSection({
  isStudent,
  userRole,
  selectedChallenge,
  detailsLoading,
  detailsError,
  goBackToOverview,
  startError,
  handleStartChallenge,
  hasAttempt,
  myAttemptStatus,
  currentStudentAttempt,
  submissionText,
  setSubmissionText,
  submissionLink,
  setSubmissionLink,
  submitLoading,
  submitError,
  submitSuccess,
  handleSubmitSolution,
  submissions,
  subsLoading,
  subsError,
  startReview,
  reviewAttemptId,
  reviewGrade,
  setReviewGrade,
  reviewFeedback,
  setReviewFeedback,
  reviewLoading,
  reviewError,
  reviewSuccess,
  handleReviewSubmit,
  closeReview, // :   
}) {
  const isReviewer =
    userRole === "teacher" || userRole === "company" || userRole === "admin";

  return (
    <section className="content-section">
      <div className="content-header">
        <div>
          <h1></h1>
        </div>
      </div>

      <button className="btn btn-ghost" onClick={goBackToOverview}>
        ← Back  
      </button>

      {detailsLoading && (
        <div className="ch-empty" style={{ marginTop: 10 }}>
            ...
        </div>
      )}

      {detailsError && (
        <div className="alert alert-error" style={{ marginTop: 10 }}>
          Error: {detailsError}
        </div>
      )}

      {!detailsLoading && selectedChallenge && (
        <div style={{ marginTop: 14 }}>
          <h2>{selectedChallenge.title}</h2>
          <p className="ch-desc">{selectedChallenge.description}</p>

          <div className="ch-meta" style={{ marginTop: 8 }}>
            {selectedChallenge.challenge_type && (
              <span className="ch-pill">
                : {selectedChallenge.challenge_type}
              </span>
            )}
            {selectedChallenge.difficulty && (
              <span className="ch-pill">
                Difficulty: {selectedChallenge.difficulty}
              </span>
            )}
            {selectedChallenge.reward_credits != null && (
              <span className="ch-pill">
                Credits: {selectedChallenge.reward_credits}
              </span>
            )}
            {selectedChallenge.reward_amount != null && (
              <span className="ch-pill">
                Reward: {selectedChallenge.reward_amount} €
              </span>
            )}
          </div>

          {isStudent && (
            <div style={{ marginTop: 14 }}>
              {startError && (
                <div className="alert alert-error">Error: {startError}</div>
              )}

              {!hasAttempt && (
                <button
                  className="btn btn-primary"
                  onClick={handleStartChallenge}
                  style={{ marginBottom: 10 }}
                >
                   
                </button>
              )}

              {hasAttempt && myAttemptStatus === "started" && (
                <>
                  <div
                    className="alert"
                    style={{
                      marginTop: 4,
                      marginBottom: 8,
                      background: "rgba(34,197,94,0.12)",
                      color: "#bbf7d0",
                      border: "1px solid rgba(34,197,94,0.6)",
                    }}
                  >
                        .    
                    .
                  </div>

                  <form className="auth-form" onSubmit={handleSubmitSolution}>
                    <div className="form-group">
                      <label>  ()</label>
                      <textarea
                        rows={4}
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
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
                      />
                    </div>

                    <div className="form-group">
                      <label>   /  ()</label>
                      <input
                        type="text"
                        value={submissionLink}
                        onChange={(e) => setSubmissionLink(e.target.value)}
                      />
                    </div>

                    {submitError && (
                      <div className="alert alert-error">
                        Error: {submitError}
                      </div>
                    )}

                    {submitSuccess && (
                      <div
                        className="alert"
                        style={{
                          background: "rgba(34,197,94,0.12)",
                          color: "#bbf7d0",
                          border: "1px solid rgba(34,197,94,0.6)",
                        }}
                      >
                        {submitSuccess}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitLoading}
                    >
                      {submitLoading ? "Submitting..." : "Submit solution"}
                    </button>
                  </form>
                </>
              )}

              {hasAttempt && myAttemptStatus === "submitted" && (
                <div
                  className="alert"
                  style={{
                    marginTop: 8,
                    background: "rgba(59,130,246,0.12)",
                    color: "#bfdbfe",
                    border: "1px solid rgba(59,130,246,0.6)",
                  }}
                >
                     . :{" "}
                  <strong>submitted</strong>.   
                   .
                </div>
              )}

              {hasAttempt && myAttemptStatus === "reviewed" && (
                <div
                  className="alert"
                  style={{
                    marginTop: 8,
                    background: "rgba(34,197,94,0.12)",
                    color: "#bbf7d0",
                    border: "1px solid rgba(34,197,94,0.6)",
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    ✅  !
                  </div>
                  {currentStudentAttempt?.grade != null && (
                    <div>
                      Grade:{" "}
                      <strong>{currentStudentAttempt.grade}</strong>
                    </div>
                  )}
                  {currentStudentAttempt?.feedback && (
                    <div style={{ marginTop: 4 }}>
                      : {currentStudentAttempt.feedback}
                    </div>
                  )}
                  {!currentStudentAttempt?.feedback &&
                    currentStudentAttempt?.grade == null && (
                      <div>
                        Teacher     .
                      </div>
                    )}
                </div>
              )}
            </div>
          )}

          {isReviewer && (
            <div style={{ marginTop: 24 }}>
              <h3>Submissions </h3>

              {subsLoading && (
                <div className="ch-empty" style={{ marginTop: 8 }}>
                   ...
                </div>
              )}

              {subsError && (
                <div className="alert alert-error" style={{ marginTop: 8 }}>
                  Error: {subsError}
                </div>
              )}

              {!subsLoading && !subsError && submissions.length === 0 && (
                <div className="ch-empty" style={{ marginTop: 8 }}>
                        .
                </div>
              )}

              {!subsLoading && submissions.length > 0 && (
                <div className="ch-list" style={{ marginTop: 8 }}>
                  {submissions.map((s) => (
                    <div key={s.attempt_id} className="ch-card">
                      <div className="ch-card-header">
                        <div>
                          <h3>{s.student_full_name}</h3>
                          <p className="ch-desc">
                            {s.student_email} · : {s.status}
                          </p>
                        </div>
                        {s.grade != null && (
                          <span className="ch-type">
                            Grade: {s.grade}
                          </span>
                        )}
                      </div>

                      <div className="ch-meta" style={{ marginTop: 4 }}>
                        {s.submission_link && (
                          <span className="ch-pill">
                            <a
                              href={s.submission_link}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#bfdbfe" }}
                            >
                               
                            </a>
                          </span>
                        )}
                      </div>

                      {s.submission_text && (
                        <p
                          className="ch-desc"
                          style={{
                            marginTop: 6,
                            maxHeight: 80,
                            overflow: "auto",
                          }}
                        >
                          {s.submission_text}
                        </p>
                      )}

                      <div style={{ marginTop: 8 }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => startReview(s)}
                        >
                           /  
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/*    */}
      <Modal
        open={!!reviewAttemptId}
        onClose={closeReview}
        title="Review student submission"
        width={520}
      >
        {reviewError && (
          <div className="alert alert-error" style={{ marginBottom: 10 }}>
            Error: {reviewError}
          </div>
        )}

        {reviewSuccess && (
          <div
            className="alert"
            style={{
              marginBottom: 10,
              background: "rgba(34,197,94,0.12)",
              color: "#bbf7d0",
              border: "1px solid rgba(34,197,94,0.6)",
            }}
          >
            {reviewSuccess}
          </div>
        )}

        <form className="auth-form" onSubmit={handleReviewSubmit}>
          <div className="form-group">
            <label> (0–100, )</label>
            <input
              type="number"
              min="0"
              max="100"
              value={reviewGrade}
              onChange={(e) => setReviewGrade(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label> </label>
            <textarea
              rows={4}
              value={reviewFeedback}
              onChange={(e) => setReviewFeedback(e.target.value)}
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
            />
          </div>

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
              onClick={closeReview}
            >
              
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={reviewLoading}
            >
              {reviewLoading ? "Saving..." : "Save feedback"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
