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

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI as string, {
        dbName: "speak-up",
    });
    console.log("Connected to MongoDB");

    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await LessonProgress.deleteMany({});
    await Vocabulary.deleteMany({});
    await Exercise.deleteMany({});
    await History.deleteMany({});
    await ExerciseVocabulary.deleteMany({});

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
            thumbnail: lesson?.thumbnail,
        }))
    ) as unknown as ILesson[];

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
        "Listen and distinguish /iː/ vs /ɪ/",
        "Words with /iː/",
        "Words with /ɪ/",
        "Minimal pairs: seat/sit, beat/bit",
        "Sentences with /iː/",
        "Sentences with /ɪ/",
        "Practice /iː/ in isolation",
        "Practice /ɪ/ in isolation",
        "Combine /iː/ and /ɪ/ in words",
        "Combine /iː/ and /ɪ/ in phrases",
        "Record yourself: /iː/ vs /ɪ/",
        "Feedback on /iː/ pronunciation",
        "Feedback on /ɪ/ pronunciation",
        "Review /iː/ and /ɪ/ together",
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

    const aSounds = [
        "Introduction to /æ/, /ʌ/, /ɑː/",
        "Words with /æ/",
        "Words with /ʌ/",
        "Words with /ɑː/",
        "Minimal pairs: cat/cut, car/cup",
        "Sentences practice",
        "Review and record",
    ];
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

    const thSounds = [
        "Introduction to /ð/ vs /θ/",
        "Words with /θ/",
        "Words with /ð/",
        "Minimal pairs: think/this",
        "Sentences with /θ/",
        "Sentences with /ð/",
        "Review and record",
    ];
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

    const rzsSounds = [
        "Introduction to /r/, /z/, /ʃ/",
        "Words with /r/",
        "Words with /z/",
        "Words with /ʃ/",
        "Minimal pairs: rose/rows",
        "Sentences practice",
        "Review and record",
    ];
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

    const intonationLessons = [
        "Introduction to English intonation",
        "Rising intonation: Yes/No questions",
        "Falling intonation: Statements",
        "Mixed intonation: Choice questions",
        "Practice and record",
    ];
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

    const longerWords = [
        "Practice basic longer words",
        "Practice phrases with longer words",
    ];
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

    // Sử dụng Map để theo dõi các từ theo lessonId
    const wordsByLesson = new Map<string, Set<string>>();

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchVocabulary = async (wordPairs: { correct: string; wrong: string }[], sound: string, lessonId: string) => {
        const vocabItems: VocabularyItem[] = [];

        // Khởi tạo Set cho lessonId nếu chưa có
        if (!wordsByLesson.has(lessonId)) {
            wordsByLesson.set(lessonId, new Set<string>());
        }
        const lessonWords = wordsByLesson.get(lessonId)!;

        for (const pair of wordPairs) {
            // Fetch correct word
            try {
                const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${pair.correct}`);
                const data = response.data[0];
                const phonetic = data.phonetic || data.phonetics?.[0]?.text || "";
                const audioUrl = data.phonetics?.find((p: any) => p.audio)?.audio || "";
                const meanings = data.meanings || [];
                if (meanings.length > 0) {
                    const meaning = meanings[0].definitions[0].definition || "No definition available";
                    const example = meanings[0].definitions[0].example || `${pair.correct} in a sentence.`;
                    if (!lessonWords.has(pair.correct)) {
                        vocabItems.push({
                            word: pair.correct,
                            phonetic,
                            meaning,
                            exampleSentence: example,
                            sound,
                            audioUrl,
                            isCorrect: true,
                        });
                        lessonWords.add(pair.correct);
                    }
                }
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    console.warn(`Word "${pair.correct}" not found in API, skipping...`);
                } else {
                    console.error(`Error fetching ${pair.correct}:`, error);
                }
            }
            await delay(1000);

            // Fetch wrong word
            try {
                const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${pair.wrong}`);
                const data = response.data[0];
                const phonetic = data.phonetic || data.phonetics?.[0]?.text || "";
                const audioUrl = data.phonetics?.find((p: any) => p.audio)?.audio || "";
                const meanings = data.meanings || [];
                if (meanings.length > 0) {
                    const meaning = meanings[0].definitions[0].definition || "No definition available";
                    const example = meanings[0].definitions[0].example || `${pair.wrong} in a sentence.`;
                    if (!lessonWords.has(pair.wrong)) {
                        vocabItems.push({
                            word: pair.wrong,
                            phonetic,
                            meaning,
                            exampleSentence: example,
                            sound,
                            audioUrl,
                            isCorrect: false,
                        });
                        lessonWords.add(pair.wrong);
                    }
                }
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    console.warn(`Wrong word "${pair.wrong}" not found in API, skipping...`);
                } else {
                    console.error(`Error fetching ${pair.wrong}:`, error);
                }
            }
            await delay(1000);
        }
        return vocabItems;
    };

    const endingSoundWords: EndingSoundWords = {
        "/p/": [
            { correct: "stop", wrong: "stock" },
            { correct: "map", wrong: "mat" },
            { correct: "cap", wrong: "cat" },
            { correct: "lip", wrong: "lit" },
            { correct: "sip", wrong: "sit" },
        ],
        "/b/": [
            { correct: "web", wrong: "wet" },
            { correct: "club", wrong: "clue" },
            { correct: "job", wrong: "jog" },
            { correct: "cab", wrong: "cap" },
            { correct: "rib", wrong: "rip" },
        ],
        "/t/": [
            { correct: "cat", wrong: "cap" },
            { correct: "hat", wrong: "hot" },
            { correct: "mat", wrong: "map" },
            { correct: "bat", wrong: "bad" },
            { correct: "sit", wrong: "sip" },
        ],
        "/d/": [
            { correct: "bed", wrong: "bet" },
            { correct: "red", wrong: "rat" },
            { correct: "sad", wrong: "sat" },
            { correct: "mad", wrong: "mat" },
            { correct: "kid", wrong: "kit" },
        ],
        "/k/": [
            { correct: "back", wrong: "bag" },
            { correct: "lock", wrong: "log" },
            { correct: "sick", wrong: "sit" },
            { correct: "duck", wrong: "dock" },
            { correct: "kick", wrong: "kit" },
        ],
        "/g/": [
            { correct: "dog", wrong: "dot" },
            { correct: "bag", wrong: "bat" },
            { correct: "pig", wrong: "pit" },
            { correct: "fog", wrong: "log" },
            { correct: "bug", wrong: "but" },
        ],
        "/f/": [
            { correct: "leaf", wrong: "leave" },
            { correct: "roof", wrong: "room" },
            { correct: "off", wrong: "of" },
            { correct: "safe", wrong: "save" },
            { correct: "elf", wrong: "else" },
        ],
        "/v/": [
            { correct: "love", wrong: "live" },
            { correct: "dove", wrong: "dive" },
            { correct: "give", wrong: "gift" },
            { correct: "live", wrong: "leave" },
            { correct: "wave", wrong: "wage" },
        ],
        "/θ/": [
            { correct: "think", wrong: "this" },
            { correct: "bath", wrong: "bat" },
            { correct: "teeth", wrong: "teethe" },
            { correct: "path", wrong: "pat" },
            { correct: "math", wrong: "mat" },
        ],
        "/ð/": [
            { correct: "this", wrong: "think" },
            { correct: "that", wrong: "hat" },
            { correct: "with", wrong: "wit" },
            { correct: "mother", wrong: "mutter" },
            { correct: "father", wrong: "farther" },
        ],
        "/s/": [
            { correct: "bus", wrong: "buzz" },
            { correct: "kiss", wrong: "kit" },
            { correct: "miss", wrong: "mix" },
            { correct: "class", wrong: "clash" },
            { correct: "dress", wrong: "drew" },
        ],
        "/z/": [
            { correct: "zoo", wrong: "sue" },
            { correct: "buzz", wrong: "bus" },
            { correct: "nose", wrong: "noose" },
            { correct: "rose", wrong: "rows" },
            { correct: "jazz", wrong: "jar" },
        ],
        "/ʃ/": [
            { correct: "shoe", wrong: "sue" },
            { correct: "fish", wrong: "fit" },
            { correct: "wish", wrong: "wit" },
            { correct: "dish", wrong: "dip" },
            { correct: "rush", wrong: "rut" },
        ],
        "/ʒ/": [
            { correct: "beige", wrong: "badge" },
            { correct: "garage", wrong: "garbage" },
            { correct: "measure", wrong: "mature" },
            { correct: "pleasure", wrong: "pressure" },
            { correct: "treasure", wrong: "tressure" },
        ],
        "/h/": [
            { correct: "hat", wrong: "hot" },
            { correct: "hit", wrong: "hot" },
            { correct: "hot", wrong: "hat" },
            { correct: "hope", wrong: "hop" },
            { correct: "house", wrong: "hose" },
        ],
        "/tʃ/": [
            { correct: "church", wrong: "search" },
            { correct: "watch", wrong: "wash" },
            { correct: "catch", wrong: "cash" },
            { correct: "match", wrong: "mash" },
            { correct: "teach", wrong: "teak" },
        ],
        "/dʒ/": [
            { correct: "judge", wrong: "jut" },
            { correct: "age", wrong: "ache" },
            { correct: "page", wrong: "pace" },
            { correct: "cage", wrong: "cake" },
            { correct: "edge", wrong: "etch" },
        ],
        "/m/": [
            { correct: "room", wrong: "root" },
            { correct: "team", wrong: "teat" },
            { correct: "dream", wrong: "dread" },
            { correct: "arm", wrong: "art" },
            { correct: "him", wrong: "hit" },
        ],
        "/n/": [
            { correct: "sun", wrong: "sum" },
            { correct: "run", wrong: "rum" },
            { correct: "fun", wrong: "funny" },
            { correct: "man", wrong: "mat" },
            { correct: "pin", wrong: "pit" },
        ],
        "/ŋ/": [
            { correct: "sing", wrong: "sin" },
            { correct: "ring", wrong: "rang" },
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
            { correct: "deep", wrong: "dip" },
            { correct: "feet", wrong: "fit" },
        ],
        "/ɪ/": [
            { correct: "sit", wrong: "see" },
            { correct: "bit", wrong: "beat" },
            { correct: "hit", wrong: "heat" },
            { correct: "lip", wrong: "leap" },
            { correct: "fit", wrong: "feet" },
        ],
    };

    const aSoundWords = {
        "/æ/": [
            { correct: "cat", wrong: "cut" },
            { correct: "hat", wrong: "hot" },
            { correct: "bat", wrong: "but" },
            { correct: "map", wrong: "mop" },
            { correct: "sad", wrong: "sod" },
        ],
        "/ʌ/": [
            { correct: "cup", wrong: "cap" },
            { correct: "but", wrong: "bat" },
            { correct: "cut", wrong: "cat" },
            { correct: "sun", wrong: "son" },
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
            { correct: "think", wrong: "this" },
            { correct: "bath", wrong: "bat" },
            { correct: "teeth", wrong: "teethe" },
            { correct: "path", wrong: "pat" },
            { correct: "math", wrong: "mat" },
        ],
        "/ð/": [
            { correct: "this", wrong: "think" },
            { correct: "that", wrong: "hat" },
            { correct: "with", wrong: "wit" },
            { correct: "mother", wrong: "mutter" },
            { correct: "father", wrong: "farther" },
        ],
    };

    const rzsSoundWords = {
        "/r/": [
            { correct: "red", wrong: "led" },
            { correct: "run", wrong: "lung" },
            { correct: "rat", wrong: "lat" },
            { correct: "rose", wrong: "lose" },
            { correct: "rain", wrong: "lane" },
        ],
        "/z/": [
            { correct: "zoo", wrong: "sue" },
            { correct: "buzz", wrong: "bus" },
            { correct: "nose", wrong: "noose" },
            { correct: "rose", wrong: "rows" },
            { correct: "jazz", wrong: "jar" },
        ],
        "/ʃ/": [
            { correct: "shoe", wrong: "sue" },
            { correct: "fish", wrong: "fit" },
            { correct: "wish", wrong: "wit" },
            { correct: "dish", wrong: "dip" },
            { correct: "rush", wrong: "rut" },
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

    for (const subLesson of subLessons) {
        let vocabWords: VocabularyItem[] = [];
        let lessonSound = subLesson.title.match(/\/[^/]+\//)?.[0] as string || "";
        const lessonId = subLesson?._id?.toString() as string;

        if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[0]._id as mongoose.Types.ObjectId)) {
            const words = endingSoundWords[lessonSound] || [];
            vocabWords = await fetchVocabulary(words, lessonSound, lessonId);
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[1]._id as mongoose.Types.ObjectId)) {
            if (subLesson.title.includes("/iː/") && !subLesson.title.includes("vs")) {
                vocabWords = await fetchVocabulary(iSoundWords["/iː/"], "/iː/", lessonId);
            } else if (subLesson.title.includes("/ɪ/") && !subLesson.title.includes("vs")) {
                vocabWords = await fetchVocabulary(iSoundWords["/ɪ/"], "/ɪ/", lessonId);
            } else {
                vocabWords = [...(await fetchVocabulary(iSoundWords["/iː/"], "/iː/", lessonId)), ...(await fetchVocabulary(iSoundWords["/ɪ/"], "/ɪ/", lessonId))];
            }
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[2]._id as mongoose.Types.ObjectId)) {
            if (subLesson.title.includes("/æ/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(aSoundWords["/æ/"], "/æ/", lessonId);
            } else if (subLesson.title.includes("/ʌ/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(aSoundWords["/ʌ/"], "/ʌ/", lessonId);
            } else if (subLesson.title.includes("/ɑː/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(aSoundWords["/ɑː/"], "/ɑː/", lessonId);
            } else {
                vocabWords = [...(await fetchVocabulary(aSoundWords["/æ/"], "/æ/", lessonId)), ...(await fetchVocabulary(aSoundWords["/ʌ/"], "/ʌ/", lessonId)), ...(await fetchVocabulary(aSoundWords["/ɑː/"], "/ɑː/", lessonId))];
            }
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[3]._id as mongoose.Types.ObjectId)) {
            if (subLesson.title.includes("/θ/") && !subLesson.title.includes("vs")) {
                vocabWords = await fetchVocabulary(thSoundWords["/θ/"], "/θ/", lessonId);
            } else if (subLesson.title.includes("/ð/") && !subLesson.title.includes("vs")) {
                vocabWords = await fetchVocabulary(thSoundWords["/ð/"], "/ð/", lessonId);
            } else {
                vocabWords = [...(await fetchVocabulary(thSoundWords["/θ/"], "/θ/", lessonId)), ...(await fetchVocabulary(thSoundWords["/ð/"], "/ð/", lessonId))];
            }
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[4]._id as mongoose.Types.ObjectId)) {
            if (subLesson.title.includes("/r/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(rzsSoundWords["/r/"], "/r/", lessonId);
            } else if (subLesson.title.includes("/z/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(rzsSoundWords["/z/"], "/z/", lessonId);
            } else if (subLesson.title.includes("/ʃ/") && !subLesson.title.includes("Introduction") && !subLesson.title.includes("Minimal pairs")) {
                vocabWords = await fetchVocabulary(rzsSoundWords["/ʃ/"], "/ʃ/", lessonId);
            } else {
                vocabWords = [...(await fetchVocabulary(rzsSoundWords["/r/"], "/r/", lessonId)), ...(await fetchVocabulary(rzsSoundWords["/z/"], "/z/", lessonId)), ...(await fetchVocabulary(rzsSoundWords["/ʃ/"], "/ʃ/", lessonId))];
            }
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[5]._id as mongoose.Types.ObjectId)) {
            vocabWords = await fetchVocabulary(intonationWords, "intonation", lessonId);
        } else if (subLesson.parentLessonId instanceof mongoose.Types.ObjectId && subLesson.parentLessonId.equals(parentLessons[6]._id as mongoose.Types.ObjectId)) {
            vocabWords = await fetchVocabulary(longerWordsData, "", lessonId);
        }

        for (const vocab of vocabWords) {
            const vocabulary = {
                lessonId: subLesson._id as mongoose.Types.ObjectId,
                word: vocab.word,
                phonetic: vocab.phonetic,
                meaning: vocab.meaning,
                exampleSentence: vocab.exampleSentence,
                audioUrl: vocab.audioUrl || `https://example.com/audio/${vocab.word}.mp3`,
                createdAt: new Date("2025-05-06T08:02:11.445Z"),
                updatedAt: new Date("2025-05-06T08:02:11.445Z"),
            };
            vocabularyData.push(vocabulary);
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

    const vocabularies = await Vocabulary.insertMany(vocabularyData) as IVocabularyDoc[];
    const exercises = await Exercise.insertMany(exercisesData) as IExerciseDoc[];

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

    await ExerciseVocabulary.insertMany(exerciseVocabularyData);
    await History.insertMany(historyData);

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