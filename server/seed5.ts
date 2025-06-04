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
        // Existing Vocabulary (Work and Career, Lifestyle, Small Talk, Holidays, Education, Travel, Health)
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
        "make an appointment": { meaning: "To schedule a visit with a doctor", exampleSentence: "I need to make an appointment with my doctor." },
        "prescription": { phonetic: "/prɪˈskrɪpʃən/", meaning: "A doctor’s order for medicine", exampleSentence: "The doctor gave me a prescription for antibiotics." },
        "symptoms": { phonetic: "/ˈsɪmptəmz/", meaning: "Signs of an illness", exampleSentence: "My symptoms include a cough and fever." },
        "i’m not feeling well": { meaning: "Expressing poor health", exampleSentence: "I’m not feeling well today." },
        "take medicine": { meaning: "To consume prescribed drugs", exampleSentence: "You should take medicine twice a day." },
        "healthy diet": { meaning: "Eating nutritious foods", exampleSentence: "A healthy diet improves your energy." },
        "exercise regularly": { meaning: "To work out consistently", exampleSentence: "I try to exercise regularly to stay fit." },
        "stay hydrated": { meaning: "To drink enough water", exampleSentence: "Make sure to stay hydrated during the day." },
        "mental health": { meaning: "The state of psychological well-being", exampleSentence: "Mental health is just as important as physical health." },
        "relax and unwind": { meaning: "To rest and reduce stress", exampleSentence: "I need to relax and unwind after work." },
        // New Vocabulary (Expanded Categories)
        // Technology and Innovation
        "software update": { meaning: "A new version of a program to improve functionality", exampleSentence: "I need to install the latest software update." },
        "cloud storage": { meaning: "Online storage for data", exampleSentence: "I saved my files to cloud storage for easy access." },
        "user interface": { phonetic: "/ˈjuːzər ˈɪntərfeɪs/", meaning: "The visual part of a program users interact with", exampleSentence: "The app has a user-friendly interface." },
        "troubleshoot": { phonetic: "/ˈtrʌbəlʃuːt/", meaning: "To find and fix problems in a system", exampleSentence: "Can you troubleshoot the network issue?" },
        "tech support": { meaning: "Assistance for technical problems", exampleSentence: "I called tech support to fix my laptop." },
        "beta version": { meaning: "A pre-release version of software for testing", exampleSentence: "The app is still in its beta version." },
        "debug": { phonetic: "/diːˈbʌɡ/", meaning: "To remove errors from code", exampleSentence: "The developer spent hours debugging the program." },
        "open source": { meaning: "Software with freely available source code", exampleSentence: "This tool is open source and free to use." },
        "what’s the wifi password?": { meaning: "Asking for the code to access a wireless network", exampleSentence: "What’s the WiFi password for this café?" },
        "restart the device": { meaning: "To turn a device off and on to fix issues", exampleSentence: "Try to restart the device to resolve the problem." },
        // Social Media and Online Communication
        "go viral": { meaning: "To become extremely popular online", exampleSentence: "Her video went viral on social media." },
        "hashtag": { phonetic: "/ˈhæʃtæɡ/", meaning: "A word or phrase preceded by # to categorize content", exampleSentence: "Use the hashtag #TravelGoals for your posts." },
        "direct message": { meaning: "A private message sent online", exampleSentence: "I’ll send you a direct message with the details." },
        "content creator": { meaning: "Someone who produces online media", exampleSentence: "She’s a content creator with a large following." },
        "live stream": { meaning: "To broadcast video in real-time", exampleSentence: "We’ll live stream the event on our page." },
        "post an update": { meaning: "To share new information online", exampleSentence: "I’ll post an update about the project later." },
        "tag someone": { meaning: "To mention someone in a post", exampleSentence: "Can you tag me in that photo?" },
        "share a link": { meaning: "To distribute a web address", exampleSentence: "I’ll share a link to the article." },
        // Environment and Sustainability
        "carbon footprint": { phonetic: "/ˈkɑːrbən ˈfʊtprɪnt/", meaning: "The amount of carbon emissions caused by an individual or activity", exampleSentence: "I’m trying to reduce my carbon footprint." },
        "renewable energy": { meaning: "Energy from sustainable sources like solar or wind", exampleSentence: "We switched to renewable energy for our home." },
        "recycle": { phonetic: "/riːˈsaɪkl/", meaning: "To process used materials for reuse", exampleSentence: "Please recycle your plastic bottles." },
        "sustainable living": { meaning: "A lifestyle that reduces environmental impact", exampleSentence: "Sustainable living is important for the planet." },
        "zero waste": { meaning: "A goal to produce no trash", exampleSentence: "I’m aiming for a zero waste lifestyle." },
        "compost": { phonetic: "/ˈkɒmpɒst/", meaning: "To convert organic waste into fertilizer", exampleSentence: "We compost food scraps in our backyard." },
        "eco-friendly": { meaning: "Not harmful to the environment", exampleSentence: "This product is eco-friendly and biodegradable." },
        // Sports and Fitness
        "warm-up": { meaning: "Exercises to prepare for physical activity", exampleSentence: "Do a quick warm-up before the game." },
        "cool-down": { meaning: "Exercises to relax after physical activity", exampleSentence: "A cool-down helps prevent muscle soreness." },
        "personal best": { meaning: "An individual’s best performance", exampleSentence: "I hit my personal best in the marathon." },
        "team captain": { meaning: "The leader of a sports team", exampleSentence: "She was chosen as the team captain." },
        "score a goal": { meaning: "To make a point in a game like soccer", exampleSentence: "He scored a goal in the final minute." },
        "join a gym": { meaning: "To become a member of a fitness center", exampleSentence: "I decided to join a gym to stay active." },
        "track your progress": { meaning: "To monitor improvements over time", exampleSentence: "Use an app to track your fitness progress." },
        // Arts and Entertainment
        "box office": { phonetic: "/ˈbɒks ˈɒfɪs/", meaning: "The place where tickets are sold", exampleSentence: "The movie was a hit at the box office." },
        "red carpet": { meaning: "A ceremonial walkway for celebrities", exampleSentence: "She walked the red carpet at the premiere." },
        "binge-watch": { meaning: "To watch multiple episodes in one sitting", exampleSentence: "We decided to binge-watch the new series." },
        "sold out": { meaning: "All tickets or items are purchased", exampleSentence: "The concert is sold out." },
        "behind the scenes": { meaning: "The process or activities not shown to the public", exampleSentence: "The behind-the-scenes footage was fascinating." },
        "audition": { phonetic: "/ɔːˈdɪʃn/", meaning: "A tryout for a role or performance", exampleSentence: "She prepared for her audition all week." },
        "standing ovation": { meaning: "Audience applause while standing", exampleSentence: "The performance received a standing ovation." },
        // Food and Cooking
        "recipe": { phonetic: "/ˈresɪpi/", meaning: "Instructions for preparing a dish", exampleSentence: "I found a great recipe for pasta." },
        "ingredient": { phonetic: "/ɪnˈɡriːdiənt/", meaning: "A component of a dish", exampleSentence: "We need fresh ingredients for the soup." },
        "chop vegetables": { meaning: "To cut vegetables into small pieces", exampleSentence: "Can you chop vegetables for the salad?" },
        "simmer": { phonetic: "/ˈsɪmər/", meaning: "To cook slowly at low heat", exampleSentence: "Let the sauce simmer for 20 minutes." },
        "bake in the oven": { meaning: "To cook food using dry heat", exampleSentence: "We’ll bake the cake in the oven." },
        "taste for seasoning": { meaning: "To check the flavor of a dish", exampleSentence: "Taste the soup for seasoning before serving." },
        "homemade meal": { meaning: "Food prepared at home", exampleSentence: "We enjoyed a homemade meal together." },
        "budget plan": { meaning: "A financial plan for allocating resources", exampleSentence: "We need to create a budget plan for next quarter." },
        "revenue stream": { meaning: "A source of income for a business", exampleSentence: "Online sales are a key revenue stream for us." },
        "cost-effective": { phonetic: "/ˈkɒst ɪˈfɛktɪv/", meaning: "Providing good value for the cost", exampleSentence: "This solution is cost-effective for small businesses." },
        "return on investment": { meaning: "The profit gained from an investment", exampleSentence: "We expect a high return on investment this year." },
        "financial forecast": { meaning: "A prediction of future financial performance", exampleSentence: "The financial forecast shows steady growth." },
        "invoice": { phonetic: "/ˈɪnvɔɪs/", meaning: "A bill requesting payment for services", exampleSentence: "Please send the invoice by email." },
        "negotiate a deal": { meaning: "To discuss terms to reach an agreement", exampleSentence: "We managed to negotiate a deal with the supplier." },
        "market trends": { meaning: "Patterns or shifts in market behavior", exampleSentence: "Keeping up with market trends is crucial for success." },
        "cash flow": { meaning: "The movement of money in and out of a business", exampleSentence: "We need to improve our cash flow this month." },
        "investment portfolio": { meaning: "A collection of financial investments", exampleSentence: "Her investment portfolio includes stocks and bonds." },
        // New Vocabulary for Hobbies and Leisure
        "pick up a hobby": { meaning: "To start a new recreational activity", exampleSentence: "I decided to pick up a hobby like painting." },
        "join a club": { meaning: "To become a member of a group activity", exampleSentence: "You should join a club to meet new people." },
        "try something new": { meaning: "To experiment with a new activity", exampleSentence: "I want to try something new this weekend." },
        "gardening": { phonetic: "/ˈɡɑːrdnɪŋ/", meaning: "The activity of growing plants", exampleSentence: "Gardening is a relaxing way to spend time." },
        "DIY project": { meaning: "A do-it-yourself task or craft", exampleSentence: "I’m working on a DIY project for my home." },
        "board game": { meaning: "A game played on a board with pieces", exampleSentence: "We played a board game last night." },
        "go hiking": { meaning: "To walk in nature for recreation", exampleSentence: "Let’s go hiking in the mountains this weekend." },
        "take up photography": { meaning: "To start practicing photography", exampleSentence: "I want to take up photography as a hobby." },
        "knitting": { phonetic: "/ˈnɪtɪŋ/", meaning: "The craft of making fabric from yarn", exampleSentence: "Knitting a scarf is my new project." },
        "leisure time": { meaning: "Free time for relaxation or hobbies", exampleSentence: "I spend my leisure time reading books." },
        // New Vocabulary for Community and Volunteering
        "volunteer work": { meaning: "Unpaid work done for a cause", exampleSentence: "I do volunteer work at the local shelter." },
        "community event": { meaning: "A gathering organized for local residents", exampleSentence: "The community event brought everyone together." },
        "donate to charity": { meaning: "To give money or goods to a cause", exampleSentence: "We decided to donate to charity this month." },
        "organize a fundraiser": { meaning: "To plan an event to raise money", exampleSentence: "Let’s organize a fundraiser for the school." },
        "make a difference": { meaning: "To have a positive impact", exampleSentence: "Your efforts can make a difference in the community." },
        "lend a hand": { meaning: "To offer help", exampleSentence: "Can you lend a hand with this project?" },
        "local initiative": { meaning: "A community-driven project or effort", exampleSentence: "The local initiative promotes recycling." },
        "team up": { meaning: "To work together with others", exampleSentence: "Let’s team up to clean the park." },
        "spread awareness": { meaning: "To inform others about an issue", exampleSentence: "We need to spread awareness about climate change." },
        "sign up to volunteer": { meaning: "To register for volunteer activities", exampleSentence: "I’ll sign up to volunteer at the event." },
        "set priorities": { meaning: "To determine the most important tasks", exampleSentence: "Let’s set priorities for this project." },
        "meet expectations": { meaning: "To fulfill required standards", exampleSentence: "She always works hard to meet expectations." },
        "performance review": { meaning: "An evaluation of an employee’s work", exampleSentence: "My performance review is scheduled for next week." },
        "take initiative": { meaning: "To act without being prompted", exampleSentence: "You should take initiative to solve this issue." },
        "work-life balance": { meaning: "Balancing professional and personal life", exampleSentence: "Maintaining work-life balance is important for health." },
        "delegate tasks": { meaning: "To assign responsibilities to others", exampleSentence: "Managers should delegate tasks to their team." },
        "onboarding process": { meaning: "The process of integrating new employees", exampleSentence: "The onboarding process helped me settle in quickly." },
        "career path": { meaning: "A planned progression of jobs", exampleSentence: "I’m exploring my career path options." },
        "networking event": { meaning: "A gathering for professional connections", exampleSentence: "I met new contacts at the networking event." },
        "pitch an idea": { meaning: "To propose a new concept", exampleSentence: "She pitched an idea to the marketing team." },
        "collaborative project": { meaning: "A project involving multiple people", exampleSentence: "We’re working on a collaborative project with another department." },
        "employee engagement": { meaning: "The level of enthusiasm employees have", exampleSentence: "Employee engagement boosts productivity." },
        "professional development": { meaning: "Activities to improve work skills", exampleSentence: "I’m attending a professional development workshop." },
        "submit a proposal": { meaning: "To present a formal plan", exampleSentence: "We need to submit a proposal by Friday." },
        "client meeting": { meaning: "A discussion with a customer", exampleSentence: "The client meeting is set for tomorrow morning." },
        // New Vocabulary for Lifestyle
        "run errands": { meaning: "To complete small tasks or chores", exampleSentence: "I need to run errands this afternoon." },
        "household chores": { meaning: "Regular tasks at home", exampleSentence: "I split household chores with my roommate." },
        "make a grocery list": { meaning: "To write down items to buy", exampleSentence: "Let’s make a grocery list before shopping." },
        "try a new recipe": { meaning: "To cook a dish for the first time", exampleSentence: "I want to try a new recipe tonight." },
        "home decor": { meaning: "Items used to decorate a home", exampleSentence: "We’re updating our home decor this weekend." },
        "social gathering": { meaning: "A casual meeting with friends", exampleSentence: "The social gathering was so much fun!" },
        "plan a trip": { meaning: "To organize travel arrangements", exampleSentence: "We’re planning a trip to the beach." },
        "stay organized": { meaning: "To keep things in order", exampleSentence: "I use a planner to stay organized." },
        "self-care routine": { meaning: "Activities for personal well-being", exampleSentence: "My self-care routine includes yoga." },
        "weekend getaway": { meaning: "A short trip for relaxation", exampleSentence: "We booked a weekend getaway to the mountains." },
        "attend a concert": { meaning: "To go to a live music event", exampleSentence: "I’m excited to attend a concert tonight." },
        "host a dinner": { meaning: "To organize a meal for guests", exampleSentence: "We’ll host a dinner for friends this weekend." },
        "daily commute": { meaning: "The regular trip to work or school", exampleSentence: "My daily commute takes about an hour." },
        "shop for deals": { meaning: "To look for discounted items", exampleSentence: "I always shop for deals during sales." },
        // New Vocabulary for Small Talk
        "break the ice": { meaning: "To start a conversation", exampleSentence: "I told a joke to break the ice." },
        "catch up": { meaning: "To talk about recent events", exampleSentence: "Let’s catch up over coffee soon." },
        "small talk": { meaning: "Casual conversation about light topics", exampleSentence: "Small talk helps build connections." },
        "how’s it going?": { meaning: "Asking about someone’s well-being", exampleSentence: "Hey, how’s it going?" },
        "any big plans?": { meaning: "Inquiring about upcoming activities", exampleSentence: "Any big plans for the weekend?" },
        "that sounds fun": { meaning: "Expressing enthusiasm for someone’s plans", exampleSentence: "A trip to Paris? That sounds fun!" },
        "keep in touch": { meaning: "To stay in contact", exampleSentence: "Let’s keep in touch after this event." },
        "what’s the latest?": { meaning: "Asking for recent updates", exampleSentence: "What’s the latest with your project?" },
        "good to see you": { meaning: "Expressing pleasure at meeting someone", exampleSentence: "Good to see you after so long!" },
        "have you heard?": { meaning: "Introducing news or gossip", exampleSentence: "Have you heard about the new café?" },
        "talk about the news": { meaning: "To discuss current events", exampleSentence: "Let’s talk about the news over lunch." },
        // New Vocabulary for Holidays
        "holiday season": { meaning: "The time around major holidays", exampleSentence: "The holiday season is always busy." },
        "festive mood": { meaning: "A cheerful holiday atmosphere", exampleSentence: "Everyone’s in a festive mood this December." },
        "light the candles": { meaning: "To ignite candles for a celebration", exampleSentence: "We light the candles for Hanukkah." },
        "family traditions": { meaning: "Customs passed down in a family", exampleSentence: "Our family traditions include baking together." },
        "holiday shopping": { meaning: "Buying gifts for holidays", exampleSentence: "Holiday shopping can be overwhelming." },
        "attend a festival": { meaning: "To participate in a cultural event", exampleSentence: "We’ll attend a festival this weekend." },
        "give a toast": { meaning: "To offer a short speech during a celebration", exampleSentence: "He gave a toast at the New Year’s party." },
        "celebrate together": { meaning: "To enjoy a holiday with others", exampleSentence: "We celebrate together every Thanksgiving." },
        "holiday decorations": { meaning: "Items used to adorn for holidays", exampleSentence: "The holiday decorations look beautiful." },
        "plan a celebration": { meaning: "To organize a festive event", exampleSentence: "Let’s plan a celebration for the holidays." },
        "cultural festival": { meaning: "An event celebrating cultural traditions", exampleSentence: "The cultural festival was vibrant and fun." },
        // New Vocabulary for Education and Learning
        "research paper": { meaning: "A detailed academic essay", exampleSentence: "I’m writing a research paper for class." },
        "study abroad": { meaning: "To attend school in another country", exampleSentence: "I want to study abroad next semester." },
        "take an exam": { meaning: "To complete a test", exampleSentence: "I need to prepare to take an exam tomorrow." },
        "group discussion": { meaning: "A conversation among students", exampleSentence: "The group discussion helped clarify the topic." },
        "academic writing": { meaning: "Formal writing for school", exampleSentence: "Academic writing requires clear arguments." },
        "attend a seminar": { meaning: "To participate in an educational talk", exampleSentence: "I’ll attend a seminar on history." },
        "peer review": { meaning: "Feedback from classmates", exampleSentence: "The peer review improved my essay." },
        "course materials": { meaning: "Resources used in a class", exampleSentence: "The course materials are online." },
        "extracurricular activity": { meaning: "Activities outside of class", exampleSentence: "I joined an extracurricular activity to meet people." },
        "online course": { meaning: "A class taken via the internet", exampleSentence: "I’m taking an online course this summer." },
        "revise notes": { meaning: "To review and improve study notes", exampleSentence: "I need to revise my notes before the exam." },
        // New Vocabulary for Travel and Tourism
        "book a tour": { meaning: "To reserve a guided trip", exampleSentence: "We’ll book a tour of the city tomorrow." },
        "travel itinerary": { meaning: "A plan for a trip", exampleSentence: "Our travel itinerary includes Paris and Rome." },
        "local cuisine": { meaning: "Food specific to a region", exampleSentence: "I can’t wait to try the local cuisine." },
        "exchange currency": { meaning: "To convert money to another currency", exampleSentence: "I need to exchange currency before the trip." },
        "tourist attraction": { meaning: "A popular place to visit", exampleSentence: "The Eiffel Tower is a major tourist attraction." },
        "travel insurance": { meaning: "Coverage for travel-related issues", exampleSentence: "I bought travel insurance for safety." },
        "check the weather": { meaning: "To look up weather conditions", exampleSentence: "Let’s check the weather before hiking." },
        "public transportation": { meaning: "Shared transport like buses or trains", exampleSentence: "Public transportation is convenient here." },
        "ask for directions": { meaning: "To request guidance to a location", exampleSentence: "I’ll ask for directions to the museum." },
        "cultural experience": { meaning: "An activity related to local culture", exampleSentence: "Visiting the temple was a cultural experience." },
        "pack light": { meaning: "To bring minimal luggage", exampleSentence: "I always try to pack light for trips." },
        // New Vocabulary for Health and Wellness
        "balanced diet": { meaning: "A diet with varied nutrients", exampleSentence: "A balanced diet keeps you healthy." },
        "physical therapy": { meaning: "Treatment to improve mobility", exampleSentence: "I’m starting physical therapy for my injury." },
        "stress management": { meaning: "Techniques to reduce stress", exampleSentence: "Stress management is key to well-being." },
        "book a check-up": { meaning: "To schedule a medical visit", exampleSentence: "I need to book a check-up soon." },
        "monitor health": { meaning: "To track health conditions", exampleSentence: "I use an app to monitor my health." },
        "healthy habits": { meaning: "Practices that promote wellness", exampleSentence: "Healthy habits include regular exercise." },
        "mental wellness": { meaning: "The state of good mental health", exampleSentence: "Mental wellness is my priority this year." },
        "practice mindfulness": { meaning: "To focus on the present moment", exampleSentence: "I practice mindfulness to stay calm." },
        "avoid burnout": { meaning: "To prevent extreme exhaustion", exampleSentence: "Take breaks to avoid burnout." },
        "stay active": { meaning: "To maintain physical activity", exampleSentence: "I try to stay active every day." },
        // New Vocabulary for Business and Finance
        "break-even point": { meaning: "The point where costs equal revenue", exampleSentence: "We reached the break-even point this month." },
        "financial statement": { meaning: "A report of financial performance", exampleSentence: "The financial statement shows our profits." },
        "business pitch": { meaning: "A presentation to sell an idea", exampleSentence: "She delivered a strong business pitch." },
        "cost analysis": { meaning: "Evaluating expenses of a project", exampleSentence: "The cost analysis helped us save money." },
        "secure a loan": { meaning: "To obtain borrowed funds", exampleSentence: "We need to secure a loan for expansion." },
        // New Vocabulary for Hobbies and Leisure
        "collect souvenirs": { meaning: "To gather keepsakes from trips", exampleSentence: "I collect souvenirs from every city I visit." },
        "join a book club": { meaning: "To participate in a reading group", exampleSentence: "I joined a book club to discuss novels." },
        "learn an instrument": { meaning: "To study how to play music", exampleSentence: "I want to learn an instrument like the guitar." },
        "outdoor adventure": { meaning: "An exciting activity in nature", exampleSentence: "This weekend is perfect for an outdoor adventure." },
        // New Vocabulary for Community and Volunteering
        "support a cause": { meaning: "To promote or help a mission", exampleSentence: "I want to support a cause for education." },
        "community outreach": { meaning: "Efforts to connect with locals", exampleSentence: "Community outreach builds stronger ties." },
        "organize a cleanup": { meaning: "To plan a community cleaning event", exampleSentence: "Let’s organize a cleanup for the park." },
        "raise awareness": { meaning: "To inform others about an issue", exampleSentence: "We need to raise awareness about recycling." },
        "collaborate with locals": { meaning: "To work with community members", exampleSentence: "We’ll collaborate with locals on this project." },
        "propose a solution": { meaning: "To suggest a way to solve a problem", exampleSentence: "I’ll propose a solution during the meeting." },
        "monitor progress": { meaning: "To track the advancement of a task", exampleSentence: "We need to monitor progress on this project." },
        "coordinate efforts": { meaning: "To organize teamwork", exampleSentence: "Let’s coordinate efforts to meet the deadline." },
        "address concerns": { meaning: "To respond to worries or issues", exampleSentence: "We’ll address concerns in the Q&A session." },
        "set expectations": { meaning: "To define what is anticipated", exampleSentence: "Managers should set expectations clearly." },
        "offer support": { meaning: "To provide assistance", exampleSentence: "I can offer support with the new system." },
        "build rapport": { meaning: "To establish a good relationship", exampleSentence: "Build rapport with clients to gain trust." },
        "handle objections": { meaning: "To respond to disagreements", exampleSentence: "Sales reps must handle objections confidently." },
        "clarify details": { meaning: "To make information clearer", exampleSentence: "Can you clarify details about the policy?" },
        "escalate a request": { meaning: "To pass a request to a higher level", exampleSentence: "I’ll escalate your request to my supervisor." },
        "showcase achievements": { meaning: "To highlight successes", exampleSentence: "Use your resume to showcase achievements." },
        "discuss opportunities": { meaning: "To talk about potential growth", exampleSentence: "Let’s discuss opportunities for advancement." },
        "align goals": { meaning: "To ensure objectives match", exampleSentence: "We need to align goals with the company vision." },
        "foster teamwork": { meaning: "To encourage collaboration", exampleSentence: "Team activities foster teamwork." },
        "review feedback": { meaning: "To examine comments for improvement", exampleSentence: "Let’s review feedback from the client." },
        // New Vocabulary for Lifestyle
        "try on clothes": { meaning: "To test how clothes fit", exampleSentence: "I’ll try on clothes before buying them." },
        "compare prices": { meaning: "To evaluate costs of items", exampleSentence: "Always compare prices to save money." },
        "ask for a discount": { meaning: "To request a lower price", exampleSentence: "Can I ask for a discount on this item?" },
        "check stock": { meaning: "To verify item availability", exampleSentence: "I’ll check stock for that product." },
        "pay by card": { meaning: "To use a credit or debit card", exampleSentence: "Can I pay by card at this store?" },
        "request a menu": { meaning: "To ask for a restaurant’s menu", exampleSentence: "Can you request a menu for us?" },
        "place an order": { meaning: "To submit a food request", exampleSentence: "I’ll place an order for the pizza." },
        "ask for takeout": { meaning: "To request food to go", exampleSentence: "Can we ask for takeout tonight?" },
        "leave a tip": { meaning: "To give extra money for service", exampleSentence: "Don’t forget to leave a tip for the waiter." },
        "check the time": { meaning: "To look at the current time", exampleSentence: "I need to check the time before leaving." },
        "set an alarm": { meaning: "To program a reminder", exampleSentence: "I’ll set an alarm for tomorrow morning." },
        "plan a workout": { meaning: "To schedule exercise", exampleSentence: "Let’s plan a workout for this evening." },
        "tidy up": { meaning: "To clean or organize", exampleSentence: "I’ll tidy up the house before guests arrive." },
        "catch a show": { meaning: "To watch a performance", exampleSentence: "We’ll catch a show at the theater." },
        // New Vocabulary for Small Talk
        "swap stories": { meaning: "To exchange personal experiences", exampleSentence: "We swapped stories about our travels." },
        "bring up a topic": { meaning: "To introduce a subject", exampleSentence: "I’ll bring up a topic to start the chat." },
        "show interest": { meaning: "To express curiosity", exampleSentence: "Show interest by asking follow-up questions." },
        "make a comment": { meaning: "To offer an opinion", exampleSentence: "I made a comment about the new exhibit." },
        "join a conversation": { meaning: "To participate in a discussion", exampleSentence: "Feel free to join the conversation." },
        "share a tip": { meaning: "To give advice", exampleSentence: "I’ll share a tip about that restaurant." },
        "talk about plans": { meaning: "To discuss future activities", exampleSentence: "Let’s talk about plans for the weekend." },
        "ask about hobbies": { meaning: "To inquire about interests", exampleSentence: "I’ll ask about hobbies to learn more." },
        // New Vocabulary for Holidays
        "host a gathering": { meaning: "To organize a social event", exampleSentence: "We’ll host a gathering for Christmas." },
        "prepare a feast": { meaning: "To cook a large meal", exampleSentence: "Let’s prepare a feast for Thanksgiving." },
        "join celebrations": { meaning: "To participate in festive events", exampleSentence: "We’ll join celebrations in the town square." },
        "send greetings": { meaning: "To share holiday wishes", exampleSentence: "I’ll send greetings to my relatives." },
        "plan a party": { meaning: "To organize a festive event", exampleSentence: "Let’s plan a party for New Year’s Eve." },
        "set up decorations": { meaning: "To arrange festive items", exampleSentence: "We’ll set up decorations for the holiday." },
        "share traditions": { meaning: "To explain cultural practices", exampleSentence: "I’ll share traditions with my friends." },
        // New Vocabulary for Education and Learning
        "present a topic": { meaning: "To introduce a subject in class", exampleSentence: "I’ll present a topic on history." },
        "take a quiz": { meaning: "To complete a short test", exampleSentence: "We’ll take a quiz on vocabulary tomorrow." },
        "review material": { meaning: "To study content again", exampleSentence: "Let’s review material before the exam." },
        "discuss ideas": { meaning: "To talk about concepts", exampleSentence: "We’ll discuss ideas in the study group." },
        "prepare a presentation": { meaning: "To create a talk", exampleSentence: "I need to prepare a presentation for class." },
        "attend office hours": { meaning: "To meet with a teacher", exampleSentence: "I’ll attend office hours for help." },
        // New Vocabulary for Travel and Tourism
        "rent a car": { meaning: "To hire a vehicle", exampleSentence: "We’ll rent a car for the trip." },
        "check the map": { meaning: "To review a map for directions", exampleSentence: "Let’s check the map to find the hotel." },
        "visit a museum": { meaning: "To explore a cultural site", exampleSentence: "We’ll visit a museum this afternoon." },
        "book a flight": { meaning: "To reserve a plane ticket", exampleSentence: "I need to book a flight for next week." },
        "ask about tours": { meaning: "To inquire about guided trips", exampleSentence: "Can you ask about tours at the desk?" },
        "take photos": { meaning: "To capture images", exampleSentence: "I’ll take photos of the landmarks." },
        "check reviews": { meaning: "To read feedback about a place", exampleSentence: "Let’s check reviews for this hotel." },
        "buy souvenirs": { meaning: "To purchase keepsakes", exampleSentence: "I’ll buy souvenirs for my family." },
        // New Vocabulary for Health and Wellness
        "visit a dentist": { meaning: "To see a dental professional", exampleSentence: "I need to visit a dentist for a check-up." },
        "follow a routine": { meaning: "To stick to a schedule", exampleSentence: "I follow a routine to stay healthy." },
        "book a session": { meaning: "To schedule a wellness activity", exampleSentence: "I’ll book a session for yoga." },
        "eat nutritious food": { meaning: "To consume healthy meals", exampleSentence: "I try to eat nutritious food daily." },
        "track sleep": { meaning: "To monitor sleep patterns", exampleSentence: "I use an app to track sleep." },
        "consult a specialist": { meaning: "To seek expert medical advice", exampleSentence: "I’ll consult a specialist for my knee." },
        "practice breathing": { meaning: "To do breathing exercises", exampleSentence: "I practice breathing to reduce stress." },
        // New Vocabulary for Technology and Innovation
        "install an app": { meaning: "To add software to a device", exampleSentence: "I’ll install an app for productivity." },
        "update settings": { meaning: "To change device configurations", exampleSentence: "Let’s update settings for better performance." },
        "fix a bug": { meaning: "To correct a software error", exampleSentence: "The team will fix a bug in the app." },
        "share a file": { meaning: "To send a digital document", exampleSentence: "I’ll share a file via email." },
        "join a webinar": { meaning: "To attend an online seminar", exampleSentence: "I’ll join a webinar on coding." },
        "discuss features": { meaning: "To talk about product capabilities", exampleSentence: "Let’s discuss features of the new software." },
        "explore tools": { meaning: "To try out new applications", exampleSentence: "I’ll explore tools for project management." },
        // New Vocabulary for Social Media and Online Communication
        "create a profile": { meaning: "To set up an online account", exampleSentence: "I’ll create a profile on the platform." },
        "edit a post": { meaning: "To modify shared content", exampleSentence: "I need to edit a post for clarity." },
        "respond to comments": { meaning: "To reply to feedback", exampleSentence: "I’ll respond to comments on my post." },
        "join a group": { meaning: "To become part of an online community", exampleSentence: "I’ll join a group for photography." },
        "schedule a post": { meaning: "To plan content release", exampleSentence: "Let’s schedule a post for tomorrow." },
        "send an invite": { meaning: "To share a meeting request", exampleSentence: "I’ll send an invite for the call." },
        "host a meeting": { meaning: "To lead an online session", exampleSentence: "I’ll host a meeting on Zoom." },
        // New Vocabulary for Environment and Sustainability
        "reduce plastic use": { meaning: "To decrease reliance on plastic", exampleSentence: "I’ll reduce plastic use by carrying a reusable bottle." },
        "support green policies": { meaning: "To advocate for environmental laws", exampleSentence: "We should support green policies." },
        "join a campaign": { meaning: "To participate in an environmental effort", exampleSentence: "I’ll join a campaign to save forests." },
        "promote recycling": { meaning: "To encourage waste processing", exampleSentence: "Let’s promote recycling in our community." },
        "save resources": { meaning: "To conserve materials", exampleSentence: "We can save resources by turning off lights." },
        "learn about sustainability": { meaning: "To study eco-friendly practices", exampleSentence: "I’ll learn about sustainability online." },
        "adopt green habits": { meaning: "To use eco-conscious behaviors", exampleSentence: "Let’s adopt green habits like composting." },
        // New Vocabulary for Sports and Fitness
        "join a team": { meaning: "To become part of a sports group", exampleSentence: "I’ll join a team for soccer." },
        "train regularly": { meaning: "To practice consistently", exampleSentence: "I train regularly to improve my skills." },
        "compete in a race": { meaning: "To participate in a running event", exampleSentence: "I’ll compete in a race next month." },
        "follow a coach": { meaning: "To listen to a trainer’s advice", exampleSentence: "I follow a coach to get better." },
        "set a record": { meaning: "To achieve a new best performance", exampleSentence: "She set a record in swimming." },
        "practice drills": { meaning: "To do repetitive exercises", exampleSentence: "We practice drills to improve teamwork." },
        "attend a class": { meaning: "To join a fitness session", exampleSentence: "I’ll attend a class for yoga." },
        // New Vocabulary for Arts and Entertainment
        "watch a play": { meaning: "To see a theater performance", exampleSentence: "We’ll watch a play this weekend." },
        "listen to a band": { meaning: "To enjoy live music", exampleSentence: "I’ll listen to a band at the festival." },
        "visit a gallery": { meaning: "To explore an art exhibit", exampleSentence: "Let’s visit a gallery this afternoon." },
        "book tickets": { meaning: "To reserve seats for an event", exampleSentence: "I’ll book tickets for the concert." },
        "enjoy a show": { meaning: "To have fun at a performance", exampleSentence: "We’ll enjoy a show at the theater." },
        "discuss a movie": { meaning: "To talk about a film", exampleSentence: "Let’s discuss a movie we watched." },
        "attend a premiere": { meaning: "To go to a movie’s debut", exampleSentence: "I’ll attend a premiere next week." },
        // New Vocabulary for Food and Cooking
        "prepare ingredients": { meaning: "To get food items ready", exampleSentence: "I’ll prepare ingredients for dinner." },
        "cook a meal": { meaning: "To make a dish", exampleSentence: "Let’s cook a meal together." },
        "try new flavors": { meaning: "To taste different foods", exampleSentence: "I want to try new flavors this week." },
        "set the oven": { meaning: "To adjust the oven’s temperature", exampleSentence: "I’ll set the oven to 350°F." },
        "mix ingredients": { meaning: "To combine food items", exampleSentence: "I’ll mix ingredients for the cake." },
        "serve a dish": { meaning: "To present food", exampleSentence: "I’ll serve a dish to the guests." },
        "taste the sauce": { meaning: "To check the flavor", exampleSentence: "I’ll taste the sauce before serving." },
        // New Vocabulary for Business and Finance
        "track performance": { meaning: "To monitor business results", exampleSentence: "We’ll track performance to measure success." },
        "review a contract": { meaning: "To examine an agreement", exampleSentence: "I need to review a contract before signing." },
        "set financial goals": { meaning: "To plan monetary objectives", exampleSentence: "Let’s set financial goals for the year." },
        "discuss strategies": { meaning: "To talk about plans", exampleSentence: "We’ll discuss strategies for growth." },
        "plan investments": { meaning: "To organize financial assets", exampleSentence: "I’ll plan investments with my advisor." },
        "analyze markets": { meaning: "To study market behavior", exampleSentence: "We’ll analyze markets to predict trends." },
        // New Vocabulary for Hobbies and Leisure
        "start painting": { meaning: "To begin an art project", exampleSentence: "I’ll start painting this afternoon." },
        "grow herbs": { meaning: "To cultivate plants", exampleSentence: "I’ll grow herbs in my backyard." },
        "play chess": { meaning: "To engage in a strategy game", exampleSentence: "Let’s play chess tonight." },
        "go fishing": { meaning: "To catch fish for fun", exampleSentence: "I’ll go fishing this weekend." },
        "try pottery": { meaning: "To experiment with clay", exampleSentence: "I want to try pottery at the studio." },
        "read novels": { meaning: "To enjoy fictional books", exampleSentence: "I’ll read novels during my vacation." },
        "collect stamps": { meaning: "To gather postage stamps", exampleSentence: "He collects stamps as a hobby." },
        // New Vocabulary for Community and Volunteering
        "plan a workshop": { meaning: "To organize a training event", exampleSentence: "We’ll plan a workshop on sustainability." },
        "support neighbors": { meaning: "To help people nearby", exampleSentence: "Let’s support neighbors during the event." },
        "host an event": { meaning: "To lead a community gathering", exampleSentence: "I’ll host an event for charity." },
        "promote unity": { meaning: "To encourage togetherness", exampleSentence: "We’ll promote unity through projects." },
        "share resources": { meaning: "To provide materials", exampleSentence: "Let’s share resources with the cleanup." },
        "attend a rally": { meaning: "To join a public gathering", exampleSentence: "I’ll attend a rally for the cause." },
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
                    { title: "Giving Feedback", vocab: ["constructive criticism", "I see your point", "could you elaborate?", "moving forward", "actionable feedback"] },
                    { title: "Scheduling Meetings", vocab: ["set a meeting", "confirm availability", "reschedule", "send an invite", "join a call"] },
                    { title: "Proposing Solutions", vocab: ["propose a solution", "address concerns", "set expectations", "monitor progress", "review feedback"] },
                    { title: "Coordinating Tasks", vocab: ["coordinate efforts", "assign roles", "track progress", "collaborate effectively", "meet deadlines"] },
                    { title: "Taking Meeting Notes", vocab: ["take notes", "summarize points", "clarify details", "share minutes", "follow up"] },
                    { title: "Leading Discussions", vocab: ["facilitate a discussion", "encourage participation", "steer the conversation", "reach a consensus", "summarize outcomes"] },
                    { title: "Managing Time", vocab: ["allocate time", "stick to the schedule", "prioritize topics", "avoid overruns", "set priorities"] },
                    { title: "Handling Questions", vocab: ["field questions", "provide clarity", "address queries", "offer insights", "defer to experts"] }
                ]
            },
            {
                title: "Customer Service",
                content: "Learn to handle customer inquiries and complaints professionally.",
                thumbnail: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=800&q=60",
                subLessons: [
                    { title: "Handling Inquiries", vocab: ["how may i assist you?", "look into that for you", "inquiry", "availability", "product specifications"] },
                    { title: "Resolving Complaints", vocab: ["i understand your frustration", "we sincerely apologize for the inconvenience", "resolve the issue", "as a gesture of goodwill"] },
                    { title: "Following Up", vocab: ["follow up", "keep you updated", "reach out", "escalate the issue", "customer satisfaction"] },
                    { title: "Building Rapport", vocab: ["build rapport", "show empathy", "active listening", "personalize service", "gain trust"] },
                    { title: "Offering Support", vocab: ["offer support", "provide assistance", "guide the customer", "suggest options", "ensure satisfaction"] },
                    { title: "Handling Objections", vocab: ["handle objections", "address concerns", "clarify details", "reassure the customer", "find solutions"] },
                    { title: "Explaining Policies", vocab: ["explain policies", "return policy", "warranty details", "terms of service", "set expectations"] },
                    { title: "Upselling Products", vocab: ["suggest add-ons", "highlight benefits", "promote deals", "meet customer needs", "increase sales"] },
                    { title: "Closing Interactions", vocab: ["thank the customer", "confirm resolution", "invite feedback", "end positively", "ensure follow-through"] },
                    { title: "Managing Difficult Customers", vocab: ["stay calm", "de-escalate tensions", "listen actively", "offer solutions", "maintain professionalism"] }
                ]
            },
            {
                title: "Job Interviews",
                content: "Prepare for interviews with confidence and clear communication.",
                thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=60",
                subLessons: [
                    { title: "Describing Strengths", vocab: ["team player", "problem-solving skills", "adaptable", "detail-oriented", "leadership qualities"] },
                    { title: "Behavioral Questions", vocab: ["tell me about a time when you faced a challenge at work.", "STAR method", "handled a conflict", "managed a tight deadline"] },
                    { title: "Asking Questions", vocab: ["career growth", "company culture", "what are the next steps?", "team dynamics", "job responsibilities"] },
                    { title: "Discussing Experience", vocab: ["previous role", "key achievements", "relevant skills", "showcase achievements", "professional background"] },
                    { title: "Negotiating Salary", vocab: ["discuss compensation", "salary expectations", "benefits package", "negotiate terms", "market rate"] },
                    { title: "Following Up Post-Interview", vocab: ["send a thank-you note", "express interest", "reiterate qualifications", "request feedback", "stay professional"] },
                    { title: "Preparing for Questions", vocab: ["common questions", "practice responses", "align goals", "demonstrate value", "research company"] },
                    { title: "Making a First Impression", vocab: ["dress appropriately", "arrive on time", "firm handshake", "positive attitude", "build rapport"] },
                    { title: "Discussing Career Goals", vocab: ["career path", "long-term goals", "professional development", "discuss opportunities", "aspire to grow"] },
                    { title: "Handling Rejection", vocab: ["accept feedback", "stay positive", "seek improvement", "move forward", "explore options"] }
                ]
            },
            {
                title: "Team Collaboration",
                content: "Learn phrases for effective teamwork and project coordination.",
                thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=60",
                subLessons: [
                    { title: "Planning Projects", vocab: ["set milestones", "assign tasks", "meet deadlines", "collaborate effectively", "track progress"] },
                    { title: "Team Communication", vocab: ["brainstorm ideas", "share updates", "give input", "reach a consensus", "resolve conflicts"] },
                    { title: "Fostering Teamwork", vocab: ["foster teamwork", "build rapport", "encourage participation", "celebrate successes", "support colleagues"] },
                    { title: "Delegating Tasks", vocab: ["delegate tasks", "assign roles", "set expectations", "monitor progress", "provide guidance"] },
                    { title: "Resolving Conflicts", vocab: ["address concerns", "mediate disputes", "find common ground", "promote understanding", "maintain harmony"] },
                    { title: "Leading a Team", vocab: ["take initiative", "inspire others", "set priorities", "guide the team", "drive results"] },
                    { title: "Sharing Feedback", vocab: ["offer support", "review feedback", "suggest improvements", "acknowledge efforts", "promote growth"] },
                    { title: "Organizing Meetings", vocab: ["schedule a meeting", "set an agenda", "facilitate discussion", "summarize outcomes", "follow up"] },
                    { title: "Collaborating Remotely", vocab: ["join a video call", "share a file", "use collaboration tools", "stay connected", "coordinate efforts"] },
                    { title: "Celebrating Achievements", vocab: ["showcase achievements", "recognize contributions", "host a team event", "boost morale", "share success"] }
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
                    { title: "Grocery Shopping", vocab: ["aisle", "shopping cart", "checkout counter", "fresh produce", "loyalty card"] },
                    { title: "Online Shopping", vocab: ["add to cart", "place an order", "track delivery", "return item", "customer reviews"] },
                    { title: "Trying on Clothes", vocab: ["try on clothes", "check the fit", "choose a size", "mirror check", "fashion advice"] },
                    { title: "Comparing Prices", vocab: ["compare prices", "find a deal", "shop for deals", "budget shopping", "price tag"] },
                    { title: "Asking for Discounts", vocab: ["ask for a discount", "negotiate price", "special offer", "clearance sale", "promo code"] },
                    { title: "Checking Stock", vocab: ["check stock", "out of stock", "restock soon", "available online", "in-store availability"] },
                    { title: "Paying at Checkout", vocab: ["pay by card", "cash payment", "scan items", "apply coupon", "bag items"] },
                    { title: "Returning Items", vocab: ["return an item", "exchange product", "refund process", "store credit", "receipt needed"] },
                    { title: "Asking for Help", vocab: ["need assistance", "find an item", "store layout", "ask a staff", "locate product"] }
                ]
            },
            {
                title: "Dining Out",
                content: "Master ordering food and making reservations at restaurants.",
                thumbnail: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=60",
                subLessons: [
                    { title: "Making Reservations", vocab: ["i'd like to book a table", "for two people", "at 7 pm", "under the name"] },
                    { title: "Ordering Food", vocab: ["what do you recommend?", "i'll have the pasta with marinara sauce.", "could we have the bill, please?", "appetizer", "main course", "dessert"] },
                    { title: "Special Requests", vocab: ["make it quick", "gluten-free option", "no spices", "extra sauce", "split the bill"] },
                    { title: "Requesting a Menu", vocab: ["request a menu", "view options", "daily specials", "drink list", "ask about dishes"] },
                    { title: "Placing an Order", vocab: ["place an order", "confirm order", "modify order", "add a side", "remove an item"] },
                    { title: "Asking for Takeout", vocab: ["ask for takeout", "pack the food", "to-go box", "carry-out order", "quick service"] },
                    { title: "Leaving a Tip", vocab: ["leave a tip", "gratuity included", "excellent service", "tip percentage", "cash tip"] },
                    { title: "Complimenting Food", vocab: ["delicious meal", "great flavor", "chef’s special", "well-prepared", "enjoy the dish"] },
                    { title: "Handling Issues", vocab: ["wrong order", "send it back", "speak to the manager", "correct the mistake", "apologize for inconvenience"] },
                    { title: "Making Small Talk", vocab: ["chat with server", "ask about specials", "discuss the ambiance", "share preferences", "build rapport"] }
                ]
            },
            {
                title: "Daily Routines",
                content: "Discuss everyday activities and habits in English.",
                thumbnail: "https://images.unsplash.com/photo-1506784365847-bbadad4e01be?w=800&q=60",
                subLessons: [
                    { title: "Morning Routines", vocab: ["wake up early", "get ready", "have breakfast", "check emails", "commute to work"] },
                    { title: "Evening Activities", vocab: ["wind down", "watch a movie", "catch up with friends", "plan tomorrow", "go to bed"] },
                    { title: "Planning the Day", vocab: ["set an alarm", "check the time", "make a to-do list", "prioritize tasks", "schedule appointments"] },
                    { title: "Household Chores", vocab: ["tidy up", "do laundry", "wash dishes", "vacuum the floor", "organize space"] },
                    { title: "Fitness Routines", vocab: ["plan a workout", "go for a run", "stretch daily", "join a gym", "stay active"] },
                    { title: "Running Errands", vocab: ["run errands", "buy groceries", "visit the bank", "pick up packages", "manage time"] },
                    { title: "Socializing", vocab: ["catch a show", "host a dinner", "attend a concert", "meet friends", "social gathering"] },
                    { title: "Self-Care Practices", vocab: ["self-care routine", "relax and unwind", "read a book", "meditate daily", "stay hydrated"] },
                    { title: "Work-Life Balance", vocab: ["manage stress", "set boundaries", "take breaks", "spend time with family", "pursue hobbies"] },
                    { title: "Weekend Plans", vocab: ["weekend getaway", "try something new", "visit a park", "catch up on sleep", "plan a trip"] }
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
                    { title: "Event Comments", vocab: ["the food is delicious", "this is a great venue", "how do you know the host?"] },
                    { title: "Making Introductions", vocab: ["nice to meet you", "this is my friend", "have you met?", "let me introduce", "we work together"] },
                    { title: "Breaking the Ice", vocab: ["break the ice", "start a chat", "make small talk", "find common ground", "ask about interests"] },
                    { title: "Swapping Stories", vocab: ["swap stories", "share experiences", "tell a story", "listen actively", "show interest"] },
                    { title: "Discussing Plans", vocab: ["talk about plans", "any big plans?", "weekend activities", "upcoming events", "future goals"] },
                    { title: "Complimenting Others", vocab: ["great outfit", "impressive work", "nice choice", "well done", "appreciate your effort"] },
                    { title: "Joining Conversations", vocab: ["join a conversation", "add a comment", "share a thought", "ask a question", "engage with others"] },
                    { title: "Asking About Hobbies", vocab: ["ask about hobbies", "what do you enjoy?", "favorite pastime", "spend free time", "try new activities"] },
                    { title: "Ending Chats Politely", vocab: ["keep in touch", "good to see you", "catch up soon", "enjoyed talking", "see you later"] }
                ]
            },
            {
                title: "Workplace Chats",
                content: "Engage with colleagues through friendly small talk.",
                thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=60",
                subLessons: [
                    { title: "Weekend Plans", vocab: ["how was your weekend?", "did you do anything exciting?", "i had a relaxing weekend"] },
                    { title: "Work Updates", vocab: ["how's that project coming along?", "i'm swamped with work", "looking forward to the holidays"] },
                    { title: "Casual Conversations", vocab: ["have you seen that movie?", "what’s new with you?", "any plans for tonight?", "great job on that", "let’s grab coffee"] },
                    { title: "Discussing News", vocab: ["talk about the news", "have you heard?", "latest updates", "share opinions", "current events"] },
                    { title: "Making Suggestions", vocab: ["share a tip", "try this place", "recommend a book", "suggest an idea", "offer advice"] },
                    { title: "Building Rapport", vocab: ["build rapport", "show interest", "ask follow-ups", "connect with colleagues", "create bonds"] },
                    { title: "Chatting About Hobbies", vocab: ["ask about hobbies", "share interests", "discuss activities", "favorite pastime", "leisure time"] },
                    { title: "Starting Discussions", vocab: ["bring up a topic", "start a chat", "spark a conversation", "introduce a subject", "engage others"] },
                    { title: "Complimenting Work", vocab: ["great work", "impressive effort", "well done", "appreciate your help", "strong contribution"] },
                    { title: "Planning Team Events", vocab: ["host a team event", "plan a lunch", "organize an outing", "celebrate success", "boost morale"] }
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
                    { title: "Christmas Traditions", vocab: ["decorate the tree", "exchange gifts", "christmas carol", "mistletoe", "reindeer"] },
                    { title: "Holiday Preparations", vocab: ["wrap presents", "bake cookies", "host a party", "send cards", "buy a tree"] },
                    { title: "Planning a Feast", vocab: ["prepare a feast", "cook festive dishes", "set the table", "invite guests", "share a meal"] },
                    { title: "Decorating the House", vocab: ["set up decorations", "hang lights", "put up ornaments", "create a festive mood", "display wreaths"] },
                    { title: "Sharing Traditions", vocab: ["share traditions", "family customs", "holiday stories", "pass down practices", "celebrate together"] },
                    { title: "Attending Events", vocab: ["join celebrations", "attend a festival", "visit a market", "watch a parade", "sing carols"] },
                    { title: "Gift Shopping", vocab: ["buy gifts", "holiday shopping", "wrap presents", "find deals", "choose thoughtful items"] },
                    { title: "Hosting a Party", vocab: ["plan a party", "send invitations", "prepare snacks", "play festive music", "welcome guests"] },
                    { title: "Reflecting on the Season", vocab: ["express gratitude", "spread joy", "cherish moments", "give back", "holiday spirit"] }
                ]
            },
            {
                title: "New Year",
                content: "Discuss New Year’s resolutions and festivities.",
                thumbnail: "https://images.unsplash.com/photo-1483791424735-e9e77397a091?w=800&q=60",
                subLessons: [
                    { title: "Resolutions", vocab: ["new year's resolution", "i'm planning to exercise more this year.", "my goal is to learn a new skill.", "stick to it"] },
                    { title: "New Year’s Eve", vocab: ["happy new year!", "countdown", "fireworks", "celebrate", "auld lang syne"] },
                    { title: "Party Planning", vocab: ["invite guests", "plan a party", "toast to the new year", "party decorations", "midnight countdown"] },
                    { title: "Setting Goals", vocab: ["set goals", "plan for the year", "achieve dreams", "track progress", "stay motivated"] },
                    { title: "Celebrating with Friends", vocab: ["host a gathering", "join celebrations", "share a toast", "enjoy the night", "create memories"] },
                    { title: "Reflecting on the Past Year", vocab: ["look back", "highlight achievements", "learn from mistakes", "set new targets", "embrace change"] },
                    { title: "Decorating for the Event", vocab: ["set up decorations", "hang banners", "light sparklers", "create a festive vibe", "display lights"] },
                    { title: "Sharing Wishes", vocab: ["send greetings", "wish for success", "spread positivity", "exchange messages", "hope for the future"] },
                    { title: "Attending Public Events", vocab: ["watch fireworks", "join a festival", "attend a countdown", "celebrate in public", "enjoy live music"] },
                    { title: "Making Toasts", vocab: ["give a toast", "raise a glass", "cheer for the future", "inspire others", "mark the occasion"] }
                ]
            },
            {
                title: "Other Holidays",
                content: "Learn phrases for various cultural and seasonal holidays.",
                thumbnail: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=60",
                subLessons: [
                    { title: "Thanksgiving", vocab: ["give thanks", "family gathering", "turkey dinner", "gratitude", "holiday feast"] },
                    { title: "Halloween", vocab: ["trick or treat", "carve a pumpkin", "wear a costume", "haunted house", "candy"] },
                    { title: "Easter", vocab: ["hunt for eggs", "easter bunny", "paint eggs", "spring celebration", "family traditions"] },
                    { title: "Independence Day", vocab: ["watch fireworks", "host a barbecue", "wave flags", "celebrate freedom", "join a parade"] },
                    { title: "Valentine’s Day", vocab: ["send a card", "give flowers", "plan a date", "express love", "romantic dinner"] },
                    { title: "Diwali", vocab: ["light lamps", "share sweets", "celebrate light", "family gathering", "exchange gifts"] },
                    { title: "Lunar New Year", vocab: ["red envelopes", "dragon dance", "clean the house", "wish prosperity", "family reunion"] },
                    { title: "Hanukkah", vocab: ["light the candles", "play dreidel", "eat latkes", "celebrate miracles", "share traditions"] },
                    { title: "Cultural Festivals", vocab: ["attend a festival", "enjoy performances", "try local food", "join celebrations", "cultural experience"] },
                    { title: "Holiday Planning", vocab: ["plan a celebration", "set up decorations", "invite friends", "prepare a feast", "create memories"] }
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
                    { title: "Academic Tasks", vocab: ["syllabus", "lecture", "assignment", "group project", "deadline"] },
                    { title: "Class Discussions", vocab: ["share your opinion", "agree or disagree", "make a point", "support your argument", "summarize the discussion"] },
                    { title: "Presenting Topics", vocab: ["present a topic", "prepare a presentation", "use visuals", "engage the audience", "answer questions"] },
                    { title: "Taking Quizzes", vocab: ["take a quiz", "review material", "answer questions", "check answers", "score results"] },
                    { title: "Collaborating in Groups", vocab: ["join a group", "discuss ideas", "divide tasks", "meet deadlines", "present findings"] },
                    { title: "Seeking Help", vocab: ["attend office hours", "ask for clarification", "request feedback", "meet with teacher", "improve understanding"] },
                    { title: "Writing Assignments", vocab: ["write an essay", "cite sources", "organize ideas", "meet word count", "submit on time"] },
                    { title: "Preparing for Exams", vocab: ["study for exams", "review notes", "practice problems", "manage time", "stay focused"] },
                    { title: "Joining Clubs", vocab: ["join a club", "attend meetings", "participate in events", "build skills", "meet peers"] }
                ]
            },
            {
                title: "Workshops and Training",
                content: "Master language for professional development sessions.",
                thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=60",
                subLessons: [
                    { title: "Joining a Workshop", vocab: ["attend a workshop", "study group", "take notes", "ask a question", "group project"] },
                    { title: "Skill Development", vocab: ["learn a new skill", "hands-on practice", "group activity", "receive feedback", "apply knowledge"] },
                    { title: "Networking at Events", vocab: ["meet professionals", "exchange contacts", "discuss opportunities", "build connections", "follow up"] },
                    { title: "Participating Actively", vocab: ["engage in discussions", "share ideas", "ask questions", "contribute insights", "collaborate with peers"] },
                    { title: "Leading a Session", vocab: ["facilitate a workshop", "set objectives", "guide activities", "summarize key points", "encourage participation"] },
                    { title: "Taking Feedback", vocab: ["receive feedback", "review comments", "improve skills", "act on suggestions", "show appreciation"] },
                    { title: "Planning a Workshop", vocab: ["plan a workshop", "set an agenda", "arrange materials", "invite participants", "organize logistics"] },
                    { title: "Using Resources", vocab: ["access materials", "use tools", "refer to guides", "explore examples", "apply techniques"] },
                    { title: "Presenting Projects", vocab: ["showcase work", "explain concepts", "use visuals", "address questions", "highlight outcomes"] },
                    { title: "Reflecting on Learning", vocab: ["evaluate progress", "set learning goals", "identify strengths", "plan improvements", "track development"] }
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
                    { title: "Check-In and Boarding", vocab: ["check-in counter", "boarding pass", "luggage", "customs", "where is the gate?"] },
                    { title: "Flight Inquiries", vocab: ["flight delay", "boarding time", "gate change", "carry-on luggage", "check-in online"] },
                    { title: "Booking a Flight", vocab: ["book a flight", "choose a seat", "confirm booking", "check fares", "select dates"] },
                    { title: "Navigating the Airport", vocab: ["find the terminal", "check the map", "locate security", "visit duty-free", "board the plane"] },
                    { title: "Handling Issues", vocab: ["lost luggage", "missed flight", "request assistance", "file a complaint", "seek compensation"] },
                    { title: "Asking for Help", vocab: ["ask about flights", "need directions", "inquire about services", "contact staff", "find information"] },
                    { title: "Checking In Online", vocab: ["online check-in", "upload documents", "print boarding pass", "manage booking", "save time"] },
                    { title: "Understanding Announcements", vocab: ["listen to announcements", "gate change", "final call", "boarding now", "delay updates"] },
                    { title: "Exchanging Currency", vocab: ["exchange currency", "currency rate", "withdraw cash", "use a card", "find an ATM"] },
                    { title: "Preparing for Travel", vocab: ["pack luggage", "check visa", "review itinerary", "confirm flight", "arrive early"] }
                ]
            },
            {
                title: "Staying at a Hotel",
                content: "Learn to book and manage hotel stays.",
                thumbnail: "https://images.unsplash.com/photo-1564501049412-37c5e3b094c8?w=800&q=60",
                subLessons: [
                    { title: "Hotel Services", vocab: ["hotel reservation", "check-in", "room service", "is breakfast included?", "tour guide"] },
                    { title: "Exploring the City", vocab: ["sightseeing", "tour guide", "where is the gate?", "luggage", "is breakfast included?"] },
                    { title: "Hotel Issues", vocab: ["room not ready", "request a late checkout", "fix a problem", "change rooms", "wifi access"] },
                    { title: "Checking In", vocab: ["check-in process", "provide ID", "sign forms", "receive key", "ask about amenities"] },
                    { title: "Booking a Room", vocab: ["make a reservation", "choose a room", "confirm dates", "check reviews", "pay in advance"] },
                    { title: "Requesting Services", vocab: ["order room service", "ask for towels", "request cleaning", "book a spa", "call the front desk"] },
                    { title: "Checking Out", vocab: ["check out early", "settle the bill", "return the key", "leave feedback", "request a receipt"] },
                    { title: "Asking About Tours", vocab: ["ask about tours", "book a tour", "join a group", "explore sites", "learn history"] },
                    { title: "Navigating the Hotel", vocab: ["find the elevator", "locate the lobby", "visit the pool", "check facilities", "use the gym"] },
                    { title: "Discussing Preferences", vocab: ["prefer a quiet room", "request a view", "need extra pillows", "specify floor", "ask for upgrades"] }
                ]
            },
            {
                title: "Local Transportation",
                content: "Navigate public transport and local travel options.",
                thumbnail: "https://images.unsplash.com/photo-1523474686866-1c66a6ed81c5?w=800&q=60",
                subLessons: [
                    { title: "Using Public Transport", vocab: ["buy a ticket", "catch a bus", "train schedule", "taxi fare", "nearest station"] },
                    { title: "Asking for Directions", vocab: ["how do I get to?", "is it far?", "take a left", "walk straight", "landmark"] },
                    { title: "Renting a Car", vocab: ["rent a car", "sign a contract", "check insurance", "return the vehicle", "fill the tank"] },
                    { title: "Taking a Taxi", vocab: ["hail a taxi", "set a destination", "pay the fare", "request a receipt", "tip the driver"] },
                    { title: "Using Ride-Sharing Apps", vocab: ["book a ride", "track the driver", "rate the trip", "share location", "pay online"] },
                    { title: "Navigating with Maps", vocab: ["check the map", "find a route", "use GPS", "follow directions", "reach destination"] },
                    { title: "Buying Passes", vocab: ["purchase a pass", "daily ticket", "weekly pass", "validate ticket", "save money"] },
                    { title: "Understanding Schedules", vocab: ["check the timetable", "next departure", "arrive on time", "plan the trip", "avoid delays"] },
                    { title: "Exploring on Foot", vocab: ["walk around", "discover sites", "follow a path", "take photos", "enjoy the view"] },
                    { title: "Asking Locals", vocab: ["ask for directions", "get local tips", "find shortcuts", "learn about stops", "chat with residents"] }
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
                    { title: "Medical Consultations", vocab: ["make an appointment", "prescription", "symptoms", "i’m not feeling well", "take medicine"] },
                    { title: "Describing Symptoms", vocab: ["feel dizzy", "have a headache", "sore throat", "run a fever", "see a specialist"] },
                    { title: "Visiting a Dentist", vocab: ["visit a dentist", "check teeth", "fill a cavity", "cleaning appointment", "dental care"] },
                    { title: "Discussing Treatment", vocab: ["follow a routine", "take medication", "rest and recover", "monitor symptoms", "schedule follow-up"] },
                    { title: "Seeking Specialists", vocab: ["consult a specialist", "get a referral", "book a session", "discuss options", "review diagnosis"] },
                    { title: "Explaining Allergies", vocab: ["have an allergy", "avoid triggers", "carry medication", "inform the doctor", "manage reactions"] },
                    { title: "Asking About Tests", vocab: ["run a test", "check results", "blood work", "scan needed", "understand findings"] },
                    { title: "Discussing Pain", vocab: ["describe pain", "sharp discomfort", "chronic issue", "rate severity", "seek relief"] },
                    { title: "Emergency Situations", vocab: ["call emergency", "need urgent care", "describe condition", "request ambulance", "stay calm"] },
                    { title: "Pharmacy Visits", vocab: ["fill a prescription", "ask about dosage", "buy over-the-counter", "check side effects", "pay for medicine"] }
                ]
            },
            {
                title: "Healthy Living",
                content: "Discuss lifestyle choices for better health.",
                thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f9eefd?w=800&q=60",
                subLessons: [
                    { title: "Diet and Exercise", vocab: ["healthy diet", "exercise regularly", "stay hydrated", "mental health", "relax and unwind"] },
                    { title: "Wellness Practices", vocab: ["practice yoga", "meditate daily", "get enough sleep", "manage stress", "self-care routine"] },
                    { title: "Nutrition Choices", vocab: ["eat nutritious food", "balanced diet", "avoid junk food", "portion control", "try new recipes"] },
                    { title: "Sleep Habits", vocab: ["track sleep", "set a bedtime", "improve sleep quality", "avoid screens", "create a routine"] },
                    { title: "Mental Wellness", vocab: ["practice mindfulness", "mental wellness", "reduce stress", "seek support", "stay positive"] },
                    { title: "Fitness Goals", vocab: ["plan a workout", "set fitness goals", "track progress", "stay motivated", "join a class"] },
                    { title: "Preventive Care", vocab: ["book a check-up", "monitor health", "get vaccinated", "screen for issues", "stay proactive"] },
                    { title: "Stress Management", vocab: ["practice breathing", "avoid burnout", "take breaks", "manage workload", "find balance"] },
                    { title: "Hydration and Energy", vocab: ["drink water", "stay energized", "healthy snacks", "boost stamina", "maintain focus"] },
                    { title: "Building Habits", vocab: ["healthy habits", "stick to routines", "set reminders", "track improvements", "celebrate progress"] }
                ]
            }
        ]
    },
    {
        title: "Technology and Innovation",
        content: "Learn to discuss technology, software, and digital tools in English.",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=60",
        lessons: [
            {
                title: "Using Technology",
                content: "Master phrases for troubleshooting and discussing tech tools.",
                thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=60",
                subLessons: [
                    { title: "Software and Apps", vocab: ["software update", "cloud storage", "user interface", "troubleshoot", "tech support"] },
                    { title: "Tech Support Requests", vocab: ["what’s the wifi password?", "restart the device", "beta version", "debug", "open source"] },
                    { title: "Installing Apps", vocab: ["install an app", "download software", "check compatibility", "update settings", "grant permissions"] },
                    { title: "Managing Files", vocab: ["share a file", "save to cloud", "organize folders", "back up data", "delete duplicates"] },
                    { title: "Troubleshooting Issues", vocab: ["fix a bug", "run diagnostics", "reset the system", "check connections", "update drivers"] },
                    { title: "Using Devices", vocab: ["charge the device", "connect to wifi", "adjust settings", "sync data", "use shortcuts"] },
                    { title: "Learning Tools", vocab: ["explore tools", "try new apps", "watch tutorials", "read guides", "practice skills"] },
                    { title: "Joining Webinars", vocab: ["join a webinar", "register online", "participate actively", "ask questions", "network with attendees"] },
                    { title: "Discussing Features", vocab: ["discuss features", "compare tools", "highlight benefits", "evaluate performance", "suggest upgrades"] },
                    { title: "Staying Secure", vocab: ["use strong passwords", "enable two-factor", "avoid phishing", "update antivirus", "protect data"] }
                ]
            },
            {
                title: "Discussing Innovation",
                content: "Learn to talk about new technologies and trends.",
                thumbnail: "https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?w=800&q=60",
                subLessons: [
                    { title: "Tech Trends", vocab: ["artificial intelligence", "machine learning", "virtual reality", "blockchain", "cybersecurity"] },
                    { title: "Innovation Discussions", vocab: ["cutting-edge technology", "disruptive innovation", "adopt new tools", "tech startup", "digital transformation"] },
                    { title: "Exploring AI", vocab: ["use AI tools", "automate tasks", "analyze data", "improve efficiency", "learn algorithms"] },
                    { title: "Discussing Startups", vocab: ["launch a startup", "pitch an idea", "secure funding", "grow a business", "innovate solutions"] },
                    { title: "Talking About VR", vocab: ["experience VR", "develop apps", "explore virtual worlds", "use headsets", "create simulations"] },
                    { title: "Blockchain Basics", vocab: ["understand blockchain", "secure transactions", "use cryptocurrency", "track records", "decentralized system"] },
                    { title: "Cybersecurity Tips", vocab: ["protect data", "avoid hacks", "use encryption", "monitor threats", "stay updated"] },
                    { title: "Future Tech", vocab: ["predict trends", "adopt innovations", "explore robotics", "discuss automation", "plan for change"] },
                    { title: "Collaborating on Tech", vocab: ["work on projects", "share tech ideas", "test prototypes", "review feedback", "launch products"] },
                    { title: "Learning Tech Skills", vocab: ["learn coding", "take online courses", "practice skills", "join tech groups", "stay current"] }
                ]
            }
        ]
    },
    {
        title: "Social Media and Online Communication",
        content: "Navigate online platforms and social media interactions in English.",
        thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=60",
        lessons: [
            {
                title: "Social Media Engagement",
                content: "Learn to interact and share content on social platforms.",
                thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=60",
                subLessons: [
                    { title: "Posting and Sharing", vocab: ["go viral", "hashtag", "direct message", "content creator", "live stream"] },
                    { title: "Interacting Online", vocab: ["post an update", "tag someone", "share a link", "comment on a post", "follow an account"] },
                    { title: "Creating Profiles", vocab: ["create a profile", "set up an account", "add a bio", "upload a picture", "customize settings", "profile picture"] },
                    { title: "Editing Content", vocab: ["edit a post", "delete a comment", "update a story", "revise captions", "manage posts", "archive content"] },
                    { title: "Engaging with Comments", vocab: ["respond to comments", "answer questions", "thank followers", "address feedback", "encourage discussion", "moderate replies"] },
                    { title: "Building a Following", vocab: ["grow followers", "engage audience", "post regularly", "use hashtags", "collaborate with others", "create trends"] },
                    { title: "Sharing Stories", vocab: ["post a story", "add filters", "include stickers", "share moments", "boost engagement", "view analytics"] },
                    { title: "Going Live", vocab: ["start a live stream", "interact with viewers", "host a session", "save the stream", "promote event", "answer live questions"] },
                    { title: "Analyzing Insights", vocab: ["check insights", "track engagement", "view analytics", "monitor reach", "evaluate performance", "adjust strategy"] },
                    { title: "Collaborating Online", vocab: ["partner with creators", "join a challenge", "feature others", "cross-promote", "build community", "share credits"] }
                ]
            },
            {
                title: "Professional Online Communication",
                content: "Master email and messaging for professional settings.",
                thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=60",
                subLessons: [
                    { title: "Writing Emails", vocab: ["formal email", "attach a file", "cc someone", "reply all", "kind regards"] },
                    { title: "Online Meetings", vocab: ["join a video call", "mute the microphone", "share your screen", "virtual meeting", "connection issues"] },
                    { title: "Using Emojis", vocab: ["add emojis", "express tone", "avoid overuse", "choose appropriate", "match context", "smile icon"] },
                    { title: "Joining Group Chats", vocab: ["join a chat", "introduce yourself", "stay on topic", "respect rules", "contribute ideas", "mute notifications"] },
                    { title: "Video Call Etiquette", vocab: ["join a video call", "mute microphone", "turn on camera", "avoid distractions", "test connection", "end call"] },
                    { title: "Posting Comments", vocab: ["leave a comment", "stay respectful", "avoid negativity", "add value", "engage positively", "report spam"] },
                    { title: "Handling Misunderstandings", vocab: ["clarify intent", "apologize if needed", "resolve conflicts", "stay calm", "rephrase message", "seek understanding"] },
                    { title: "Managing Notifications", vocab: ["manage notifications", "set preferences", "mute chats", "prioritize alerts", "check updates", "stay organized"] },
                    { title: "Sharing Links", vocab: ["share a link", "verify source", "add context", "avoid spam", "check permissions", "open in browser"] },
                    { title: "Maintaining Privacy", vocab: ["protect privacy", "set boundaries", "avoid oversharing", "use secure platforms", "check settings", "stay safe"] }
                ]
            }
        ]
    },
    {
        title: "Environment and Sustainability",
        content: "Discuss environmental issues and sustainable practices in English.",
        thumbnail: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=60",
        lessons: [
            {
                title: "Environmental Issues",
                content: "Learn to talk about climate change and conservation.",
                thumbnail: "https://images.unsplash.com/photo-1508739773434-c26b3d1e7e0a?w=800&q=60",
                subLessons: [
                    { title: "Climate Change", vocab: ["carbon footprint", "renewable energy", "global warming", "reduce emissions", "green initiatives"] },
                    { title: "Conservation Efforts", vocab: ["protect wildlife", "preserve natural resources", "combat pollution", "plant trees", "clean energy"] },
                    { title: "Deforestation", vocab: ["prevent deforestation", "restore forests", "tree planting", "forest conservation", "sustainable logging", "ecosystem balance"] },
                    { title: "Ocean Pollution", vocab: ["reduce plastic waste", "clean oceans", "marine life", "pollution control", "coastal cleanup", "microplastics"] },
                    { title: "Air Quality", vocab: ["improve air quality", "reduce smog", "monitor emissions", "clean air", "pollution standards", "urban planning"] },
                    { title: "Wildlife Protection", vocab: ["save endangered species", "create sanctuaries", "stop poaching", "wildlife conservation", "habitat restoration", "animal rights"] },
                    { title: "Renewable Energy", vocab: ["solar power", "wind energy", "hydro power", "green technology", "energy transition", "sustainable energy"] },
                    { title: "Climate Policies", vocab: ["support policies", "carbon tax", "emission targets", "international agreements", "climate summit", "policy advocacy"] },
                    { title: "Water Conservation", vocab: ["conserve water", "prevent waste", "water management", "rain harvesting", "efficient irrigation", "clean water"] },
                    { title: "Urban Sustainability", vocab: ["green cities", "sustainable urban planning", "public transport", "reduce congestion", "eco-friendly buildings", "city parks"] }
                ]
            },
            {
                title: "Sustainable Practices",
                content: "Discuss ways to live sustainably.",
                thumbnail: "https://images.unsplash.com/photo-1440186347098-386b7459ad6b?w=800&q=60",
                subLessons: [
                    { title: "Eco-Friendly Living", vocab: ["recycle", "sustainable living", "zero waste", "compost", "eco-friendly"] },
                    { title: "Green Habits", vocab: ["use reusable bags", "save energy", "reduce waste", "buy local", "conserve water"] },
                    { title: "Sustainable Fashion", vocab: ["ethical fashion", "second-hand clothing", "sustainable brands", "avoid fast fashion", "recycle fabrics", "upcycle clothes"] },
                    { title: "Energy Efficiency", vocab: ["energy-efficient appliances", "turn off lights", "insulate homes", "smart thermostat", "reduce energy use", "solar panels"] },
                    { title: "Sustainable Diet", vocab: ["plant-based diet", "reduce meat", "organic food", "local produce", "food miles", "sustainable farming"] },
                    { title: "Green Transportation", vocab: ["use public transport", "ride a bike", "electric vehicles", "carpool", "reduce fuel use", "walk more"] },
                    { title: "Waste Management", vocab: ["sort waste", "compost organic", "recycle plastics", "avoid single-use", "donate items", "proper disposal"] },
                    { title: "Eco-Friendly Products", vocab: ["buy eco-products", "biodegradable items", "sustainable packaging", "avoid chemicals", "green brands", "refillable containers"] },
                    { title: "Community Gardening", vocab: ["start a garden", "grow food", "share produce", "compost waste", "urban farming", "green spaces"] },
                    { title: "Advocating Sustainability", vocab: ["raise awareness", "educate others", "join campaigns", "support green policies", "share tips", "inspire change"] }
                ]
            }
        ]
    },
    {
        title: "Sports and Fitness",
        content: "Learn to discuss sports, fitness routines, and athletic events.",
        thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=60",
        lessons: [
            {
                title: "Sports Activities",
                content: "Master phrases for discussing sports and games.",
                thumbnail: "https://images.unsplash.com/photo-1461896836931-6b9a41a1c2ad?w=800&q=60",
                subLessons: [
                    { title: "Playing Sports", vocab: ["warm-up", "cool-down", "personal best", "team captain", "score a goal"] },
                    { title: "Talking About Sports", vocab: ["favorite team", "watch a match", "cheer for", "play competitively", "sports event"] },
                    { title: "Joining a Team", vocab: ["join a team", "try out", "team spirit", "attend practice", "play a position", "support teammates"] },
                    { title: "Watching Live Games", vocab: ["buy tickets", "stadium atmosphere", "cheer loudly", "watch live", "support players", "game day"] },
                    { title: "Discussing Rules", vocab: ["learn the rules", "follow regulations", "referee calls", "game strategy", "fair play", "penalties"] },
                    { title: "Sports Equipment", vocab: ["buy gear", "wear uniforms", "use equipment", "maintain tools", "safety gear", "sports kit"] },
                    { title: "Training for Events", vocab: ["train for a game", "build stamina", "improve skills", "set goals", "track progress", "compete"] },
                    { title: "Celebrating Wins", vocab: ["celebrate victory", "award ceremony", "team pride", "share success", "trophy win", "post-game"] },
                    { title: "Sports Commentary", vocab: ["give commentary", "discuss plays", "analyze performance", "predict outcomes", "share opinions", "broadcast game"] },
                    { title: "Organizing Tournaments", vocab: ["plan a tournament", "set brackets", "invite teams", "manage schedule", "award prizes", "host event"] }
                ]
            },
            {
                title: "Fitness and Exercise",
                content: "Learn to talk about workouts and healthy habits.",
                thumbnail: "https://images.unsplash.com/photo-1518609878371-6d76ab6a50a2?w=800&q=60",
                subLessons: [
                    { title: "Gym Workouts", vocab: ["join a gym", "track your progress", "lift weights", "cardio exercise", "stretch daily"] },
                    { title: "Fitness Goals", vocab: ["set a goal", "stay motivated", "improve endurance", "build strength", "healthy lifestyle"] },
                    { title: "Home Workouts", vocab: ["exercise at home", "follow videos", "use bodyweight", "set a routine", "stay consistent", "create space"] },
                    { title: "Running Routines", vocab: ["go for a run", "track distance", "improve pace", "wear running shoes", "join a race", "stay hydrated"] },
                    { title: "Group Fitness", vocab: ["join a class", "attend yoga", "try spin", "work out together", "motivate each other", "book a session"] },
                    { title: "Stretching Exercises", vocab: ["do stretches", "improve flexibility", "prevent injury", "warm up muscles", "cool down", "daily mobility"] },
                    { title: "Nutrition for Fitness", vocab: ["eat for fitness", "protein intake", "healthy carbs", "post-workout meal", "stay fueled", "balance diet"] },
                    { title: "Tracking Progress", vocab: ["use a fitness app", "log workouts", "measure gains", "set milestones", "review achievements", "adjust plan"] },
                    { title: "Outdoor Fitness", vocab: ["exercise outdoors", "hike trails", "cycle paths", "swim laps", "enjoy nature", "stay active"] },
                    { title: "Rest and Recovery", vocab: ["take rest days", "recover muscles", "get enough sleep", "avoid overtraining", "listen to body", "relax"] }
                ]
            }
        ]
    },
    {
        title: "Arts and Entertainment",
        content: "Discuss movies, music, and cultural events in English.",
        thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=60",
        lessons: [
            {
                title: "Movies and Shows",
                content: "Learn phrases for discussing films and TV series.",
                thumbnail: "https://images.unsplash.com/photo-1536440136628-0f0603d8c7b1?w=800&q=60",
                subLessons: [
                    { title: "Watching Movies", vocab: ["box office", "red carpet", "binge-watch", "sold out", "behind the scenes"] },
                    { title: "Discussing Shows", vocab: ["favorite series", "new episode", "plot twist", "stream online", "movie genre"] },
                    { title: "Choosing Films", vocab: ["pick a movie", "read reviews", "check ratings", "watch trailers", "select genre", "book tickets"] },
                    { title: "Talking About Actors", vocab: ["favorite actor", "star in a film", "award-winning", "play a role", "cast members", "performance"] },
                    { title: "Discussing Plots", vocab: ["explain the plot", "share spoilers", "twist ending", "main storyline", "character arc", "predict outcome"] },
                    { title: "Movie Genres", vocab: ["watch a comedy", "enjoy drama", "love sci-fi", "try horror", "action-packed", "romantic film"] },
                    { title: "Streaming Platforms", vocab: ["use a platform", "subscribe online", "stream shows", "download episodes", "watch offline", "create profiles"] },
                    { title: "Attending Premieres", vocab: ["attend a premiere", "walk the red carpet", "meet stars", "watch early", "join fans", "celebrate launch"] },
                    { title: "Sharing Reviews", vocab: ["write a review", "rate a film", "share opinions", "recommend shows", "discuss favorites", "post online"] },
                    { title: "Film Festivals", vocab: ["visit a festival", "watch indie films", "meet directors", "join screenings", "award winners", "network"] }
                ]
            },
            {
                title: "Live Performances",
                content: "Talk about concerts, theater, and live events.",
                thumbnail: "https://images.unsplash.com/photo-1503095396549-807759745b35?w=800&q=60",
                subLessons: [
                    { title: "Attending Events", vocab: ["buy tickets", "front row", "live performance", "venue location", "festival pass"] },
                    { title: "Performing Arts", vocab: ["audition", "standing ovation", "rehearse a play", "stage performance", "theater production"] }

                ]
            }
        ]
    },
    {
        title: "Food and Cooking",
        content: "Learn to discuss recipes, cooking techniques, and dining experiences.",
        thumbnail: "https://images.unsplash.com/photo-1498837167922-ddd275948d5b?w=800&q=60",
        lessons: [
            {
                title: "Cooking at Home",
                content: "Master phrases for preparing meals and discussing recipes.",
                thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae37?w=800&q=60",
                subLessons: [
                    { title: "Preparing Recipes", vocab: ["recipe", "ingredient", "chop vegetables", "simmer", "bake in the oven"] },
                    { title: "Cooking Techniques", vocab: ["taste for seasoning", "grill meat", "boil water", "stir the pot", "preheat the oven"] }
                ]
            },
            {
                title: "Food Culture",
                content: "Discuss food preferences and dining traditions.",
                thumbnail: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&q=60",
                subLessons: [
                    { title: "Talking About Food", vocab: ["homemade meal", "favorite dish", "try new cuisines", "food festival", "local specialty"] },
                    { title: "Dining Etiquette", vocab: ["set the table", "pass the salt", "compliment the chef", "share a meal", "tip the server"] }
                ]
            }
        ]
    },
    {
        title: "Business and Finance",
        content: "Learn to discuss financial concepts, business strategies, and economic terms in English.",
        thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=60",
        lessons: [
            {
                title: "Financial Planning",
                content: "Master vocabulary for budgeting and forecasting in business.",
                thumbnail: "https://images.unsplash.com/photo-1551288049-b1f3c42d6a54?w=800&q=60",
                subLessons: [
                    { title: "Creating Budgets", vocab: ["budget plan", "revenue stream", "cost-effective", "return on investment", "financial forecast"] },
                    { title: "Managing Finances", vocab: ["invoice", "cash flow", "investment portfolio", "market trends", "negotiate a deal"] }
                ]
            },
            {
                title: "Business Negotiations",
                content: "Learn phrases for negotiating deals and contracts.",
                thumbnail: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&q=60",
                subLessons: [
                    { title: "Discussing Terms", vocab: ["negotiate a deal", "reach an agreement", "set terms", "mutual benefit", "close the deal"] },
                    { title: "Presenting Proposals", vocab: ["business proposal", "outline benefits", "address concerns", "secure funding", "market analysis"] }
                ]
            },
            {
                title: "Economic Discussions",
                content: "Talk about market trends and economic concepts.",
                thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=60",
                subLessons: [
                    { title: "Market Insights", vocab: ["market trends", "economic growth", "supply and demand", "inflation rate", "global economy"] },
                    { title: "Business Strategies", vocab: ["competitive advantage", "target audience", "brand positioning", "scale operations", "diversify products"] }
                ]
            }
        ]
    },
    {
        title: "Hobbies and Leisure",
        content: "Discuss hobbies, recreational activities, and leisure time in English.",
        thumbnail: "https://images.unsplash.com/photo-1504280390367-5f8a8d9e77cd?w=800&q=60",
        lessons: [
            {
                title: "Creative Hobbies",
                content: "Learn to talk about artistic and creative activities.",
                thumbnail: "https://images.unsplash.com/photo-1513366208864-8752b8bd20ac?w=800&q=60",
                subLessons: [
                    { title: "Art and Crafts", vocab: ["pick up a hobby", "DIY project", "knitting", "take up photography", "create art"] },
                    { title: "Gardening", vocab: ["gardening", "plant a seed", "water the plants", "grow vegetables", "landscape design"] }
                ]
            },
            {
                title: "Active Leisure",
                content: "Discuss outdoor and physical activities for fun.",
                thumbnail: "https://images.unsplash.com/photo-1518609878371-6d76ab6a50a2?w=800&q=60",
                subLessons: [
                    { title: "Outdoor Activities", vocab: ["go hiking", "ride a bike", "go camping", "explore nature", "take a walk"] },
                    { title: "Group Games", vocab: ["board game", "join a club", "play cards", "team up for a game", "host a game night"] }
                ]
            },
            {
                title: "Relaxation and Fun",
                content: "Talk about ways to unwind and enjoy free time.",
                thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=60",
                subLessons: [
                    { title: "Leisure Activities", vocab: ["leisure time", "read a book", "listen to music", "watch a series", "relax at home"] },
                    { title: "Trying New Things", vocab: ["try something new", "learn a craft", "attend a class", "explore a hobby", "join a group"] }
                ]
            }
        ]
    },
    {
        title: "Community and Volunteering",
        content: "Learn to discuss community involvement and volunteer activities in English.",
        thumbnail: "https://images.unsplash.com/photo-1532622785990-d6f376a6f914?w=800&q=60",
        lessons: [
            {
                title: "Volunteering",
                content: "Master phrases for participating in volunteer work.",
                thumbnail: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=60",
                subLessons: [
                    { title: "Volunteer Activities", vocab: ["volunteer work", "sign up to volunteer", "lend a hand", "make a difference", "community service"] },
                    { title: "Organizing Events", vocab: ["organize a fundraiser", "community event", "spread awareness", "donate to charity", "host an event"] }
                ]
            },
            {
                title: "Community Engagement",
                content: "Learn to talk about building stronger communities.",
                thumbnail: "https://images.unsplash.com/photo-1524504388940-b6f5861d6f0d?w=800&q=60",
                subLessons: [
                    { title: "Community Projects", vocab: ["local initiative", "team up", "community outreach", "support a cause", "build connections"] },
                    { title: "Discussing Impact", vocab: ["make a difference", "raise funds", "inspire others", "collaborate on projects", "community spirit"] }
                ]
            },
            {
                title: "Fundraising Events",
                content: "Discuss organizing and participating in fundraisers.",
                thumbnail: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=60",
                subLessons: [
                    { title: "Planning Fundraisers", vocab: ["organize a fundraiser", "raise funds", "set a goal", "promote the event", "collect donations"] },
                    { title: "Engaging Donors", vocab: ["donate to charity", "share the cause", "inspire support", "thank donors", "build awareness"] },
                    { title: "Event Logistics", vocab: ["host an event", "plan logistics", "set up a booth", "manage volunteers", "track donations"] }
                ]
            },
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