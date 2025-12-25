import React from "react";

function renderAttemptStatusPill(status) {
  if (!status) return null;
  const base = "status-pill";

  switch (status) {
    case "started":
      return (
        <span className={`${base} status-pill-applied`}>
          В процессе
        </span>
      );
    case "submitted":
      return (
        <span className={`${base} status-pill-pending`}>
          Ожидает проверки
        </span>
      );
    case "reviewed":
      return (
        <span className={`${base} status-pill-completed`}>
          Проверено
        </span>
      );
    default:
      return <span className={base}>{status}</span>;
  }
}

export default function MyChallengesSection({
  myChallenges,
  myLoading,
  myError,
  openChallengeDetails,
}) {
  return (
    <section className="content-section">
      <div className="content-header">
        <div>
          <h1>Мои челленджи</h1>
          <p>Челленджи, в которых вы участвуете как студент.</p>
        </div>
        <div className="content-header-meta">
          {myLoading && <span className="ch-badge">Загружаем...</span>}
          {!myLoading && myChallenges.length > 0 && (
            <span className="ch-badge">
              {myChallenges.length} челлендж(ей)
            </span>
          )}
        </div>
      </div>

      {myError && (
        <div className="alert alert-error">Ошибка: {myError}</div>
      )}

      {!myLoading && myChallenges.length === 0 && !myError && (
        <div className="ch-empty">
          Вы ещё не начали ни одного челленджа.
        </div>
      )}

      <div className="ch-list">
        {myChallenges.map((item) => (
          <div key={item.attempt_id} className="ch-card">
            <div className="ch-card-header">
              <div>
                <h3>{item.title}</h3>
                <p className="ch-desc">
                  {item.challenge_type}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                {renderAttemptStatusPill(item.attempt_status)}
                {item.grade != null && (
                  <span className="ch-type">Оценка: {item.grade}</span>
                )}
              </div>
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
    </section>
  );
}
