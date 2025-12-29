// // src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// export default function DashboardPage() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);

//   const [challenges, setChallenges] = useState([]);
//   const [chError, setChError] = useState(null);
//   const [chLoading, setChLoading] = useState(false);

//   const [activeView, setActiveView] = useState("overview");

//   const [myChallenges, setMyChallenges] = useState([]);
//   const [myLoading, setMyLoading] = useState(false);
//   const [myError, setMyError] = useState(null);

//   const [selectedChallengeId, setSelectedChallengeId] = useState(null);
//   const [selectedChallenge, setSelectedChallenge] = useState(null);
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [detailsError, setDetailsError] = useState(null);
//   const [startError, setStartError] = useState(null);

//   const [submissionText, setSubmissionText] = useState("");
//   const [submissionLink, setSubmissionLink] = useState("");
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [submitSuccess, setSubmitSuccess] = useState(null);

//   const [submissions, setSubmissions] = useState([]);
//   const [subsLoading, setSubsLoading] = useState(false);
//   const [subsError, setSubsError] = useState(null);

//   const [reviewAttemptId, setReviewAttemptId] = useState(null);
//   const [reviewGrade, setReviewGrade] = useState("");
//   const [reviewFeedback, setReviewFeedback] = useState("");
//   const [reviewLoading, setReviewLoading] = useState(false);
//   const [reviewError, setReviewError] = useState(null);
//   const [reviewSuccess, setReviewSuccess] = useState(null);

//   const [chTitle, setChTitle] = useState("");
//   const [chDescription, setChDescription] = useState("");
//   const [chType, setChType] = useState("academic");
//   const [chDifficulty, setChDifficulty] = useState("");
//   const [chRewardCredits, setChRewardCredits] = useState("");
//   const [chRewardAmount, setChRewardAmount] = useState("");
//   const [createLoading, setCreateLoading] = useState(false);
//   const [createError, setCreateError] = useState(null);
//   const [createSuccess, setCreateSuccess] = useState(null);

//   const [mtTitle, setMtTitle] = useState("");
//   const [mtDescription, setMtDescription] = useState("");
//   const [mtDifficulty, setMtDifficulty] = useState("");
//   const [mtRewardCredits, setMtRewardCredits] = useState("");
//   const [mtRewardAmount, setMtRewardAmount] = useState("");
//   const [mtCreateLoading, setMtCreateLoading] = useState(false);
//   const [mtCreateError, setMtCreateError] = useState(null);
//   const [mtCreateSuccess, setMtCreateSuccess] = useState(null);

//   const [microtasks, setMicrotasks] = useState([]);
//   const [mtLoading, setMtLoading] = useState(false);
//   const [mtError, setMtError] = useState(null);

//   const [myMicrotasks, setMyMicrotasks] = useState([]);
//   const [myMtLoading, setMyMtLoading] = useState(false);
//   const [myMtError, setMyMtError] = useState(null);

//   const [applyMicrotaskId, setApplyMicrotaskId] = useState(null);
//   const [applicationText, setApplicationText] = useState("");
//   const [applyLoading, setApplyLoading] = useState(false);
//   const [applyError, setApplyError] = useState(null);
//   const [applySuccess, setApplySuccess] = useState(null);

//   const [resultText, setResultText] = useState("");
//   const [resultLink, setResultLink] = useState("");
//   const [resultForAppId, setResultForAppId] = useState(null);
//   const [resultLoading, setResultLoading] = useState(false);
//   const [resultError, setResultError] = useState(null);
//   const [resultSuccess, setResultSuccess] = useState(null);

//   const [selectedMicrotaskForApps, setSelectedMicrotaskForApps] =
//     useState(null);
//   const [mtApps, setMtApps] = useState([]);
//   const [mtAppsLoading, setMtAppsLoading] = useState(false);
//   const [mtAppsError, setMtAppsError] = useState(null);
//   const [mtStatusLoadingId, setMtStatusLoadingId] = useState(null);
//   const [mtStatusError, setMtStatusError] = useState(null);

//   //  /
//   useEffect(() => {
//     const savedUser = localStorage.getItem("currentUser");
//     const savedToken = localStorage.getItem("token");

