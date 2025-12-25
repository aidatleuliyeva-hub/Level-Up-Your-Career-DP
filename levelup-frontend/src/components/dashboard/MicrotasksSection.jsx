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
  // сеттеры для сброса сообщений
  setApplyError,
  setApplySuccess,
  setResultError,
  setResultSuccess,
}) {
  // ---- локальное состояние для модалки управления откликом (teacher/company/admin) ----
  const [selectedAppForManage, setSelectedAppForManage] = useState(null);

  // Найти микрозадачу для которой открыт отклик (по ID)
  const microtaskForApplyModal = useMemo(
    () => microtasks.find((mt) => mt.id === applyMicrotaskId) || null,
    [microtasks, applyMicrotaskId]
  );

  // Найти микрозадачу/заявку для модалки "Сдать результат"
  const applicationForResultModal = useMemo(
    () =>
      myMicrotasks.find((item) => item.application_id === resultForAppId) ||
      null,
    [myMicrotasks, resultForAppId]
  );

  // Закрыть модалку "Откликнуться"
  const closeApplyModal = () => {
    setApplyMicrotaskId(null);
    setApplicationText("");
    if (setApplyError) setApplyError(null);
    if (setApplySuccess) setApplySuccess(null);
  };

  // Закрыть модалку "Сдать результат"
  const closeResultModal = () => {
    setResultForAppId(null);
    setResultText("");
    setResultLink("");
    if (setResultError) setResultError(null);
    if (setResultSuccess) setResultSuccess(null);
  };

  // Закрыть модалку управления откликом (teacher/company/admin)
  const closeManageAppModal = () => {
    setSelectedAppForManage(null);
  };

  const isTeacherSide = userRole !== "student";

  return (
    <section className="content-section">
      <div className="content-header">
        <div>
          <h1>Микрозадачи</h1>
          <p>
            Небольшие задания от компаний и преподавателей. Берёшь — делаешь —
            получаешь опыт и вознаграждение.
          </p>
        </div>
        <div className="content-header-meta">
          {mtLoading && <span className="ch-badge">Загружаем...</span>}
          {!mtLoading && microtasks.length > 0 && (
            <span className="ch-badge">
              {microtasks.length} микрозадач(и)
            </span>
          )}
        </div>
      </div>

      {mtError && <div className="alert alert-error">Ошибка: {mtError}</div>}

      {!mtLoading && microtasks.length === 0 && !mtError && (
        <div className="ch-empty">
          Пока нет активных микрозадач. Позже здесь будут задачи от компаний.
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
                  <span className="ch-pill">Сложность: {mt.difficulty}</span>
                )}
                {mt.reward_credits != null && (
                  <span className="ch-pill">
                    Кредиты: {mt.reward_credits}
                  </span>
                )}
                {mt.reward_amount != null && (
                  <span className="ch-pill">
                    Вознаграждение: {mt.reward_amount} €
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
                      Вы уже откликнулись на эту микрозадачу. Статус:{" "}
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
                        Откликнуться
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
                    Отклики студентов
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- Мои микрозадачи (как студент) --- */}
      {isStudent && (
        <div className="challenges-section">
          <h3 style={{ marginTop: 18, marginBottom: 6 }}>Мои микрозадачи</h3>

          {myMtLoading && (
            <div className="ch-empty">Загружаем ваши отклики...</div>
          )}

          {myMtError && (
            <div className="alert alert-error">Ошибка: {myMtError}</div>
          )}

          {!myMtLoading && !myMtError && myMicrotasks.length === 0 && (
            <div className="ch-empty">
              Вы ещё не откликались на микрозадачи.
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
                        Статус отклика: {item.application_status}
                      </p>
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

                  {item.application_text && (
                    <p
                      className="ch-desc"
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        opacity: 0.9,
                      }}
                    >
                      Ваш отклик: {item.application_text}
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
                      <strong>Ваш результат:</strong>{" "}
                      {item.result_text && <span>{item.result_text} </span>}
                      {item.result_link && (
                        <a
                          href={item.result_link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#bfdbfe" }}
                        >
                          открыть ссылку
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
                          Сдать результат
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

      {/* --- Панель откликов для teacher/company/admin --- */}
      {isTeacherSide && selectedMicrotaskForApps && (
        <div
          style={{
            marginTop: 20,
            paddingTop: 12,
            borderTop: "1px solid rgba(148,163,184,0.35)",
          }}
        >
          <h3>Отклики на микрозадачу: {selectedMicrotaskForApps.title}</h3>

          {mtAppsLoading && (
            <div className="ch-empty">Загружаем отклики...</div>
          )}

          {mtAppsError && (
            <div className="alert alert-error">Ошибка: {mtAppsError}</div>
          )}

          {mtStatusError && (
            <div className="alert alert-error">
              Ошибка статуса: {mtStatusError}
            </div>
          )}

          {!mtAppsLoading && !mtAppsError && mtApps.length === 0 && (
            <div className="ch-empty">
              Пока нет откликов на эту микрозадачу.
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
                        {app.student_email} · статус: {app.status}
                      </p>
                    </div>
                  </div>

                  {app.application_text && (
                    <p
                      className="ch-desc"
                      style={{ marginTop: 6, fontSize: 13 }}
                    >
                      Отклик: {app.application_text}
                    </p>
                  )}

                  {(app.result_text || app.result_link) && (
                    <p
                      className="ch-desc"
                      style={{ marginTop: 6, fontSize: 12, opacity: 0.9 }}
                    >
                      <strong>Результат студента:</strong>{" "}
                      {app.result_text && <span>{app.result_text} </span>}
                      {app.result_link && (
                        <a
                          href={app.result_link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#bfdbfe" }}
                        >
                          открыть ссылку
                        </a>
                      )}
                    </p>
                  )}

                  <div style={{ marginTop: 8 }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => setSelectedAppForManage(app)}
                    >
                      Управлять откликом
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === МОДАЛКА: отклик на микрозадачу (student) === */}
      <Modal
        open={!!applyMicrotaskId}
        onClose={closeApplyModal}
        title={
          microtaskForApplyModal
            ? `Отклик на: ${microtaskForApplyModal.title}`
            : "Отклик на микрозадачу"
        }
        width={520}
      >
        <form className="auth-form" onSubmit={handleApplySubmit}>
          <div className="form-group">
            <label>Коротко о том, почему вы подходите</label>
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
            <div className="alert alert-error">Ошибка: {applyError}</div>
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
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={applyLoading}
            >
              {applyLoading ? "Отправляем..." : "Отправить отклик"}
            </button>
          </div>
        </form>
      </Modal>

      {/* === МОДАЛКА: сдача результата по микрозадаче (student) === */}
      <Modal
        open={!!resultForAppId}
        onClose={closeResultModal}
        title={
          applicationForResultModal
            ? `Результат по: ${applicationForResultModal.title}`
            : "Сдать результат"
        }
        width={520}
      >
        <form className="auth-form" onSubmit={handleSubmitMicrotaskResult}>
          <div className="form-group">
            <label>Что вы сделали (кратко)</label>
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
            <label>Ссылка на результат (GitHub / Figma / Drive)</label>
            <input
              type="text"
              value={resultLink}
              onChange={(e) => setResultLink(e.target.value)}
            />
          </div>

          {resultError && (
            <div className="alert alert-error">Ошибка: {resultError}</div>
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
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={resultLoading}
            >
              {resultLoading ? "Отправляем..." : "Отправить результат"}
            </button>
          </div>
        </form>
      </Modal>

      {/* === МОДАЛКА: управление откликом (teacher/company/admin) === */}
      <Modal
        open={!!selectedAppForManage}
        onClose={closeManageAppModal}
        title={
          selectedAppForManage
            ? `Отклик: ${selectedAppForManage.student_full_name}`
            : "Отклик студента"
        }
        width={540}
      >
        {selectedAppForManage && (
          <>
            <p className="ch-desc" style={{ marginBottom: 10 }}>
              {selectedAppForManage.student_email} · статус:{" "}
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
                  Отклик
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
                  Результат студента
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
                      открыть ссылку
                    </a>
                  )}
                </p>
              </div>
            )}

            {mtStatusError && (
              <div className="alert alert-error" style={{ marginBottom: 10 }}>
                Ошибка статуса: {mtStatusError}
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
                  ? "Сохраняем..."
                  : "Принять"}
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
                Отклонить
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
                Отметить выполненной
              </button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
