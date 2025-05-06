import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/configs/connectDB';
import { initRoutes } from './src/routes/index';
import "./src/passport/index"
import Course from './src/models/Course';
import Lesson from './src/models/Lesson';
import path from 'path';
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));
app.use(cookieParser())
app.use('/static', express.static(path.join(__dirname, './assets/images')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
initRoutes(app)
// async function seedData() {


//     // 1. Tạo Course
//     const course = await Course.create({
//         title: "English Speaking Basics",
//         description: "A beginner-level course to practice basic English speaking skills.",
//         level: "beginner",
//         thumbnail: "https://app.talkpal.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FSentenceMode.dd5d65d9.jpg&w=1200&q=100"
//     });

//     // 2. Tạo Lessons thuộc Course trên
//     await Lesson.insertMany([
//         {
//             courseId: course._id,
//             title: "Speaking: Daily Greetings",
//             type: "speaking",
//             content: "Listen to short dialogues where people greet each other in daily life.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/making_friends_with_new_employee_.jpg"
//         },
//         {
//             courseId: course._id,
//             title: "Speaking: At the Market",
//             type: "speaking",
//             content: "Understand conversations between buyers and sellers in a local market.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/at_a_supermarket.jpg"
//         },
//         {
//             courseId: course._id,
//             title: "Speaking: Making a Phone Call",
//             type: "speaking",
//             content: "Learn common phrases used in phone conversations.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/customer_support_chat.jpg"
//         },
//         {
//             courseId: course._id,
//             title: "Speaking: Ordering at a Restaurant",
//             type: "speaking",
//             content: "Listen to people order food and drinks at a restaurant.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/ordering_food_in_a_restaurant.jpg"
//         },
//         {
//             courseId: course._id,
//             title: "Speaking: Visiting the Doctor",
//             type: "speaking",
//             content: "Conversations about health issues and appointments with a doctor.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/at_a_doctor.jpg"
//         }
//     ]);

//     console.log("✅ Seed dữ liệu thành công");
// }

// seedData().catch(console.error);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})