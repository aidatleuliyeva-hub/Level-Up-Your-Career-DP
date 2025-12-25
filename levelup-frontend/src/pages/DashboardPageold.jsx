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

  // "My challenges" ( )
  const [myChallenges, setMyChallenges] = useState([]);
  const [myLoading, setMyLoading] = useState(false);
  const [myError, setMyError] = useState(null);

  //  
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  // const [startStatus, setStartStatus] = useState(null);
  const [startError, setStartError] = useState(null);

  //  
  const [submissionText, setSubmissionText] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

    //   ( teacher/company/admin)
  const [submissions, setSubmissions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState(null);

  //   
  const [reviewAttemptId, setReviewAttemptId] = useState(null);
  const [reviewGrade, setReviewGrade] = useState("");
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  //   
  const [chTitle, setChTitle] = useState("");
  const [chDescription, setChDescription] = useState("");
  const [chType, setChType] = useState("academic");
  const [chDifficulty, setChDifficulty] = useState("");
  const [chRewardCredits, setChRewardCredits] = useState("");
  const [chRewardAmount, setChRewardAmount] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

    //   
  const [mtTitle, setMtTitle] = useState("");
  const [mtDescription, setMtDescription] = useState("");
  const [mtDifficulty, setMtDifficulty] = useState("");
  const [mtRewardCredits, setMtRewardCredits] = useState("");
  const [mtRewardAmount, setMtRewardAmount] = useState("");
  const [mtCreateLoading, setMtCreateLoading] = useState(false);
  const [mtCreateError, setMtCreateError] = useState(null);
  const [mtCreateSuccess, setMtCreateSuccess] = useState(null);

    //  (marketplace)
  const [microtasks, setMicrotasks] = useState([]);
  const [mtLoading, setMtLoading] = useState(false);
  const [mtError, setMtError] = useState(null);

  // my microtasks ( )
  const [myMicrotasks, setMyMicrotasks] = useState([]);
  const [myMtLoading, setMyMtLoading] = useState(false);
  const [myMtError, setMyMtError] = useState(null);

  //   
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


  //    teacher/company/admin
  const [selectedMicrotaskForApps, setSelectedMicrotaskForApps] =
    useState(null);
  const [mtApps, setMtApps] = useState([]);
  const [mtAppsLoading, setMtAppsLoading] = useState(false);
  const [mtAppsError, setMtAppsError] = useState(null);
  const [mtStatusLoadingId, setMtStatusLoadingId] = useState(null);
  const [mtStatusError, setMtStatusError] = useState(null);

  //    
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

  //   
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

  //    (marketplace)
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

  //   
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

    //    (  teacher/company/admin)
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

  //  "My challenges" (       - )
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
  //  "My challenges"   ( ,   )
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

  //  "My microtasks" ( )
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
      setCreateSuccess(`Challenge created (ID: ${created.id})`);

      setChTitle("");
      setChDescription("");
      setChDifficulty("");
      setChRewardCredits("");
      setChRewardAmount("");

      //  
      try {
        const data = await getChallenges(token);
        setChallenges(data);
      } catch {
        // 
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
      setMtCreateSuccess(`Microtask created (ID: ${created.id})`);

      //  
      setMtTitle("");
      setMtDescription("");
      setMtDifficulty("");
      setMtRewardCredits("");
      setMtRewardAmount("");

      //   
      try {
        const data = await getMicrotasks(token);
        setMicrotasks(data);
      } catch (_) {
        // 
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
      //     "my challenges"
      if (isStudent) {
        try {
          const data = await getMyChallenges(token);
          setMyChallenges(data);
        } catch {
          // 
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

      setSubmitSuccess("Solution submitted. Status: submitted.");

      if (isStudent) {
        try {
          const data = await getMyChallenges(token);
          setMyChallenges(data);
        } catch {
          //  
        }
      }

      //     "My challenges",     submitted
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
          throw new Error("Grade must be a number");
        }
        gradeValue = parsed;
      }

      await reviewSubmission(token, reviewAttemptId, {
        grade: gradeValue,
        feedback: reviewFeedback,
      });

      setReviewSuccess("Feedback saved, status: reviewed");

      //    
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

          setApplySuccess("Response sent.");
          setApplyMicrotaskId(null);
          setApplicationText("");

          //  "my microtasks"
          if (isStudent) {
            try {
              const data = await getMyMicrotasks(token);
              setMyMicrotasks(data);
            } catch {
              // 
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

      //    
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

      setResultSuccess("Result submitted.");
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

    // ---     ---
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
        {/*   */}
        <header className="dashboard-header">
          <div className="header-left">
            <div className="logo-mini">LU</div>
            <div className="header-title-block">
              <div className="dashboard-title">Level Up Your Career</div>
              <div className="dashboard-subtitle">
                Challenges ·  ·  
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
              Sign out
            </button>
          </div>
        </header>

        {/*  :  +  */}
        <div className="dashboard-body">
          {/*  */}
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
              <div className="sidebar-section-title"></div>
              {/* <nav className="sidebar-nav">
                <button
                  className={
                    "sidebar-link " +
                    (activeView === "overview" ? "sidebar-link-active" : "")
                  }
                  onClick={() => setActiveView("overview")}
                >
                  
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
                  Create challenge
                </button>

                <button className="sidebar-link" disabled>
                  Microtasks
                </button>
                <button className="sidebar-link" disabled>
                  Leaderboard
                </button>
                <button className="sidebar-link" disabled>
                  Portfolio
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
                  
                </button>

                <button
                  className={
                    "sidebar-link " +
                    (activeView === "profile" ? "sidebar-link-active" : "")
                  }
                  onClick={() => setActiveView("profile")}
                  disabled={!isStudent}
                >
                  Profile
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
                  My challenges
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
                  Create challenge
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
                  Create microtask
                </button>

                <button
                  className={
                    "sidebar-link " +
                    (activeView === "microtasks" ? "sidebar-link-active" : "")
                  }
                  onClick={() => setActiveView("microtasks")}
                >
                  Microtasks
                </button>
                <button className="sidebar-link" disabled>
                  Leaderboard
                </button>
                <button className="sidebar-link" disabled>
                  Portfolio
                </button>
              </nav>
            </div>

            <div className="sidebar-section sidebar-hint">
              <div className="sidebar-hint-title"> ?</div>
              <p>
                     ,   
                 .
              </p>
              {!canCreate && (
                <p style={{ marginTop: 6, fontSize: 11, color: "#6b7280" }}>
                      teacher / company / admin.
                </p>
              )}
            </div>
          </aside>

          {/*  */}
          <main className="dashboard-content">
            {activeView === "overview" && (
              <section className="content-section">
                <div className="content-header">
                  <div>
                    <h1> </h1>
                    <p>
                          ,  
                       .
                    </p>
                  </div>
                  <div className="content-header-meta">
                    {chLoading && (
                      <span className="ch-badge">...</span>
                    )}
                    {!chLoading && challengesForOverview.length > 0 && (
                      <span className="ch-badge">
                        {challengesForOverview.length} ()
                      </span>
                    )}
                  </div>
                </div>

                {chError && (
                  <div className="alert alert-error">Error: {chError}</div>
                )}

                {!chLoading &&
                  challengesForOverview.length === 0 &&
                  !chError && (
                    <div className="ch-empty">
                         .   
                          .
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
                            Difficulty: {ch.difficulty}
                          </span>
                        )}
                        {ch.reward_credits != null && (
                          <span className="ch-pill">
                            Credits: {ch.reward_credits}
                          </span>
                        )}
                        {ch.reward_amount != null && (
                          <span className="ch-pill">
                            Reward: {ch.reward_amount} €
                          </span>
                        )}
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => openChallengeDetails(ch.id)}
                        >
                          
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
                            Difficulty: {ch.difficulty}
                          </span>
                        )}
                        {ch.reward_credits != null && (
                          <span className="ch-pill">
                            Credits: {ch.reward_credits}
                          </span>
                        )}
                        {ch.reward_amount != null && (
                          <span className="ch-pill">
                            Reward: {ch.reward_amount} €
                          </span>
                        )}
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => openChallengeDetails(ch.id)}
                        >
                          
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
                    <h1>Profile </h1>
                    <p>
                         :   , 
                          .
                    </p>
                  </div>
                </div>

                {!isStudent && (
                  <div className="alert alert-error">
                    Profile     student.
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

                    {/*   */}
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
                          In progress
                        </h3>
                        <p className="ch-desc" style={{ marginBottom: 4 }}>
                          Challenges,   .
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
                          Pending review
                        </h3>
                        <p className="ch-desc" style={{ marginBottom: 4 }}>
                          ,    .
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
                          Completed
                        </h3>
                        <p className="ch-desc" style={{ marginBottom: 4 }}>
                           .
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
                          Credits ()
                        </h3>
                        <p className="ch-desc" style={{ marginBottom: 4 }}>
                              .
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
                          Earned, €
                        </h3>
                        <p className="ch-desc" style={{ marginBottom: 4 }}>
                              .
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
                          Average rating
                        </h3>
                        <p className="ch-desc" style={{ marginBottom: 4 }}>
                                .
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
                        <div className="ch-list">
                          {lastReviewed.map((item) => (
                            <div key={item.attempt_id} className="ch-card">
                              <div className="ch-card-header">
                                <div>
                                  <h3>{item.title}</h3>
                                  <p className="ch-desc">
                                    {item.challenge_type} · :{" "}
                                    {item.attempt_status}
                                  </p>
                                </div>
                                {item.grade != null && (
                                  <span className="ch-type">
                                    Grade: {item.grade}
                                  </span>
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
                                  onClick={() =>
                                    openChallengeDetails(item.challenge_id)
                                  }
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
            )}

            {activeView === "microtasks" && (
              <section className="content-section">
                <div className="content-header">
                  <div>
                    <h1>Microtasks</h1>
                    <p>
                           .  —
                       —    .
                    </p>
                  </div>
                  <div className="content-header-meta">
                    {mtLoading && (
                      <span className="ch-badge">...</span>
                    )}
                    {!mtLoading && microtasks.length > 0 && (
                      <span className="ch-badge">
                        {microtasks.length} ()
                      </span>
                    )}
                  </div>
                </div>

                {mtError && (
                  <div className="alert alert-error">Error: {mtError}</div>
                )}

                {!mtLoading && microtasks.length === 0 && !mtError && (
                  <div className="ch-empty">
                       .     
                    .
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
                              Difficulty: {mt.difficulty}
                            </span>
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

                        {/*   :    */}
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
                                    setApplyError(null);
                                    setApplySuccess(null);
                                  }}
                                >
                                  Respond
                                </button>
                              </div>
                            )}

                            {/*       */}
                            {!alreadyApplied && applyMicrotaskId === mt.id && (
                              <form
                                className="auth-form"
                                onSubmit={handleApplySubmit}
                                style={{ marginTop: 8 }}
                              >
                                <div className="form-group">
                                  <label>
                                      ,   
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
                                    Error: {applyError}
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
                                    ? "Submitting..."
                                    : "Submit response"}
                                </button>
                              </form>
                            )}
                          </>
                        )}

                        {/*   teacher/company/admin:   */}
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

                {/*  : "My microtasks" —    */}
                {isStudent && (
                  <div className="challenges-section">
                    <h3 style={{ marginTop: 18, marginBottom: 6 }}>
                      My microtasks
                    </h3>

                    {myMtLoading && (
                      <div className="ch-empty">  ...</div>
                    )}

                    {myMtError && (
                      <div className="alert alert-error">
                        Error: {myMtError}
                      </div>
                    )}

                    {!myMtLoading &&
                      !myMtError &&
                      myMicrotasks.length === 0 && (
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
                                    Submit result
                                  </button>
                                )}

                                {resultForAppId === item.application_id && (
                                  <form
                                    className="auth-form"
                                    onSubmit={handleSubmitMicrotaskResult}
                                    style={{ marginTop: 8 }}
                                  >
                                    <div className="form-group">
                                      <label>   ()</label>
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
                                           (GitHub / Figma /
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
                                        Error: {resultError}
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
                                        ? "Submitting..."
                                        : "Submit result"}
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

                {/*   —   teacher/company/admin */}
                {!isStudent && selectedMicrotaskForApps && (
                  <div
                    style={{
                      marginTop: 20,
                      paddingTop: 12,
                      borderTop: "1px solid rgba(148,163,184,0.35)",
                    }}
                  >
                    <h3>
                        : {selectedMicrotaskForApps.title}
                    </h3>

                    {mtAppsLoading && (
                      <div className="ch-empty"> ...</div>
                    )}

                    {mtAppsError && (
                      <div className="alert alert-error">
                        Error: {mtAppsError}
                      </div>
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
                                style={{
                                  marginTop: 6,
                                  fontSize: 13,
                                }}
                              >
                                : {app.application_text}
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
                                  ? "Saving..."
                                  : "Accept"}
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
                    <h1>My challenges</h1>
                    <p>Challenges you started as a student.</p>
                  </div>
                  <div className="content-header-meta">
                    {myLoading && (
                      <span className="ch-badge">...</span>
                    )}
                    {!myLoading && myChallenges.length > 0 && (
                      <span className="ch-badge">
                        {myChallenges.length} ()
                      </span>
                    )}
                  </div>
                </div>

                {myError && (
                  <div className="alert alert-error">Error: {myError}</div>
                )}

                {!myLoading && myChallenges.length === 0 && !myError && (
                  <div className="ch-empty">
                          .
                  </div>
                )}

                <div className="ch-list">
                  {myChallenges.map((item) => (
                    <div key={item.attempt_id} className="ch-card">
                      <div className="ch-card-header">
                        <div>
                          <h3>{item.title}</h3>
                          <p className="ch-desc">
                            {item.challenge_type} · :{" "}
                            {item.attempt_status}
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
                      <div style={{ marginTop: 8 }}>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            openChallengeDetails(item.challenge_id)
                          }
                        >
                          Open challenge
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
                    <h1>Create challenge</h1>
                    <p>
                      Task description  : , , 
                       .
                    </p>
                  </div>
                </div>

                {!canCreate && (
                  <div className="alert alert-error">
                    Your role cannot create challenges.
                  </div>
                )}

                {canCreate && (
                  <form className="auth-form" onSubmit={handleCreateChallenge}>
                    <div className="form-group">
                      <label></label>
                      <input
                        type="text"
                        value={chTitle}
                        onChange={(e) => setChTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label></label>
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
                      <label>Challenge type</label>
                      <select
                        value={chType}
                        onChange={(e) => setChType(e.target.value)}
                      >
                        <option value="academic">academic</option>
                        <option value="company">company</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Difficulty (e.g., easy / medium / hard)</label>
                      <input
                        type="text"
                        value={chDifficulty}
                        onChange={(e) => setChDifficulty(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Credits ()</label>
                      <input
                        type="number"
                        min="0"
                        value={chRewardCredits}
                        onChange={(e) => setChRewardCredits(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>, € ()</label>
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
                        Error: {createError}
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
                      {createLoading ? "Creating..." : "Create challenge"}
                    </button>
                  </form>
                )}
              </section>
            )}

            {activeView === "create-microtask" && (
              <section className="content-section">
                <div className="content-header">
                  <div>
                    <h1>Create microtask</h1>
                    <p>
                        :   ,
                             .
                    </p>
                  </div>
                </div>

                {!canCreate && (
                  <div className="alert alert-error">
                         .
                  </div>
                )}

                {canCreate && (
                  <form className="auth-form" onSubmit={handleCreateMicrotask}>
                    <div className="form-group">
                      <label></label>
                      <input
                        type="text"
                        value={mtTitle}
                        onChange={(e) => setMtTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label></label>
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
                      <label>Difficulty (e.g., easy / medium / hard)</label>
                      <input
                        type="text"
                        value={mtDifficulty}
                        onChange={(e) => setMtDifficulty(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Credits ()</label>
                      <input
                        type="number"
                        min="0"
                        value={mtRewardCredits}
                        onChange={(e) => setMtRewardCredits(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>, € ()</label>
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
                        Error: {mtCreateError}
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
                      {mtCreateLoading ? "Creating..." : "Create microtask"}
                    </button>
                  </form>
                )}
              </section>
            )}

            {/* {activeView === "challenge-details" && (
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

                    {user.role === "student" && (
                      <div style={{ marginTop: 14 }}>
                        {startError && (
                          <div className="alert alert-error">
                            Error: {startError}
                          </div>
                        )}

                        {startStatus !== "started" && (
                          <button
                            className="btn btn-primary"
                            onClick={handleStartChallenge}
                            style={{ marginBottom: 10 }}
                          >
                             
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
                                 .    
                               .
                            </div>

                            <form
                              className="auth-form"
                              onSubmit={handleSubmitSolution}
                            >
                              <div className="form-group">
                                <label>  ()</label>
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
                                     /  ()
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
                                {submitLoading
                                  ? "Submitting..."
                                  : "Submit solution"}
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

                    {/*   :  +   */}
                    {/* {user.role === "student" && (
                      <div style={{ marginTop: 14 }}>
                        {startError && (
                          <div className="alert alert-error">
                            Error: {startError}
                          </div>
                        )}

                        {startStatus !== "started" && (
                          <button
                            className="btn btn-primary"
                            onClick={handleStartChallenge}
                            style={{ marginBottom: 10 }}
                          >
                             
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
                                 .    
                               .
                            </div>

                            <form
                              className="auth-form"
                              onSubmit={handleSubmitSolution}
                            >
                              <div className="form-group">
                                <label>  ()</label>
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
                                     /  ()
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
                                {submitLoading
                                  ? "Submitting..."
                                  : "Submit solution"}
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
                            Error: {startError}
                          </div>
                        )}

                        {/* 1)     —     */}
                        {!hasAttempt && (
                          <button
                            className="btn btn-primary"
                            onClick={handleStartChallenge}
                            style={{ marginBottom: 10 }}
                          >
                             
                          </button>
                        )}

                        {/* 2)      started —    */}
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

                            <form
                              className="auth-form"
                              onSubmit={handleSubmitSolution}
                            >
                              <div className="form-group">
                                <label>  ()</label>
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
                                     /  ()
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
                                {submitLoading
                                  ? "Submitting..."
                                  : "Submit solution"}
                              </button>
                            </form>
                          </>
                        )}

                        {/* 3)  ,     */}
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

                        {/* 4)   —     */}
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
                                  Teacher    
                                  .
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    )}

                    {/*   teacher/company/admin:      */}
                    {(user.role === "teacher" ||
                      user.role === "company" ||
                      user.role === "admin") && (
                      <div style={{ marginTop: 24 }}>
                        <h3>Submissions </h3>

                        {subsLoading && (
                          <div className="ch-empty" style={{ marginTop: 8 }}>
                             ...
                          </div>
                        )}

                        {subsError && (
                          <div
                            className="alert alert-error"
                            style={{ marginTop: 8 }}
                          >
                            Error: {subsError}
                          </div>
                        )}

                        {!subsLoading &&
                          !subsError &&
                          submissions.length === 0 && (
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

                        {reviewAttemptId && (
                          <div
                            style={{
                              marginTop: 16,
                              paddingTop: 10,
                              borderTop: "1px dashed rgba(148,163,184,0.5)",
                            }}
                          >
                            <h4> </h4>

                            {reviewError && (
                              <div className="alert alert-error">
                                Error: {reviewError}
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
                                <label> (0–100, )</label>
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
                                <label> </label>
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
                                  ? "Saving..."
                                  : "Save feedback"}
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
