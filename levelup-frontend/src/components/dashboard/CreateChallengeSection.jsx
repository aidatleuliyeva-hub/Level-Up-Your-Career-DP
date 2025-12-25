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
          <h1>Создать челлендж</h1>
          <p>
            Описание задания для студентов: теоретический модуль, проектная
            работа или реальный кейс от компании.
          </p>
        </div>
      </div>

      {!canCreate && (
        <div className="alert alert-error">
          Ваша роль не может создавать челленджи.  
          Доступно для <strong>teacher / company / admin</strong>.
        </div>
      )}

      {canCreate && (
        <div className="form-layout">
          {/* Основная форма */}
          <div className="ch-card form-panel">
            <div className="form-panel-header">
              <h2>Параметры челленджа</h2>
              <p>
                Сформулируйте короткий, понятный вызов для студента: что он
                должен сделать и какой результат ожидается.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleCreateChallenge}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Заголовок челленджа</label>
                  <input
                    type="text"
                    value={chTitle}
                    onChange={(e) => setChTitle(e.target.value)}
                    placeholder="Например: Backend-челлендж: REST API на Go"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Тип челленджа</label>
                  <select
                    value={chType}
                    onChange={(e) => setChType(e.target.value)}
                  >
                    <option value="academic">academic (учебный)</option>
                    <option value="company">company (от компании)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Описание задания</label>
                <textarea
                  value={chDescription}
                  onChange={(e) => setChDescription(e.target.value)}
                  rows={5}
                  placeholder="Кратко: контекст, что нужно сделать, критерии успешности. Без огромных простыней текста."
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
                  <label>Сложность</label>
                  <input
                    type="text"
                    value={chDifficulty}
                    onChange={(e) => setChDifficulty(e.target.value)}
                    placeholder="например: easy / medium / hard"
                  />
                </div>

                <div className="form-group">
                  <label>Кредиты (опционально)</label>
                  <input
                    type="number"
                    min="0"
                    value={chRewardCredits}
                    onChange={(e) => setChRewardCredits(e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Вознаграждение, € (опционально)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={chRewardAmount}
                    onChange={(e) => setChRewardAmount(e.target.value)}
                    placeholder="например: 150"
                  />
                </div>
              </div>

              {createError && (
                <div className="alert alert-error">Ошибка: {createError}</div>
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
                  {createLoading ? "Создаём..." : "Создать челлендж"}
                </button>
              </div>
            </form>
          </div>

          {/* Правая колонка — подсказки */}
          <aside className="ch-card form-aside">
            <div className="form-aside-title">Как сделать челлендж сильным</div>
            <ul className="form-aside-list">
              <li>1–2 абзаца контекста, без лишней воды.</li>
              <li>Чёткий ожидаемый результат: код, презентация, отчёт.</li>
              <li>Понятные критерии оценки: что считается «хорошо».</li>
              <li>Реалистичный объём работы на 1–2 недели.</li>
            </ul>

            <div className="form-aside-note">
              Такие челленджи потом можно показывать компаниям как
              портфолио-работы студентов.
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
