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
          <h1>Профиль студента</h1>
          <p>
            Ваш прогресс по челленджам: сколько уже сделано, какие результаты и
            сколько кредитов заработано.
          </p>
        </div>
      </div>

      {!isStudent && (
        <div className="alert alert-error">
          Профиль доступен только для роли <strong>student</strong>.
        </div>
      )}

      {isStudent && (
        <>
          {myLoading && (
            <div className="ch-empty" style={{ marginTop: 8 }}>
              Обновляем данные по вашим челленджам...
            </div>
          )}

          {myError && (
            <div className="alert alert-error">Ошибка: {myError}</div>
          )}

          {/* KPI-блоки */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">В процессе</div>
              <div className="kpi-value">{startedCount}</div>
              <div className="kpi-sub">
                Челленджи, которые вы начали как студент.
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Ожидают проверки</div>
              <div className="kpi-value">{submittedCount}</div>
              <div className="kpi-sub">
                Отправлены, но ещё не проверены преподавателем или компанией.
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Завершено</div>
              <div className="kpi-value">{reviewedCount}</div>
              <div className="kpi-sub">Проверенные и закрытые челленджи.</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Кредиты</div>
              <div className="kpi-value">{totalCredits}</div>
              <div className="kpi-sub">
                Набранные кредиты по завершённым челленджам.
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Заработано, €</div>
              <div className="kpi-value">{totalAmount.toFixed(2)}</div>
              <div className="kpi-sub">
                Суммарное вознаграждение по проверенным челленджам.
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Средняя оценка</div>
              <div className="kpi-value">
                {avgGrade != null ? avgGrade : "—"}
              </div>
              <div className="kpi-sub">
                По челленджам, где преподаватель выставил оценку.
              </div>
            </div>
          </div>

          {/* Последние проверенные челленджи */}
          <div className="challenges-section">
            <h3 style={{ marginTop: 18, marginBottom: 6 }}>
              Последние проверенные челленджи
            </h3>

            {reviewedCount === 0 && (
              <div className="ch-empty">
                У вас пока нет проверенных челленджей. Как только работа будет
                проверена, она появится здесь.
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
                        <span className="ch-type">Оценка: {item.grade}</span>
                      )}
                    </div>

                    <div className="ch-meta">
                      {item.difficulty && (
                        <span className="ch-pill">
                          Сложность: {item.difficulty}
                        </span>
                      )}
                      {item.reward_credits != null && (
                        <span className="ch-pill">
                          Кредиты: {item.reward_credits}
                        </span>
                      )}
                      {item.reward_amount != null && (
                        <span className="ch-pill">
                          Вознаграждение: {item.reward_amount} €
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
                        Фидбэк: {item.feedback}
                      </p>
                    )}

                    <div style={{ marginTop: 8 }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => openChallengeDetails(item.challenge_id)}
                      >
                        Открыть челлендж
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