//     if (savedUser && savedToken) {
//       try {
//         setUser(JSON.parse(savedUser));
//         setToken(savedToken);
//       } catch {
//         //     —   ,
//         //    PrivateRoute
//       }
//     }
//   }, []); //  navigate  

//   //   
//   useEffect(() => {
//     if (!token) return;

//     const load = async () => {
//       setChLoading(true);
//       setChError(null);
//       try {
//         const data = await getChallenges(token);
//         setChallenges(data);
//       } catch (err) {
//         setChError(err.message);
//       } finally {
//         setChLoading(false);
//       }
//     };

//     load();
//   }, [token]);

//   //  
//   useEffect(() => {
//     if (!token) return;

//     const load = async () => {
//       setMtLoading(true);
//       setMtError(null);
//       try {
//         const data = await getMicrotasks(token);
//         setMicrotasks(data);
//       } catch (err) {
//         setMtError(err.message);
//       } finally {
//         setMtLoading(false);
//       }
//     };

//     load();
//   }, [token]);

//   //  
//   useEffect(() => {
//     if (activeView !== "challenge-details") return;
//     if (!token || !selectedChallengeId) return;

//     const loadDetails = async () => {
//       setDetailsLoading(true);
//       setDetailsError(null);
//       setSelectedChallenge(null);
//       try {
//         const data = await getChallenge(token, selectedChallengeId);
//         setSelectedChallenge(data);
//       } catch (err) {
//         setDetailsError(err.message);
//       } finally {
//         setDetailsLoading(false);
//       }
//     };

//     loadDetails();
//   }, [activeView, token, selectedChallengeId]);

//   // Submissions   —  teacher/company/admin
//   useEffect(() => {
//     if (activeView !== "challenge-details") return;
//     if (!token || !selectedChallengeId || !user) return;

//     const isReviewer =
//       user.role === "teacher" ||
//       user.role === "company" ||
//       user.role === "admin";

//     if (!isReviewer) return;

//     const loadSubs = async () => {
//       setSubsLoading(true);
//       setSubsError(null);
//       try {
//         const data = await getChallengeSubmissions(token, selectedChallengeId);
//         setSubmissions(data);
//       } catch (err) {
//         setSubsError(err.message);
//       } finally {
//         setSubsLoading(false);
//       }
//     };

//     loadSubs();
//   }, [activeView, token, selectedChallengeId, user]);

//   // My challenges (student)
//   useEffect(() => {
//     if (!token || !user) return;
//     if (user.role !== "student") return;

//     const loadMy = async () => {
//       setMyLoading(true);
//       setMyError(null);
//       try {
//         const data = await getMyChallenges(token);
//         setMyChallenges(data);
//       } catch (err) {
//         setMyError(err.message);
//       } finally {
//         setMyLoading(false);
//       }
//     };

//     loadMy();
//   }, [token, user]);

//   // My microtasks (student)
//   useEffect(() => {
//     if (!token || !user) return;
//     if (user.role !== "student") return;

//     const loadMyMicro = async () => {
//       setMyMtLoading(true);
//       setMyMtError(null);
//       try {
//         const data = await getMyMicrotasks(token);
//         setMyMicrotasks(data);
//       } catch (err) {
//         setMyMtError(err.message);
//       } finally {
//         setMyMtLoading(false);
//       }
//     };

//     loadMyMicro();
//   }, [token, user]);

//   if (!user) {
//     return null;
//   }

//   const canCreate =
//     user.role === "teacher" || user.role === "company" || user.role === "admin";

//   const isStudent = user.role === "student";

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("currentUser");

//     //  React   ,  
//     setTimeout(() => {
//       navigate("/", { replace: true });
//     }, 0);
//   };

//   const handleCreateChallenge = async (e) => {
//     e.preventDefault();
//     if (!token) return;

//     setCreateError(null);
//     setCreateSuccess(null);
//     setCreateLoading(true);

//     try {
//       const payload = {
//         title: chTitle,
//         description: chDescription,
//         challenge_type: chType,
//         difficulty: chDifficulty,
//       };

//       if (chRewardCredits.trim() !== "") {
//         const parsed = parseInt(chRewardCredits, 10);
//         if (!Number.isNaN(parsed)) {
//           payload.reward_credits = parsed;
//         }
//       }

