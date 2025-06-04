import mongoose from "mongoose";
import dotenv from "dotenv";
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

interface IExerciseCreate {
    lessonId: mongoose.Types.ObjectId;
    type: "pronunciation" | "repeat_sentence";
    prompt: string;
    correctPronunciation: string;
    difficultyLevel: "easy" | "medium" | "hard";
}

dotenv.config();

// --- UTILITIES ---
const wordCache: { [word: string]: VocabularyItem } = {};

const getVocabularyItem = (wordOrPhrase: string, isCorrect: boolean, pairOrder: number): VocabularyItem => {
    const normalizedTerm = wordOrPhrase.toLowerCase().trim();
    if (wordCache[normalizedTerm]) {
        return { ...wordCache[normalizedTerm], isCorrect, pairOrder };
    }

    const isPhrase = normalizedTerm.includes(" ");

    const customPhrases: { [key: string]: { phonetic?: string; meaning: string; exampleSentence: string } } = {
        // Work and Career
        "agenda": { phonetic: "/əˈdʒɛndə/", meaning: "A list of items to be discussed at a meeting", exampleSentence: "The meeting agenda includes budget planning and project updates." },
        "objective": { phonetic: "/əbˈdʒɛktɪv/", meaning: "A specific goal or aim", exampleSentence: "Our objective is to increase sales by 10% this quarter." },
        "item": { phonetic: "/ˈaɪtəm/", meaning: "A single topic or unit in a list", exampleSentence: "The next item on the agenda is team restructuring." },
        "kick off": { meaning: "To start something, like a meeting or project", exampleSentence: "Let’s kick off the meeting with a quick introduction." },
        "wrap up": { meaning: "To conclude or finish something", exampleSentence: "We need to wrap up this discussion by 3 PM." },
        "time allocation": { meaning: "Assigning specific time periods for tasks", exampleSentence: "Time allocation for each agenda item is crucial for efficiency." },
        "quarterly report": { meaning: "A summary of activities or performance every three months", exampleSentence: "The quarterly report shows strong growth in revenue." },
        "key findings": { meaning: "The most important results from a study or analysis", exampleSentence: "The key findings suggest we need more marketing efforts." },
        "data shows": { meaning: "Information or evidence indicates", exampleSentence: "The data shows a significant increase in customer satisfaction." },
        "projections": { phonetic: "/prəˈdʒɛkʃənz/", meaning: "Estimates or forecasts of future trends", exampleSentence: "Our projections indicate a profitable year ahead." },
        "recommendations": { phonetic: "/ˌrɛkəmɛnˈdeɪʃənz/", meaning: "Suggestions for actions or improvements", exampleSentence: "The report includes recommendations for cost reduction." },
        "executive summary": { meaning: "A brief overview of a report’s main points", exampleSentence: "The executive summary highlights our strategic goals." },
        "constructive criticism": { meaning: "Feedback intended to help improve", exampleSentence: "She offered constructive criticism to enhance the project." },
        "i see your point": { meaning: "Acknowledging someone’s perspective", exampleSentence: "I see your point, but we need more data to decide." },
        "could you elaborate?": { meaning: "Requesting more details or explanation", exampleSentence: "Could you elaborate on your proposal for the new system?" },
        "moving forward": { meaning: "Continuing or progressing in the future", exampleSentence: "Moving forward, we’ll implement these changes." },
        "actionable feedback": { meaning: "Feedback that can be acted upon", exampleSentence: "Please provide actionable feedback to improve our workflow." },
        "how may i assist you?": { meaning: "Offering help in a customer service context", exampleSentence: "How may I assist you with your purchase today?" },
        "look into that for you": { meaning: "Promising to investigate an issue", exampleSentence: "I’ll look into that for you and get back soon." },
        "inquiry": { phonetic: "/ɪnˈkwaɪəri/", meaning: "A question or request for information", exampleSentence: "We received an inquiry about product availability." },
        "availability": { phonetic: "/əˌveɪləˈbɪlɪti/", meaning: "The state of being accessible or in stock", exampleSentence: "Please check the availability of the item." },
        "product specifications": { meaning: "Details about a product’s features", exampleSentence: "The product specifications are listed on our website." },
        "i understand your frustration": { meaning: "Empathizing with a customer’s complaint", exampleSentence: "I understand your frustration, and we’ll fix this issue." },
        "we sincerely apologize for the inconvenience": { meaning: "Formal apology for a service issue", exampleSentence: "We sincerely apologize for the inconvenience caused." },
        "resolve the issue": { meaning: "Addressing and fixing a problem", exampleSentence: "We will resolve the issue within 24 hours." },
        "as a gesture of goodwill": { meaning: "Offering something to appease a customer", exampleSentence: "We’ll refund you as a gesture of goodwill." },
        "team player": { meaning: "Someone who works well in a group", exampleSentence: "Being a team player is essential for this role." },
        "problem-solving skills": { meaning: "Ability to find solutions to challenges", exampleSentence: "My problem-solving skills helped us meet deadlines." },
        "adaptable": { phonetic: "/əˈdæptəbəl/", meaning: "Able to adjust to new conditions", exampleSentence: "She’s highly adaptable to changing work environments." },
        "detail-oriented": { meaning: "Focused on small details", exampleSentence: "We need a detail-oriented person for this task." },
        "leadership qualities": { meaning: "Traits that make someone a good leader", exampleSentence: "Her leadership qualities inspire the team." },
        "tell me about a time when you faced a challenge at work.": { meaning: "Responding to a behavioral interview question", exampleSentence: "Tell me about a time when you faced a challenge at work." },
        "star method": { meaning: "A technique for answering behavioral interview questions", exampleSentence: "I used the STAR method to structure my response." },
        "handled a conflict": { meaning: "Managed a disagreement effectively", exampleSentence: "I handled a conflict between team members calmly." },
        "managed a tight deadline": { meaning: "Completed work under time pressure", exampleSentence: "I managed a tight deadline by prioritizing tasks." },
        // Lifestyle
        "fitting room": { phonetic: "/ˈfɪtɪŋ ruːm/", meaning: "A space to try on clothes", exampleSentence: "Can I use the fitting room to try this shirt?" },
        "do you have this in a different size?": { meaning: "Asking about product availability", exampleSentence: "Do you have this in a different size?" },
        "on sale": { meaning: "Available at a discounted price", exampleSentence: "This jacket is on sale for 20% off." },
        "return policy": { meaning: "Rules for returning purchased items", exampleSentence: "What’s your store’s return policy?" },
        "receipt": { phonetic: "/rɪˈsiːt/", meaning: "A document proving purchase", exampleSentence: "Please keep your receipt for returns." },
        "aisle": { phonetic: "/aɪl/", meaning: "A passageway between shelves in a store", exampleSentence: "The cereals are in aisle five." },
        "shopping cart": { meaning: "A wheeled basket for carrying items", exampleSentence: "I filled my shopping cart with groceries." },
        "checkout counter": { meaning: "The place where purchases are paid for", exampleSentence: "Please proceed to the checkout counter." },
        "fresh produce": { meaning: "Unprocessed fruits and vegetables", exampleSentence: "The fresh produce section has organic apples." },
        "loyalty card": { meaning: "A card offering discounts to regular customers", exampleSentence: "Do you have a loyalty card for extra savings?" },
        "i'd like to book a table": { meaning: "Requesting a restaurant reservation", exampleSentence: "I’d like to book a table for two." },
        "for two people": { meaning: "Specifying the number of guests", exampleSentence: "We need a table for two people." },
        "at 7 pm": { meaning: "Specifying a time for a reservation", exampleSentence: "Can you book it at 7 PM?" },
        "under the name": { meaning: "Providing a name for a reservation", exampleSentence: "The reservation is under the name Smith." },
        "what do you recommend?": { meaning: "Asking for a suggestion in a restaurant", exampleSentence: "What do you recommend from the menu?" },
        "i'll have the pasta with marinara sauce.": { meaning: "Ordering a specific dish", exampleSentence: "I’ll have the pasta with marinara sauce." },
        "could we have the bill, please?": { meaning: "Requesting the check", exampleSentence: "Could we have the bill, please?" },
        "appetizer": { phonetic: "/ˈæpɪtaɪzər/", meaning: "A small dish served before the main course", exampleSentence: "We ordered an appetizer to share." },
        "main course": { meaning: "The primary dish of a meal", exampleSentence: "The main course was delicious." },
        "dessert": { phonetic: "/dɪˈzɜːrt/", meaning: "A sweet dish served at the end of a meal", exampleSentence: "I’m too full for dessert." },
        // Small Talk
        "lovely day, isn't it?": { meaning: "Making small talk about the weather", exampleSentence: "Lovely day, isn’t it?" },
        "i can't believe how cold it is": { meaning: "Commenting on cold weather", exampleSentence: "I can’t believe how cold it is today!" },
        "looks like it's going to rain": { meaning: "Predicting weather conditions", exampleSentence: "Looks like it’s going to rain this afternoon." },
        "the food is delicious": { meaning: "Complimenting food at an event", exampleSentence: "The food is delicious at this party!" },
        "this is a great venue": { meaning: "Praising the location of an event", exampleSentence: "This is a great venue for the conference." },
        "how do you know the host?": { meaning: "Asking about someone’s connection to the host", exampleSentence: "How do you know the host of this event?" },
        "how was your weekend?": { meaning: "Asking about weekend activities", exampleSentence: "How was your weekend?" },
        "did you do anything exciting?": { meaning: "Inquiring about interesting activities", exampleSentence: "Did you do anything exciting over the weekend?" },
        "i had a relaxing weekend": { meaning: "Describing a calm weekend", exampleSentence: "I had a relaxing weekend at home." },
        "how's that project coming along?": { meaning: "Asking about work progress", exampleSentence: "How’s that project coming along?" },
        "i'm swamped with work": { meaning: "Expressing being overwhelmed with tasks", exampleSentence: "I’m swamped with work this week." },
        "looking forward to the holidays": { meaning: "Expressing excitement for holidays", exampleSentence: "I’m looking forward to the holidays!" },
        // Holidays
        "merry christmas!": { meaning: "A festive holiday greeting", exampleSentence: "Merry Christmas to you and your family!" },
        "happy holidays!": { meaning: "A general holiday greeting", exampleSentence: "Happy Holidays!" },
        "season's greetings": { meaning: "A formal holiday greeting", exampleSentence: "Season’s Greetings from our team!" },
        "all the best for the new year": { meaning: "Wishing well for the upcoming year", exampleSentence: "All the best for the New Year!" },
        "decorate the tree": { meaning: "To adorn a Christmas tree with ornaments", exampleSentence: "We’ll decorate the tree this weekend." },
        "exchange gifts": { meaning: "To give and receive presents", exampleSentence: "We exchange gifts on Christmas morning." },
        "christmas carol": { meaning: "A traditional Christmas song", exampleSentence: "We sang a Christmas carol at the party." },
        "mistletoe": { phonetic: "/ˈmɪsəltoʊ/", meaning: "A plant used as a Christmas decoration", exampleSentence: "They kissed under the mistletoe." },
        "reindeer": { phonetic: "/ˈreɪndɪr/", meaning: "An animal associated with Santa Claus", exampleSentence: "The reindeer pulled Santa’s sleigh." },
        "new year's resolution": { meaning: "A goal set for the new year", exampleSentence: "My New Year’s resolution is to read more books." },
        "i'm planning to exercise more this year.": { meaning: "Expressing a personal goal", exampleSentence: "I’m planning to exercise more this year." },
        "my goal is to learn a new skill.": { meaning: "Stating a personal objective", exampleSentence: "My goal is to learn a new skill." },
        "stick to it": { meaning: "To continue with a plan or goal", exampleSentence: "I hope I can stick to my resolution." },
        "happy new year!": { meaning: "A celebratory New Year greeting", exampleSentence: "Happy New Year!" },
        "countdown": { phonetic: "/ˈkaʊntdaʊn/", meaning: "Counting backward to mark an event", exampleSentence: "We started the countdown to midnight." },
        "fireworks": { phonetic: "/ˈfaɪərwɜːrks/", meaning: "Explosive displays for celebrations", exampleSentence: "The fireworks lit up the night sky." },
        "celebrate": { phonetic: "/ˈsɛlɪbreɪt/", meaning: "To mark an occasion with joy", exampleSentence: "We’ll celebrate New Year’s Eve with friends." },
        "auld lang syne": { phonetic: "/ˌɔːld læŋ ˈsaɪn/", meaning: "A traditional New Year’s song", exampleSentence: "We sang Auld Lang Syne at midnight." },
        // Education and Learning
        "syllabus": { phonetic: "/ˈsɪləbəs/", meaning: "An outline of course topics", exampleSentence: "The syllabus lists all the assignments." },
        "lecture": { phonetic: "/ˈlɛktʃər/", meaning: "An educational talk to an audience", exampleSentence: "The lecture on biology was fascinating." },
        "assignment": { phonetic: "/əˈsaɪnmənt/", meaning: "A task given to students", exampleSentence: "I need to finish my assignment by tomorrow." },
        "group project": { meaning: "A collaborative academic task", exampleSentence: "Our group project is due next week." },
        "deadline": { phonetic: "/ˈdɛdlaɪn/", meaning: "The latest time for completing a task", exampleSentence: "The deadline for the essay is Friday." },
        "study group": { meaning: "A group of students studying together", exampleSentence: "I joined a study group for the exam." },
        "raise your hand": { meaning: "To signal a question or answer in class", exampleSentence: "Please raise your hand if you have a question." },
        "take notes": { meaning: "To write down important information", exampleSentence: "I always take notes during lectures." },
        "ask a question": { meaning: "To seek clarification or information", exampleSentence: "Feel free to ask a question if you’re confused." },
        "do you understand?": { meaning: "Checking if someone comprehends", exampleSentence: "Do you understand the instructions?" },
        "submit your work": { meaning: "To turn in completed assignments", exampleSentence: "Please submit your work by email." },
        "attend a workshop": { meaning: "To participate in a short training session", exampleSentence: "I’ll attend a workshop on public speaking." },
        // Travel and Tourism
        "check-in counter": { meaning: "The place to register for a flight", exampleSentence: "We need to go to the check-in counter." },
        "boarding pass": { meaning: "A ticket needed to board a plane", exampleSentence: "Please have your boarding pass ready." },
        "luggage": { phonetic: "/ˈlʌɡɪdʒ/", meaning: "Bags and suitcases for travel", exampleSentence: "My luggage is already at the gate." },
        "customs": { phonetic: "/ˈkʌstəmz/", meaning: "The place where bags are checked for restricted items", exampleSentence: "We passed through customs quickly." },
        "where is the gate?": { meaning: "Asking for the location of a boarding area", exampleSentence: "Where is the gate for flight 123?" },
        "hotel reservation": { meaning: "A booking for a hotel stay", exampleSentence: "I made a hotel reservation for two nights." },
        "check-in": { meaning: "To register at a hotel", exampleSentence: "We’ll check-in at the hotel this afternoon." },
        "room service": { meaning: "Food or services delivered to a hotel room", exampleSentence: "Can we order room service tonight?" },
        "is breakfast included?": { meaning: "Asking if a meal is part of the hotel stay", exampleSentence: "Is breakfast included with our booking?" },
        "tour guide": { meaning: "A person who leads tourists", exampleSentence: "Our tour guide explained the city’s history." },
        "sightseeing": { phonetic: "/ˈsaɪtsiːɪŋ/", meaning: "Visiting places of interest", exampleSentence: "We went sightseeing in the old town." },
        // Health and Wellness
        "make an appointment": { meaning: "To schedule a visit with a doctor", exampleSentence: "I need to make an appointment with my doctor." },
        "prescription": { phonetic: "/prɪˈskrɪpʃən/", meaning: "A doctor’s order for medicine", exampleSentence: "The doctor gave me a prescription for antibiotics." },
        "symptoms": { phonetic: "/ˈsɪmptəmz/", meaning: "Signs of an illness", exampleSentence: "My symptoms include a cough and fever." },
        "i’m not feeling well": { meaning: "Expressing poor health", exampleSentence: "I’m not feeling well today." },
        "take medicine": { meaning: "To consume prescribed drugs", exampleSentence: "You should take medicine twice a day." },
        "healthy diet": { meaning: "Eating nutritious foods", exampleSentence: "A healthy diet improves your energy." },
        "exercise regularly": { meaning: "To work out consistently", exampleSentence: "I try to exercise regularly to stay fit." },
        "stay hydrated": { meaning: "To drink enough water", exampleSentence: "Make sure to stay hydrated during the day." },
        "mental health": { meaning: "The state of psychological well-being", exampleSentence: "Mental health is just as important as physical health." },
        "relax and unwind": { meaning: "To rest and reduce stress", exampleSentence: "I need to relax and unwind after work." }
    };

    const vocabItem: VocabularyItem = {
        word: wordOrPhrase,
        phonetic: isPhrase ? "" : customPhrases[normalizedTerm]?.phonetic || `/ ${normalizedTerm}/`,
        meaning: customPhrases[normalizedTerm]?.meaning || `Contextual usage of "${wordOrPhrase}".`,
        exampleSentence: customPhrases[normalizedTerm]?.exampleSentence || `Use "${wordOrPhrase}" in a conversation.`,
        isCorrect,
        pairOrder
    };

    wordCache[normalizedTerm] = vocabItem;
    return vocabItem;
};

