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
          <h1>Создать микрозадачу</h1>
          <p>
            Маленькое практическое задание: тестовое для стажёров, мини-исследование
            или кусочек реального проекта.
          </p>
        </div>
      </div>

      {!canCreate && (
        <div className="alert alert-error">
          Ваша роль не может создавать микрозадачи.  
          Доступно для <strong>teacher / company / admin</strong>.
        </div>
      )}

      {canCreate && (
        <div className="form-layout">
          {/* Основная форма */}
          <div className="ch-card form-panel">
            <div className="form-panel-header">
              <h2>Параметры микрозадачи</h2>
              <p>
                Микрозадача — это задание на 1–3 часа.  
                Цель — быстро проверить навыки и дать небольшой, но реальный опыт.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleCreateMicrotask}>
              <div className="form-group">
                <label>Заголовок</label>
                <input
                  type="text"
                  value={mtTitle}
                  onChange={(e) => setMtTitle(e.target.value)}
                  placeholder="Например: Написать SQL-запрос для отчёта"
                  required
                />
              </div>

              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={mtDescription}
                  onChange={(e) => setMtDescription(e.target.value)}
                  rows={4}
                  placeholder="Коротко опишите задачу, входные данные и что считать результатом."
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
                    value={mtDifficulty}
                    onChange={(e) => setMtDifficulty(e.target.value)}
                    placeholder="например: easy / medium / hard"
                  />
                </div>

                <div className="form-group">
                  <label>Кредиты (опционально)</label>
                  <input
                    type="number"
                    min="0"
                    value={mtRewardCredits}
                    onChange={(e) => setMtRewardCredits(e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Вознаграждение, € (опционально)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={mtRewardAmount}
                    onChange={(e) => setMtRewardAmount(e.target.value)}
                    placeholder="например: 20"
                  />
                </div>
              </div>

              {mtCreateError && (
                <div className="alert alert-error">
                  Ошибка: {mtCreateError}
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
                  {mtCreateLoading ? "Создаём..." : "Создать микрозадачу"}
                </button>
              </div>
            </form>
          </div>

          {/* Правая колонка — подсказки */}
          <aside className="ch-card form-aside">
            <div className="form-aside-title">Хорошая микрозадача</div>
            <ul className="form-aside-list">
              <li>Решается за 1–3 часа.</li>
              <li>Имеет чёткий, измеримый результат.</li>
              <li>Связана с реальными задачами команды.</li>
              <li>Подходит для стажёров / джунов.</li>
            </ul>

            <div className="form-aside-note">
              Микрозадачи помогают быстро заметить сильных студентов и собрать
              для них первые проекты в портфолио.
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