//       if (chRewardAmount.trim() !== "") {
//         const parsed = parseFloat(chRewardAmount);
//         if (!Number.isNaN(parsed)) {
//           payload.reward_amount = parsed;
//         }
//       }

//       const created = await createChallenge(token, payload);
//       setCreateSuccess(`Challenge created (ID: ${created.id})`);

//       setChTitle("");
//       setChDescription("");
//       setChDifficulty("");
//       setChRewardCredits("");
//       setChRewardAmount("");

//       try {
//         const data = await getChallenges(token);
//         setChallenges(data);
//       } catch {
//         // 
//       }
//     } catch (err) {
//       setCreateError(err.message);
//     } finally {
//       setCreateLoading(false);
//     }
//   };

//   const handleCreateMicrotask = async (e) => {
//     e.preventDefault();
//     if (!token) return;

//     setMtCreateError(null);
//     setMtCreateSuccess(null);
//     setMtCreateLoading(true);

//     try {
//       const payload = {
//         title: mtTitle,
//         description: mtDescription,
//         difficulty: mtDifficulty,
//       };

//       if (mtRewardCredits.trim() !== "") {
//         const parsed = parseInt(mtRewardCredits, 10);
//         if (!Number.isNaN(parsed)) {
//           payload.reward_credits = parsed;
//         }
//       }

//       if (mtRewardAmount.trim() !== "") {
//         const parsed = parseFloat(mtRewardAmount);
//         if (!Number.isNaN(parsed)) {
//           payload.reward_amount = parsed;
//         }
//       }

//       const created = await createMicrotask(token, payload);
//       setMtCreateSuccess(`Microtask created (ID: ${created.id})`);

//       setMtTitle("");
//       setMtDescription("");
//       setMtDifficulty("");
//       setMtRewardCredits("");
//       setMtRewardAmount("");

//       try {
//         const data = await getMicrotasks(token);
//         setMicrotasks(data);
//       } catch {
//         // 
//       }
//     } catch (err) {
//       setMtCreateError(err.message);
//     } finally {
//       setMtCreateLoading(false);
//     }
//   };

//   const openChallengeDetails = (id) => {
//     setSelectedChallengeId(id);
//     setSelectedChallenge(null);
//     setDetailsError(null);
//     setStartError(null);
//     setActiveView("challenge-details");
//   };

//   const handleStartChallenge = async () => {
//     if (!token || !selectedChallengeId) return;

//     setStartError(null);
//     try {
//       await startChallenge(token, selectedChallengeId);
//       if (isStudent) {
//         try {
//           const data = await getMyChallenges(token);
//           setMyChallenges(data);
//         } catch {
//           // 
//         }
//       }
//     } catch (err) {
//       setStartError(err.message);
//     }
//   };

//   const handleSubmitSolution = async (e) => {
//     e.preventDefault();
//     if (!token || !selectedChallengeId) return;

//     setSubmitError(null);
//     setSubmitSuccess(null);
//     setSubmitLoading(true);

//     try {
//       const payload = {
//         submission_text: submissionText,
//         submission_link: submissionLink,
//       };

//       await submitChallenge(token, selectedChallengeId, payload);

//       setSubmitSuccess("Solution submitted. Status: submitted.");

