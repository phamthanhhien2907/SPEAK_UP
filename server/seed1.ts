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

interface WordPair {
    correct: string;
    wrong: string;
}

interface SoundWords {
    correct: string[];
    wrong: string[];
}

interface SoundData {
    [key: string]: SoundWords;
}

interface VocabularyItem {
    word: string;
    phonetic?: string;
    meaning: string;
    exampleSentence: string;
    sound: string;
    audioUrl?: string;
    isCorrect: boolean;
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

const fetchWord = async (word: string, sound: string, isCorrect: boolean): Promise<VocabularyItem> => {
    if (wordCache[word]) {
        return { ...wordCache[word], sound, isCorrect };
    }

    // Only fetch correct words from the API
    if (isCorrect) {
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
            };

            wordCache[word] = vocabItem;
            return vocabItem;
        } catch (error: any) {
            console.warn(`Failed to fetch ${word}, using mock data:`, error.message);
        }
    }

    // For wrong words or failed fetches, use mock data
    const mockItem: VocabularyItem = {
        word,
        phonetic: `/${word}/`,
        meaning: `${word} meaning`,
        exampleSentence: `${word} in a sentence.`,
        sound,
        audioUrl: `https://example.com/audio/${word}.mp3`,
        isCorrect,
    };
    wordCache[word] = mockItem;
    return mockItem;
};

