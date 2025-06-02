import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Course from "./src/models/Course";
import Topic from "./src/models/Topic";
import Lesson, { ILesson, ILessonInput } from "./src/models/Lesson";
import LessonProgress from "./src/models/LessonProgress";
import Vocabulary from "./src/models/Vocabulary";
import Exercise, { IExercise } from "./src/models/Exercise";
import History from "./src/models/History";
import ExerciseVocabulary from "./src/models/ExerciseVocabulary";

// --- INTERFACES ---
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
    word: string;
}

interface IExerciseDoc {
    _id: mongoose.Types.ObjectId;
    lessonId: mongoose.Types.ObjectId;
}
// NEW INTERFACE FOR EXERCISE CREATION DATA
interface IExerciseCreate {
    lessonId: mongoose.Types.ObjectId;
    type: "pronunciation" | "repeat_sentence" | "fill_in_blank"; // Restrict to known types
    prompt: string;
    correctPronunciation: string;
    difficultyLevel: "easy" | "medium" | "hard"; // Restrict to known levels
}

dotenv.config();

// --- UTILITIES ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const wordCache: { [word: string]: VocabularyItem } = {};

// --- API & DATA FETCHING ---
const fetchWithRetry = async (url: string, retries = 3, backoff = 3000): Promise<any> => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url);
            return response;
        } catch (error: any) {
            if (error.response && error.response.status === 429) {
                const waitTime = backoff * (i + 1);
                console.warn(`Rate limit hit for ${url}, retrying after ${waitTime}ms...`);
                await delay(waitTime);
            } else {
                // Don't re-throw for 404, just return null
                if (error.response && error.response.status === 404) {
                    return null;
                }
                throw error;
            }
        }
    }
    console.error(`Failed to fetch ${url} after ${retries} retries`);
    return null;
};

const fetchWord = async (wordOrPhrase: string, isCorrect: boolean, pairOrder: number): Promise<VocabularyItem> => {
    const normalizedTerm = wordOrPhrase.toLowerCase().trim();
    if (wordCache[normalizedTerm]) {
        return { ...wordCache[normalizedTerm], isCorrect, pairOrder };
    }

    let vocabItem: VocabularyItem | null = null;
    const isPhrase = normalizedTerm.includes(" ");

    // Custom mock data for specific phrases with ellipses
    const customPhrases: { [key: string]: { meaning: string; exampleSentence: string } } = {
        "i'm planning to exercise more this year.": {
            meaning: "Expressing an intention to undertake a new goal or resolution.",
            exampleSentence: "I'm planning to exercise more this year."
        },
        "my goal is to learn a new skill.": {
            meaning: "Stating a personal or professional objective.",
            exampleSentence: "My goal is to learn a new skill."
        },
        "i'll have the pasta with marinara sauce.": {
            meaning: "Ordering a specific item from a restaurant menu.",
            exampleSentence: "I'll have the pasta with marinara sauce."
        },
        "tell me about a time when you faced a challenge at work.": {
            meaning: "Responding to a behavioral interview question.",
            exampleSentence: "Tell me about a time when you faced a challenge at work."
        }
    };

    // Try fetching from dictionary API for single words
    if (!isPhrase) {
        try {
            const response = await fetchWithRetry(`https://api.dictionaryapi.dev/api/v2/entries/en/${normalizedTerm}`);
            if (response && response.data && response.data[0]) {
                const data = response.data[0];
                const phonetic = data.phonetic || data.phonetics?.find((p: any) => p.text)?.text || "";
                const audioUrl = data.phonetics?.find((p: any) => p.audio)?.audio || "";
                const meaning = data.meanings[0]?.definitions[0]?.definition || "No definition available.";
                const exampleSentence = data.meanings[0]?.definitions[0]?.example || `Use "${data.word}" in a sentence.`;
                vocabItem = { word: data.word, phonetic, meaning, exampleSentence, audioUrl, sound: "", isCorrect, pairOrder };
            }
        } catch (error: any) {
            // Error already logged in fetchWithRetry
        }
    }

    // If API fails or it's a phrase, use custom data or default mock
    if (!vocabItem) {
        vocabItem = {
            word: wordOrPhrase,
            phonetic: isPhrase ? "" : `/${normalizedTerm}/`,
            meaning: customPhrases[normalizedTerm]?.meaning || `The definition or usage context of "${wordOrPhrase}".`,
            exampleSentence: customPhrases[normalizedTerm]?.exampleSentence || `Here is an example using "${wordOrPhrase}".`,
            sound: "",
            audioUrl: "",
            isCorrect,
            pairOrder,
        };
    }

    wordCache[normalizedTerm] = vocabItem;
    return vocabItem;
};

