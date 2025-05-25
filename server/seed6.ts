import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Course from "./src/models/Course";
import Topic from "./src/models/Topic";
import Lesson, { ILesson, ILessonInput } from "./src/models/Lesson";
import LessonProgress from "./src/models/LessonProgress";
import Vocabulary from "./src/models/Vocabulary";
import Exercise from "./src/models/Exercise";
import History from "./src/models/History";
import ExerciseVocabulary from "./src/models/ExerciseVocabulary";

interface VocabularyItem {
    word: string;
    phonetic?: string;
    meaning: string;
    exampleSentence: string;
    sound: string;
    audioUrl?: string;
    isCorrect: boolean;
    pairOrder: number;
}

interface IVocabularyDoc {
    _id: mongoose.Types.ObjectId;
    lessonId: mongoose.Types.ObjectId;
}

interface IExerciseDoc {
    _id: mongoose.Types.ObjectId;
    lessonId: mongoose.Types.ObjectId;
}

dotenv.config();

// Utility to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cache for API results
const wordCache: { [word: string]: VocabularyItem } = {};

// Retry mechanism for API calls with exponential backoff
const fetchWithRetry = async (url: string, retries = 3, backoff = 3000): Promise<any> => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url);
            return response;
        } catch (error: any) {
            if (error.response && error.response.status === 429) {
                const waitTime = backoff * Math.pow(2, i);
                console.warn(`Rate limit hit for ${url}, retrying after ${waitTime}ms...`);
                await delay(waitTime);
            } else {
                throw error;
            }
        }
    }
    throw new Error(`Failed to fetch ${url} after ${retries} retries`);
};