const fetchVocabulary = async (soundWords: SoundWords, sound: string): Promise<VocabularyItem[]> => {
    const vocabItems: VocabularyItem[] = [];
    const batchSize = 2;

    // Fetch correct words in batches
    for (let i = 0; i < soundWords.correct.length; i += batchSize) {
        const batch = soundWords.correct.slice(i, i + batchSize);
        const promises = batch.map(word => fetchWord(word, sound, true));
        const results = await Promise.all(promises);
        vocabItems.push(...results);

        if (i + batchSize < soundWords.correct.length) {
            console.log(`Waiting 5 seconds before next batch...`);
            await delay(5000);
        }
    }

    // Add wrong words without API calls
    for (const wrongWord of soundWords.wrong) {
        const vocabItem = await fetchWord(wrongWord, sound, false);
        vocabItems.push(vocabItem);
    }

    return vocabItems;
};

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI as string, {
        dbName: "speak-up",
    });
    console.log("Connected to MongoDB");

    await Promise.all([
        Course.deleteMany({}),
        Lesson.deleteMany({}),
        LessonProgress.deleteMany({}),
        Vocabulary.deleteMany({}),
        Exercise.deleteMany({}),
        History.deleteMany({}),
        ExerciseVocabulary.deleteMany({}),
    ]);

    const course = await Course.create({
        _id: new mongoose.Types.ObjectId("6819c20302afe322ee61b1d2"),
        title: "English Pronunciation with IPA",
        description: "Master English pronunciation using the International Phonetic Alphabet",
        level: "beginner",
        thumbnail: "https://dummyimage.com/600x400/000/fff",
        createdAt: new Date("2025-05-06T08:02:11.316Z"),
        updatedAt: new Date("2025-05-06T08:02:11.316Z"),
    });

    const parentLessonsData: ILessonInput[] = [
        { courseId: course._id as mongoose.Types.ObjectId, title: "Ending Sounds", content: "Practice consonant sounds at the end of words", type: "pronunciation", level: 1, thumbnail: "http://localhost:8080/static/circle.png", createdAt: new Date("2025-05-06T08:02:11.316Z"), updatedAt: new Date("2025-05-06T08:02:11.316Z") },
        { courseId: course._id as mongoose.Types.ObjectId, title: "/iː/ vs /ɪ/", content: "Distinguish between long /iː/ and short /ɪ/ vowel sounds", type: "pronunciation", level: 1, thumbnail: "http://localhost:8080/static/circle_1.png", createdAt: new Date("2025-05-06T08:02:11.316Z"), updatedAt: new Date("2025-05-06T08:02:11.316Z") },
        { courseId: course._id as mongoose.Types.ObjectId, title: "/æ/, /ʌ/, /ɑː/", content: "Practice the vowel sounds /æ/, /ʌ/, and /ɑː/", type: "pronunciation", level: 1, thumbnail: "http://localhost:8080/static/circle_2.png", createdAt: new Date("2025-05-06T08:02:11.316Z"), updatedAt: new Date("2025-05-06T08:02:11.316Z") },
        { courseId: course._id as mongoose.Types.ObjectId, title: "/ð/ vs /θ/", content: "Distinguish between voiced /ð/ and voiceless /θ/ sounds", type: "pronunciation", level: 1, thumbnail: "http://localhost:8080/static/circle_3.png", createdAt: new Date("2025-05-06T08:02:11.316Z"), updatedAt: new Date("2025-05-06T08:02:11.316Z") },
        { courseId: course._id as mongoose.Types.ObjectId, title: "/r/, /z/, /ʃ/", content: "Practice the consonant sounds /r/, /z/, and /ʃ/", type: "pronunciation", level: 1, thumbnail: "http://localhost:8080/static/circle_4.png", createdAt: new Date("2025-05-06T08:02:11.316Z"), updatedAt: new Date("2025-05-06T08:02:11.316Z") },
        { courseId: course._id as mongoose.Types.ObjectId, title: "Intonation", content: "Learn English intonation patterns", type: "pronunciation", level: 1, thumbnail: "http://localhost:8080/static/circle_5.png", createdAt: new Date("2025-05-06T08:02:11.316Z"), updatedAt: new Date("2025-05-06T08:02:11.316Z") },
        { courseId: course._id as mongoose.Types.ObjectId, title: "Longer Words", content: "Practice pronunciation of longer words and phrases", type: "pronunciation", level: 2, thumbnail: "http://localhost:8080/static/circle_6.png", createdAt: new Date("2025-05-06T08:02:11.316Z"), updatedAt: new Date("2025-05-06T08:02:11.316Z") },
    ];

    const parentLessons: ILesson[] = await Lesson.insertMany(parentLessonsData.map(lesson => ({ ...lesson, thumbnail: course?.thumbnail }))) as unknown as ILesson[];

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

    const iSounds = ["Listen and distinguish /iː/ vs /ɪ/", "Words with /iː/", "Words with /ɪ/", "Minimal pairs: seat/sit, beat/bit", "Sentences with /iː/", "Sentences with /ɪ/", "Practice /iː/ in isolation", "Practice /ɪ/ in isolation", "Combine /iː/ and /ɪ/ in words", "Combine /iː/ and /ɪ/ in phrases", "Record yourself: /iː/ vs /ɪ/", "Feedback on /iː/ pronunciation", "Feedback on /ɪ/ pronunciation", "Review /iː/ and /ɪ/ together"];
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

    const endingSoundWords: SoundData = {
        "/p/": { correct: ["stop", "map", "cap", "lip", "sip"], wrong: ["stock", "mat", "cat", "lit", "sit"] },
        "/b/": { correct: ["web", "club", "job", "cab", "rib"], wrong: ["wet", "clue", "jog", "cap", "rip"] },
        "/t/": { correct: ["cat", "hat", "mat", "bat", "sit"], wrong: ["cap", "hot", "map", "bad", "sip"] },
        "/d/": { correct: ["bed", "red", "sad", "mad", "kid"], wrong: ["bet", "rat", "sat", "mat", "kit"] },
        "/k/": { correct: ["back", "lock", "sick", "duck", "kick"], wrong: ["bag", "log", "sit", "dock", "kit"] },
        "/g/": { correct: ["dog", "bag", "pig", "fog", "bug"], wrong: ["dot", "bat", "pit", "log", "but"] },
        "/f/": { correct: ["leaf", "roof", "off", "safe", "elf"], wrong: ["leave", "room", "of", "save", "else"] },
        "/v/": { correct: ["love", "dove", "give", "live", "wave"], wrong: ["live", "dive", "gift", "leave", "wage"] },
        "/θ/": { correct: ["bath", "path", "teeth", "math", "truth"], wrong: ["bat", "pat", "teethe", "mat", "true"] },
        "/ð/": { correct: ["this", "that", "with", "mother", "father"], wrong: ["these", "hat", "wit", "mutter", "farther"] },
        "/s/": { correct: ["bus", "kiss", "miss", "class", "dress"], wrong: ["buzz", "kit", "mix", "clash", "drew"] },
        "/z/": { correct: ["zoo", "buzz", "nose", "rose", "jazz"], wrong: ["sue", "bus", "noose", "rows", "jar"] },
        "/ʃ/": { correct: ["fish", "wish", "dish", "rush", "brush"], wrong: ["fit", "wit", "dip", "rut", "brut"] },
        "/ʒ/": { correct: ["beige", "garage", "measure", "pleasure", "treasure"], wrong: ["badge", "garbage", "mature", "pressure", "tressure"] },
        "/h/": { correct: ["hat", "hit", "hot", "hope", "house"], wrong: ["hot", "hot", "hat", "hop", "hose"] },
        "/tʃ/": { correct: ["church", "watch", "catch", "match", "teach"], wrong: ["search", "wash", "cash", "mash", "teak"] },
        "/dʒ/": { correct: ["judge", "age", "page", "cage", "edge"], wrong: ["jut", "ache", "pace", "cake", "etch"] },
        "/m/": { correct: ["room", "team", "dream", "arm", "him"], wrong: ["root", "teat", "dread", "art", "hit"] },
        "/n/": { correct: ["sun", "run", "fun", "man", "pin"], wrong: ["sum", "rum", "funny", "mat", "pit"] },
        "/ŋ/": { correct: ["sing", "ring", "song", "king", "wing"], wrong: ["sin", "rang", "son", "kin", "win"] },
    };

    const iSoundWords: { [key: string]: SoundWords } = {
        "/iː/": { correct: ["see", "tree", "green", "deep", "feet"], wrong: ["sit", "trip", "grin", "dip", "fit"] },
        "/ɪ/": { correct: ["sit", "bit", "hit", "lip", "fit"], wrong: ["see", "beat", "heat", "leap", "feet"] },
    };

    const aSoundWords: { [key: string]: SoundWords } = {
        "/æ/": { correct: ["cat", "hat", "bat", "map", "sad"], wrong: ["cut", "hot", "but", "mop", "sod"] },
        "/ʌ/": { correct: ["cup", "but", "cut", "sun", "run"], wrong: ["cap", "bat", "cat", "son", "ran"] },
        "/ɑː/": { correct: ["car", "far", "star", "bar", "hard"], wrong: ["core", "four", "store", "bore", "heard"] },
    };

    const thSoundWords: { [key: string]: SoundWords } = {
        "/θ/": { correct: ["bath", "path", "teeth", "math", "truth"], wrong: ["bat", "pat", "teethe", "mat", "true"] },
        "/ð/": { correct: ["this", "that", "with", "mother", "father"], wrong: ["these", "hat", "wit", "mutter", "farther"] },
    };

    const rzsSoundWords: { [key: string]: SoundWords } = {
        "/r/": { correct: ["red", "run", "rat", "rose", "rain"], wrong: ["led", "lung", "lat", "lose", "lane"] },
        "/z/": { correct: ["zoo", "buzz", "nose", "rose", "jazz"], wrong: ["sue", "bus", "noose", "rows", "jar"] },
        "/ʃ/": { correct: ["fish", "wish", "dish", "rush", "brush"], wrong: ["fit", "wit", "dip", "rut", "brut"] },
    };

    const intonationWords: SoundWords = {
        correct: ["yes", "no", "hello", "goodbye", "sorry"],
        wrong: ["yet", "now", "halo", "goodly", "sorely"],
    };

    const longerWordsData: SoundWords = {
        correct: ["beautiful", "education", "information", "technology", "relationship"],
        wrong: ["beauty", "educate", "inform", "technical", "relative"],
    };

    const vocabularyData: Array<{
        lessonId: mongoose.Types.ObjectId;
        word: string;
        phonetic?: string;
        meaning: string;
        exampleSentence: string;
        audioUrl: string;
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
            const words = endingSoundWords[lessonSound] || { correct: [], wrong: [] };
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

        for (const vocab of vocabWords) {
            if (!allWords.has(vocab.word)) {
                vocabularyData.push({
                    lessonId: subLesson._id as mongoose.Types.ObjectId,
                    word: vocab.word,
                    phonetic: vocab.phonetic,
                    meaning: vocab.meaning,
                    exampleSentence: vocab.exampleSentence,
                    audioUrl: vocab.audioUrl || `https://example.com/audio/${vocab.word}.mp3`,
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