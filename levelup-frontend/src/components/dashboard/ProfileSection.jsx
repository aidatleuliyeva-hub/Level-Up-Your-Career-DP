// F:\gopro\levelup-frontend\src\components\dashboard\ProfileSection.jsx
import React from "react";

export default function ProfileSection({
  isStudent,
  myChallenges,
  myLoading,
  myError,
  openChallengeDetails,
}) {
  const safeChallenges = Array.isArray(myChallenges) ? myChallenges : [];

  const startedCount = isStudent
    ? safeChallenges.filter((m) => m.attempt_status === "started").length
    : 0;

  const submittedCount = isStudent
    ? safeChallenges.filter((m) => m.attempt_status === "submitted").length
    : 0;

  const reviewedChallenges = isStudent
    ? safeChallenges.filter((m) => m.attempt_status === "reviewed")
    : [];

  const reviewedCount = reviewedChallenges.length;

  const totalCredits = reviewedChallenges.reduce(
    (sum, m) => sum + (m.reward_credits || 0),
    0
  );

  const totalAmount = reviewedChallenges.reduce(
    (sum, m) => sum + (m.reward_amount || 0),
    0
  );

  const grades = reviewedChallenges
    .filter((m) => m.grade != null)
    .map((m) => m.grade);

  const avgGrade =
    grades.length > 0
      ? Math.round(
          (grades.reduce((sum, g) => sum + g, 0) / grades.length) * 10
        ) / 10
      : null;

  const lastReviewed = reviewedChallenges.slice(0, 3);

  const getStatusClass = (status) => {
    switch (status) {
      case "started":
        return "status-pill status-started";
      case "submitted":
        return "status-pill status-submitted";
      case "reviewed":
        return "status-pill status-reviewed";
      default:
        return "status-pill";
    }
  };

  return (
    <section className="content-section">
      <div className="content-header">
        <div>
          <h1>Profile </h1>
          <p>
               :   ,   
              .
          </p>
        </div>
      </div>

      {!isStudent && (
        <div className="alert alert-error">
          Profile     <strong>student</strong>.
        </div>
      )}

      {isStudent && (
        <>
          {myLoading && (
            <div className="ch-empty" style={{ marginTop: 8 }}>
                  ...
            </div>
          )}

          {myError && (
            <div className="alert alert-error">Error: {myError}</div>
          )}

          {/* KPI- */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">In progress</div>
              <div className="kpi-value">{startedCount}</div>
              <div className="kpi-sub">
                Challenges you started as a student.
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Pending review</div>
              <div className="kpi-value">{submittedCount}</div>
              <div className="kpi-sub">
                Submitted but not yet reviewed by a teacher or a company.
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Completed</div>
              <div className="kpi-value">{reviewedCount}</div>
              <div className="kpi-sub">Reviewed and closed challenges.</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Credits</div>
              <div className="kpi-value">{totalCredits}</div>
              <div className="kpi-sub">
                Credits earned from completed challenges.
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Earned, €</div>
              <div className="kpi-value">{totalAmount.toFixed(2)}</div>
              <div className="kpi-sub">
                Total reward for reviewed challenges.
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Average rating</div>
              <div className="kpi-value">
                {avgGrade != null ? avgGrade : "—"}
              </div>
              <div className="kpi-sub">
                For challenges where a teacher gave a grade.
              </div>
            </div>
          </div>

          {/* Latest reviewed challenges */}
          <div className="challenges-section">
            <h3 style={{ marginTop: 18, marginBottom: 6 }}>
              Latest reviewed challenges
            </h3>

            {reviewedCount === 0 && (
              <div className="ch-empty">
                     .    
                ,   .
              </div>
            )}

            {reviewedCount > 0 && (
              <div className="ch-horizontal-list">
                {lastReviewed.map((item) => (
                  <div
                    key={item.attempt_id}
                    className="ch-card ch-card-clickable"
                  >
                    <div className="ch-card-header">
                      <div>
                        <h3>{item.title}</h3>
                        <p className="ch-desc">
                          {item.challenge_type} ·{" "}
                          <span className={getStatusClass(item.attempt_status)}>
                            <span className="status-dot" />
                            {item.attempt_status}
                          </span>
                        </p>
                      </div>
                      {item.grade != null && (
                        <span className="ch-type">Grade: {item.grade}</span>
                      )}
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

                    {item.feedback && (
                      <p
                        className="ch-desc"
                        style={{
                          marginTop: 6,
                          fontSize: 12,
                          opacity: 0.9,
                        }}
                      >
                        Feedback: {item.feedback}
                      </p>
                    )}

                    <div style={{ marginTop: 8 }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => openChallengeDetails(item.challenge_id)}
                      >
                        Open challenge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