// --- COMPREHENSIVE CURRICULUM DATA ---
// This structure mirrors the app's hierarchy based on UI.docx
const curriculum = [
    {
        title: "Work and Career",
        content: "Master English for professional environments, from meetings to client interactions.",
        thumbnail: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        lessons: [
            {
                title: "Meetings and Reports",
                content: "Learn the essential language for effective participation in meetings and writing reports.",
                thumbnail: "https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                subLessons: [
                    { title: "Discussing the Agenda", vocab: ["agenda", "objective", "item", "kick off", "wrap up", "time allocation"] },
                    { title: "Presenting a Report", vocab: ["quarterly report", "key findings", "data shows", "projections", "recommendations", "executive summary"] },
                    { title: "Giving and Receiving Feedback", vocab: ["constructive criticism", "I see your point", "Could you elaborate?", "moving forward", "actionable feedback"] },
                ],
            },
            {
                title: "Chatting with Customers",
                content: "Develop skills to provide excellent customer service and build client relationships.",
                thumbnail: "https://images.pexels.com/photos/8867432/pexels-photo-8867432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                subLessons: [
                    { title: "Handling Inquiries", vocab: ["How may I assist you?", "look into that for you", "inquiry", "availability", "product specifications"] },
                    { title: "Resolving Complaints", vocab: ["I understand your frustration", "We sincerely apologize for the inconvenience", "resolve the issue", "as a gesture of goodwill"] },
                ],
            },
            {
                title: "Job Interviews",
                content: "Prepare for common interview questions and confidently showcase your skills.",
                thumbnail: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                subLessons: [
                    { title: "Describing Your Strengths", vocab: ["team player", "problem-solving skills", "adaptable", "detail-oriented", "leadership qualities"] },
                    { title: "Answering Behavioral Questions", vocab: ["Tell me about a time when you faced a challenge at work.", "STAR method", "handled a conflict", "managed a tight deadline"] },
                ]
            },
        ],
    },
    {
        title: "Lifestyle",
        content: "Navigate everyday situations with confidence, from shopping to dining out.",
        thumbnail: "https://images.pexels.com/photos/1050244/pexels-photo-1050244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        lessons: [
            {
                title: "Shopping",
                content: "Learn vocabulary and phrases for a smooth shopping experience.",
                thumbnail: "https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                subLessons: [
                    { title: "At a Clothing Store", vocab: ["fitting room", "Do you have this in a different size?", "on sale", "return policy", "receipt"] },
                    { title: "Grocery Shopping", vocab: ["aisle", "shopping cart", "checkout counter", "fresh produce", "loyalty card"] },
                ],
            },
            {
                title: "Eating and Dining",
                content: "Master the art of ordering food and dining at restaurants.",
                thumbnail: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                subLessons: [
                    { title: "Making a Reservation", vocab: ["I'd like to book a table", "for two people", "at 7 PM", "under the name"] },
                    { title: "Ordering a Meal", vocab: ["What do you recommend?", "I'll have the pasta with marinara sauce.", "Could we have the bill, please?", "appetizer", "main course", "dessert"] },
                ],
            },
        ],
    },
    {
        title: "Small Talk",
        content: "Learn how to start and maintain engaging conversations in any social setting.",
        thumbnail: "https://images.pexels.com/photos/716276/pexels-photo-716276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        lessons: [
            {
                title: "Breaking the Ice",
                content: "Master conversation starters for networking events and parties.",
                thumbnail: "https://images.pexels.com/photos/6224711/pexels-photo-6224711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                subLessons: [
                    { title: "Talking About the Weather", vocab: ["Lovely day, isn't it?", "I can't believe how cold it is", "Looks like it's going to rain"] },
                    { title: "Commenting on the Event", vocab: ["The food is delicious", "This is a great venue", "How do you know the host?"] },
                ],
            },
            {
                title: "Chatting with Colleagues",
                content: "Build better relationships with your coworkers through friendly conversation.",
                thumbnail: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                subLessons: [
                    { title: "Weekend Talk", vocab: ["How was your weekend?", "Did you do anything exciting?", "I had a relaxing weekend"] },
                    { title: "Discussing Work", vocab: ["How's that project coming along?", "I'm swamped with work", "Looking forward to the holidays"] },
                ]
            }
        ],
    },
    {
        title: "Holidays",
        content: "Learn vocabulary and greetings for major holidays and celebrations.",
        thumbnail: "https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        lessons: [
            {
                title: "Christmas",
                content: "Get in the festive spirit with Christmas-related English.",
                thumbnail: "https://images.pexels.com/photos/3224164/pexels-photo-3224164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                subLessons: [
                    { title: "Christmas Greetings", vocab: ["Merry Christmas!", "Happy Holidays!", "Season's Greetings", "All the best for the New Year"] },
                    { title: "Holiday Traditions", vocab: ["decorate the tree", "exchange gifts", "Christmas carol", "mistletoe", "reindeer"] },
                ]
            },
            {
                title: "New Year",
                content: "Learn how to talk about New Year's resolutions and celebrations.",
                thumbnail: "https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                subLessons: [
                    { title: "Making Resolutions", vocab: ["New Year's resolution", "I'm planning to exercise more this year.", "My goal is to learn a new skill.", "stick to it"] },
                    { title: "New Year's Eve", vocab: ["Happy New Year!", "countdown", "fireworks", "celebrate", "Auld Lang Syne"] },
                ]
            }
        ]
    }
];

