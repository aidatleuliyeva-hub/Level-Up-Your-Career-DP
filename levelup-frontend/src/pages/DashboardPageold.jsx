// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getChallenges,
  createChallenge,
  getChallenge,
  startChallenge,
  getMyChallenges,
  submitChallenge,
  getChallengeSubmissions,
  reviewSubmission,
  getMicrotasks,
  applyMicrotask,
  getMyMicrotasks,
  getMicrotaskApplications,
  updateMicrotaskApplicationStatus,
  createMicrotask,
  submitMicrotaskResult,
} from "../api/auth";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [challenges, setChallenges] = useState([]);
  const [chError, setChError] = useState(null);
  const [chLoading, setChLoading] = useState(false);

  // overview | create-challenge | challenge-details
  const [activeView, setActiveView] = useState("overview");

  // "Мои челленджи" (для студента)
  const [myChallenges, setMyChallenges] = useState([]);
  const [myLoading, setMyLoading] = useState(false);
  const [myError, setMyError] = useState(null);

  // детальный челлендж
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  // const [startStatus, setStartStatus] = useState(null);
  const [startError, setStartError] = useState(null);

  // отправка решения
  const [submissionText, setSubmissionText] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

    // сабмиты студентов (для teacher/company/admin)
  const [submissions, setSubmissions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState(null);

  // ревью конкретного сабмита
  const [reviewAttemptId, setReviewAttemptId] = useState(null);
  const [reviewGrade, setReviewGrade] = useState("");
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  // форма создания челленджа
  const [chTitle, setChTitle] = useState("");
  const [chDescription, setChDescription] = useState("");
  const [chType, setChType] = useState("academic");
  const [chDifficulty, setChDifficulty] = useState("");
  const [chRewardCredits, setChRewardCredits] = useState("");
  const [chRewardAmount, setChRewardAmount] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

    // форма создания микрозадачи
  const [mtTitle, setMtTitle] = useState("");
  const [mtDescription, setMtDescription] = useState("");
  const [mtDifficulty, setMtDifficulty] = useState("");
  const [mtRewardCredits, setMtRewardCredits] = useState("");
  const [mtRewardAmount, setMtRewardAmount] = useState("");
  const [mtCreateLoading, setMtCreateLoading] = useState(false);
  const [mtCreateError, setMtCreateError] = useState(null);
  const [mtCreateSuccess, setMtCreateSuccess] = useState(null);

    // микрозадачи (marketplace)
  const [microtasks, setMicrotasks] = useState([]);
  const [mtLoading, setMtLoading] = useState(false);
  const [mtError, setMtError] = useState(null);

  // мои микрозадачи (для студента)
  const [myMicrotasks, setMyMicrotasks] = useState([]);
  const [myMtLoading, setMyMtLoading] = useState(false);
  const [myMtError, setMyMtError] = useState(null);

  // отклик на микрозадачу
  const [applyMicrotaskId, setApplyMicrotaskId] = useState(null);
  const [applicationText, setApplicationText] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [applySuccess, setApplySuccess] = useState(null);
  const [resultText, setResultText] = useState("");
  const [resultLink, setResultLink] = useState("");
  const [resultForAppId, setResultForAppId] = useState(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [resultError, setResultError] = useState(null);
  const [resultSuccess, setResultSuccess] = useState(null);


  // панель откликов для teacher/company/admin
  const [selectedMicrotaskForApps, setSelectedMicrotaskForApps] =
    useState(null);
  const [mtApps, setMtApps] = useState([]);
  const [mtAppsLoading, setMtAppsLoading] = useState(false);
  const [mtAppsError, setMtAppsError] = useState(null);
  const [mtStatusLoadingId, setMtStatusLoadingId] = useState(null);
  const [mtStatusError, setMtStatusError] = useState(null);

  // читаем юзера и токен
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const savedToken = localStorage.getItem("token");

    if (!savedUser || !savedToken) {
      navigate("/");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    } catch {
      navigate("/");
    }
  }, [navigate]);

  // подгружаем список челленджей
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setChLoading(true);
      setChError(null);
      try {
        const data = await getChallenges(token);
        setChallenges(data);
      } catch (err) {
        setChError(err.message);
      } finally {
        setChLoading(false);
      }
    };

    load();
  }, [token]);

  // подгружаем список микрозадач (marketplace)
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setMtLoading(true);
      setMtError(null);
      try {
        const data = await getMicrotasks(token);
        setMicrotasks(data);
      } catch (err) {
        setMtError(err.message);
      } finally {
        setMtLoading(false);
      }
    };

    load();
  }, [token]);

  // подгружаем детали челленджа
  useEffect(() => {
    if (activeView !== "challenge-details") return;
    if (!token || !selectedChallengeId) return;

    const loadDetails = async () => {
      setDetailsLoading(true);
      setDetailsError(null);
      setSelectedChallenge(null);
      try {
        const data = await getChallenge(token, selectedChallengeId);
        setSelectedChallenge(data);
      } catch (err) {
        setDetailsError(err.message);
      } finally {
        setDetailsLoading(false);
      }
    };

    loadDetails();
  }, [activeView, token, selectedChallengeId]);

    // подгружаем сабмиты студентов (только для teacher/company/admin)
  useEffect(() => {
    if (activeView !== "challenge-details") return;
    if (!token || !selectedChallengeId || !user) return;

    const isReviewer =
      user.role === "teacher" ||
      user.role === "company" ||
      user.role === "admin";

    if (!isReviewer) return;

    const loadSubs = async () => {
      setSubsLoading(true);
      setSubsError(null);
      try {
        const data = await getChallengeSubmissions(token, selectedChallengeId);
        setSubmissions(data);
      } catch (err) {
        setSubsError(err.message);
      } finally {
        setSubsLoading(false);
      }
    };

    loadSubs();
  }, [activeView, token, selectedChallengeId, user]);

  // подгружаем "Мои челленджи" (только когда открыт соответствующий экран и пользователь - студент)
  // useEffect(() => {
  //   if (activeView !== "my-challenges") return;
  //   if (!token || !user) return;
  //   if (user.role !== "student") return;

  //   const loadMy = async () => {
  //     setMyLoading(true);
  //     setMyError(null);
  //     try {
  //       const data = await getMyChallenges(token);
  //       setMyChallenges(data);
  //     } catch (err) {
  //       setMyError(err.message);
  //     } finally {
  //       setMyLoading(false);
  //     }
  //   };

  //   loadMy();
  // }, [activeView, token, user]);
  // подгружаем "Мои челленджи" для студента (чтобы знать, какие уже взяты)
