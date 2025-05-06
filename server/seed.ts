import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./src/models/Course";
import Lesson from "./src/models/Lesson";
import LessonProgress from "./src/models/LessonProgress";

dotenv.config();

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI as string, {
        dbName: "speak-up",
    });
    console.log("Connected to MongoDB");

    // Xóa dữ liệu cũ để tránh trùng lặp
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await LessonProgress.deleteMany({});

    // Tạo khóa học
    const course = await Course.create({
        _id: new mongoose.Types.ObjectId("6819c20302afe322ee61b1d2"),
        title: "English Pronunciation with IPA",
        description: "Master English pronunciation using the International Phonetic Alphabet",
        level: "beginner",
        thumbnail: "https://dummyimage.com/600x400/000/fff",
        createdAt: new Date("2025-05-06T08:02:11.316Z"),
        updatedAt: new Date("2025-05-06T08:02:11.316Z"),
    });

    // Tạo các bài học cha dựa trên IPA
    const parentLessonsData = [
        { _id: new mongoose.Types.ObjectId("6819b3cb7f4870fcf2e98dd7"), title: "Ending Sounds", content: "Practice consonant sounds at the end of words", type: "pronunciation", level: 1, thumbnail: "http://localhost:8080/static/circle.png" },
        { _id: new mongoose.Types.ObjectId("6819c20302afe322ee61b1d4"), title: "/iː/ vs /ɪ/", content: "Distinguish between long /iː/ and short /ɪ/ vowel sounds", type: "pronunciation", level: 1, thumbnail: "http://localhost:8080/static/circle_1.png" },
        { _id: new mongoose.Types.ObjectId("6819b3cb7f4870fcf2e98dd9"), title: "/æ/, /ʌ/, /ɑː/", content: "Practice the vowel sounds /æ/, /ʌ/, and /ɑː/", type: "pronunciation", level: 1, thumbnail: "http://localhost:8080/static/circle_2.png" },
        { _id: new mongoose.Types.ObjectId("6819b3cb7f4870fcf2e98dda"), title: "/ð/ vs /θ/", content: "Distinguish between voiced /ð/ and voiceless /θ/ sounds", type: "pronunciation", level: 1, thumbnail: "http://localhost:8080/static/circle_3.png" },
        { _id: new mongoose.Types.ObjectId("6819b3cb7f4870fcf2e98ddb"), title: "/r/, /z/, /ʃ/", content: "Practice the consonant sounds /r/, /z/, and /ʃ/", type: "pronunciation", level: 1, thumbnail: "http://localhost:8080/static/circle_4.png" },
        { _id: new mongoose.Types.ObjectId("6819b3cb7f4870fcf2e98ddc"), title: "Intonation", content: "Learn English intonation patterns", type: "pronunciation", level: 1, thumbnail: "http://localhost:8080/static/circle_5.png" },
        { _id: new mongoose.Types.ObjectId("6819c20302afe322ee61b1d6"), title: "Longer Words", content: "Practice pronunciation of longer words and phrases", type: "pronunciation", level: 2, thumbnail: "http://localhost:8080/static/circle_6.png" },
    ];

    const parentLessons = await Lesson.insertMany(parentLessonsData.map(lesson => ({
        ...lesson,
        courseId: course._id,
        thumbnail: course?.thumbnail,
        createdAt: new Date("2025-05-06T08:02:11.316Z"),
        updatedAt: new Date("2025-05-06T08:02:11.316Z"),
    })));

    // Tạo bài học con với nội dung IPA nghiêm túc
    const subLessonsData = [];

    // "Ending Sounds" - 38 bài con (phụ âm cuối)
    const endingSounds = ["/p/", "/b/", "/t/", "/d/", "/k/", "/g/", "/f/", "/v/", "/θ/", "/ð/", "/s/", "/z/", "/ʃ/", "/ʒ/", "/h/", "/tʃ/", "/dʒ/", "/m/", "/n/", "/ŋ/"];
    for (let i = 0; i < 38; i++) {
        const sound = endingSounds[i % endingSounds.length];
        subLessonsData.push({
            courseId: course._id,
            parentLessonId: parentLessons[0]._id,
            title: `Lesson ${i + 1} - Ending Sound ${sound}`,
            content: `Practice words ending with ${sound}: e.g., "stop" (/stɒp/) for /p/, "rub" (/rʌb/) for /b/.`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    // "/iː/ vs /ɪ/" - 14 bài con
    const iSounds = [
        "Listen and distinguish /iː/ vs /ɪ/",
        "Words with /iː/: sheep, see, feel",
        "Words with /ɪ/: ship, sit, fill",
        "Minimal pairs: seat/sit, beat/bit",
        "Sentences with /iː/: She reads books.",
        "Sentences with /ɪ/: I sit here.",
        "Practice /iː/ in isolation",
        "Practice /ɪ/ in isolation",
        "Combine /iː/ and /ɪ/ in words",
        "Combine /iː/ and /ɪ/ in phrases",
        "Record yourself: /iː/ vs /ɪ/",
        "Feedback on /iː/ pronunciation",
        "Feedback on /ɪ/ pronunciation",
        "Review /iː/ and /ɪ/ together"
    ];
    for (let i = 0; i < 14; i++) {
        subLessonsData.push({
            courseId: course._id,
            parentLessonId: parentLessons[1]._id,
            title: `Lesson ${i + 1} - ${iSounds[i]}`,
            content: `Focus on ${iSounds[i].toLowerCase()}. Example: /iː/ in "see" (/siː/), /ɪ/ in "sit" (/sɪt/).`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    // "/æ/, /ʌ/, /ɑː/" - 7 bài con
    const aSounds = [
        "Introduction to /æ/, /ʌ/, /ɑː/",
        "Words with /æ/: cat, hat, bat",
        "Words with /ʌ/: cup, but, cut",
        "Words with /ɑː/: car, father, far",
        "Minimal pairs: cat/cut, car/cup",
        "Sentences practice",
        "Review and record"
    ];
    for (let i = 0; i < 7; i++) {
        subLessonsData.push({
            courseId: course._id,
            parentLessonId: parentLessons[2]._id,
            title: `Lesson ${i + 1} - ${aSounds[i]}`,
            content: `Practice ${aSounds[i].toLowerCase()}. Example: /æ/ in "cat" (/kæt/), /ʌ/ in "cup" (/kʌp/), /ɑː/ in "car" (/kɑːr/).`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    // "/ð/ vs /θ/" - 7 bài con
    const thSounds = [
        "Introduction to /ð/ vs /θ/",
        "Words with /θ/: think, bath, teeth",
        "Words with /ð/: this, mother, breathe",
        "Minimal pairs: think/this",
        "Sentences with /θ/",
        "Sentences with /ð/",
        "Review and record"
    ];
    for (let i = 0; i < 7; i++) {
        subLessonsData.push({
            courseId: course._id,
            parentLessonId: parentLessons[3]._id,
            title: `Lesson ${i + 1} - ${thSounds[i]}`,
            content: `Practice ${thSounds[i].toLowerCase()}. Example: /θ/ in "think" (/θɪŋk/), /ð/ in "this" (/ðɪs/).`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    // "/r/, /z/, /ʃ/" - 7 bài con
    const rzsSounds = [
        "Introduction to /r/, /z/, /ʃ/",
        "Words with /r/: red, car, run",
        "Words with /z/: zoo, buzz, nose",
        "Words with /ʃ/: shoe, wash, sure",
        "Minimal pairs: rose/rows",
        "Sentences practice",
        "Review and record"
    ];
    for (let i = 0; i < 7; i++) {
        subLessonsData.push({
            courseId: course._id,
            parentLessonId: parentLessons[4]._id,
            title: `Lesson ${i + 1} - ${rzsSounds[i]}`,
            content: `Practice ${rzsSounds[i].toLowerCase()}. Example: /r/ in "red" (/rɛd/), /z/ in "zoo" (/zuː/), /ʃ/ in "shoe" (/ʃuː/).`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    // "Intonation" - 5 bài con
    const intonationLessons = [
        "Introduction to English intonation",
        "Rising intonation: Yes/No questions",
        "Falling intonation: Statements",
        "Mixed intonation: Choice questions",
        "Practice and record"
    ];
    for (let i = 0; i < 5; i++) {
        subLessonsData.push({
            courseId: course._id,
            parentLessonId: parentLessons[5]._id,
            title: `Lesson ${i + 1} - ${intonationLessons[i]}`,
            content: `Practice ${intonationLessons[i].toLowerCase()}. Example: Rising in "Are you okay?" (/ɑːr jə ʊˈkeɪ/), Falling in "I’m fine." (/aɪm faɪn/).`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    // "Longer Words" - 2 bài con
    const longerWords = [
        "Practice basic longer words",
        "Practice phrases with longer words"
    ];
    for (let i = 0; i < 2; i++) {
        subLessonsData.push({
            courseId: course._id,
            parentLessonId: parentLessons[6]._id,
            title: `Lesson ${i + 1} - ${longerWords[i]}`,
            content: `Practice ${longerWords[i].toLowerCase()}. Example: "international" (/ˌɪntərˈnæʃənl/), "The weather is nice." (/ðə ˈwɛðər ɪz naɪs/).`,
            type: "pronunciation",
            level: 2,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.511Z"),
            updatedAt: new Date("2025-05-06T08:02:11.511Z"),
        });
    }

    const subLessons = await Lesson.insertMany(subLessonsData);

    // Tạo LessonProgress cho tất cả bài học con
    const userId = new mongoose.Types.ObjectId("6814e1d4f941dc16637b6235");
    const progressData = subLessons.map(lesson => ({
        lessonId: lesson._id,
        userId,
        score: 0,
        createdAt: new Date("2025-05-06T08:02:11.575Z"),
        updatedAt: new Date("2025-05-06T08:02:11.575Z"),
    }));

    await LessonProgress.insertMany(progressData);

    console.log("Seed completed successfully");
    await mongoose.connection.close();
};

seed().catch(err => {
    console.error(err);
    process.exit(1);
});