// --- CALCULATE TOTAL LESSONS ---
const calculateTotalLessons = (curriculum: any[]) => {
    let total = 0;
    curriculum.forEach((topic) => {
        topic.lessons.forEach((lesson: any) => {
            total += 1; // Count parent lesson
            total += lesson.subLessons.length; // Count sub-lessons
        });
    });
    return total;
};

// --- CALCULATE TOTAL LESSONS FOR A TOPIC ---
const calculateTopicTotalLessons = (topic: any) => {
    let total = 0;
    topic.lessons.forEach((lesson: any) => {
        total += 1; // Count parent lesson
        total += lesson.subLessons.length; // Count sub-lessons
    });
    return total;
};

// --- MAIN SEED FUNCTION ---
const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI as string, {
        dbName: "speak-up-test",
    });
    console.log("Connected to MongoDB");

    // Calculate total lessons for the course
    const totalLessons = calculateTotalLessons(curriculum);

    // Create Course
    const course = await Course.create({
        title: "Comprehensive English Speaking & Communication",
        description: "A complete course to master real-world English, from professional settings to daily life.",
        level: "Beginner to Intermediate",
        thumbnail: "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        totalLessons,
    });
    console.log("Course created.");

    // --- HIERARCHICAL DATA CREATION ---
    console.log("Starting curriculum creation...");

    for (const topicData of curriculum) {
        // 1. Create Topic
        const topicTotalLessons = calculateTopicTotalLessons(topicData);
        const topic = await Topic.create({
            courseId: course._id,
            title: topicData.title,
            content: topicData.content,
            thumbnail: topicData.thumbnail,
            type: 'speaking',
            section: "topic",
            level: 1,
            totalLessons: topicTotalLessons,
        });
        console.log(`-> Topic created: ${topic.title}`);

        for (const lessonData of topicData.lessons) {
            // 2. Create Parent Lesson
            const parentLesson = await Lesson.create({
                courseId: course._id,
                parentTopicId: topic._id,
                title: lessonData.title,
                content: lessonData.content,
                thumbnail: lessonData.thumbnail,
                type: 'speaking',
                level: 1,
            });
            console.log(`  - Parent Lesson created: ${parentLesson.title}`);

            for (const subLessonData of lessonData.subLessons) {
                // 3. Create Sub-Lesson (Communication Goal)
                const subLesson = await Lesson.create({
                    courseId: course._id,
                    parentTopicId: topic._id,
                    parentLessonId: parentLesson._id,
                    title: subLessonData.title,
                    content: `Practice vocabulary and phrases for: ${subLessonData.title}.`,
                    thumbnail: "", // Sub-lessons don't need thumbnails
                    type: 'vocabulary',
                    level: 1,
                });
                console.log(`    - Sub-Lesson created: ${subLesson.title}`);

                // 4. Fetch and Create Vocabulary for the Sub-Lesson
                const vocabPromises = subLessonData.vocab.map((term, index) => fetchWord(term, true, index));
                const fetchedVocabs = await Promise.all(vocabPromises);

                const vocabularyDocs = fetchedVocabs.map(v => ({ lessonId: subLesson._id, ...v }));
                const createdVocabularies = await Vocabulary.insertMany(vocabularyDocs) as unknown as IVocabularyDoc[];

                // 5. Create Exercises for the Sub-Lesson
                const exercisesData: IExerciseCreate[] = [];

                if (fetchedVocabs.length > 0) {
                    // Pronunciation Exercise for a random word
                    const randomWord = fetchedVocabs[Math.floor(Math.random() * fetchedVocabs.length)];
                    exercisesData.push({
                        lessonId: subLesson._id as mongoose.Types.ObjectId,
                        type: "pronunciation",
                        prompt: `Practice the pronunciation of: "${randomWord.word}"`,
                        correctPronunciation: randomWord.phonetic || `/${randomWord.word}/`,
                        difficultyLevel: "easy",
                    });

                    // Repeat Sentence Exercise
                    if (subLessonData.title === "Making Resolutions" || subLessonData.title === "Ordering a Meal" || subLessonData.title === "Answering Behavioral Questions") {
                        // Use completed sentences for specific phrases
                        const targetVocabs = fetchedVocabs.filter(v =>
                            v.word === "I'm planning to exercise more this year." ||
                            v.word === "My goal is to learn a new skill." ||
                            v.word === "I'll have the pasta with marinara sauce." ||
                            v.word === "Tell me about a time when you faced a challenge at work."
                        );
                        if (targetVocabs.length > 0) {
                            const selectedVocab = targetVocabs[Math.floor(Math.random() * targetVocabs.length)];
                            exercisesData.push({
                                lessonId: subLesson._id as mongoose.Types.ObjectId, // FIXED: Changed subLessonData._id to subLesson._id
                                type: "repeat_sentence",
                                prompt: `Listen and repeat: "${selectedVocab.exampleSentence}"`,
                                correctPronunciation: selectedVocab.exampleSentence,
                                difficultyLevel: "medium",
                            });
                        } else {
                            // Fallback for other vocab in the sub-lesson
                            const vocabWithSentence = fetchedVocabs.find(v => v.exampleSentence && !v.exampleSentence.includes("Example using"));
                            const sentenceToRepeat = vocabWithSentence ? vocabWithSentence.exampleSentence : `Let's practice saying: "${fetchedVocabs[0].word}"`;
                            exercisesData.push({
                                lessonId: subLesson._id as mongoose.Types.ObjectId, // FIXED: Changed subLessonData._id to subLesson._id
                                type: "repeat_sentence",
                                prompt: `Listen and repeat: "${sentenceToRepeat}"`,
                                correctPronunciation: sentenceToRepeat,
                                difficultyLevel: "medium",
                            });
                        }
                    } else {
                        // Default repeat_sentence for other sub-lessons
                        const vocabWithSentence = fetchedVocabs.find(v => v.exampleSentence && !v.exampleSentence.includes("Example using"));
                        const sentenceToRepeat = vocabWithSentence ? vocabWithSentence.exampleSentence : `Let's practice saying: "${fetchedVocabs[0].word}"`;
                        exercisesData.push({
                            lessonId: subLesson._id as mongoose.Types.ObjectId,
                            type: "repeat_sentence",
                            prompt: `Listen and repeat: "${sentenceToRepeat}"`,
                            correctPronunciation: sentenceToRepeat,
                            difficultyLevel: "medium",
                        });
                    }
                }

                const createdExercises = await Exercise.insertMany(exercisesData) as IExerciseDoc[];

                // 6. Link Exercises to Vocabularies
                const exerciseVocabularyData = [];
                for (const exercise of createdExercises) {
                    for (const vocab of createdVocabularies) {
                        exerciseVocabularyData.push({ exerciseId: exercise._id, vocabularyId: vocab._id });
                    }
                }
                if (exerciseVocabularyData.length > 0) {
                    await ExerciseVocabulary.insertMany(exerciseVocabularyData);
                }
            }
        }
    }

    // --- CREATE DUMMY USER DATA ---
    console.log("Creating dummy user progress and history...");
    const userId = new mongoose.Types.ObjectId();
    const allLessons = await Lesson.find({ parentLessonId: { $ne: null } }).lean(); // Progress only for sub-lessons
    const allExercises = await Exercise.find().lean();

    const progressData = allLessons.map((lesson, i) => ({
        lessonId: lesson._id,
        userId: userId,
        score: i % 4 === 0 ? 100 : Math.floor(Math.random() * 81) + 15,
        isCompleted: i % 4 === 0,
    }));

    const historyData = allExercises.slice(0, 30).map(exercise => ({
        userId,
        lessonId: exercise.lessonId,
        exerciseId: exercise._id,
        attempts: Math.floor(Math.random() * 3) + 1,
        lastAttemptAt: new Date(),
    }));

    await LessonProgress.insertMany(progressData);
    await History.insertMany(historyData);
    console.log("Dummy user data created.");

    console.log("\n✅ Seed completed successfully! Your database is now populated with rich, realistic data.");
    await mongoose.connection.close();
};

seed().catch(err => {
    console.error("\n❌ An error occurred during the seed process:");
    console.error(err);
    mongoose.connection.close();
    process.exit(1);
});