useEffect(() => {
  if (!token || !user) return;
  if (user.role !== "student") return;

  const loadMy = async () => {
    setMyLoading(true);
    setMyError(null);
    try {
      const data = await getMyChallenges(token);
      setMyChallenges(data);
    } catch (err) {
      setMyError(err.message);
    } finally {
      setMyLoading(false);
    }
  };

  loadMy();
}, [token, user]);

  // подгружаем "Мои микрозадачи" (для студента)
  useEffect(() => {
    if (!token || !user) return;
    if (user.role !== "student") return;

    const loadMyMicro = async () => {
      setMyMtLoading(true);
      setMyMtError(null);
      try {
        const data = await getMyMicrotasks(token);
        setMyMicrotasks(data);
      } catch (err) {
        setMyMtError(err.message);
      } finally {
        setMyMtLoading(false);
      }
    };

    loadMyMicro();
  }, [token, user]);

  if (!user) {
    return null;
  }

  const canCreate =
    user.role === "teacher" || user.role === "company" || user.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    if (!token) return;

    setCreateError(null);
    setCreateSuccess(null);
    setCreateLoading(true);

    try {
      const payload = {
        title: chTitle,
        description: chDescription,
        challenge_type: chType,
        difficulty: chDifficulty,
      };

      if (chRewardCredits.trim() !== "") {
        const parsed = parseInt(chRewardCredits, 10);
        if (!Number.isNaN(parsed)) {
          payload.reward_credits = parsed;
        }
      }

      if (chRewardAmount.trim() !== "") {
        const parsed = parseFloat(chRewardAmount);
        if (!Number.isNaN(parsed)) {
          payload.reward_amount = parsed;
        }
      }

      const created = await createChallenge(token, payload);
      setCreateSuccess(`Челлендж создан (ID: ${created.id})`);

      setChTitle("");
      setChDescription("");
      setChDifficulty("");
      setChRewardCredits("");
      setChRewardAmount("");

      // перезагрузим список
      try {
        const data = await getChallenges(token);
        setChallenges(data);
      } catch {
        // тихо
      }
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

    const handleCreateMicrotask = async (e) => {
    e.preventDefault();
    if (!token) return;

    setMtCreateError(null);
    setMtCreateSuccess(null);
    setMtCreateLoading(true);

    try {
      const payload = {
        title: mtTitle,
        description: mtDescription,
        difficulty: mtDifficulty,
      };

      if (mtRewardCredits.trim() !== "") {
        const parsed = parseInt(mtRewardCredits, 10);
        if (!Number.isNaN(parsed)) {
          payload.reward_credits = parsed;
        }
      }

      if (mtRewardAmount.trim() !== "") {
        const parsed = parseFloat(mtRewardAmount);
        if (!Number.isNaN(parsed)) {
          payload.reward_amount = parsed;
        }
      }

      const created = await createMicrotask(token, payload);
      setMtCreateSuccess(`Микрозадача создана (ID: ${created.id})`);

      // очистим форму
      setMtTitle("");
      setMtDescription("");
      setMtDifficulty("");
      setMtRewardCredits("");
      setMtRewardAmount("");

      // обновим список микрозадач
      try {
        const data = await getMicrotasks(token);
        setMicrotasks(data);
      } catch (_) {
        // молча
      }
    } catch (err) {
      setMtCreateError(err.message);
    } finally {
      setMtCreateLoading(false);
    }
  };


  const openChallengeDetails = (id) => {
    setSelectedChallengeId(id);
    setSelectedChallenge(null);
    setDetailsError(null);
    // setStartStatus(null);
    setStartError(null);
    setActiveView("challenge-details");
  };

  // const handleStartChallenge = async () => {
  //   if (!token || !selectedChallengeId) return;

  //   setStartError(null);
  //   try {
  //     await startChallenge(token, selectedChallengeId);
  //     setStartStatus("started");
  //   } catch (err) {
  //     setStartError(err.message);
  //   }
  // };
  const handleStartChallenge = async () => {
    if (!token || !selectedChallengeId) return;

    setStartError(null);
    try {
      await startChallenge(token, selectedChallengeId);
      // после старта сразу обновляем "мои челленджи"
      if (isStudent) {
        try {
          const data = await getMyChallenges(token);
          setMyChallenges(data);
        } catch {
          // тихо
        }
      }
    } catch (err) {
      setStartError(err.message);
    }
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!token || !selectedChallengeId) return;

    setSubmitError(null);
    setSubmitSuccess(null);
    setSubmitLoading(true);

    try {
      const payload = {
        submission_text: submissionText,
        submission_link: submissionLink,
      };

      await submitChallenge(token, selectedChallengeId, payload);

      setSubmitSuccess("Решение отправлено. Статус: submitted.");

      if (isStudent) {
        try {
          const data = await getMyChallenges(token);
          setMyChallenges(data);
        } catch {
          // можно молча
        }
      }

      // если потом зайдёшь в "Мои челленджи", там статус уже будет submitted
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

    const startReview = (attempt) => {
    setReviewAttemptId(attempt.attempt_id);
    setReviewGrade(attempt.grade != null ? String(attempt.grade) : "");
    setReviewFeedback(attempt.feedback || "");
    setReviewError(null);
    setReviewSuccess(null);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token || !reviewAttemptId) return;

    setReviewError(null);
    setReviewSuccess(null);
    setReviewLoading(true);

    try {
      let gradeValue = null;
      if (reviewGrade.trim() !== "") {
        const parsed = parseInt(reviewGrade, 10);
        if (Number.isNaN(parsed)) {
          throw new Error("Оценка должна быть числом");
        }
        gradeValue = parsed;
      }

      await reviewSubmission(token, reviewAttemptId, {
        grade: gradeValue,
        feedback: reviewFeedback,
      });

      setReviewSuccess("Отзыв сохранён, статус: reviewed");

      // локально обновим список сабмитов
      setSubmissions((prev) =>
        prev.map((s) =>
          s.attempt_id === reviewAttemptId
            ? {
                ...s,
                grade: gradeValue,
                feedback: reviewFeedback,
                status: "reviewed",
              }
            : s
        )
      );
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const goBackToOverview = () => {
    setActiveView("overview");
    setSelectedChallengeId(null);
    setSelectedChallenge(null);
    setDetailsError(null);
    // setStartStatus(null);
    setStartError(null);
    setSubmitError(null);
    setSubmitSuccess(null);
    setSubmissions([]);
    setSubsError(null);
    setReviewAttemptId(null);
    setReviewError(null);
    setReviewSuccess(null);
  };

      const handleApplySubmit = async (e) => {
        e.preventDefault();
        if (!token || !applyMicrotaskId) return;

        setApplyError(null);
        setApplySuccess(null);
        setApplyLoading(true);

        try {
          await applyMicrotask(token, applyMicrotaskId, {
            application_text: applicationText,
          });

          setApplySuccess("Отклик отправлен.");
          setApplyMicrotaskId(null);
          setApplicationText("");

          // обновим "мои микрозадачи"
          if (isStudent) {
            try {
              const data = await getMyMicrotasks(token);
              setMyMicrotasks(data);
            } catch {
              // молча
            }
          }
        } catch (err) {
          setApplyError(err.message);
        } finally {
          setApplyLoading(false);
        }
      };

    const loadApplicationsForMicrotask = async (microtaskId) => {
    if (!token) return;

    setMtAppsLoading(true);
    setMtAppsError(null);
    setMtStatusError(null);

    try {
      const data = await getMicrotaskApplications(token, microtaskId);
      setMtApps(data);
    } catch (err) {
      setMtAppsError(err.message);
    } finally {
      setMtAppsLoading(false);
    }
  };

    const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    if (!token) return;

    setMtStatusError(null);
    setMtStatusLoadingId(applicationId);

    try {
      await updateMicrotaskApplicationStatus(token, applicationId, newStatus);

      // локально обновим список откликов
      setMtApps((prev) =>
        prev.map((a) =>
          a.application_id === applicationId ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      setMtStatusError(err.message);
    } finally {
      setMtStatusLoadingId(null);
    }
  };

  const handleSubmitMicrotaskResult = async (e) => {
    e.preventDefault();
    if (!token || !resultForAppId) return;

    setResultError(null);
    setResultSuccess(null);
    setResultLoading(true);

    try {
      await submitMicrotaskResult(token, resultForAppId, {
        result_text: resultText,
        result_link: resultLink,
      });

      setResultSuccess("Результат отправлен.");
      setResultForAppId(null);
      setResultText("");
      setResultLink("");

      if (isStudent) {
        try {
          const data = await getMyMicrotasks(token);
          setMyMicrotasks(data);
        } catch (_) {}
      }
    } catch (err) {
      setResultError(err.message);
    } finally {
      setResultLoading(false);
    }
  };


  const isStudent = user.role === "student";

  const challengesForOverview = isStudent
    ? challenges.filter(
        (ch) => !myChallenges.some((mine) => mine.challenge_id === ch.id)
      )
    : challenges;

  const currentStudentAttempt =
    isStudent && selectedChallengeId
      ? myChallenges.find((m) => m.challenge_id === selectedChallengeId)
      : null;

  const hasAttempt = !!currentStudentAttempt;
  const myAttemptStatus = currentStudentAttempt?.attempt_status || null;

    // --- агрегаты для профиля студента ---
  const startedCount = isStudent
    ? myChallenges.filter((m) => m.attempt_status === "started").length
    : 0;

  const submittedCount = isStudent
    ? myChallenges.filter((m) => m.attempt_status === "submitted").length
    : 0;

  const reviewedChallenges = isStudent
    ? myChallenges.filter((m) => m.attempt_status === "reviewed")
    : [];

  const reviewedCount = reviewedChallenges.length;

  const totalCredits = reviewedChallenges.reduce((sum, m) => {
    return sum + (m.reward_credits || 0);
  }, 0);

  const totalAmount = reviewedChallenges.reduce((sum, m) => {
    return sum + (m.reward_amount || 0);
  }, 0);

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

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        {/* Верхняя панель */}
        <header className="dashboard-header">
          <div className="header-left">
            <div className="logo-mini">LU</div>
            <div className="header-title-block">
              <div className="dashboard-title">Level Up Your Career</div>
              <div className="dashboard-subtitle">
                Челленджи · микрозадачи · реальные кейсы
              </div>
            </div>
          </div>

          <div className="header-right">
            <div className="header-user-info">
              <div className="header-user-name">{user.full_name}</div>
              <div className="header-user-meta">
                <span>{user.email}</span>
                <span className="header-user-role">{user.role}</span>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </header>

        {/* Основная часть: сайдбар + контент */}
        <div className="dashboard-body">
          {/* Сайдбар */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-section sidebar-user-card">
              <div className="sidebar-user-avatar">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="sidebar-user-text">
                <div className="sidebar-user-name">{user.full_name}</div>
                <div className="sidebar-user-role">{user.role}</div>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-section-title">Навигация</div>
              {/* <nav className="sidebar-nav">
                <button
                  className={
                    "sidebar-link " +
                    (activeView === "overview" ? "sidebar-link-active" : "")
                  }
                  onClick={() => setActiveView("overview")}
                >
                  Обзор
                </button>

                <button
                  className={
                    "sidebar-link " +
                    (activeView === "create-challenge"
                      ? "sidebar-link-active"
                      : "")
                  }
                  onClick={() => canCreate && setActiveView("create-challenge")}
                  disabled={!canCreate}
                >
                  Создать челлендж
                </button>

                <button className="sidebar-link" disabled>
                  Микрозадачи
                </button>
                <button className="sidebar-link" disabled>
                  Рейтинг
                </button>
                <button className="sidebar-link" disabled>
                  Портфолио
                </button>
              </nav> */}
              <nav className="sidebar-nav">
                <button
                  className={
                    "sidebar-link " +
                    (activeView === "overview" ? "sidebar-link-active" : "")
                  }
                  onClick={() => setActiveView("overview")}
                >
                  Обзор
                </button>

                <button
                  className={
                    "sidebar-link " +
                    (activeView === "profile" ? "sidebar-link-active" : "")
                  }
                  onClick={() => setActiveView("profile")}
                  disabled={!isStudent}
                >
                  Профиль
                </button>

                <button
                  className={
                    "sidebar-link " +
                    (activeView === "my-challenges"
                      ? "sidebar-link-active"
                      : "")
                  }
                  onClick={() => setActiveView("my-challenges")}
                  disabled={user.role !== "student"}
                >
                  Мои челленджи
                </button>

                <button
                  className={
                    "sidebar-link " +
                    (activeView === "create-challenge"
                      ? "sidebar-link-active"
                      : "")
                  }
                  onClick={() => canCreate && setActiveView("create-challenge")}
                  disabled={!canCreate}
                >
                  Создать челлендж
                </button>

                <button
                  className={
                    "sidebar-link " +
                    (activeView === "create-microtask"
                      ? "sidebar-link-active"
                      : "")
                  }
                  onClick={() => canCreate && setActiveView("create-microtask")}
                  disabled={!canCreate}
                >
                  Создать микрозадачу
                </button>

                <button
                  className={
                    "sidebar-link " +
                    (activeView === "microtasks" ? "sidebar-link-active" : "")
                  }
                  onClick={() => setActiveView("microtasks")}
                >
                  Микрозадачи
                </button>
                <button className="sidebar-link" disabled>
                  Рейтинг
                </button>
                <button className="sidebar-link" disabled>
                  Портфолио
                </button>
              </nav>
            </div>

            <div className="sidebar-section sidebar-hint">
              <div className="sidebar-hint-title">Что дальше?</div>
              <p>
                Здесь появятся фильтры по типу челленджей, уровню сложности и
                возможностям монетизации.
              </p>
              {!canCreate && (
                <p style={{ marginTop: 6, fontSize: 11, color: "#6b7280" }}>
                  Создавать челленджи могут роли teacher / company / admin.
                </p>
              )}
            </div>
          </aside>

          {/* Контент */}
          <main className="dashboard-content">
            {activeView === "overview" && (
              <section className="content-section">
                <div className="content-header">
                  <div>
                    <h1>Опубликованные челленджи</h1>
                    <p>
                      Задания от университетов и компаний, доступные для
                      выполнения сейчас.
                    </p>
                  </div>
                  <div className="content-header-meta">
                    {chLoading && (
                      <span className="ch-badge">Загружаем...</span>
                    )}
                    {!chLoading && challengesForOverview.length > 0 && (
                      <span className="ch-badge">
                        {challengesForOverview.length} челлендж(ей)
                      </span>
                    )}
                  </div>
                </div>

                {chError && (
                  <div className="alert alert-error">Ошибка: {chError}</div>
                )}

                {!chLoading &&
                  challengesForOverview.length === 0 &&
                  !chError && (
                    <div className="ch-empty">
                      Пока нет опубликованных челленджей. Позже здесь будут
                      задачи от преподавателей и компаний.
                    </div>
                  )}

                {/* <div className="ch-list">
                  {challengesForOverview.map((ch) => (
                    <div key={ch.id} className="ch-card">
                      <div className="ch-card-header">
                        <div>
                          <h3>{ch.title}</h3>
                          <p className="ch-desc">{ch.description}</p>
                        </div>
                        <span className="ch-type">{ch.challenge_type}</span>
                      </div>
                      <div className="ch-meta">
                        {ch.difficulty && (
                          <span className="ch-pill">
                            Сложность: {ch.difficulty}
                          </span>
                        )}
                        {ch.reward_credits != null && (
                          <span className="ch-pill">
                            Кредиты: {ch.reward_credits}
                          </span>
                        )}
                        {ch.reward_amount != null && (
                          <span className="ch-pill">
                            Вознаграждение: {ch.reward_amount} €
                          </span>
                        )}
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => openChallengeDetails(ch.id)}
                        >
                          Подробнее
                        </button>
                      </div>
                    </div>
                  ))}
                </div> */}
                <div className="ch-list">
                  {challengesForOverview.map((ch) => (
                    <div key={ch.id} className="ch-card">
                      <div className="ch-card-header">
                        <div>
                          <h3>{ch.title}</h3>
                          <p className="ch-desc">{ch.description}</p>
                        </div>
                        <span className="ch-type">{ch.challenge_type}</span>
                      </div>
                      <div className="ch-meta">
                        {ch.difficulty && (
                          <span className="ch-pill">
                            Сложность: {ch.difficulty}
                          </span>
                        )}
                        {ch.reward_credits != null && (
                          <span className="ch-pill">
                            Кредиты: {ch.reward_credits}
                          </span>
                        )}
                        {ch.reward_amount != null && (
                          <span className="ch-pill">
                            Вознаграждение: {ch.reward_amount} €
                          </span>
                        )}
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => openChallengeDetails(ch.id)}
                        >
                          Подробнее
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeView === "profile" && (
              <section className="content-section">
                <div className="content-header">
                  <div>
                    <h1>Профиль студента</h1>
                    <p>
                      Ваш прогресс по челленджам: сколько уже сделано, какие
                      результаты и сколько кредитов заработано.
                    </p>
                  </div>
                </div>

                {!isStudent && (
                  <div className="alert alert-error">
                    Профиль доступен только для роли student.
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

                    {/* Карточки метрик */}
                    <div
                      className="ch-list"
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 10,
                        marginTop: 12,
                      }}
                    >
                      <div className="ch-card">
                        <h3 style={{ margin: 0, marginBottom: 4 }}>
                          В процессе
                        </h3>
                        <p className="ch-desc" style={{ marginBottom: 4 }}>
                          Челленджи, которые вы начали.
                        </p>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 600,
                            marginTop: 4,
                          }}
                        >
                          {startedCount}
                        </div>
                      </div>

                      <div className="ch-card">
                        <h3 style={{ margin: 0, marginBottom: 4 }}>
                          Ожидают проверки
                        </h3>
                        <p className="ch-desc" style={{ marginBottom: 4 }}>
                          Отправлены, но ещё не проверены.
                        </p>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 600,
                            marginTop: 4,
                          }}
                        >
                          {submittedCount}
                        </div>
                      </div>

                      <div className="ch-card">
                        <h3 style={{ margin: 0, marginBottom: 4 }}>
                          Завершено
                        </h3>
                        <p className="ch-desc" style={{ marginBottom: 4 }}>
                          Проверенные челленджи.
                        </p>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 600,
                            marginTop: 4,
                          }}
                        >
                          {reviewedCount}
                        </div>
                      </div>

                      <div className="ch-card">
                        <h3 style={{ margin: 0, marginBottom: 4 }}>
                          Кредиты (завершённые)
                        </h3>
                        <p className="ch-desc" style={{ marginBottom: 4 }}>
                          Сумма кредитов по проверенным челленджам.
                        </p>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 600,
                            marginTop: 4,
                          }}
                        >
                          {totalCredits}
                        </div>
                      </div>

                      <div className="ch-card">
                        <h3 style={{ margin: 0, marginBottom: 4 }}>
                          Заработано, €
                        </h3>
                        <p className="ch-desc" style={{ marginBottom: 4 }}>
                          Сумма вознаграждений по проверенным челленджам.
                        </p>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 600,
                            marginTop: 4,
                          }}
                        >
                          {totalAmount.toFixed(2)}
                        </div>
                      </div>

                      <div className="ch-card">
                        <h3 style={{ margin: 0, marginBottom: 4 }}>
                          Средняя оценка
                        </h3>
                        <p className="ch-desc" style={{ marginBottom: 4 }}>
                          По всем проверенным челленджам с выставленной оценкой.
                        </p>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 600,
                            marginTop: 4,
                          }}
                        >
                          {avgGrade != null ? avgGrade : "—"}
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
                          У вас пока нет проверенных челленджей. Как только
                          преподаватель проверит работу, она появится здесь.
                        </div>
                      )}

                      {reviewedCount > 0 && (
                        <div className="ch-list">
                          {lastReviewed.map((item) => (
                            <div key={item.attempt_id} className="ch-card">
                              <div className="ch-card-header">
                                <div>
                                  <h3>{item.title}</h3>
                                  <p className="ch-desc">
                                    {item.challenge_type} · статус:{" "}
                                    {item.attempt_status}
                                  </p>
                                </div>
                                {item.grade != null && (
                                  <span className="ch-type">
                                    Оценка: {item.grade}
                                  </span>
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
                                  onClick={() =>
                                    openChallengeDetails(item.challenge_id)
                                  }
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
            )}

            {activeView === "microtasks" && (
              <section className="content-section">
                <div className="content-header">
                  <div>
                    <h1>Микрозадачи</h1>
                    <p>
                      Небольшие задания от компаний и преподавателей. Берёшь —
                      делаешь — получаешь опыт и вознаграждение.
                    </p>
                  </div>
                  <div className="content-header-meta">
                    {mtLoading && (
                      <span className="ch-badge">Загружаем...</span>
                    )}
                    {!mtLoading && microtasks.length > 0 && (
                      <span className="ch-badge">
                        {microtasks.length} микрозадач(и)
                      </span>
                    )}
                  </div>
                </div>

                {mtError && (
                  <div className="alert alert-error">Ошибка: {mtError}</div>
                )}

                {!mtLoading && microtasks.length === 0 && !mtError && (
                  <div className="ch-empty">
                    Пока нет активных микрозадач. Позже здесь будут задачи от
                    компаний.
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
                            <span className="ch-pill">
                              Сложность: {mt.difficulty}
                            </span>
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

                        {/* Блок для студента: отклик и статус */}
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
                                    setApplyError(null);
                                    setApplySuccess(null);
                                  }}
                                >
                                  Откликнуться
                                </button>
                              </div>
                            )}

                            {/* Форма отклика только для выбранной микрозадачи */}
                            {!alreadyApplied && applyMicrotaskId === mt.id && (
                              <form
                                className="auth-form"
                                onSubmit={handleApplySubmit}
                                style={{ marginTop: 8 }}
                              >
                                <div className="form-group">
                                  <label>
                                    Коротко о том, почему вы подходите
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={applicationText}
                                    onChange={(e) =>
                                      setApplicationText(e.target.value)
                                    }
                                    style={{
                                      resize: "vertical",
                                      borderRadius: 9,
                                      border:
                                        "1px solid rgba(148,163,184,0.55)",
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
                                  <div className="alert alert-error">
                                    Ошибка: {applyError}
                                  </div>
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

                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                  disabled={applyLoading}
                                >
                                  {applyLoading
                                    ? "Отправляем..."
                                    : "Отправить отклик"}
                                </button>
                              </form>
                            )}
                          </>
                        )}

                        {/* Блок для teacher/company/admin: просмотр откликов */}
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

                {/* Нижний блок: "Мои микрозадачи" — только для студента */}
                {isStudent && (
                  <div className="challenges-section">
                    <h3 style={{ marginTop: 18, marginBottom: 6 }}>
                      Мои микрозадачи
                    </h3>

                    {myMtLoading && (
                      <div className="ch-empty">Загружаем ваши отклики...</div>
                    )}

                    {myMtError && (
                      <div className="alert alert-error">
                        Ошибка: {myMtError}
                      </div>
                    )}

                    {!myMtLoading &&
                      !myMtError &&
                      myMicrotasks.length === 0 && (
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
                            {item.application_status === "accepted" && (
                              <div style={{ marginTop: 8 }}>
                                {resultForAppId !== item.application_id && (
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                      setResultForAppId(item.application_id);
                                      setResultText("");
                                      setResultLink("");
                                      setResultError(null);
                                      setResultSuccess(null);
                                    }}
                                  >
                                    Сдать результат
                                  </button>
                                )}

                                {resultForAppId === item.application_id && (
                                  <form
                                    className="auth-form"
                                    onSubmit={handleSubmitMicrotaskResult}
                                    style={{ marginTop: 8 }}
                                  >
                                    <div className="form-group">
                                      <label>Что вы сделали (кратко)</label>
                                      <textarea
                                        rows={3}
                                        value={resultText}
                                        onChange={(e) =>
                                          setResultText(e.target.value)
                                        }
                                        style={{
                                          resize: "vertical",
                                          borderRadius: 9,
                                          border:
                                            "1px solid rgba(148,163,184,0.55)",
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
                                      <label>
                                        Ссылка на результат (GitHub / Figma /
                                        Drive)
                                      </label>
                                      <input
                                        type="text"
                                        value={resultLink}
                                        onChange={(e) =>
                                          setResultLink(e.target.value)
                                        }
                                      />
                                    </div>

                                    {resultError && (
                                      <div className="alert alert-error">
                                        Ошибка: {resultError}
                                      </div>
                                    )}

                                    {resultSuccess && (
                                      <div
                                        className="alert"
                                        style={{
                                          background: "rgba(34,197,94,0.12)",
                                          color: "#bbf7d0",
                                          border:
                                            "1px solid rgba(34,197,94,0.6)",
                                        }}
                                      >
                                        {resultSuccess}
                                      </div>
                                    )}

                                    <button
                                      type="submit"
                                      className="btn btn-primary"
                                      disabled={resultLoading}
                                    >
                                      {resultLoading
                                        ? "Отправляем..."
                                        : "Отправить результат"}
                                    </button>
                                  </form>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Панель откликов — только для teacher/company/admin */}
                {!isStudent && selectedMicrotaskForApps && (
                  <div
                    style={{
                      marginTop: 20,
                      paddingTop: 12,
                      borderTop: "1px solid rgba(148,163,184,0.35)",
                    }}
                  >
                    <h3>
                      Отклики на микрозадачу: {selectedMicrotaskForApps.title}
                    </h3>

                    {mtAppsLoading && (
                      <div className="ch-empty">Загружаем отклики...</div>
                    )}

                    {mtAppsError && (
                      <div className="alert alert-error">
                        Ошибка: {mtAppsError}
                      </div>
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
                                style={{
                                  marginTop: 6,
                                  fontSize: 13,
                                }}
                              >
                                Отклик: {app.application_text}
                              </p>
                            )}

                            <div
                              style={{
                                marginTop: 8,
                                display: "flex",
                                gap: 8,
                                flexWrap: "wrap",
                              }}
                            >
                              <button
                                className="btn btn-primary"
                                disabled={
                                  mtStatusLoadingId === app.application_id
                                }
                                onClick={() =>
                                  handleUpdateApplicationStatus(
                                    app.application_id,
                                    "accepted"
                                  )
                                }
                              >
                                {mtStatusLoadingId === app.application_id
                                  ? "Сохраняем..."
                                  : "Принять"}
                              </button>

                              <button
                                className="btn btn-ghost"
                                disabled={
                                  mtStatusLoadingId === app.application_id
                                }
                                onClick={() =>
                                  handleUpdateApplicationStatus(
                                    app.application_id,
                                    "rejected"
                                  )
                                }
                              >
                                Отклонить
                              </button>

                              <button
                                className="btn btn-ghost"
                                disabled={
                                  mtStatusLoadingId === app.application_id
                                }
                                onClick={() =>
                                  handleUpdateApplicationStatus(
                                    app.application_id,
                                    "completed"
                                  )
                                }
                              >
                                Отметить выполненной
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {activeView === "my-challenges" && (
              <section className="content-section">
                <div className="content-header">
                  <div>
                    <h1>Мои челленджи</h1>
                    <p>Челленджи, которые вы начали как студент.</p>
                  </div>
                  <div className="content-header-meta">
                    {myLoading && (
                      <span className="ch-badge">Загружаем...</span>
                    )}
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
                            {item.challenge_type} · статус:{" "}
                            {item.attempt_status}
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
                      <div style={{ marginTop: 8 }}>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            openChallengeDetails(item.challenge_id)
                          }
                        >
                          Открыть челлендж
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeView === "create-challenge" && (
              <section className="content-section">
                <div className="content-header">
                  <div>
                    <h1>Создать челлендж</h1>
                    <p>
                      Описание задания для студентов: теория, практика, задачи
                      от компаний.
                    </p>
                  </div>
                </div>

                {!canCreate && (
                  <div className="alert alert-error">
                    Ваша роль не может создавать челленджи.
                  </div>
                )}

                {canCreate && (
                  <form className="auth-form" onSubmit={handleCreateChallenge}>
                    <div className="form-group">
                      <label>Заголовок</label>
                      <input
                        type="text"
                        value={chTitle}
                        onChange={(e) => setChTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Описание</label>
                      <textarea
                        value={chDescription}
                        onChange={(e) => setChDescription(e.target.value)}
                        rows={4}
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
                      <label>Тип челленджа</label>
                      <select
                        value={chType}
                        onChange={(e) => setChType(e.target.value)}
                      >
                        <option value="academic">academic</option>
                        <option value="company">company</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Сложность (например: easy / medium / hard)</label>
                      <input
                        type="text"
                        value={chDifficulty}
                        onChange={(e) => setChDifficulty(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Кредиты (опционально)</label>
                      <input
                        type="number"
                        min="0"
                        value={chRewardCredits}
                        onChange={(e) => setChRewardCredits(e.target.value)}
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
                      />
                    </div>

                    {createError && (
                      <div className="alert alert-error">
                        Ошибка: {createError}
                      </div>
                    )}

                    {createSuccess && (
                      <div
                        className="alert"
                        style={{
                          background: "rgba(34,197,94,0.12)",
                          color: "#bbf7d0",
                          border: "1px solid rgba(34,197,94,0.6)",
                        }}
                      >
                        {createSuccess}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={createLoading}
                    >
                      {createLoading ? "Создаём..." : "Создать челлендж"}
                    </button>
                  </form>
                )}
              </section>
            )}

            {activeView === "create-microtask" && (
              <section className="content-section">
                <div className="content-header">
                  <div>
                    <h1>Создать микрозадачу</h1>
                    <p>
                      Небольшое практическое задание: тестовое для стажёров,
                      мелкая задача из реального проекта или короткий ресёрч.
                    </p>
                  </div>
                </div>

                {!canCreate && (
                  <div className="alert alert-error">
                    Ваша роль не может создавать микрозадачи.
                  </div>
                )}

                {canCreate && (
                  <form className="auth-form" onSubmit={handleCreateMicrotask}>
                    <div className="form-group">
                      <label>Заголовок</label>
                      <input
                        type="text"
                        value={mtTitle}
                        onChange={(e) => setMtTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Описание</label>
                      <textarea
                        value={mtDescription}
                        onChange={(e) => setMtDescription(e.target.value)}
                        rows={4}
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
                      <label>Сложность (например: easy / medium / hard)</label>
                      <input
                        type="text"
                        value={mtDifficulty}
                        onChange={(e) => setMtDifficulty(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Кредиты (опционально)</label>
                      <input
                        type="number"
                        min="0"
                        value={mtRewardCredits}
                        onChange={(e) => setMtRewardCredits(e.target.value)}
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
                      />
                    </div>

                    {mtCreateError && (
                      <div className="alert alert-error">
                        Ошибка: {mtCreateError}
                      </div>
                    )}

                    {mtCreateSuccess && (
                      <div
                        className="alert"
                        style={{
                          background: "rgba(34,197,94,0.12)",
                          color: "#bbf7d0",
                          border: "1px solid rgba(34,197,94,0.6)",
                        }}
                      >
                        {mtCreateSuccess}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={mtCreateLoading}
                    >
                      {mtCreateLoading ? "Создаём..." : "Создать микрозадачу"}
                    </button>
                  </form>
                )}
              </section>
            )}

            {/* {activeView === "challenge-details" && (
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

                    {user.role === "student" && (
                      <div style={{ marginTop: 14 }}>
                        {startError && (
                          <div className="alert alert-error">
                            Ошибка: {startError}
                          </div>
                        )}

                        {startStatus !== "started" && (
                          <button
                            className="btn btn-primary"
                            onClick={handleStartChallenge}
                            style={{ marginBottom: 10 }}
                          >
                            Начать участие
                          </button>
                        )}

                        {startStatus === "started" && (
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
                              Вы начали этот челлендж. Ниже вы можете отправить
                              своё решение.
                            </div>

                            <form
                              className="auth-form"
                              onSubmit={handleSubmitSolution}
                            >
                              <div className="form-group">
                                <label>Текстовое решение (опционально)</label>
                                <textarea
                                  rows={4}
                                  value={submissionText}
                                  onChange={(e) =>
                                    setSubmissionText(e.target.value)
                                  }
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
                                <label>
                                  Ссылка на репозиторий / файл (опционально)
                                </label>
                                <input
                                  type="text"
                                  value={submissionLink}
                                  onChange={(e) =>
                                    setSubmissionLink(e.target.value)
                                  }
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
                                {submitLoading
                                  ? "Отправляем..."
                                  : "Отправить решение"}
                              </button>
                            </form>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )} */}
            {activeView === "challenge-details" && (
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

                    {/* блок для студента: старт + отправка решения */}
                    {/* {user.role === "student" && (
                      <div style={{ marginTop: 14 }}>
                        {startError && (
                          <div className="alert alert-error">
                            Ошибка: {startError}
                          </div>
                        )}

                        {startStatus !== "started" && (
                          <button
                            className="btn btn-primary"
                            onClick={handleStartChallenge}
                            style={{ marginBottom: 10 }}
                          >
                            Начать участие
                          </button>
                        )}

                        {startStatus === "started" && (
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
                              Вы начали этот челлендж. Ниже вы можете отправить
                              своё решение.
                            </div>

                            <form
                              className="auth-form"
                              onSubmit={handleSubmitSolution}
                            >
                              <div className="form-group">
                                <label>Текстовое решение (опционально)</label>
                                <textarea
                                  rows={4}
                                  value={submissionText}
                                  onChange={(e) =>
                                    setSubmissionText(e.target.value)
                                  }
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
                                <label>
                                  Ссылка на репозиторий / файл (опционально)
                                </label>
                                <input
                                  type="text"
                                  value={submissionLink}
                                  onChange={(e) =>
                                    setSubmissionLink(e.target.value)
                                  }
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
                                {submitLoading
                                  ? "Отправляем..."
                                  : "Отправить решение"}
                              </button>
                            </form>
                          </>
                        )}
                      </div>
                    )} */}
                    {isStudent && (
                      <div style={{ marginTop: 14 }}>
                        {startError && (
                          <div className="alert alert-error">
                            Ошибка: {startError}
                          </div>
                        )}

                        {/* 1) Если попытки нет вообще — можно только начать участие */}
                        {!hasAttempt && (
                          <button
                            className="btn btn-primary"
                            onClick={handleStartChallenge}
                            style={{ marginBottom: 10 }}
                          >
                            Начать участие
                          </button>
                        )}

                        {/* 2) Если попытка есть и статус started — форма отправки решения */}
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
                              Вы участвуете в этом челлендже. Ниже можно
                              отправить своё решение.
                            </div>

                            <form
                              className="auth-form"
                              onSubmit={handleSubmitSolution}
                            >
                              <div className="form-group">
                                <label>Текстовое решение (опционально)</label>
                                <textarea
                                  rows={4}
                                  value={submissionText}
                                  onChange={(e) =>
                                    setSubmissionText(e.target.value)
                                  }
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
                                <label>
                                  Ссылка на репозиторий / файл (опционально)
                                </label>
                                <input
                                  type="text"
                                  value={submissionLink}
                                  onChange={(e) =>
                                    setSubmissionLink(e.target.value)
                                  }
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
                                {submitLoading
                                  ? "Отправляем..."
                                  : "Отправить решение"}
                              </button>
                            </form>
                          </>
                        )}

                        {/* 3) Если отправлено, но ещё не проверено */}
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
                            <strong>submitted</strong>. Ожидайте проверки
                            преподавателем или компанией.
                          </div>
                        )}

                        {/* 4) Если проверено — показываем оценку и фидбэк */}
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
                                  Преподаватель ещё не оставил подробный
                                  комментарий.
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* блок для teacher/company/admin: список сабмитов и форма ревью */}
                    {(user.role === "teacher" ||
                      user.role === "company" ||
                      user.role === "admin") && (
                      <div style={{ marginTop: 24 }}>
                        <h3>Сабмиты студентов</h3>

                        {subsLoading && (
                          <div className="ch-empty" style={{ marginTop: 8 }}>
                            Загружаем сабмиты...
                          </div>
                        )}

                        {subsError && (
                          <div
                            className="alert alert-error"
                            style={{ marginTop: 8 }}
                          >
                            Ошибка: {subsError}
                          </div>
                        )}

                        {!subsLoading &&
                          !subsError &&
                          submissions.length === 0 && (
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

                                <div
                                  className="ch-meta"
                                  style={{ marginTop: 4 }}
                                >
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

                        {reviewAttemptId && (
                          <div
                            style={{
                              marginTop: 16,
                              paddingTop: 10,
                              borderTop: "1px dashed rgba(148,163,184,0.5)",
                            }}
                          >
                            <h4>Ревью сабмита</h4>

                            {reviewError && (
                              <div className="alert alert-error">
                                Ошибка: {reviewError}
                              </div>
                            )}

                            {reviewSuccess && (
                              <div
                                className="alert"
                                style={{
                                  background: "rgba(34,197,94,0.12)",
                                  color: "#bbf7d0",
                                  border: "1px solid rgba(34,197,94,0.6)",
                                }}
                              >
                                {reviewSuccess}
                              </div>
                            )}

                            <form
                              className="auth-form"
                              onSubmit={handleReviewSubmit}
                            >
                              <div className="form-group">
                                <label>Оценка (0–100, опционально)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={reviewGrade}
                                  onChange={(e) =>
                                    setReviewGrade(e.target.value)
                                  }
                                />
                              </div>

                              <div className="form-group">
                                <label>Фидбэк студенту</label>
                                <textarea
                                  rows={3}
                                  value={reviewFeedback}
                                  onChange={(e) =>
                                    setReviewFeedback(e.target.value)
                                  }
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

                              <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={reviewLoading}
                              >
                                {reviewLoading
                                  ? "Сохраняем..."
                                  : "Сохранить отзыв"}
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
