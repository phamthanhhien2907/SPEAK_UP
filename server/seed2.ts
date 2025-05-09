import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Course from "./src/models/Course";
import Lesson, { ILesson, ILessonInput } from "./src/models/Lesson";
import LessonProgress from "./src/models/LessonProgress";
import Vocabulary from "./src/models/Vocabulary";
import Exercise from "./src/models/Exercise";
import History from "./src/models/History";
import ExerciseVocabulary from "./src/models/ExerciseVocabulary";

interface EndingSoundWords {
    [key: string]: { correct: string; wrong: string }[];
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

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI as string, {
        dbName: "speak-up",
    });
    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
        Course.deleteMany({}),
        Lesson.deleteMany({}),
        LessonProgress.deleteMany({}),
        Vocabulary.deleteMany({}),
        Exercise.deleteMany({}),
        History.deleteMany({}),
        ExerciseVocabulary.deleteMany({}),
    ]);

    // Create course
    const course = await Course.create({
        _id: new mongoose.Types.ObjectId("6819c20302afe322ee61b1d2"),
        title: "English Pronunciation with IPA",
        description: "Master English pronunciation using the International Phonetic Alphabet",
        level: "beginner",
        thumbnail: "https://dummyimage.com/600x400/000/fff",
        createdAt: new Date("2025-05-06T08:02:11.316Z"),
        updatedAt: new Date("2025-05-06T08:02:11.316Z"),
    });

    // Create parent lessons
    const parentLessonsData: ILessonInput[] = [
        {
            courseId: course._id as mongoose.Types.ObjectId,
            title: "Ending Sounds",
            content: "Practice consonant sounds at the end of words",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle.png",
            createdAt: new Date("2025-05-06T08:02:11.316Z"),
            updatedAt: new Date("2025-05-06T08:02:11.316Z"),
        },
        {
            courseId: course._id as mongoose.Types.ObjectId,
            title: "/iː/ vs /ɪ/",
            content: "Distinguish between long /iː/ and short /ɪ/ vowel sounds",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle_1.png",
            createdAt: new Date("2025-05-06T08:02:11.316Z"),
            updatedAt: new Date("2025-05-06T08:02:11.316Z"),
        },
        {
            courseId: course._id as mongoose.Types.ObjectId,
            title: "/æ/, /ʌ/, /ɑː/",
            content: "Practice the vowel sounds /æ/, /ʌ/, and /ɑː/",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle_2.png",
            createdAt: new Date("2025-05-06T08:02:11.316Z"),
            updatedAt: new Date("2025-05-06T08:02:11.316Z"),
        },
        {
            courseId: course._id as mongoose.Types.ObjectId,
            title: "/ð/ vs /θ/",
            content: "Distinguish between voiced /ð/ and voiceless /θ/ sounds",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle_3.png",
            createdAt: new Date("2025-05-06T08:02:11.316Z"),
            updatedAt: new Date("2025-05-06T08:02:11.316Z"),
        },
        {
            courseId: course._id as mongoose.Types.ObjectId,
            title: "/r/, /z/, /ʃ/",
            content: "Practice the consonant sounds /r/, /z/, and /ʃ/",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle_4.png",
            createdAt: new Date("2025-05-06T08:02:11.316Z"),
            updatedAt: new Date("2025-05-06T08:02:11.316Z"),
        },
        {
            courseId: course._id as mongoose.Types.ObjectId,
            title: "Intonation",
            content: "Learn English intonation patterns",
            type: "pronunciation",
            level: 1,
            thumbnail: "http://localhost:8080/static/circle_5.png",
            createdAt: new Date("2025-05-06T08:02:11.316Z"),
            updatedAt: new Date("2025-05-06T08:02:11.316Z"),
        },
        {
            courseId: course._id as mongoose.Types.ObjectId,
            title: "Longer Words",
            content: "Practice pronunciation of longer words and phrases",
            type: "pronunciation",
            level: 2,
            thumbnail: "http://localhost:8080/static/circle_6.png",
            createdAt: new Date("2025-05-06T08:02:11.316Z"),
            updatedAt: new Date("2025-05-06T08:02:11.316Z"),
        },
    ];

    const parentLessons: ILesson[] = await Lesson.insertMany(
        parentLessonsData.map(lesson => ({
            ...lesson,
            thumbnail: course?.thumbnail,
        }))
    ) as unknown as ILesson[];

    // Create sub lessons
    const subLessonsData: ILessonInput[] = [];
    const endingSounds = ["/p/", "/b/", "/t/", "/d/", "/k/", "/g/", "/f/", "/v/", "/θ/", "/ð/", "/s/", "/z/", "/ʃ/", "/ʒ/", "/h/", "/tʃ/", "/dʒ/", "/m/", "/n/", "/ŋ/"];
    for (let i = 0; i < 38; i++) {
        const sound = endingSounds[i % endingSounds.length];
        subLessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentLessonId: parentLessons[0]._id as mongoose.Types.ObjectId,
            title: `Lesson ${i + 1} - Ending Sound ${sound}`,
            content: `Practice words ending with ${sound}.`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    const iSounds = [
        "Listen and distinguish /iː/ vs /ɪ/", "Words with /iː/", "Words with /ɪ/", "Minimal pairs: seat/sit, beat/bit",
        "Sentences with /iː/", "Sentences with /ɪ/", "Practice /iː/ in isolation", "Practice /ɪ/ in isolation",
        "Combine /iː/ and /ɪ/ in words", "Combine /iː/ and /ɪ/ in phrases", "Record yourself: /iː/ vs /ɪ/",
        "Feedback on /iː/ pronunciation", "Feedback on /ɪ/ pronunciation", "Review /iː/ and /ɪ/ together",
    ];
    for (let i = 0; i < 14; i++) {
        subLessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentLessonId: parentLessons[1]._id as mongoose.Types.ObjectId,
            title: `Lesson ${i + 1} - ${iSounds[i]}`,
            content: `Focus on ${iSounds[i].toLowerCase()}.`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    const aSounds = ["Introduction to /æ/, /ʌ/, /ɑː/", "Words with /æ/", "Words with /ʌ/", "Words with /ɑː/", "Minimal pairs: cat/cut, car/cup", "Sentences practice", "Review and record"];
    for (let i = 0; i < 7; i++) {
        subLessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentLessonId: parentLessons[2]._id as mongoose.Types.ObjectId,
            title: `Lesson ${i + 1} - ${aSounds[i]}`,
            content: `Practice ${aSounds[i].toLowerCase()}.`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    const thSounds = ["Introduction to /ð/ vs /θ/", "Words with /θ/", "Words with /ð/", "Minimal pairs: think/this", "Sentences with /θ/", "Sentences with /ð/", "Review and record"];
    for (let i = 0; i < 7; i++) {
        subLessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentLessonId: parentLessons[3]._id as mongoose.Types.ObjectId,
            title: `Lesson ${i + 1} - ${thSounds[i]}`,
            content: `Practice ${thSounds[i].toLowerCase()}.`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    const rzsSounds = ["Introduction to /r/, /z/, /ʃ/", "Words with /r/", "Words with /z/", "Words with /ʃ/", "Minimal pairs: rose/rows", "Sentences practice", "Review and record"];
    for (let i = 0; i < 7; i++) {
        subLessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentLessonId: parentLessons[4]._id as mongoose.Types.ObjectId,
            title: `Lesson ${i + 1} - ${rzsSounds[i]}`,
            content: `Practice ${rzsSounds[i].toLowerCase()}.`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    const intonationLessons = ["Introduction to English intonation", "Rising intonation: Yes/No questions", "Falling intonation: Statements", "Mixed intonation: Choice questions", "Practice and record"];
    for (let i = 0; i < 5; i++) {
        subLessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentLessonId: parentLessons[5]._id as mongoose.Types.ObjectId,
            title: `Lesson ${i + 1} - ${intonationLessons[i]}`,
            content: `Practice ${intonationLessons[i].toLowerCase()}.`,
            type: "pronunciation",
            level: 1,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
        });
    }

    const longerWords = ["Practice basic longer words", "Practice phrases with longer words"];
    for (let i = 0; i < 2; i++) {
        subLessonsData.push({
            courseId: course._id as mongoose.Types.ObjectId,
            parentLessonId: parentLessons[6]._id as mongoose.Types.ObjectId,
            title: `Lesson ${i + 1} - ${longerWords[i]}`,
            content: `Practice ${longerWords[i].toLowerCase()}.`,
            type: "pronunciation",
            level: 2,
            thumbnail: "",
            createdAt: new Date("2025-05-06T08:02:11.511Z"),
            updatedAt: new Date("2025-05-06T08:02:11.511Z"),
        });
    }

    const subLessons: ILesson[] = await Lesson.insertMany(subLessonsData) as unknown as ILesson[];

    // Define vocabulary data with unique words
    const endingSoundWords: EndingSoundWords = {
        "/p/": [
            { correct: "stop", wrong: "stock" },
            { correct: "deep", wrong: "deed" },
            { correct: "soap", wrong: "soak" },
            { correct: "leap", wrong: "lead" },
            { correct: "shop", wrong: "shock" },
        ],
        "/b/": [
            { correct: "web", wrong: "wet" },
            { correct: "club", wrong: "clue" },
            { correct: "job", wrong: "jog" },
            { correct: "grab", wrong: "grad" },
            { correct: "slab", wrong: "slack" },
        ],
        "/t/": [
            { correct: "beat", wrong: "bead" },
            { correct: "seat", wrong: "seed" },
            { correct: "meet", wrong: "mead" },
            { correct: "heat", wrong: "heed" },
            { correct: "feet", wrong: "feed" },
        ],
        "/d/": [
            { correct: "bed", wrong: "bet" },
            { correct: "red", wrong: "ret" },
            { correct: "sad", wrong: "sat" },
            { correct: "lid", wrong: "lit" },
            { correct: "nod", wrong: "not" },
        ],
        "/k/": [
            { correct: "back", wrong: "bag" },
            { correct: "lock", wrong: "log" },
            { correct: "sick", wrong: "sig" },
            { correct: "duck", wrong: "dug" },
            { correct: "kick", wrong: "kid" },
        ],
        "/g/": [
            { correct: "dog", wrong: "dot" },
            { correct: "bag", wrong: "bat" },
            { correct: "pig", wrong: "pit" },
            { correct: "fog", wrong: "fox" },
            { correct: "bug", wrong: "bud" },
        ],
        "/f/": [
            { correct: "leaf", wrong: "leak" },
            { correct: "roof", wrong: "root" },
            { correct: "off", wrong: "of" },
            { correct: "safe", wrong: "sake" },
            { correct: "cliff", wrong: "click" },
        ],
        "/v/": [
            { correct: "love", wrong: "loaf" },
            { correct: "dove", wrong: "dose" },
            { correct: "give", wrong: "gift" },
            { correct: "live", wrong: "lift" },
            { correct: "wave", wrong: "waist" },
        ],
        "/θ/": [
            { correct: "bath", wrong: "bass" },
            { correct: "path", wrong: "pass" },
            { correct: "teeth", wrong: "teethe" },
            { correct: "myth", wrong: "miss" },
            { correct: "truth", wrong: "truce" },
        ],
        "/ð/": [
            { correct: "this", wrong: "these" },
            { correct: "that", wrong: "than" },
            { correct: "with", wrong: "wit" },
            { correct: "breathe", wrong: "breed" },
            { correct: "clothe", wrong: "close" },
        ],
        "/s/": [
            { correct: "bus", wrong: "buzz" },
            { correct: "kiss", wrong: "kill" },
            { correct: "miss", wrong: "mix" },
            { correct: "dress", wrong: "drew" },
            { correct: "glass", wrong: "glad" },
        ],
        "/z/": [
            { correct: "zoo", wrong: "sue" },
            { correct: "buzz", wrong: "bud" },
            { correct: "nose", wrong: "noose" },
            { correct: "rose", wrong: "rows" },
            { correct: "jazz", wrong: "jar" },
        ],
        "/ʃ/": [
            { correct: "fish", wrong: "fit" },
            { correct: "wish", wrong: "wit" },
            { correct: "dish", wrong: "dip" },
            { correct: "rush", wrong: "rug" },
            { correct: "brush", wrong: "brute" },
        ],
        "/ʒ/": [
            { correct: "beige", wrong: "badge" },
            { correct: "garage", wrong: "garbage" },
            { correct: "measure", wrong: "mess" },
            { correct: "pleasure", wrong: "pledge" },
            { correct: "treasure", wrong: "trend" },
        ],
        "/h/": [
            { correct: "hope", wrong: "hop" },
            { correct: "house", wrong: "hose" },
            { correct: "hill", wrong: "ill" },
            { correct: "harm", wrong: "arm" },
            { correct: "huge", wrong: "use" },
        ],
        "/tʃ/": [
            { correct: "church", wrong: "search" },
            { correct: "watch", wrong: "wash" },
            { correct: "catch", wrong: "cash" },
            { correct: "match", wrong: "mash" },
            { correct: "teach", wrong: "teak" },
        ],
        "/dʒ/": [
            { correct: "judge", wrong: "jug" },
            { correct: "age", wrong: "ache" },
            { correct: "page", wrong: "pace" },
            { correct: "cage", wrong: "cake" },
            { correct: "edge", wrong: "etch" },
        ],
        "/m/": [
            { correct: "room", wrong: "rune" },
            { correct: "team", wrong: "teak" },
            { correct: "dream", wrong: "dread" },
            { correct: "arm", wrong: "art" },
            { correct: "him", wrong: "hid" },
        ],
        "/n/": [
            { correct: "sun", wrong: "sum" },
            { correct: "run", wrong: "rug" },
            { correct: "fun", wrong: "fund" },
            { correct: "man", wrong: "map" },
            { correct: "pin", wrong: "pig" },
        ],
        "/ŋ/": [
            { correct: "sing", wrong: "sink" },
            { correct: "ring", wrong: "rink" },
            { correct: "song", wrong: "son" },
            { correct: "king", wrong: "kin" },
            { correct: "wing", wrong: "win" },
        ],
    };

    const iSoundWords = {
        "/iː/": [
            { correct: "see", wrong: "sit" },
            { correct: "tree", wrong: "trip" },
            { correct: "green", wrong: "grin" },
            { correct: "sleep", wrong: "slip" },
            { correct: "need", wrong: "knit" },
        ],
        "/ɪ/": [
            { correct: "sit", wrong: "see" },
            { correct: "bit", wrong: "beat" },
            { correct: "ship", wrong: "sheep" },
            { correct: "lip", wrong: "leap" },
            { correct: "fit", wrong: "feet" },
        ],
    };

    const aSoundWords = {
        "/æ/": [
            { correct: "cat", wrong: "cut" },
            { correct: "hat", wrong: "hut" },
            { correct: "bat", wrong: "but" },
            { correct: "map", wrong: "mop" },
            { correct: "sad", wrong: "sod" },
        ],
        "/ʌ/": [
            { correct: "cup", wrong: "cap" },
            { correct: "but", wrong: "bat" },
            { correct: "cut", wrong: "cat" },
            { correct: "luck", wrong: "lack" },
            { correct: "run", wrong: "ran" },
        ],
        "/ɑː/": [
            { correct: "car", wrong: "core" },
            { correct: "far", wrong: "four" },
            { correct: "star", wrong: "store" },
            { correct: "bar", wrong: "bore" },
            { correct: "hard", wrong: "heard" },
        ],
    };

    const thSoundWords = {
        "/θ/": [
            { correct: "think", wrong: "sink" },
            { correct: "path", wrong: "pass" },
            { correct: "teeth", wrong: "teethe" },
            { correct: "myth", wrong: "miss" },
            { correct: "truth", wrong: "truce" },
        ],
        "/ð/": [
            { correct: "this", wrong: "these" },
            { correct: "that", wrong: "than" },
            { correct: "with", wrong: "wit" },
            { correct: "breathe", wrong: "breed" },
            { correct: "clothe", wrong: "close" },
        ],
    };

    const rzsSoundWords = {
        "/r/": [
            { correct: "road", wrong: "load" },
            { correct: "rain", wrong: "lane" },
            { correct: "rat", wrong: "lat" },
            { correct: "rock", wrong: "lock" },
            { correct: "rest", wrong: "lest" },
        ],
        "/z/": [
            { correct: "zoo", wrong: "sue" },
            { correct: "buzz", wrong: "bus" },
            { correct: "nose", wrong: "noose" },
            { correct: "rose", wrong: "rows" },
            { correct: "jazz", wrong: "jar" },
        ],
        "/ʃ/": [
            { correct: "fish", wrong: "fit" },
            { correct: "wish", wrong: "wit" },
            { correct: "dish", wrong: "dip" },
            { correct: "rush", wrong: "rug" },
            { correct: "brush", wrong: "brute" },
        ],
    };

    const intonationWords = [
        { correct: "yes", wrong: "yet" },
        { correct: "no", wrong: "now" },
        { correct: "hello", wrong: "halo" },
        { correct: "goodbye", wrong: "goodly" },
        { correct: "sorry", wrong: "sorely" },
    ];

    const longerWordsData = [
        { correct: "beautiful", wrong: "beauty" },
        { correct: "education", wrong: "educate" },
        { correct: "information", wrong: "inform" },
        { correct: "technology", wrong: "technical" },
        { correct: "relationship", wrong: "relative" },
    ];

    // Fetch word data with caching and fallback
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

    // Fetch vocabulary in smaller batches with longer delays
    const fetchVocabulary = async (wordPairs: { correct: string; wrong: string }[], sound: string): Promise<VocabularyItem[]> => {
        const vocabItems: VocabularyItem[] = [];
        const existingWords = new Set<string>();
        const batchSize = 2;

        for (let i = 0; i < wordPairs.length; i += batchSize) {
            const batch = wordPairs.slice(i, i + batchSize);
            const promises: Promise<VocabularyItem>[] = [];

            batch.forEach((pair, index) => {
                const pairIndex = i + index;
                promises.push(fetchWord(pair.correct, sound, true, pairIndex));
                promises.push(fetchWord(pair.wrong, sound, false, pairIndex));
            });

            const results = await Promise.all(promises);
            results.forEach(item => {
                if (item && !existingWords.has(item.word)) {
                    vocabItems.push(item);
                    existingWords.add(item.word);
                }
            });

            if (i + batchSize < wordPairs.length) {
                console.log(`Waiting 5 seconds before next batch...`);
                await delay(5000);
            }
        }

        return vocabItems;
    };

    // Create vocabulary and exercises
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

    const allWords = new Set<string>();

    for (const subLesson of subLessons) {
        let vocabWords: VocabularyItem[] = [];
        let lessonSound = subLesson.title.match(/\/[^/]+\//)?.[0] as string || "";

        if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[0]._id as mongoose.Types.ObjectId)) {
            const words = endingSoundWords[lessonSound] || [];
            vocabWords = await fetchVocabulary(words, lessonSound);
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[1]._id as mongoose.Types.ObjectId)) {
            if (subLesson.title.includes("/iː/") && !subLesson.title.includes("vs")) {
                vocabWords = await fetchVocabulary(iSoundWords["/iː/"], "/iː/");
            } else if (subLesson.title.includes("/ɪ/") && !subLesson.title.includes("vs")) {
                vocabWords = await fetchVocabulary(iSoundWords["/ɪ/"], "/ɪ/");
            } else {
                vocabWords = [...(await fetchVocabulary(iSoundWords["/iː/"], "/iː/")), ...(await fetchVocabulary(iSoundWords["/ɪ/"], "/ɪ/"))];
            }
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[2]._id as mongoose.Types.ObjectId)) {
            if (subLesson.title.includes("/æ/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(aSoundWords["/æ/"], "/æ/");
            } else if (subLesson.title.includes("/ʌ/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(aSoundWords["/ʌ/"], "/ʌ/");
            } else if (subLesson.title.includes("/ɑː/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(aSoundWords["/ɑː/"], "/ɑː/");
            } else {
                vocabWords = [...(await fetchVocabulary(aSoundWords["/æ/"], "/æ/")), ...(await fetchVocabulary(aSoundWords["/ʌ/"], "/ʌ/")), ...(await fetchVocabulary(aSoundWords["/ɑː/"], "/ɑː/"))];
            }
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[3]._id as mongoose.Types.ObjectId)) {
            if (subLesson.title.includes("/θ/") && !subLesson.title.includes("vs")) {
                vocabWords = await fetchVocabulary(thSoundWords["/θ/"], "/θ/");
            } else if (subLesson.title.includes("/ð/") && !subLesson.title.includes("vs")) {
                vocabWords = await fetchVocabulary(thSoundWords["/ð/"], "/ð/");
            } else {
                vocabWords = [...(await fetchVocabulary(thSoundWords["/θ/"], "/θ/")), ...(await fetchVocabulary(thSoundWords["/ð/"], "/ð/"))];
            }
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[4]._id as mongoose.Types.ObjectId)) {
            if (subLesson.title.includes("/r/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(rzsSoundWords["/r/"], "/r/");
            } else if (subLesson.title.includes("/z/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(rzsSoundWords["/z/"], "/z/");
            } else if (subLesson.title.includes("/ʃ/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(rzsSoundWords["/ʃ/"], "/ʃ/");
            } else {
                vocabWords = [...(await fetchVocabulary(rzsSoundWords["/r/"], "/r/")), ...(await fetchVocabulary(rzsSoundWords["/z/"], "/z/")), ...(await fetchVocabulary(rzsSoundWords["/ʃ/"], "/ʃ/"))];
            }
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[5]._id as mongoose.Types.ObjectId)) {
            vocabWords = await fetchVocabulary(intonationWords, "intonation");
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[6]._id as mongoose.Types.ObjectId)) {
            vocabWords = await fetchVocabulary(longerWordsData, "");
        }

        vocabWords.sort((a, b) => a.pairOrder - b.pairOrder);

        for (const vocab of vocabWords) {
            if (!allWords.has(vocab.word)) {
                vocabularyData.push({
                    lessonId: subLesson._id as mongoose.Types.ObjectId,
                    word: vocab.word,
                    phonetic: vocab.phonetic,
                    meaning: vocab.meaning,
                    exampleSentence: vocab.exampleSentence,
                    audioUrl: vocab.audioUrl || `https://example.com/audio/${vocab.word}.mp3`,
                    pairOrder: vocab.pairOrder,
                    createdAt: new Date("2025-05-06T08:02:11.445Z"),
                    updatedAt: new Date("2025-05-06T08:02:11.445Z"),
                });
                allWords.add(vocab.word);
            }
        }

        const exercise = {
            lessonId: subLesson._id as mongoose.Types.ObjectId,
            type: "pronunciation" as const,
            prompt: `Practice pronouncing the sounds in ${vocabWords.filter(v => v.isCorrect).map(v => v.word).join(", ")}`,
            correctPronunciation: vocabWords.filter(v => v.isCorrect).map(v => v.phonetic).join(" / ") || lessonSound || "N/A",
            difficultyLevel: "easy" as const,
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T08:02:11.445Z"),
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
        const subLessonVocabs = vocabularies.filter(v => {
            if (v.lessonId instanceof mongoose.Types.ObjectId && exercises[i].lessonId instanceof mongoose.Types.ObjectId) {
                return v.lessonId.equals(exercises[i].lessonId);
            }
            return false;
        });

        for (const vocab of subLessonVocabs) {
            exerciseVocabularyData.push({
                exerciseId: exercises[i]._id as mongoose.Types.ObjectId,
                vocabularyId: vocab._id as mongoose.Types.ObjectId,
                createdAt: new Date("2025-05-06T08:02:11.445Z"),
                updatedAt: new Date("2025-05-06T08:02:11.445Z"),
            });
        }

        historyData.push({
            userId,
            lessonId: exercises[i].lessonId as mongoose.Types.ObjectId,
            exerciseId: exercises[i]._id as mongoose.Types.ObjectId,
            attempts: 2,
            lastAttemptAt: new Date("2025-05-06T09:00:00.000Z"),
            createdAt: new Date("2025-05-06T08:02:11.445Z"),
            updatedAt: new Date("2025-05-06T09:00:00.000Z"),
        });
    }

    await Promise.all([
        ExerciseVocabulary.insertMany(exerciseVocabularyData),
        History.insertMany(historyData),
    ]);

    const userIdProgress = new mongoose.Types.ObjectId("6814e1d4f941dc16637b6235");
    const progressData = subLessons.map(lesson => ({
        lessonId: lesson._id as mongoose.Types.ObjectId,
        userId: userIdProgress,
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