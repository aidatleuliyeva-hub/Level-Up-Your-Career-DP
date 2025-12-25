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
  closeReview, // НОВОЕ: закрытие модалки ревью
}) {
  const isReviewer =
    userRole === "teacher" || userRole === "company" || userRole === "admin";

  return (
    <section className="content-section">
      <div className="content-header">
        <div>
          <h1>Челлендж</h1>
        </div>
      </div>

      <button className="btn btn-ghost" onClick={goBackToOverview}>
        ← Назад к списку
      </button>

      {detailsLoading && (
        <div className="ch-empty" style={{ marginTop: 10 }}>
          Загружаем детали челленджа...
        </div>
      )}

      {detailsError && (
        <div className="alert alert-error" style={{ marginTop: 10 }}>
          Ошибка: {detailsError}
        </div>
      )}

      {!detailsLoading && selectedChallenge && (
        <div style={{ marginTop: 14 }}>
          <h2>{selectedChallenge.title}</h2>
          <p className="ch-desc">{selectedChallenge.description}</p>

          <div className="ch-meta" style={{ marginTop: 8 }}>
            {selectedChallenge.challenge_type && (
              <span className="ch-pill">
                Тип: {selectedChallenge.challenge_type}
              </span>
            )}
            {selectedChallenge.difficulty && (
              <span className="ch-pill">
                Сложность: {selectedChallenge.difficulty}
              </span>
            )}
            {selectedChallenge.reward_credits != null && (
              <span className="ch-pill">
                Кредиты: {selectedChallenge.reward_credits}
              </span>
            )}
            {selectedChallenge.reward_amount != null && (
              <span className="ch-pill">
                Вознаграждение: {selectedChallenge.reward_amount} €
              </span>
            )}
          </div>

          {isStudent && (
            <div style={{ marginTop: 14 }}>
              {startError && (
                <div className="alert alert-error">Ошибка: {startError}</div>
              )}

              {!hasAttempt && (
                <button
                  className="btn btn-primary"
                  onClick={handleStartChallenge}
                  style={{ marginBottom: 10 }}
                >
                  Начать участие
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
                    Вы участвуете в этом челлендже. Ниже можно отправить своё
                    решение.
                  </div>

                  <form className="auth-form" onSubmit={handleSubmitSolution}>
                    <div className="form-group">
                      <label>Текстовое решение (опционально)</label>
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
                      <label>Ссылка на репозиторий / файл (опционально)</label>
                      <input
                        type="text"
                        value={submissionLink}
                        onChange={(e) => setSubmissionLink(e.target.value)}
                      />
                    </div>

                    {submitError && (
                      <div className="alert alert-error">
                        Ошибка: {submitError}
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
                      {submitLoading ? "Отправляем..." : "Отправить решение"}
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
                  Вы уже отправили решение. Статус:{" "}
                  <strong>submitted</strong>. Ожидайте проверки преподавателем
                  или компанией.
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
                    ✅ Работа проверена!
                  </div>
                  {currentStudentAttempt?.grade != null && (
                    <div>
                      Оценка:{" "}
                      <strong>{currentStudentAttempt.grade}</strong>
                    </div>
                  )}
                  {currentStudentAttempt?.feedback && (
                    <div style={{ marginTop: 4 }}>
                      Комментарий: {currentStudentAttempt.feedback}
                    </div>
                  )}
                  {!currentStudentAttempt?.feedback &&
                    currentStudentAttempt?.grade == null && (
                      <div>
                        Преподаватель ещё не оставил подробный комментарий.
                      </div>
                    )}
                </div>
              )}
            </div>
          )}

          {isReviewer && (
            <div style={{ marginTop: 24 }}>
              <h3>Сабмиты студентов</h3>

              {subsLoading && (
                <div className="ch-empty" style={{ marginTop: 8 }}>
                  Загружаем сабмиты...
                </div>
              )}

              {subsError && (
                <div className="alert alert-error" style={{ marginTop: 8 }}>
                  Ошибка: {subsError}
                </div>
              )}

              {!subsLoading && !subsError && submissions.length === 0 && (
                <div className="ch-empty" style={{ marginTop: 8 }}>
                  Пока нет отправленных решений по этому челленджу.
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
                            {s.student_email} · статус: {s.status}
                          </p>
                        </div>
                        {s.grade != null && (
                          <span className="ch-type">
                            Оценка: {s.grade}
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
                              Открыть ссылку
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
                          Оценить / отредактировать отзыв
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

      {/* Модалка ревью сабмита */}
      <Modal
        open={!!reviewAttemptId}
        onClose={closeReview}
        title="Ревью сабмита студента"
        width={520}
      >
        {reviewError && (
          <div className="alert alert-error" style={{ marginBottom: 10 }}>
            Ошибка: {reviewError}
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
            <label>Оценка (0–100, опционально)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={reviewGrade}
              onChange={(e) => setReviewGrade(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Фидбэк студенту</label>
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
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={reviewLoading}
            >
              {reviewLoading ? "Сохраняем..." : "Сохранить отзыв"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