// --- EXPANDED CURRICULUM DATA ---
const curriculum = [
    {
        title: "Work and Career",
        content: "Develop professional English skills for workplace communication, client interactions, and career advancement.",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=60",
        lessons: [
            {
                title: "Meetings and Reports",
                content: "Master the language for leading and participating in meetings and drafting reports.",
                thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=60",
                subLessons: [
                    { title: "Discussing the Agenda", vocab: ["agenda", "objective", "item", "kick off", "wrap up", "time allocation"] },
                    { title: "Presenting a Report", vocab: ["quarterly report", "key findings", "data shows", "projections", "recommendations", "executive summary"] },
                    { title: "Giving Feedback", vocab: ["constructive criticism", "I see your point", "could you elaborate?", "moving forward", "actionable feedback"] }
                ]
            },
            {
                title: "Customer Service",
                content: "Learn to handle customer inquiries and complaints professionally.",
                thumbnail: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=800&q=60",
                subLessons: [
                    { title: "Handling Inquiries", vocab: ["how may i assist you?", "look into that for you", "inquiry", "availability", "product specifications"] },
                    { title: "Resolving Complaints", vocab: ["i understand your frustration", "we sincerely apologize for the inconvenience", "resolve the issue", "as a gesture of goodwill"] }
                ]
            },
            {
                title: "Job Interviews",
                content: "Prepare for interviews with confidence and clear communication.",
                thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=60",
                subLessons: [
                    { title: "Describing Strengths", vocab: ["team player", "problem-solving skills", "adaptable", "detail-oriented", "leadership qualities"] },
                    { title: "Behavioral Questions", vocab: ["tell me about a time when you faced a challenge at work.", "STAR method", "handled a conflict", "managed a tight deadline"] }
                ]
            }
        ]
    },
    {
        title: "Lifestyle",
        content: "Navigate daily life with ease, from shopping to dining and socializing.",
        thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=60",
        lessons: [
            {
                title: "Shopping",
                content: "Learn phrases for a seamless shopping experience in stores.",
                thumbnail: "https://images.unsplash.com/photo-1594224457767-2d02403e1b60?w=800&q=60",
                subLessons: [
                    { title: "Clothing Stores", vocab: ["fitting room", "do you have this in a different size?", "on sale", "return policy", "receipt"] },
                    { title: "Grocery Shopping", vocab: ["aisle", "shopping cart", "checkout counter", "fresh produce", "loyalty card"] }
                ]
            },
            {
                title: "Dining Out",
                content: "Master ordering food and making reservations at restaurants.",
                thumbnail: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=60",
                subLessons: [
                    { title: "Making Reservations", vocab: ["i'd like to book a table", "for two people", "at 7 pm", "under the name"] },
                    { title: "Ordering Food", vocab: ["what do you recommend?", "i'll have the pasta with marinara sauce.", "could we have the bill, please?", "appetizer", "main course", "dessert"] }
                ]
            }
        ]
    },
    {
        title: "Small Talk",
        content: "Build conversational skills for casual and professional settings.",
        thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01df4?w=800&q=60",
        lessons: [
            {
                title: "Social Events",
                content: "Learn to start and maintain conversations at gatherings.",
                thumbnail: "https://images.unsplash.com/photo-1517457373958-b4bdd8d5d024?w=800&q=60",
                subLessons: [
                    { title: "Weather Talk", vocab: ["lovely day, isn't it?", "i can't believe how cold it is", "looks like it's going to rain"] },
                    { title: "Event Comments", vocab: ["the food is delicious", "this is a great venue", "how do you know the host?"] }
                ]
            },
            {
                title: "Workplace Chats",
                content: "Engage with colleagues through friendly small talk.",
                thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=60",
                subLessons: [
                    { title: "Weekend Plans", vocab: ["how was your weekend?", "did you do anything exciting?", "i had a relaxing weekend"] },
                    { title: "Work Updates", vocab: ["how's that project coming along?", "i'm swamped with work", "looking forward to the holidays"] }
                ]
            }
        ]
    },
    {
        title: "Holidays",
        content: "Learn to discuss holiday traditions and greetings.",
        thumbnail: "https://images.unsplash.com/photo-1519643382497-3dbbd57e6a2c?w=800&q=60",
        lessons: [
            {
                title: "Christmas",
                content: "Explore vocabulary for Christmas celebrations.",
                thumbnail: "https://images.unsplash.com/photo-1542587221-7a9e1b3e81b6?w=800&q=60",
                subLessons: [
                    { title: "Holiday Greetings", vocab: ["merry christmas!", "happy holidays!", "season's greetings", "all the best for the new year"] },
                    { title: "Christmas Traditions", vocab: ["decorate the tree", "exchange gifts", "christmas carol", "mistletoe", "reindeer"] }
                ]
            },
            {
                title: "New Year",
                content: "Discuss New Year’s resolutions and festivities.",
                thumbnail: "https://images.unsplash.com/photo-1483791424735-e9e77397a091?w=800&q=60",
                subLessons: [
                    { title: "Resolutions", vocab: ["new year's resolution", "i'm planning to exercise more this year.", "my goal is to learn a new skill.", "stick to it"] },
                    { title: "New Year’s Eve", vocab: ["happy new year!", "countdown", "fireworks", "celebrate", "auld lang syne"] }
                ]
            }
        ]
    },
    {
        title: "Education and Learning",
        content: "Enhance your English for academic settings and lifelong learning.",
        thumbnail: "https://images.unsplash.com/photo-1503676260728-332c7b7124af?w=800&q=60",
        lessons: [
            {
                title: "Classroom Communication",
                content: "Learn to interact effectively in educational environments.",
                thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=60",
                subLessons: [
                    { title: "Participating in Class", vocab: ["raise your hand", "take notes", "ask a question", "do you understand?", "submit your work"] },
                    { title: "Academic Tasks", vocab: ["syllabus", "lecture", "assignment", "group project", "deadline"] }
                ]
            },
            {
                title: "Workshops and Training",
                content: "Master language for professional development sessions.",
                thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=60",
                subLessons: [
                    { title: "Joining a Workshop", vocab: ["attend a workshop", "study group", "take notes", "ask a question", "group project"] }
                ]
            }
        ]
    },
    {
        title: "Travel and Tourism",
        content: "Communicate confidently while traveling and exploring new places.",
        thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=60",
        lessons: [
            {
                title: "At the Airport",
                content: "Navigate airports with essential travel phrases.",
                thumbnail: "https://images.unsplash.com/photo-1504609773096-104ff2c73a4e?w=800&q=60",
                subLessons: [
                    { title: "Check-In and Boarding", vocab: ["check-in counter", "boarding pass", "luggage", "customs", "where is the gate?"] }
                ]
            },
            {
                title: "Staying at a Hotel",
                content: "Learn to book and manage hotel stays.",
                thumbnail: "https://images.unsplash.com/photo-1564501049412-37c5e3b094c8?w=800&q=60",
                subLessons: [
                    { title: "Hotel Services", vocab: ["hotel reservation", "check-in", "room service", "is breakfast included?", "tour guide"] },
                    { title: "Exploring the City", vocab: ["sightseeing", "tour guide", "where is the gate?", "luggage", "is breakfast included?"] }
                ]
            }
        ]
    },
    {
        title: "Health and Wellness",
        content: "Discuss health, medical visits, and wellness practices in English.",
        thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=60",
        lessons: [
            {
                title: "Visiting the Doctor",
                content: "Learn phrases for medical appointments and describing symptoms.",
                thumbnail: "https://images.unsplash.com/photo-1584516150909-c43483ee7936?w=800&q=60",
                subLessons: [
                    { title: "Medical Consultations", vocab: ["make an appointment", "prescription", "symptoms", "i’m not feeling well", "take medicine"] }
                ]
            },
            {
                title: "Healthy Living",
                content: "Discuss lifestyle choices for better health.",
                thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f9eefd?w=800&q=60",
                subLessons: [
                    { title: "Diet and Exercise", vocab: ["healthy diet", "exercise regularly", "stay hydrated", "mental health", "relax and unwind"] }
                ]
            }
        ]
    }
];
// --- CALCULATE TOTAL LESSONS ---
const calculateTotalLessons = (curriculum: any[]): number => {
    let total = 0;
    curriculum.forEach((topic) => {
        topic.lessons.forEach((lesson: any) => {
            total += 1; // Parent lesson
            total += lesson.subLessons.length; // Sub-lessons
        });
    });
    return total;
};