const fetchWord = async (word: string, sound: string, isCorrect: boolean, pairOrder: number): Promise<VocabularyItem> => {
    if (wordCache[word]) {
        return { ...wordCache[word], sound, isCorrect, pairOrder };
    }

    try {
        const response = await fetchWithRetry(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = response.data[0];
        const phonetic = data.phonetic || data.phonetics?.[0]?.text || "";
        const audioUrl = data.phonetics?.find((p: any) => p.audio)?.audio || "";
        const meanings = data.meanings || [];
        const meaning = meanings.length > 0 ? meanings[0].definitions[0].definition : "No definition available";
        const example = meanings.length > 0 ? meanings[0].definitions[0].example || `${word} in a sentence.` : `${word} in a sentence.`;

        const vocabItem: VocabularyItem = {
            word,
            phonetic,
            meaning,
            exampleSentence: example,
            sound,
            audioUrl,
            isCorrect,
            pairOrder,
        };

        wordCache[word] = vocabItem;
        return vocabItem;
    } catch (error: any) {
        console.warn(`Failed to fetch ${word}, using mock data:`, error.message);
        const mockItem: VocabularyItem = {
            word,
            phonetic: `/${word}/`,
            meaning: `${word} meaning`,
            exampleSentence: `${word} in a sentence.`,
            sound,
            audioUrl: `https://example.com/audio/${word}.mp3`,
            isCorrect,
            pairOrder,
        };
        wordCache[word] = mockItem;
        return mockItem;
    }
};

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI as string, {
        dbName: "speak-up-test",
    });
    console.log("Connected to MongoDB");

    // // Clear existing data
    // await Promise.all([
    //     Course.deleteMany({}),
    //     Topic.deleteMany({}),
    //     Lesson.deleteMany({}),
    //     LessonProgress.deleteMany({}),
    //     Vocabulary.deleteMany({}),
    //     Exercise.deleteMany({}),
    //     History.deleteMany({}),
    //     ExerciseVocabulary.deleteMany({}),
    // ]);

    // Create course
    const course = await Course.create({
        title: "English Speaking and Vocabulary",
        description: "Master English speaking, vocabulary, and everyday communication skills",
        level: "beginner",
        thumbnail: "https://via.placeholder.com/600x400",
        createdAt: new Date("2025-05-25T00:06:00.000Z"),
        updatedAt: new Date("2025-05-25T00:06:00.000Z"),
    });

    // Create topics (based on original parent lessons)
    const topicsData = [
        { title: "Basic", content: "Foundational English skills", type: "speaking" as const, level: 1, totalLessons: 33 },
        { title: "Introductory English", content: "English Articles", type: "speaking" as const, level: 1, totalLessons: 20 },
        { title: "Lifestyle", content: "Articles", type: "speaking" as const, level: 1, totalLessons: 20 },
        { title: "Small Talk", content: "Let's Study", type: "speaking" as const, level: 1, totalLessons: 42 },
        { title: "Work and Career", content: "English Basics", type: "speaking" as const, level: 1, totalLessons: 50 },
        { title: "Education", content: "Mr. Salas' Common Word Endings Challenge", type: "pronunciation" as const, level: 1, totalLessons: 28 },
        { title: "Holidays", content: "Dajiro's Silent Letter Challenge", type: "pronunciation" as const, level: 1, totalLessons: 30 },
        { title: "Relationship", content: "Suffixes with Maria", type: "vocabulary" as const, level: 1, totalLessons: 42 },
        { title: "Health", content: "Keith's IELTS Speaking Part 3 Challenge", type: "speaking" as const, level: 1, totalLessons: 15 },
        { title: "Video Call", content: "Everyday Contractions", type: "speaking" as const, level: 1, totalLessons: 15 },
        { title: "Using Informal English", content: "Common Slang", type: "vocabulary" as const, level: 1, totalLessons: 15 },
        { title: "Video Lesson", content: "Common English Slang", type: "vocabulary" as const, level: 1, totalLessons: 15 },
        { title: "Other", content: "Grammar Foundations", type: "speaking" as const, level: 1, totalLessons: 15 },
        { title: "Influencers", content: "Hey! What's Up?", type: "speaking" as const, level: 1, totalLessons: 15 },
        { title: "Grammar", content: "Grammar Foundations", type: "speaking" as const, level: 1, totalLessons: 15 },
    ].map(topic => ({
        courseId: course._id,
        title: topic.title,
        content: topic.content,
        type: topic.type,
        level: topic.level,
        thumbnail: `https://via.placeholder.com/300x200?text=${topic.title}`,
        totalLessons: topic.totalLessons,
        createdAt: new Date("2025-05-25T00:06:00.000Z"),
        updatedAt: new Date("2025-05-25T00:06:00.000Z"),
    }));

    const topics = await Topic.insertMany(topicsData) as any[];

    // Create lessons (sub-lessons under topics)
    const lessonsData: ILessonInput[] = [];

    // Sub-lessons for "Basic" topic
    const basicTopic = topics.find(t => t.title === "Basic")!;
    const basicSubLessons = [
        { title: "Revisiting Everyday Conversations", content: "Lessons focusing on revisiting everyday conversations.", type: "speaking" as const, totalLessons: 33 },
        { title: "English Articles", content: "Lessons focusing on English articles.", type: "speaking" as const, totalLessons: 20 },
        { title: "Articles", content: "Lessons focusing on articles.", type: "speaking" as const, totalLessons: 20 },
        { title: "English Basics", content: "Lessons focusing on English basics.", type: "speaking" as const, totalLessons: 50 },
        { title: "Mr. Salas' Common Word Endings Challenge", content: "Lessons focusing on common word endings challenge.", type: "pronunciation" as const, totalLessons: 28 },
        { title: "Dajiro's Silent Letter Challenge", content: "Lessons focusing on silent letter challenge.", type: "pronunciation" as const, totalLessons: 30 },
        { title: "Suffixes with Maria", content: "Lessons focusing on suffixes.", type: "vocabulary" as const, totalLessons: 42 },
        { title: "Keith's IELTS Speaking Part 3 Challenge", content: "Lessons focusing on IELTS speaking part 3.", type: "speaking" as const, totalLessons: 15 },
        { title: "Everyday Contractions", content: "Lessons focusing on everyday contractions.", type: "speaking" as const, totalLessons: 15 },
        { title: "Common Slang", content: "Lessons focusing on common slang.", type: "vocabulary" as const, totalLessons: 15 },
    ];

    for (const subLesson of basicSubLessons) {
        lessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentTopicId: basicTopic._id,
            title: subLesson.title,
            content: subLesson.content,
            type: subLesson.type,
            category: "Basics",
            level: 1,
            thumbnail: `https://via.placeholder.com/300x200?text=${subLesson.title}`,
            createdAt: new Date("2025-05-25T00:06:00.000Z"),
            updatedAt: new Date("2025-05-25T00:06:00.000Z"),
        });
    }

    // Sub-sub-lessons for "Revisiting Everyday Conversations"
    const revisitingEverydayConversationsSubLessons = [
        "Lesson 1 - Can you hear the difference?",
        "Lesson 2 - Can you stress these words?",
        "Lesson 3 - Mastering Greetings and First Impressions",
        "Lesson 4 - Greetings and Introductions",
        "Lesson 5 - Building Bridges",
        "Lesson 6 - Doing e-Greetings!",
        "Lesson 7 - Can you stress the right words?",
        "Lesson 8 - Asking for directions",
        "Lesson 9 - The 5 Do's for Communication",
        "Lesson 10 - Unscramble the words",
        ...Array.from({ length: 23 }, (_, i) => `Lesson ${i + 11} - Practice Everyday Conversation ${i + 1}`),
    ];

    // First, insert the initial lessons to get the ID for "Revisiting Everyday Conversations"
    const initialLessons = await Lesson.insertMany(lessonsData) as unknown as ILesson[];
    const revisitingEverydayConversationsLesson = initialLessons.find(l => l.title === "Revisiting Everyday Conversations" && (l.parentTopicId as mongoose.Types.ObjectId).equals(basicTopic._id))!;
    if (!revisitingEverydayConversationsLesson) {
        throw new Error("Revisiting Everyday Conversations lesson not found");
    }
    // Now add sub-sub-lessons
    const subSubLessons: ILessonInput[] = [];
    for (const title of revisitingEverydayConversationsSubLessons) {
        subSubLessons.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentTopicId: basicTopic._id,
            parentLessonId: revisitingEverydayConversationsLesson._id as mongoose.Types.ObjectId,
            title: title,
            content: `Practice ${title.toLowerCase()}.`,
            type: title.includes("stress") ? "pronunciation" as const : "speaking" as const,
            category: "Basics",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-25T00:06:00.000Z"),
            updatedAt: new Date("2025-05-25T00:06:00.000Z"),
        });
    }

    // Placeholder sub-lessons for other topics
    const remainingTopics = [
        { title: "Introductory English", total: 20, type: "speaking" as const },
        { title: "Lifestyle", total: 20, type: "speaking" as const },
        { title: "Small Talk", total: 42, type: "speaking" as const },
        { title: "Work and Career", total: 50, type: "speaking" as const },
        { title: "Education", total: 28, type: "pronunciation" as const },
        { title: "Holidays", total: 30, type: "pronunciation" as const },
        { title: "Relationship", total: 42, type: "vocabulary" as const },
        { title: "Health", total: 15, type: "speaking" as const },
        { title: "Video Call", total: 15, type: "speaking" as const },
        { title: "Using Informal English", total: 15, type: "vocabulary" as const },
        { title: "Video Lesson", total: 15, type: "vocabulary" as const },
        { title: "Other", total: 15, type: "speaking" as const },
        { title: "Influencers", total: 15, type: "speaking" as const },
        { title: "Grammar", total: 15, type: "speaking" as const },
    ];

    for (const topic of remainingTopics) {
        const parentTopic = topics.find(t => t.title === topic.title)!;
        subSubLessons.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentTopicId: parentTopic._id,
            title: `${topic.title} Lesson 1`,
            content: `Practice ${topic.title.toLowerCase()} concepts.`,
            type: topic.type,
            category: "Basics",
            level: 1,
            thumbnail: `https://via.placeholder.com/300x200?text=${topic.title} Lesson 1`,
            createdAt: new Date("2025-05-25T00:06:00.000Z"),
            updatedAt: new Date("2025-05-25T00:06:00.000Z"),
        });
    }

    const additionalLessons = await Lesson.insertMany(subSubLessons) as unknown as ILesson[];
    const lessons = [...initialLessons, ...additionalLessons];

    // Define realistic vocabulary data
    const vocabularyData: Array<{
        lessonId: mongoose.Types.ObjectId;
        word: string;
        phonetic?: string;
        meaning: string;
        exampleSentence: string;
        audioUrl: string;
        pairOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }> = [];
    const exercisesData: Array<{
        lessonId: mongoose.Types.ObjectId;
        type: "repeat_sentence" | "fill_in_blank" | "pronunciation" | "listening";
        prompt: string;
        correctPronunciation: string;
        difficultyLevel: "easy" | "medium" | "hard";
        createdAt: Date;
        updatedAt: Date;
    }> = [];

    // Track words by lessonId to avoid duplicates
    const wordsByLesson = new Map<string, Set<string>>();

    for (const lesson of lessons) {
        const lessonId = lesson?._id?.toString() as string;
        if (!wordsByLesson.has(lessonId)) {
            wordsByLesson.set(lessonId, new Set<string>());
        }
        const lessonWords = wordsByLesson.get(lessonId)!;

        // Vocabulary and exercises for specific lessons
        if (lesson.title === "Lesson 2 - Can you stress these words?") {
            const stressWords = [
                await fetchWord("communication", "", true, 0),
                await fetchWord("education", "", true, 1),
                await fetchWord("information", "", true, 2),
            ];
            for (const vocab of stressWords) {
                if (!lessonWords.has(vocab.word)) {
                    vocabularyData.push({
                        lessonId: lesson._id as mongoose.Types.ObjectId,
                        word: vocab.word,
                        phonetic: vocab.phonetic,
                        meaning: vocab.meaning,
                        exampleSentence: vocab.exampleSentence,
                        audioUrl: vocab.audioUrl || `https://api.dictionaryapi.dev/media/pronunciations/en/${vocab.word}-us.mp3`,
                        pairOrder: vocab.pairOrder,
                        createdAt: new Date("2025-05-25T00:06:00.000Z"),
                        updatedAt: new Date("2025-05-25T00:06:00.000Z"),
                    });
                    lessonWords.add(vocab.word);
                }
            }
            exercisesData.push({
                lessonId: lesson._id as mongoose.Types.ObjectId,
                type: "pronunciation",
                prompt: `Practice stressing the words: ${stressWords.map(v => v.word).join(", ")}`,
                correctPronunciation: stressWords.map(v => v.phonetic).join(" / "),
                difficultyLevel: "easy",
                createdAt: new Date("2025-05-25T00:06:00.000Z"),
                updatedAt: new Date("2025-05-25T00:06:00.000Z"),
            });
        } else if (lesson.title === "Lesson 3 - Mastering Greetings and First Impressions") {
            const greetingsWords = [
                await fetchWord("hello", "", true, 0),
                await fetchWord("hi", "", true, 1),
                await fetchWord("goodbye", "", true, 2),
            ];
            for (const vocab of greetingsWords) {
                if (!lessonWords.has(vocab.word)) {
                    vocabularyData.push({
                        lessonId: lesson._id as mongoose.Types.ObjectId,
                        word: vocab.word,
                        phonetic: vocab.phonetic,
                        meaning: vocab.meaning,
                        exampleSentence: vocab.exampleSentence,
                        audioUrl: vocab.audioUrl || `https://api.dictionaryapi.dev/media/pronunciations/en/${vocab.word}-us.mp3`,
                        pairOrder: vocab.pairOrder,
                        createdAt: new Date("2025-05-25T00:06:00.000Z"),
                        updatedAt: new Date("2025-05-25T00:06:00.000Z"),
                    });
                    lessonWords.add(vocab.word);
                }
            }
            exercisesData.push({
                lessonId: lesson._id as mongoose.Types.ObjectId,
                type: "repeat_sentence",
                prompt: `Repeat the greetings: ${greetingsWords.map(v => v.word).join(", ")}`,
                correctPronunciation: greetingsWords.map(v => v.phonetic).join(" / "),
                difficultyLevel: "easy",
                createdAt: new Date("2025-05-25T00:06:00.000Z"),
                updatedAt: new Date("2025-05-25T00:06:00.000Z"),
            });
        } else if (lesson.title === "Mr. Salas' Common Word Endings Challenge") {
            const endingWords = [
                await fetchWord("stop", "", true, 0),
                await fetchWord("run", "", true, 1),
                await fetchWord("sing", "", true, 2),
            ];
            for (const vocab of endingWords) {
                if (!lessonWords.has(vocab.word)) {
                    vocabularyData.push({
                        lessonId: lesson._id as mongoose.Types.ObjectId,
                        word: vocab.word,
                        phonetic: vocab.phonetic,
                        meaning: vocab.meaning,
                        exampleSentence: vocab.exampleSentence,
                        audioUrl: vocab.audioUrl || `https://api.dictionaryapi.dev/media/pronunciations/en/${vocab.word}-us.mp3`,
                        pairOrder: vocab.pairOrder,
                        createdAt: new Date("2025-05-25T00:06:00.000Z"),
                        updatedAt: new Date("2025-05-25T00:06:00.000Z"),
                    });
                    lessonWords.add(vocab.word);
                }
            }
            exercisesData.push({
                lessonId: lesson._id as mongoose.Types.ObjectId,
                type: "pronunciation",
                prompt: `Practice the word endings: ${endingWords.map(v => v.word).join(", ")}`,
                correctPronunciation: endingWords.map(v => v.phonetic).join(" / "),
                difficultyLevel: "medium",
                createdAt: new Date("2025-05-25T00:06:00.000Z"),
                updatedAt: new Date("2025-05-25T00:06:00.000Z"),
            });
        }
    }

    // Insert vocabulary and exercises
    let vocabularies: IVocabularyDoc[] = [];
    try {
        vocabularies = await Vocabulary.insertMany(vocabularyData, { ordered: false }) as IVocabularyDoc[];
    } catch (error: any) {
        console.error("Error inserting vocabularies:", error.message);
    }

    let exercises: IExerciseDoc[] = [];
    try {
        exercises = await Exercise.insertMany(exercisesData) as IExerciseDoc[];
    } catch (error: any) {
        console.error("Error inserting exercises:", error.message);
    }

    // Create ExerciseVocabulary and History
    const exerciseVocabularyData: Array<{
        exerciseId: mongoose.Types.ObjectId;
        vocabularyId: mongoose.Types.ObjectId;
        createdAt: Date;
        updatedAt: Date;
    }> = [];
    const historyData: Array<{
        userId: mongoose.Types.ObjectId;
        lessonId: mongoose.Types.ObjectId;
        exerciseId: mongoose.Types.ObjectId;
        attempts: number;
        lastAttemptAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }> = [];
    const userId = new mongoose.Types.ObjectId("6814e1d4f941dc16637b6235");

    for (let i = 0; i < exercises.length; i++) {
        const lessonVocabs = vocabularies.filter(v => {
            if (v.lessonId instanceof mongoose.Types.ObjectId && exercises[i].lessonId instanceof mongoose.Types.ObjectId) {
                return v.lessonId.equals(exercises[i].lessonId);
            }
            return false;
        });

        for (const vocab of lessonVocabs) {
            exerciseVocabularyData.push({
                exerciseId: exercises[i]._id as mongoose.Types.ObjectId,
                vocabularyId: vocab._id as mongoose.Types.ObjectId,
                createdAt: new Date("2025-05-25T00:06:00.000Z"),
                updatedAt: new Date("2025-05-25T00:06:00.000Z"),
            });
        }

        historyData.push({
            userId,
            lessonId: exercises[i].lessonId as mongoose.Types.ObjectId,
            exerciseId: exercises[i]._id as mongoose.Types.ObjectId,
            attempts: 2,
            lastAttemptAt: new Date("2025-05-25T00:06:00.000Z"),
            createdAt: new Date("2025-05-25T00:06:00.000Z"),
            updatedAt: new Date("2025-05-25T00:06:00.000Z"),
        });
    }

    await Promise.all([
        ExerciseVocabulary.insertMany(exerciseVocabularyData),
        History.insertMany(historyData),
    ]);

    // Create LessonProgress
    const userIdProgress = new mongoose.Types.ObjectId("6814e1d4f941dc16637b6235");
    const progressData = lessons.map(lesson => ({
        lessonId: lesson._id as mongoose.Types.ObjectId,
        userId: userIdProgress,
        score: 0,
        createdAt: new Date("2025-05-25T00:06:00.000Z"),
        updatedAt: new Date("2025-05-25T00:06:00.000Z"),
    }));

    await LessonProgress.insertMany(progressData);

    console.log("Seed completed successfully");
    await mongoose.connection.close();
};

seed().catch(err => {
    console.error(err);
    process.exit(1);
});