//       if (isStudent) {
//         try {
//           const data = await getMyChallenges(token);
//           setMyChallenges(data);
//         } catch {
//           // 
//         }
//       }
//     } catch (err) {
//       setSubmitError(err.message);
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const startReview = (attempt) => {
//     setReviewAttemptId(attempt.attempt_id);
//     setReviewGrade(attempt.grade != null ? String(attempt.grade) : "");
//     setReviewFeedback(attempt.feedback || "");
//     setReviewError(null);
//     setReviewSuccess(null);
//   };

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     if (!token || !reviewAttemptId) return;

//     setReviewError(null);
//     setReviewSuccess(null);
//     setReviewLoading(true);

//     try {
//       let gradeValue = null;
//       if (reviewGrade.trim() !== "") {
//         const parsed = parseInt(reviewGrade, 10);
//         if (Number.isNaN(parsed)) {
//           throw new Error("Grade must be a number");
//         }
//         gradeValue = parsed;
//       }

//       await reviewSubmission(token, reviewAttemptId, {
//         grade: gradeValue,
//         feedback: reviewFeedback,
//       });

//       setReviewSuccess("Feedback saved, status: reviewed");

//       setSubmissions((prev) =>
//         prev.map((s) =>
//           s.attempt_id === reviewAttemptId
//             ? {
//                 ...s,
//                 grade: gradeValue,
//                 feedback: reviewFeedback,
//                 status: "reviewed",
//               }
//             : s
//         )
//       );
//     } catch (err) {
//       setReviewError(err.message);
//     } finally {
//       setReviewLoading(false);
//     }
//   };

//   const goBackToOverview = () => {
//     setActiveView("overview");
//     setSelectedChallengeId(null);
//     setSelectedChallenge(null);
//     setDetailsError(null);
//     setStartError(null);
//     setSubmitError(null);
//     setSubmitSuccess(null);
//     setSubmissions([]);
//     setSubsError(null);
//     setReviewAttemptId(null);
//     setReviewError(null);
//     setReviewSuccess(null);
//   };

//   const handleApplySubmit = async (e) => {
//     e.preventDefault();
//     if (!token || !applyMicrotaskId) return;

//     setApplyError(null);
//     setApplySuccess(null);
//     setApplyLoading(true);

//     try {
//       await applyMicrotask(token, applyMicrotaskId, {
//         application_text: applicationText,
//       });

//       setApplySuccess("Response sent.");
//       setApplyMicrotaskId(null);
//       setApplicationText("");

//       if (isStudent) {
//         try {
//           const data = await getMyMicrotasks(token);
//           setMyMicrotasks(data);
//         } catch {
//           // ignore
//         }
//       }
//     } catch (err) {
//       setApplyError(err.message);
//     } finally {
//       setApplyLoading(false);
//     }
//   };

//   const loadApplicationsForMicrotask = async (microtaskId) => {
//     if (!token) return;

//     setMtAppsLoading(true);
//     setMtAppsError(null);
//     setMtStatusError(null);

//     try {
//       const data = await getMicrotaskApplications(token, microtaskId);
//       setMtApps(data);
//     } catch (err) {
//       setMtAppsError(err.message);
//     } finally {
//       setMtAppsLoading(false);
//     }
//   };

//   const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
//     if (!token) return;

//     setMtStatusError(null);
//     setMtStatusLoadingId(applicationId);

//     try {
//       await updateMicrotaskApplicationStatus(token, applicationId, newStatus);

//       setMtApps((prev) =>
//         prev.map((a) =>
//           a.application_id === applicationId ? { ...a, status: newStatus } : a
//         )
//       );
//     } catch (err) {
//       setMtStatusError(err.message);
//     } finally {
//       setMtStatusLoadingId(null);
//     }
//   };

//   const handleSubmitMicrotaskResult = async (e) => {
//     e.preventDefault();
//     if (!token || !resultForAppId) return;

//     setResultError(null);
//     setResultSuccess(null);
//     setResultLoading(true);

//     try {
//       await submitMicrotaskResult(token, resultForAppId, {
//         result_text: resultText,
//         result_link: resultLink,
//       });

//       setResultSuccess("Result submitted.");
//       setResultForAppId(null);
//       setResultText("");
//       setResultLink("");

//       if (isStudent) {
//         try {
//           const data = await getMyMicrotasks(token);
//           setMyMicrotasks(data);
//         } catch {
//           // ignore
//         }
//       }
//     } catch (err) {
//       setResultError(err.message);
//     } finally {
//       setResultLoading(false);
//     }
//   };

//   const challengesForOverview = isStudent
//     ? challenges.filter(
//         (ch) => !myChallenges.some((mine) => mine.challenge_id === ch.id)
//       )
//     : challenges;

//   const currentStudentAttempt =
//     isStudent && selectedChallengeId
//       ? myChallenges.find((m) => m.challenge_id === selectedChallengeId)
//       : null;

//   const hasAttempt = !!currentStudentAttempt;
//   const myAttemptStatus = currentStudentAttempt?.attempt_status || null;

//   const renderContent = () => {
//     if (activeView === "overview") {
//       return (
//         <OverviewSection
//           challengesForOverview={challengesForOverview}
//           chLoading={chLoading}
//           chError={chError}
//           openChallengeDetails={openChallengeDetails}
//         />
//       );
//     }

//     if (activeView === "profile") {
//       return (
//         <ProfileSection
//           isStudent={isStudent}
//           myChallenges={myChallenges}
//           myLoading={myLoading}
//           myError={myError}
//           openChallengeDetails={openChallengeDetails}
//         />
//       );
//     }

//     if (activeView === "microtasks") {
//       return (
//         <MicrotasksSection
//           isStudent={isStudent}
//           userRole={user.role}
//           microtasks={microtasks}
//           mtLoading={mtLoading}
//           mtError={mtError}
//           myMicrotasks={myMicrotasks}
//           myMtLoading={myMtLoading}
//           myMtError={myMtError}
//           applyMicrotaskId={applyMicrotaskId}
//           setApplyMicrotaskId={setApplyMicrotaskId}
//           applicationText={applicationText}
//           setApplicationText={setApplicationText}
//           applyLoading={applyLoading}
//           applyError={applyError}
//           applySuccess={applySuccess}
//           handleApplySubmit={handleApplySubmit}
//           resultForAppId={resultForAppId}
//           setResultForAppId={setResultForAppId}
//           resultText={resultText}
//           setResultText={setResultText}
//           resultLink={resultLink}
//           setResultLink={setResultLink}
//           resultLoading={resultLoading}
//           resultError={resultError}
//           resultSuccess={resultSuccess}
//           handleSubmitMicrotaskResult={handleSubmitMicrotaskResult}
//           selectedMicrotaskForApps={selectedMicrotaskForApps}
//           setSelectedMicrotaskForApps={setSelectedMicrotaskForApps}
//           mtApps={mtApps}
//           mtAppsLoading={mtAppsLoading}
//           mtAppsError={mtAppsError}
//           mtStatusLoadingId={mtStatusLoadingId}
//           mtStatusError={mtStatusError}
//           loadApplicationsForMicrotask={loadApplicationsForMicrotask}
//           handleUpdateApplicationStatus={handleUpdateApplicationStatus}
//           setApplyError={setApplyError}
//           setApplySuccess={setApplySuccess}
//           setResultError={setResultError}
//           setResultSuccess={setResultSuccess}
//         />
//       );
//     }

//     if (activeView === "my-challenges") {
//       return (
//         <MyChallengesSection
//           myChallenges={myChallenges}
//           myLoading={myLoading}
//           myError={myError}
//           openChallengeDetails={openChallengeDetails}
//         />
//       );
//     }

//     if (activeView === "create-challenge") {
//       return (
//         <CreateChallengeSection
//           canCreate={canCreate}
//           chTitle={chTitle}
//           setChTitle={setChTitle}
//           chDescription={chDescription}
//           setChDescription={setChDescription}
//           chType={chType}
//           setChType={setChType}
//           chDifficulty={chDifficulty}
//           setChDifficulty={setChDifficulty}
//           chRewardCredits={chRewardCredits}
//           setChRewardCredits={setChRewardCredits}
//           chRewardAmount={chRewardAmount}
//           setChRewardAmount={setChRewardAmount}
//           createLoading={createLoading}
//           createError={createError}
//           createSuccess={createSuccess}
//           handleCreateChallenge={handleCreateChallenge}
//         />
//       );
//     }

//     if (activeView === "create-microtask") {
//       return (
//         <CreateMicrotaskSection
//           canCreate={canCreate}
//           mtTitle={mtTitle}
//           setMtTitle={setMtTitle}
//           mtDescription={mtDescription}
//           setMtDescription={setMtDescription}
//           mtDifficulty={mtDifficulty}
//           setMtDifficulty={setMtDifficulty}
//           mtRewardCredits={mtRewardCredits}
//           setMtRewardCredits={setMtRewardCredits}
//           mtRewardAmount={mtRewardAmount}
//           setMtRewardAmount={setMtRewardAmount}
//           mtCreateLoading={mtCreateLoading}
//           mtCreateError={mtCreateError}
//           mtCreateSuccess={mtCreateSuccess}
//           handleCreateMicrotask={handleCreateMicrotask}
//         />
//       );
//     }

//     if (activeView === "challenge-details") {
//       return (
//         <ChallengeDetailsSection
//           isStudent={isStudent}
//           userRole={user.role}
//           selectedChallenge={selectedChallenge}
//           detailsLoading={detailsLoading}
//           detailsError={detailsError}
//           goBackToOverview={goBackToOverview}
//           startError={startError}
//           handleStartChallenge={handleStartChallenge}
//           hasAttempt={hasAttempt}
//           myAttemptStatus={myAttemptStatus}
//           currentStudentAttempt={currentStudentAttempt}
//           submissionText={submissionText}
//           setSubmissionText={setSubmissionText}
//           submissionLink={submissionLink}
//           setSubmissionLink={setSubmissionLink}
//           submitLoading={submitLoading}
//           submitError={submitError}
//           submitSuccess={submitSuccess}
//           handleSubmitSolution={handleSubmitSolution}
//           submissions={submissions}
//           subsLoading={subsLoading}
//           subsError={subsError}
//           startReview={startReview}
//           reviewAttemptId={reviewAttemptId}
//           reviewGrade={reviewGrade}
//           setReviewGrade={setReviewGrade}
//           reviewFeedback={reviewFeedback}
//           setReviewFeedback={setReviewFeedback}
//           reviewLoading={reviewLoading}
//           reviewError={reviewError}
//           reviewSuccess={reviewSuccess}
//           handleReviewSubmit={handleReviewSubmit}
//         />
//       );
//     }

//     //   rating/portfolio,   
//     if (activeView === "rating" || activeView === "portfolio") {
//       return (
//         <section className="content-section">
//           <div className="content-header">
//             <div>
//               <h1>Section under development</h1>
//               <p>      .</p>
//             </div>
//           </div>
//         </section>
//       );
//     }

//     // fallback
//     return (
//       <OverviewSection
//         challengesForOverview={challengesForOverview}
//         chLoading={chLoading}
//         chError={chError}
//         openChallengeDetails={openChallengeDetails}
//       />
//     );
//   };

//   return (
//     <DashboardLayout
//       user={user}
//       isStudent={isStudent}
//       canCreate={canCreate}
//       activeView={activeView}
//       setActiveView={setActiveView}
//       onLogout={handleLogout}
//     >
//       {renderContent()}
//     </DashboardLayout>
//   );
// }














// src/pages/DashboardPage.jsx
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

import OverviewSection from "../components/dashboard/OverviewSection";
import ProfileSection from "../components/dashboard/ProfileSection";
import MyChallengesSection from "../components/dashboard/MyChallengesSection";
import CreateChallengeSection from "../components/dashboard/CreateChallengeSection";
import CreateMicrotaskSection from "../components/dashboard/CreateMicrotaskSection";
import MicrotasksSection from "../components/dashboard/MicrotasksSection";
import ChallengeDetailsSection from "../components/dashboard/ChallengeDetailsSection";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [challenges, setChallenges] = useState([]);
  const [chError, setChError] = useState(null);
  const [chLoading, setChLoading] = useState(false);

  const [activeView, setActiveView] = useState("overview");

  const [myChallenges, setMyChallenges] = useState([]);
  const [myLoading, setMyLoading] = useState(false);
  const [myError, setMyError] = useState(null);

  const [selectedChallengeId, setSelectedChallengeId] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [startError, setStartError] = useState(null);

  const [submissionText, setSubmissionText] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const [submissions, setSubmissions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState(null);

  const [reviewAttemptId, setReviewAttemptId] = useState(null);
  const [reviewGrade, setReviewGrade] = useState("");
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const closeReview = () => {
    setReviewAttemptId(null);
    setReviewError(null);
    setReviewSuccess(null);
    // /  ,   ,   — :
    // setReviewGrade("");
    // setReviewFeedback("");
  };

  const [chTitle, setChTitle] = useState("");
  const [chDescription, setChDescription] = useState("");
  const [chType, setChType] = useState("academic");
  const [chDifficulty, setChDifficulty] = useState("");
  const [chRewardCredits, setChRewardCredits] = useState("");
  const [chRewardAmount, setChRewardAmount] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

  const [mtTitle, setMtTitle] = useState("");
  const [mtDescription, setMtDescription] = useState("");
  const [mtDifficulty, setMtDifficulty] = useState("");
  const [mtRewardCredits, setMtRewardCredits] = useState("");
  const [mtRewardAmount, setMtRewardAmount] = useState("");
  const [mtCreateLoading, setMtCreateLoading] = useState(false);
  const [mtCreateError, setMtCreateError] = useState(null);
  const [mtCreateSuccess, setMtCreateSuccess] = useState(null);

  const [microtasks, setMicrotasks] = useState([]);
  const [mtLoading, setMtLoading] = useState(false);
  const [mtError, setMtError] = useState(null);

  const [myMicrotasks, setMyMicrotasks] = useState([]);
  const [myMtLoading, setMyMtLoading] = useState(false);
  const [myMtError, setMyMtError] = useState(null);

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

  const [selectedMicrotaskForApps, setSelectedMicrotaskForApps] =
    useState(null);
  const [mtApps, setMtApps] = useState([]);
  const [mtAppsLoading, setMtAppsLoading] = useState(false);
  const [mtAppsError, setMtAppsError] = useState(null);
  const [mtStatusLoadingId, setMtStatusLoadingId] = useState(null);
  const [mtStatusError, setMtStatusError] = useState(null);

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

  //  
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

  // Submissions   —  teacher/company/admin
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

  // My challenges (student)
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

  // My microtasks (student)
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

  const isStudent = user.role === "student";

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
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

      setMtTitle("");
      setMtDescription("");
      setMtDifficulty("");
      setMtRewardCredits("");
      setMtRewardAmount("");

      try {
        const data = await getMicrotasks(token);
        setMicrotasks(data);
      } catch {
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
    setStartError(null);
    setActiveView("challenge-details");
  };

  const handleStartChallenge = async () => {
    if (!token || !selectedChallengeId) return;

    setStartError(null);
    try {
      await startChallenge(token, selectedChallengeId);
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

      if (isStudent) {
        try {
          const data = await getMyMicrotasks(token);
          setMyMicrotasks(data);
        } catch {
          // ignore
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
        } catch {
          // ignore
        }
      }
    } catch (err) {
      setResultError(err.message);
    } finally {
      setResultLoading(false);
    }
  };

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

  const renderContent = () => {
    if (activeView === "overview") {
      return (
        <OverviewSection
          challengesForOverview={challengesForOverview}
          chLoading={chLoading}
          chError={chError}
          openChallengeDetails={openChallengeDetails}
        />
      );
    }

    if (activeView === "profile") {
      return (
        <ProfileSection
          isStudent={isStudent}
          myChallenges={myChallenges}
          myLoading={myLoading}
          myError={myError}
          openChallengeDetails={openChallengeDetails}
        />
      );
    }

    if (activeView === "microtasks") {
      return (
        <MicrotasksSection
          isStudent={isStudent}
          userRole={user.role}
          microtasks={microtasks}
          mtLoading={mtLoading}
          mtError={mtError}
          myMicrotasks={myMicrotasks}
          myMtLoading={myMtLoading}
          myMtError={myMtError}
          applyMicrotaskId={applyMicrotaskId}
          setApplyMicrotaskId={setApplyMicrotaskId}
          applicationText={applicationText}
          setApplicationText={setApplicationText}
          applyLoading={applyLoading}
          applyError={applyError}
          applySuccess={applySuccess}
          handleApplySubmit={handleApplySubmit}
          resultForAppId={resultForAppId}
          setResultForAppId={setResultForAppId}
          resultText={resultText}
          setResultText={setResultText}
          resultLink={resultLink}
          setResultLink={setResultLink}
          resultLoading={resultLoading}
          resultError={resultError}
          resultSuccess={resultSuccess}
          handleSubmitMicrotaskResult={handleSubmitMicrotaskResult}
          selectedMicrotaskForApps={selectedMicrotaskForApps}
          setSelectedMicrotaskForApps={setSelectedMicrotaskForApps}
          mtApps={mtApps}
          mtAppsLoading={mtAppsLoading}
          mtAppsError={mtAppsError}
          mtStatusLoadingId={mtStatusLoadingId}
          mtStatusError={mtStatusError}
          loadApplicationsForMicrotask={loadApplicationsForMicrotask}
          handleUpdateApplicationStatus={handleUpdateApplicationStatus}
          setApplyError={setApplyError}
          setApplySuccess={setApplySuccess}
          setResultError={setResultError}
          setResultSuccess={setResultSuccess}
        />
      );
    }

    if (activeView === "my-challenges") {
      return (
        <MyChallengesSection
          myChallenges={myChallenges}
          myLoading={myLoading}
          myError={myError}
          openChallengeDetails={openChallengeDetails}
        />
      );
    }

    if (activeView === "create-challenge") {
      return (
        <CreateChallengeSection
          canCreate={canCreate}
          chTitle={chTitle}
          setChTitle={setChTitle}
          chDescription={chDescription}
          setChDescription={setChDescription}
          chType={chType}
          setChType={setChType}
          chDifficulty={chDifficulty}
          setChDifficulty={setChDifficulty}
          chRewardCredits={chRewardCredits}
          setChRewardCredits={setChRewardCredits}
          chRewardAmount={chRewardAmount}
          setChRewardAmount={setChRewardAmount}
          createLoading={createLoading}
          createError={createError}
          createSuccess={createSuccess}
          handleCreateChallenge={handleCreateChallenge}
        />
      );
    }

    if (activeView === "create-microtask") {
      return (
        <CreateMicrotaskSection
          canCreate={canCreate}
          mtTitle={mtTitle}
          setMtTitle={setMtTitle}
          mtDescription={mtDescription}
          setMtDescription={setMtDescription}
          mtDifficulty={mtDifficulty}
          setMtDifficulty={setMtDifficulty}
          mtRewardCredits={mtRewardCredits}
          setMtRewardCredits={setMtRewardCredits}
          mtRewardAmount={mtRewardAmount}
          setMtRewardAmount={setMtRewardAmount}
          mtCreateLoading={mtCreateLoading}
          mtCreateError={mtCreateError}
          mtCreateSuccess={mtCreateSuccess}
          handleCreateMicrotask={handleCreateMicrotask}
        />
      );
    }

    if (activeView === "challenge-details") {
      return (
        <ChallengeDetailsSection
          isStudent={isStudent}
          userRole={user.role}
          selectedChallenge={selectedChallenge}
          detailsLoading={detailsLoading}
          detailsError={detailsError}
          goBackToOverview={goBackToOverview}
          startError={startError}
          handleStartChallenge={handleStartChallenge}
          hasAttempt={hasAttempt}
          myAttemptStatus={myAttemptStatus}
          currentStudentAttempt={currentStudentAttempt}
          submissionText={submissionText}
          setSubmissionText={setSubmissionText}
          submissionLink={submissionLink}
          setSubmissionLink={setSubmissionLink}
          submitLoading={submitLoading}
          submitError={submitError}
          submitSuccess={submitSuccess}
          handleSubmitSolution={handleSubmitSolution}
          submissions={submissions}
          subsLoading={subsLoading}
          subsError={subsError}
          startReview={startReview}
          reviewAttemptId={reviewAttemptId}
          reviewGrade={reviewGrade}
          setReviewGrade={setReviewGrade}
          reviewFeedback={reviewFeedback}
          setReviewFeedback={setReviewFeedback}
          reviewLoading={reviewLoading}
          reviewError={reviewError}
          reviewSuccess={reviewSuccess}
          handleReviewSubmit={handleReviewSubmit}
          closeReview={closeReview}
        />
      );
    }

    if (activeView === "rating" || activeView === "portfolio") {
      return (
        <section className="content-section">
          <div className="content-header">
            <div>
              <h1>Section under development</h1>
              <p>      .</p>
            </div>
          </div>
        </section>
      );
    }

    return (
      <OverviewSection
        challengesForOverview={challengesForOverview}
        chLoading={chLoading}
        chError={chError}
        openChallengeDetails={openChallengeDetails}
      />
    );
  };

  return (
    <DashboardLayout
      user={user}
      isStudent={isStudent}
      canCreate={canCreate}
      activeView={activeView}
      setActiveView={setActiveView}
      onLogout={handleLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