// --- CALCULATE TOTAL LESSONS FOR A TOPIC ---
const calculateTopicTotalLessons = (topic: any): number => {
    let total = 0;
    topic.lessons.forEach((lesson: any) => {
        total += 1; // Parent lesson
        total += lesson.subLessons.length; // Sub-lessons
    });
    return total;
};

// --- MAIN SEED FUNCTION ---
const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, { dbName: "speak-up-test" });
        console.log("Connected to MongoDB");

        // Clear existing data
        await Promise.all([
            Course.deleteMany({}),
            Topic.deleteMany({}),
            Lesson.deleteMany({}),
            Vocabulary.deleteMany({}),
            Exercise.deleteMany({}),
            ExerciseVocabulary.deleteMany({}),
            LessonProgress.deleteMany({}),
            History.deleteMany({})
        ]);
        console.log("Cleared existing data");

        // Calculate total lessons
        const totalLessons = calculateTotalLessons(curriculum);
        console.log(`Calculated total lessons: ${totalLessons}`);

        // Create Course
        const course = await Course.create({
            title: "Comprehensive English Speaking & Communication",
            description: "Master real-world English for professional, social, and personal contexts.",
            level: "Beginner to Intermediate",
            thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
            totalLessons
        });
        console.log(`Course created: ${course.title} (ID: ${course._id})`);

        // --- HIERARCHICAL DATA CREATION ---
        console.log("Starting curriculum creation...");

        for (const topicData of curriculum) {
            try {
                // Create Topic
                const topicTotalLessons = calculateTopicTotalLessons(topicData);
                const topic = await Topic.create({
                    courseId: course._id,
                    title: topicData.title,
                    content: topicData.content,
                    thumbnail: topicData.thumbnail,
                    type: 'speaking',
                    section: "topic",
                    level: 1,
                    totalLessons: topicTotalLessons
                });
                console.log(`-> Topic created: ${topic.title} (ID: ${topic._id}, ${topicTotalLessons} lessons)`);

                for (const lessonData of topicData.lessons) {
                    try {
                        // Create Parent Lesson
                        const parentLesson = await Lesson.create({
                            courseId: course._id,
                            parentTopicId: topic._id,
                            title: lessonData.title,
                            content: lessonData.content,
                            thumbnail: lessonData.thumbnail,
                            type: 'speaking',
                            level: 1,
                            category: 'Basics'
                        });
                        console.log(`  - Parent Lesson created: ${parentLesson.title} (ID: ${parentLesson._id})`);

                        for (const subLessonData of lessonData.subLessons) {
                            try {
                                // Create Sub-Lesson
                                const subLesson = await Lesson.create({
                                    courseId: course._id,
                                    parentTopicId: topic._id,
                                    parentLessonId: parentLesson._id,
                                    title: subLessonData.title,
                                    content: `Practice vocabulary and phrases for: ${subLessonData.title}.`,
                                    thumbnail: "",
                                    type: 'vocabulary',
                                    level: 1,
                                    category: 'Basics'
                                });
                                console.log(`    - Sub-Lesson created: ${subLesson.title} (ID: ${subLesson._id})`);

                                // Fetch and Create Vocabulary
                                const fetchedVocabs = subLessonData.vocab.map((term: string, index: number) => getVocabularyItem(term, true, index));
                                console.log(`      Fetched ${fetchedVocabs.length} vocabulary items for ${subLesson.title}`);

                                if (fetchedVocabs.length !== subLessonData.vocab.length) {
                                    console.warn(`      Warning: Expected ${subLessonData.vocab.length} vocab items, got ${fetchedVocabs.length} for ${subLesson.title}`);
                                }

                                const vocabularyDocs = fetchedVocabs.map((v: VocabularyItem) => ({
                                    lessonId: subLesson._id,
                                    word: v.word,
                                    phonetic: v.phonetic,
                                    meaning: v.meaning,
                                    exampleSentence: v.exampleSentence,
                                    isCorrect: v.isCorrect,
                                    pairOrder: v.pairOrder
                                }));

                                const createdVocabularies = await Vocabulary.insertMany(vocabularyDocs, { ordered: false }) as unknown as IVocabularyDoc[];
                                console.log(`      Created ${createdVocabularies.length} vocabulary items for ${subLesson.title}`);

                                // Create Exercises
                                const exercisesData: IExerciseCreate[] = [];

                                if (fetchedVocabs.length > 0) {
                                    // Pronunciation Exercise
                                    const randomWord = fetchedVocabs[Math.floor(Math.random() * fetchedVocabs.length)];
                                    exercisesData.push({
                                        lessonId: subLesson._id as mongoose.Types.ObjectId,
                                        type: "pronunciation",
                                        prompt: `Practice the pronunciation of: "${randomWord.word}"`,
                                        correctPronunciation: randomWord.phonetic || `/${randomWord.word}/`,
                                        difficultyLevel: "easy"
                                    });

                                    // Repeat Sentence Exercises (2 for variety)
                                    const vocabWithSentences = fetchedVocabs.filter(v => v.exampleSentence && !v.exampleSentence.includes("Use "));
                                    const selectedVocabs = vocabWithSentences.length > 1
                                        ? [vocabWithSentences[Math.floor(Math.random() * vocabWithSentences.length)], vocabWithSentences[Math.floor(Math.random() * vocabWithSentences.length)]]
                                        : [fetchedVocabs[0]];

                                    selectedVocabs.forEach((vocab, idx) => {
                                        exercisesData.push({
                                            lessonId: subLesson._id as mongoose.Types.ObjectId,
                                            type: "repeat_sentence",
                                            prompt: `Listen and repeat: "${vocab.exampleSentence}"`,
                                            correctPronunciation: vocab.exampleSentence,
                                            difficultyLevel: idx === 0 ? "medium" : "hard"
                                        });
                                    });
                                } else {
                                    console.warn(`      No vocabulary items for ${subLesson.title}, skipping exercises`);
                                }

                                let createdExercises: IExerciseDoc[] = [];
                                if (exercisesData.length > 0) {
                                    createdExercises = await Exercise.insertMany(exercisesData, { ordered: false }) as IExerciseDoc[];
                                    console.log(`      Created ${createdExercises.length} exercises for ${subLesson.title}`);
                                } else {
                                    console.warn(`      No exercises created for ${subLesson.title}`);
                                }

                                // Link Exercises to Vocabularies
                                const exerciseVocabularyData = [];
                                for (const exercise of createdExercises) {
                                    for (const vocab of createdVocabularies) {
                                        exerciseVocabularyData.push({ exerciseId: exercise._id, vocabularyId: vocab._id });
                                    }
                                }
                                if (exerciseVocabularyData.length > 0) {
                                    const createdLinks = await ExerciseVocabulary.insertMany(exerciseVocabularyData, { ordered: false });
                                    console.log(`      Linked ${createdLinks.length} exercise-vocabulary pairs for ${subLesson.title}`);
                                }
                            } catch (subError) {
                                console.error(`    Error creating sub-lesson ${subLessonData.title}:`, subError);
                            }
                        }
                    } catch (lessonError) {
                        console.error(`  Error creating lesson ${lessonData.title}:`, lessonError);
                    }
                }
            } catch (topicError) {
                console.error(`Error creating topic ${topicData.title}:`, topicError);
            }
        }

        // --- CREATE DUMMY USER DATA ---
        console.log("Creating dummy user progress and history...");
        const userId = new mongoose.Types.ObjectId();
        const allLessons = await Lesson.find({ parentLessonId: { $ne: null } }).lean();
        const allExercises = await Exercise.find().lean();

        const progressData = allLessons.map((lesson, i: number) => ({
            lessonId: lesson._id,
            userId,
            score: i % 4 === 0 ? 100 : Math.floor(Math.random() * 81) + 15,
            isCompleted: i % 4 === 0
        }));

        const historyData = allExercises.slice(0, 50).map(exercise => ({
            userId,
            lessonId: exercise.lessonId,
            exerciseId: exercise._id,
            attempts: Math.floor(Math.random() * 3) + 1,
            lastAttemptAt: new Date()
        }));

        if (progressData.length > 0) {
            const createdProgress = await LessonProgress.insertMany(progressData, { ordered: false });
            console.log(`Created ${createdProgress.length} lesson progress records`);
        } else {
            console.warn("No progress data created (no sub-lessons found)");
        }

        if (historyData.length > 0) {
            const createdHistory = await History.insertMany(historyData, { ordered: false });
            console.log(`Created ${createdHistory.length} history records`);
        } else {
            console.warn("No history data created (no exercises found)");
        }

        // --- VERIFY DATABASE STATE ---
        const counts = {
            courses: await Course.countDocuments({}),
            topics: await Topic.countDocuments({}),
            lessons: await Lesson.countDocuments({}),
            subLessons: await Lesson.countDocuments({ parentLessonId: { $ne: null } }),
            vocabularies: await Vocabulary.countDocuments({}),
            exercises: await Exercise.countDocuments({}),
            exerciseVocab: await ExerciseVocabulary.countDocuments({}),
            progress: await LessonProgress.countDocuments({}),
            history: await History.countDocuments({})
        };
        console.log("\n=== Final Database State ===");
        console.log(JSON.stringify(counts, null, 2));

        console.log("\n✅ Seed completed successfully!");
    } catch (err) {
        console.error("\n❌ Critical error during seed process:", err);
        throw err;
    } finally {
        await mongoose.connection.close();
    }
};

seed().catch(err => {
    console.error("\n❌ Seed process terminated due to error:", err);
    mongoose.connection.close();
    process.exit(1);
});