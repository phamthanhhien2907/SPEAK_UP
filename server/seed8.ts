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

interface EndingSoundWords {
    [key: string]: { correct: string }[];
}

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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const wordCache: { [word: string]: VocabularyItem } = {};

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
        const meaning = meanings.length > 0 ? meanings[0].definitions[0].definition || "No definition available" : "No definition available";
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

const fetchVocabulary = async (wordPairs: { correct: string }[], sound: string): Promise<VocabularyItem[]> => {
    const vocabItems: VocabularyItem[] = [];
    const batchSize = 2;

    for (let i = 0; i < wordPairs.length; i += batchSize) {
        const batch = wordPairs.slice(i, i + batchSize);
        const promises: Promise<VocabularyItem>[] = [];

        batch.forEach((pair, index) => {
            const pairIndex = i + index;
            promises.push(fetchWord(pair.correct, sound, true, pairIndex));
        });

        const results = await Promise.all(promises);
        vocabItems.push(...results);
        if (i + batchSize < wordPairs.length) {
            console.log(`Waiting 5 seconds before next batch...`);
            await delay(5000);
        }
    }

    return vocabItems;
};

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI as string, {
        dbName: "speak-up-test",
    });
    console.log("Connected to MongoDB");

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

    const course = await Course.create({
        _id: new mongoose.Types.ObjectId("6819c20302afe322ee61b1d2"),
        title: "English Pronunciation with IPA",
        description: "Master English pronunciation using the International Phonetic Alphabet",
        level: "beginner",
        thumbnail: "https://dummyimage.com/600x400/000/fff",
        createdAt: new Date("2025-05-24T23:30:00.000Z"),
        updatedAt: new Date("2025-05-24T23:30:00.000Z"),
    });

    const topicsData = [
        {
            courseId: course._id,
            title: "Ending Sounds",
            content: "Practice consonant sounds at the end of words",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle.png",
            totalLessons: 38,
        },
        {
            courseId: course._id,
            title: "Vowel Sounds",
            content: "Learn and distinguish vowel sounds",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle_1.png",
            totalLessons: 21,
        },
        {
            courseId: course._id,
            title: "Consonant Sounds",
            content: "Practice specific consonant sounds",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle_2.png",
            totalLessons: 14,
        },
        {
            courseId: course._id,
            title: "Intonation",
            content: "Learn English intonation patterns",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle_3.png",
            totalLessons: 5,
        },
        {
            courseId: course._id,
            title: "Longer Words",
            content: "Practice pronunciation of longer words and phrases",
            type: "pronunciation",
            level: 2,
            thumbnail: "http://localhost:8080/static/circle_4.png",
            totalLessons: 2,
        },
    ].map(topic => ({
        ...topic,
        section: "lesson",
        createdAt: new Date("2025-05-24T23:30:00.000Z"),
        updatedAt: new Date("2025-05-24T23:30:00.000Z"),
    }));

    const topics = await Topic.insertMany(topicsData) as any[];

    const lessonsData: ILessonInput[] = [
        ...(() => {
            const endingSoundsTopic = topics.find(t => t.title === "Ending Sounds")!;
            const endingSounds = ["/p/", "/b/", "/t/", "/d/", "/k/", "/g/", "/f/", "/v/", "/θ/", "/ð/", "/s/", "/z/", "/ʃ/", "/ʒ/", "/h/", "/tʃ/", "/dʒ/", "/m/", "/n/", "/ŋ/"];
            const lessons: ILessonInput[] = [];
            for (let i = 0; i < 38; i++) {
                const sound = endingSounds[i % endingSounds.length];
                lessons.push({
                    courseId: course._id as mongoose.Types.ObjectId,
                    parentTopicId: endingSoundsTopic._id,
                    title: `Lesson ${i + 1} - Ending Sound ${sound}`,
                    content: `Practice words ending with ${sound}.`,
                    type: "pronunciation",
                    category: "Basics",
                    level: 1,
                    createdAt: new Date("2025-05-24T23:30:00.000Z"),
                    updatedAt: new Date("2025-05-24T23:30:00.000Z"),
                });
            }
            return lessons;
        })(),
        ...(() => {
            const vowelSoundsTopic = topics.find(t => t.title === "Vowel Sounds")!;
            const iSounds = [
                "Listen and distinguish /iː/ vs /ɪ/", "Words with /iː/", "Words with /ɪ/", "Minimal pairs: seat/sit, beat/bit",
                "Sentences with /iː/", "Sentences with /ɪ/", "Practice /iː/ in isolation", "Practice /ɪ/ in isolation",
                "Combine /iː/ and /ɪ/ in words", "Combine /iː/ and /ɪ/ in phrases", "Record yourself: /iː/ vs /ɪ/",
                "Feedback on /iː/ pronunciation", "Feedback on /ɪ/ pronunciation", "Review /iː/ and /ɪ/ together",
            ];
            const aSounds = ["Introduction to /æ/, /ʌ/, /ɑː/", "Words with /æ/", "Words with /ʌ/", "Words with /ɑː/", "Minimal pairs: cat/cut, car/cup", "Sentences practice", "Review and record"];
            const lessons: ILessonInput[] = [];
            for (let i = 0; i < 14; i++) {
                lessons.push({
                    courseId: course._id as mongoose.Types.ObjectId,
                    parentTopicId: vowelSoundsTopic._id,
                    title: `Lesson ${i + 1} - ${iSounds[i]}`,
                    content: `Focus on ${iSounds[i].toLowerCase()}.`,
                    type: "pronunciation",
                    category: "Basics",
                    level: 1,
                    createdAt: new Date("2025-05-24T23:30:00.000Z"),
                    updatedAt: new Date("2025-05-24T23:30:00.000Z"),
                });
            }
            for (let i = 0; i < 7; i++) {
                lessons.push({
                    courseId: course._id as mongoose.Types.ObjectId,
                    parentTopicId: vowelSoundsTopic._id,
                    title: `Lesson ${i + 15} - ${aSounds[i]}`,
                    content: `Practice ${aSounds[i].toLowerCase()}.`,
                    type: "pronunciation",
                    category: "Basics",
                    level: 1,
                    createdAt: new Date("2025-05-24T23:30:00.000Z"),
                    updatedAt: new Date("2025-05-24T23:30:00.000Z"),
                });
            }
            return lessons;
        })(),
        ...(() => {
            const consonantSoundsTopic = topics.find(t => t.title === "Consonant Sounds")!;
            const thSounds = ["Introduction to /ð/ vs /θ/", "Words with /θ/", "Words with /ð/", "Minimal pairs: think/this", "Sentences with /θ/", "Sentences with /ð/", "Review and record"];
            const rzsSounds = ["Introduction to /r/, /z/, /ʃ/", "Words with /r/", "Words with /z/", "Words with /ʃ/", "Minimal pairs: rose/rows", "Sentences practice", "Review and record"];
            const lessons: ILessonInput[] = [];
            for (let i = 0; i < 7; i++) {
                lessons.push({
                    courseId: course._id as mongoose.Types.ObjectId,
                    parentTopicId: consonantSoundsTopic._id,
                    title: `Lesson ${i + 1} - ${thSounds[i]}`,
                    content: `Practice ${thSounds[i].toLowerCase()}.`,
                    type: "pronunciation",
                    category: "Basics",
                    level: 1,
                    createdAt: new Date("2025-05-24T23:30:00.000Z"),
                    updatedAt: new Date("2025-05-24T23:30:00.000Z"),
                });
            }
            for (let i = 0; i < 7; i++) {
                lessons.push({
                    courseId: course._id as mongoose.Types.ObjectId,
                    parentTopicId: consonantSoundsTopic._id,
                    title: `Lesson ${i + 8} - ${rzsSounds[i]}`,
                    content: `Practice ${rzsSounds[i].toLowerCase()}.`,
                    type: "pronunciation",
                    category: "Basics",
                    level: 1,
                    createdAt: new Date("2025-05-24T23:30:00.000Z"),
                    updatedAt: new Date("2025-05-24T23:30:00.000Z"),
                });
            }
            return lessons;
        })(),
        ...(() => {
            const intonationTopic = topics.find(t => t.title === "Intonation")!;
            const intonationLessons = ["Introduction to English intonation", "Rising intonation: Yes/No questions", "Falling intonation: Statements", "Mixed intonation: Choice questions", "Practice and record"];
            const lessons: ILessonInput[] = [];
            for (let i = 0; i < 5; i++) {
                lessons.push({
                    courseId: course._id as mongoose.Types.ObjectId,
                    parentTopicId: intonationTopic._id,
                    title: `Lesson ${i + 1} - ${intonationLessons[i]}`,
                    content: `Practice ${intonationLessons[i].toLowerCase()}.`,
                    type: "pronunciation",
                    category: "Basics",
                    level: 1,
                    createdAt: new Date("2025-05-24T23:30:00.000Z"),
                    updatedAt: new Date("2025-05-24T23:30:00.000Z"),
                });
            }
            return lessons;
        })(),
        ...(() => {
            const longerWordsTopic = topics.find(t => t.title === "Longer Words")!;
            const longerWords = ["Practice basic longer words", "Practice phrases with longer words"];
            const lessons: ILessonInput[] = [];
            for (let i = 0; i < 2; i++) {
                lessons.push({
                    courseId: course._id as mongoose.Types.ObjectId,
                    parentTopicId: longerWordsTopic._id,
                    title: `Lesson ${i + 1} - ${longerWords[i]}`,
                    content: `Practice ${longerWords[i].toLowerCase()}.`,
                    type: "pronunciation",
                    category: "Intermediate",
                    level: 2,
                    createdAt: new Date("2025-05-24T23:30:00.000Z"),
                    updatedAt: new Date("2025-05-24T23:30:00.000Z"),
                });
            }
            return lessons;
        })(),
    ];

    const lessons = await Lesson.insertMany(lessonsData) as unknown as ILesson[];

    const endingSoundWords: EndingSoundWords = {
        "/p/": [{ correct: "stop" }, { correct: "map" }, { correct: "cap" }, { correct: "lip" }, { correct: "sip" }],
        "/b/": [{ correct: "web" }, { correct: "club" }, { correct: "job" }, { correct: "cab" }, { correct: "rib" }],
        "/t/": [{ correct: "cat" }, { correct: "hat" }, { correct: "mat" }, { correct: "bat" }, { correct: "sit" }],
        "/d/": [{ correct: "bed" }, { correct: "red" }, { correct: "sad" }, { correct: "mad" }, { correct: "kid" }],
        "/k/": [{ correct: "back" }, { correct: "lock" }, { correct: "sick" }, { correct: "duck" }, { correct: "kick" }],
        "/g/": [{ correct: "dog" }, { correct: "bag" }, { correct: "pig" }, { correct: "fog" }, { correct: "bug" }],
        "/f/": [{ correct: "leaf" }, { correct: "roof" }, { correct: "off" }, { correct: "safe" }, { correct: "elf" }],
        "/v/": [{ correct: "love" }, { correct: "dove" }, { correct: "give" }, { correct: "live" }, { correct: "wave" }],
        "/θ/": [{ correct: "bath" }, { correct: "path" }, { correct: "teeth" }, { correct: "math" }, { correct: "truth" }],
        "/ð/": [{ correct: "this" }, { correct: "that" }, { correct: "with" }, { correct: "mother" }, { correct: "father" }],
        "/s/": [{ correct: "bus" }, { correct: "kiss" }, { correct: "miss" }, { correct: "class" }, { correct: "dress" }],
        "/z/": [{ correct: "zoo" }, { correct: "buzz" }, { correct: "nose" }, { correct: "rose" }, { correct: "jazz" }],
        "/ʃ/": [{ correct: "fish" }, { correct: "wish" }, { correct: "dish" }, { correct: "rush" }, { correct: "brush" }],
        "/ʒ/": [{ correct: "beige" }, { correct: "garage" }, { correct: "measure" }, { correct: "pleasure" }, { correct: "treasure" }],
        "/h/": [{ correct: "hat" }, { correct: "hit" }, { correct: "hot" }, { correct: "hope" }, { correct: "house" }],
        "/tʃ/": [{ correct: "church" }, { correct: "watch" }, { correct: "catch" }, { correct: "match" }, { correct: "teach" }],
        "/dʒ/": [{ correct: "judge" }, { correct: "age" }, { correct: "page" }, { correct: "cage" }, { correct: "edge" }],
        "/m/": [{ correct: "room" }, { correct: "team" }, { correct: "dream" }, { correct: "arm" }, { correct: "him" }],
        "/n/": [{ correct: "sun" }, { correct: "run" }, { correct: "fun" }, { correct: "man" }, { correct: "pin" }],
        "/ŋ/": [{ correct: "sing" }, { correct: "ring" }, { correct: "song" }, { correct: "king" }, { correct: "wing" }],
    };

    const iSoundWords = {
        "/iː/": [{ correct: "see" }, { correct: "tree" }, { correct: "green" }, { correct: "deep" }, { correct: "feet" }],
        "/ɪ/": [{ correct: "sit" }, { correct: "bit" }, { correct: "hit" }, { correct: "lip" }, { correct: "fit" }],
    };

    const aSoundWords = {
        "/æ/": [{ correct: "cat" }, { correct: "hat" }, { correct: "bat" }, { correct: "map" }, { correct: "sad" }],
        "/ʌ/": [{ correct: "cup" }, { correct: "but" }, { correct: "cut" }, { correct: "sun" }, { correct: "run" }],
        "/ɑː/": [{ correct: "car" }, { correct: "far" }, { correct: "star" }, { correct: "bar" }, { correct: "hard" }],
    };

    const thSoundWords = {
        "/θ/": [{ correct: "bath" }, { correct: "path" }, { correct: "teeth" }, { correct: "math" }, { correct: "truth" }],
        "/ð/": [{ correct: "this" }, { correct: "that" }, { correct: "with" }, { correct: "mother" }, { correct: "father" }],
    };

    const rzsSoundWords = {
        "/r/": [{ correct: "red" }, { correct: "run" }, { correct: "rat" }, { correct: "rose" }, { correct: "rain" }],
        "/z/": [{ correct: "zoo" }, { correct: "buzz" }, { correct: "nose" }, { correct: "rose" }, { correct: "jazz" }],
        "/ʃ/": [{ correct: "fish" }, { correct: "wish" }, { correct: "dish" }, { correct: "rush" }, { correct: "brush" }],
    };

    const intonationWords = [
        { correct: "yes" }, { correct: "no" }, { correct: "hello" },
        { correct: "goodbye" }, { correct: "sorry" },
    ];

    const longerWordsData = [
        { correct: "beautiful" }, { correct: "education" },
        { correct: "information" }, { correct: "technology" },
        { correct: "relationship" },
    ];

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

    const wordsByLesson = new Map<string, Set<string>>();

    for (const lesson of lessons) {
        let vocabWords: VocabularyItem[] = [];
        let lessonSound = lesson.title.match(/\/[^/]+\//)?.[0] as string || "";
        const lessonId = lesson?._id?.toString() as string;

        if (!wordsByLesson.has(lessonId)) {
            wordsByLesson.set(lessonId, new Set<string>());
        }
        const lessonWords = wordsByLesson.get(lessonId)!;

        if (lesson.parentTopicId instanceof mongoose.Types.ObjectId && lesson.parentTopicId.equals(topics.find(t => t.title === "Ending Sounds")!._id)) {
            const words = endingSoundWords[lessonSound] || [];
            vocabWords = await fetchVocabulary(words, lessonSound);
        } else if (lesson.parentTopicId instanceof mongoose.Types.ObjectId && lesson.parentTopicId.equals(topics.find(t => t.title === "Vowel Sounds")!._id)) {
            if (lesson.title.includes("/iː/") && !lesson.title.includes("vs")) {
                vocabWords = await fetchVocabulary(iSoundWords["/iː/"], "/iː/");
            } else if (lesson.title.includes("/ɪ/") && !lesson.title.includes("vs")) {
                vocabWords = await fetchVocabulary(iSoundWords["/ɪ/"], "/ɪ/");
            } else if (lesson.title.includes("/æ/") && !lesson.title.includes("Introduction") && !lesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(aSoundWords["/æ/"], "/æ/");
            } else if (lesson.title.includes("/ʌ/") && !lesson.title.includes("Introduction") && !lesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(aSoundWords["/ʌ/"], "/ʌ/");
            } else if (lesson.title.includes("/ɑː/") && !lesson.title.includes("Introduction") && !lesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(aSoundWords["/ɑː/"], "/ɑː/");
            } else if (lesson.title.includes("Introduction to /æ/, /ʌ/, /ɑː/") || lesson.title.includes("Minimal pairs: cat/cut, car/cup") || lesson.title.includes("Sentences practice") || lesson.title.includes("Review and record")) {
                vocabWords = [...(await fetchVocabulary(aSoundWords["/æ/"], "/æ/")), ...(await fetchVocabulary(aSoundWords["/ʌ/"], "/ʌ/")), ...(await fetchVocabulary(aSoundWords["/ɑː/"], "/ɑː/"))];
            } else {
                vocabWords = [...(await fetchVocabulary(iSoundWords["/iː/"], "/iː/")), ...(await fetchVocabulary(iSoundWords["/ɪ/"], "/ɪ/"))];
            }
        } else if (lesson.parentTopicId instanceof mongoose.Types.ObjectId && lesson.parentTopicId.equals(topics.find(t => t.title === "Consonant Sounds")!._id)) {
            if (lesson.title.includes("/θ/") && !lesson.title.includes("vs")) {
                vocabWords = await fetchVocabulary(thSoundWords["/θ/"], "/θ/");
            } else if (lesson.title.includes("/ð/") && !lesson.title.includes("vs")) {
                vocabWords = await fetchVocabulary(thSoundWords["/ð/"], "/ð/");
            } else if (lesson.title.includes("/r/") && !lesson.title.includes("Introduction") && !lesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(rzsSoundWords["/r/"], "/r/");
            } else if (lesson.title.includes("/z/") && !lesson.title.includes("Introduction") && !lesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(rzsSoundWords["/z/"], "/z/");
            } else if (lesson.title.includes("/ʃ/") && !lesson.title.includes("Introduction") && !lesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(rzsSoundWords["/ʃ/"], "/ʃ/");
            } else if (lesson.title.includes("Introduction to /ð/ vs /θ/") || lesson.title.includes("Minimal pairs: think/this") || lesson.title.includes("Sentences with /θ/") || lesson.title.includes("Sentences with /ð/") || lesson.title.includes("Review and record")) {
                vocabWords = [...(await fetchVocabulary(thSoundWords["/θ/"], "/θ/")), ...(await fetchVocabulary(thSoundWords["/ð/"], "/ð/"))];
            } else {
                vocabWords = [...(await fetchVocabulary(rzsSoundWords["/r/"], "/r/")), ...(await fetchVocabulary(rzsSoundWords["/z/"], "/z/")), ...(await fetchVocabulary(rzsSoundWords["/ʃ/"], "/ʃ/"))];
            }
        } else if (lesson.parentTopicId instanceof mongoose.Types.ObjectId && lesson.parentTopicId.equals(topics.find(t => t.title === "Intonation")!._id)) {
            vocabWords = await fetchVocabulary(intonationWords, "intonation");
        } else if (lesson.parentTopicId instanceof mongoose.Types.ObjectId && lesson.parentTopicId.equals(topics.find(t => t.title === "Longer Words")!._id)) {
            vocabWords = await fetchVocabulary(longerWordsData, "");
        }

        vocabWords.sort((a, b) => a.pairOrder - b.pairOrder);

        for (const vocab of vocabWords) {
            if (!lessonWords.has(vocab.word)) {
                vocabularyData.push({
                    lessonId: lesson._id as mongoose.Types.ObjectId,
                    word: vocab.word,
                    phonetic: vocab.phonetic,
                    meaning: vocab.meaning,
                    exampleSentence: vocab.exampleSentence,
                    audioUrl: vocab.audioUrl || `https://example.com/audio/${vocab.word}.mp3`,
                    pairOrder: vocab.pairOrder,
                    createdAt: new Date("2025-05-24T23:30:00.000Z"),
                    updatedAt: new Date("2025-05-24T23:30:00.000Z"),
                });
                lessonWords.add(vocab.word);
            }
        }

        const exercise = {
            lessonId: lesson._id as mongoose.Types.ObjectId,
            type: "pronunciation" as const,
            prompt: `Practice pronouncing the sounds in ${vocabWords.map(v => v.word).join(", ")}`,
            correctPronunciation: vocabWords.map(v => v.phonetic).join(" / ") || lessonSound || "N/A",
            difficultyLevel: "easy" as const,
            createdAt: new Date("2025-05-24T23:30:00.000Z"),
            updatedAt: new Date("2025-05-24T23:30:00.000Z"),
        };
        exercisesData.push(exercise);
    }

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
                createdAt: new Date("2025-05-24T23:30:00.000Z"),
                updatedAt: new Date("2025-05-24T23:30:00.000Z"),
            });
        }

        historyData.push({
            userId,
            lessonId: exercises[i].lessonId as mongoose.Types.ObjectId,
            exerciseId: exercises[i]._id as mongoose.Types.ObjectId,
            attempts: 2,
            lastAttemptAt: new Date("2025-05-24T23:30:00.000Z"),
            createdAt: new Date("2025-05-24T23:30:00.000Z"),
            updatedAt: new Date("2025-05-24T23:30:00.000Z"),
        });
    }

    await Promise.all([
        ExerciseVocabulary.insertMany(exerciseVocabularyData),
        History.insertMany(historyData),
    ]);

    const userIdProgress = new mongoose.Types.ObjectId("6814e1d4f941dc16637b6235");
    const progressData = lessons.map(lesson => ({
        lessonId: lesson._id as mongoose.Types.ObjectId,
        userId: userIdProgress,
        score: 0,
        createdAt: new Date("2025-05-24T23:30:00.000Z"),
        updatedAt: new Date("2025-05-24T23:30:00.000Z"),
    }));

    await LessonProgress.insertMany(progressData);

    console.log("Seed completed successfully");
    await mongoose.connection.close();
};

seed().catch(err => {
    console.error(err);
    process.exit(1);
});