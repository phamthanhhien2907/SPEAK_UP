import { Application } from "express";
import userRoute from './user'
import courseRoute from './course'
import enrollmentRoute from './enrollment'
import exerciseVocabularyRoute from './exerciseVocabulary'
import exerciseRoute from './exercise'
import feedbackRoute from './feedback'
import historyRoute from './history'
import lessonRoute from './lesson'
import lessonProgressRoute from './lessonProgress'
import progressTrackingRoute from './progressTracking'
import vocabularyRoute from './vocabulary'
import authRoute from './auth'
import pronunciationScoreRoute from './pronunciationScore'


export const initRoutes = (app: Application) => {
    app.use("/api/auth", authRoute);
    app.use("/api/users", userRoute);
    app.use("/api/courses", courseRoute);
    app.use("/api/vocabulary", vocabularyRoute);
    app.use("/api/history", historyRoute);
    app.use("/api/lessonProgress", lessonProgressRoute);
    app.use("/api/lesson", lessonRoute);
    app.use("/api/exercise", exerciseRoute);
    app.use("/api/exerciseVocabulary", exerciseVocabularyRoute);
    app.use("/api/feedback", feedbackRoute);
    app.use("/api/enrollment", enrollmentRoute);
    app.use("/api/progressTracking", progressTrackingRoute);
    app.use("/api/pronunciationScore", pronunciationScoreRoute);

};

