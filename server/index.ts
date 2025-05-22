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
import axios from 'axios';
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
//     // 1. Tạo Courses cho các danh mục
//     const courseBasics = await Course.create({
//         title: "Basic English Conversations",
//         description: "Practice essential English conversations for everyday situations.",
//         level: "beginner",
//         thumbnail: "https://app.talkpal.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FDialogueMode.f7c4f7b5.jpg&w=1200&q=100"
//     });

//     const courseIntermediate = await Course.create({
//         title: "Intermediate English Conversations",
//         description: "Improve your English with conversations in more complex scenarios.",
//         level: "intermediate",
//         thumbnail: "https://app.talkpal.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FSentenceMode.dd5d65d9.jpg&w=1200&q=100"
//     });

//     const courseProfessional = await Course.create({
//         title: "Professional English Conversations",
//         description: "Master English conversations for workplace and professional settings.",
//         level: "advanced",
//         thumbnail: "https://app.talkpal.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FRoleplayMode.5c7e6c1e.jpg&w=1200&q=100"
//     });

//     // 2. Tạo Lessons dựa trên dữ liệu cung cấp
//     await Lesson.insertMany([
//         // Basics
//         {
//             courseId: courseBasics._id,
//             title: "Ordering a taxi",
//             type: "speaking",
//             content: "Practice ordering a taxi and discussing destinations with a driver.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/ordering_a_taxi.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/taxi_driver.jpg",
//             name: "Taxi driver",
//             category: "Basics"
//         },
//         {
//             courseId: courseBasics._id,
//             title: "Booking a hotel",
//             type: "speaking",
//             content: "Learn to reserve a hotel room and discuss amenities.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/booking_a_hotel.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/hotel_manager.jpg",
//             name: "Hotel manager",
//             category: "Basics"
//         },
//         {
//             courseId: courseBasics._id,
//             title: "At a supermarket",
//             type: "speaking",
//             content: "Understand conversations with a cashier at a supermarket.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/at_a_supermarket.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/cashier.jpg",
//             name: "Cashier",
//             category: "Basics"
//         },
//         {
//             courseId: courseBasics._id,
//             title: "Buying clothes",
//             type: "speaking",
//             content: "Practice discussing sizes, colors, and prices with a store employee.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/buying_clothes.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/store_employee.jpg",
//             name: "Store employee",
//             category: "Basics"
//         },
//         {
//             courseId: courseBasics._id,
//             title: "Ordering food in a restaurant",
//             type: "speaking",
//             content: "Learn to order food and drinks at a restaurant.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/ordering_food_in_a_restaurant.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/waiter.jpg",
//             name: "Waiter",
//             category: "Basics"
//         },
//         {
//             courseId: courseBasics._id,
//             title: "Coffee shop",
//             type: "speaking",
//             content: "Practice ordering coffee and chatting with a barista.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/coffee_shop.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/barista.jpg",
//             name: "Barista",
//             category: "Basics"
//         },
//         {
//             courseId: courseBasics._id,
//             title: "Opening a bank account",
//             type: "speaking",
//             content: "Learn to discuss account options with a bank employee.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/opening_a_bank_account.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/bank_employee.jpg",
//             name: "Bank employee",
//             category: "Basics"
//         },
//         {
//             courseId: courseBasics._id,
//             title: "Renting an apartment",
//             type: "speaking",
//             content: "Practice discussing rental terms with a real estate agent.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/renting_an_apartment.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/real_estate_agent.jpg",
//             name: "Real estate agent",
//             category: "Basics"
//         },
//         {
//             courseId: courseBasics._id,
//             title: "Starting a gym membership",
//             type: "speaking",
//             content: "Learn to discuss membership plans with a gym employee.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/starting_a_gym_membership.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/gyp_employee.jpg",
//             name: "Gym employee",
//             category: "Basics"
//         },
//         {
//             courseId: courseBasics._id,
//             title: "Meeting an old friend",
//             type: "speaking",
//             content: "Practice catching up with an old friend.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/meeting_an_old_friend.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/anita.jpg",
//             name: "Anita",
//             category: "Basics"
//         },
//         {
//             courseId: courseBasics._id,
//             title: "Hair salon",
//             type: "speaking",
//             content: "Learn to book an appointment and discuss hairstyles at a salon.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/making_an_appointment_at_the_hair_salon.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/salon_manager_.jpg",
//             name: "Salon manager",
//             category: "Basics"
//         },
//         {
//             courseId: courseBasics._id,
//             title: "At dry cleaning",
//             type: "speaking",
//             content: "Practice discussing cleaning services with a dry cleaner clerk.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/at_dry_cleaning.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/dry_cleaner_clerk.jpg",
//             name: "Dry cleaner clerk",
//             category: "Basics"
//         },
//         {
//             courseId: courseBasics._id,
//             title: "At post office sending package",
//             type: "speaking",
//             content: "Learn to discuss shipping options with a post office clerk.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/at_post_office_sending_package_.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/post_office_clerk.jpg",
//             name: "Post office clerk",
//             category: "Basics"
//         },
//         {
//             courseId: courseBasics._id,
//             title: "Lunchtime chat",
//             type: "speaking",
//             content: "Practice casual conversation with a co-worker during lunch.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/lunchtime_chat_.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/your_co-worker.jpg",
//             name: "Your co-worker",
//             category: "Basics"
//         },
//         // Intermediate
//         {
//             courseId: courseIntermediate._id,
//             title: "Date night",
//             type: "speaking",
//             content: "Practice romantic conversation during a date.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/date_night.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/sandra.jpg",
//             name: "Sandra",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "At a doctor",
//             type: "speaking",
//             content: "Learn to discuss health concerns with a doctor.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/at_a_doctor.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/doctor_dreyfus.jpg",
//             name: "Doctor Dreyfus",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Travel agency",
//             type: "speaking",
//             content: "Practice planning a trip with a travel agent.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/travel_agency.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/travel_agent.jpg",
//             name: "Travel agent",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Customer support chat",
//             type: "speaking",
//             content: "Learn to resolve issues with a customer support representative.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/customer_support_chat.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/customer_support.jpg",
//             name: "Customer support",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Mobile phone contract",
//             type: "speaking",
//             content: "Practice discussing phone plans with a sales representative.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/mobile_phone_contract.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/sales_representative.jpg",
//             name: "Sales representative",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Phone repair shop",
//             type: "speaking",
//             content: "Learn to discuss phone repairs with a repairman.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/phone_repair_shop.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/repairman.jpg",
//             name: "Repairman",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "At a police station",
//             type: "speaking",
//             content: "Practice reporting an issue to a policewoman.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/at_a_police_station.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/policewoman.jpg",
//             name: "Policewoman",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Returning damaged item to store",
//             type: "speaking",
//             content: "Learn to return a damaged item to a store employee.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/returning_damaged_item_to_store.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/store_employee.jpg",
//             name: "Store employee",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "At a pet shop",
//             type: "speaking",
//             content: "Practice discussing pet supplies with a consultant.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/buying_dog_food_at_pet_shop.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/consultant_pet_shop.jpg",
//             name: "Consultant",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Buying a new book",
//             type: "speaking",
//             content: "Learn to discuss book recommendations with a bookstore consultant.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/visiting_bookstore_to_buy_new_book.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/consultant_bookstore.jpg",
//             name: "Consultant",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Lost luggage",
//             type: "speaking",
//             content: "Practice reporting lost luggage to an airline representative.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/lost_luggage_at_airport.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/airline_representative.jpg",
//             name: "Airline representative",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "At the vet",
//             type: "speaking",
//             content: "Learn to discuss pet health with a veterinarian.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/taking_your_pet_to_a_vet.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/veterinarian.jpg",
//             name: "Veterinarian",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "House chores",
//             type: "speaking",
//             content: "Practice discussing household tasks with a roommate.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/discussing_house_chores_with_roommate.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/roommate.jpg",
//             name: "Roommate",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Apartment sitting",
//             type: "speaking",
//             content: "Learn to give apartment sitting instructions to a friend.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/giving_apartment_sitting_instructions_.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/best_friend_.jpg",
//             name: "Best friend",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Resolving a dispute",
//             type: "speaking",
//             content: "Practice resolving a conflict with a neighbor.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/resolving_a_dispute_with_a_neighbor.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/neighbor.jpg",
//             name: "Neighbor",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Making friends",
//             type: "speaking",
//             content: "Learn to make friends with a new employee.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/making_friends_with_new_employee_.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/new_employee.jpg",
//             name: "New employee",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Weekend getaway",
//             type: "speaking",
//             content: "Practice planning a weekend trip with your partner.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/planning_a_weekend_getaway.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/your_partner.jpg",
//             name: "Your partner",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Meeting an intriguing stranger",
//             type: "speaking",
//             content: "Learn to start a conversation with an intriguing stranger.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/meeting_interesting_person_.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/_intriguing_stranger.jpg",
//             name: "Intriguing Stranger",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Apartment renovation",
//             type: "speaking",
//             content: "Practice discussing renovation plans with your roommate.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/discussing_renovation_of_apartment_.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/your_roommate.jpg",
//             name: "Your roommate",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Meeting your mother-in-law",
//             type: "speaking",
//             content: "Learn to converse with your partner's mother for the first time.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/meeting_your_partner_s_mother_for_the_first_time.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/your_partner_s_mother.jpg",
//             name: "Your partner's mother",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Online dating",
//             type: "speaking",
//             content: "Practice texting someone you met online.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/texting_someone_interesting_you_have_met_online.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/your_potential_partner.jpg",
//             name: "Your potential partner",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Interviewing a celebrity",
//             type: "speaking",
//             content: "Learn to conduct an interview with a celebrity.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/interviewing_your_favorite_celebrity.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/celebrity.jpg",
//             name: "Celebrity",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Being a celebrity",
//             type: "speaking",
//             content: "Practice responding to an interview as a celebrity.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/you_are_getting_interviewed_as_a_celebrity.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/interviewer.jpg",
//             name: "Interviewer",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Birthday present discussion",
//             type: "speaking",
//             content: "Practice discussing a birthday gift for your boss with a co-worker.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/discussing_birthday_present_for_your_boss.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/co-worker__female.jpg",
//             name: "Co-worker",
//             category: "Intermediate"
//         },
//         {
//             courseId: courseIntermediate._id,
//             title: "Parent-teacher conference",
//             type: "speaking",
//             content: "Learn to discuss your child's progress with a teacher.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/attending_parent_teacher_conference_.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/teacher.jpg",
//             name: "Teacher",
//             category: "Intermediate"
//         },
//         // Professional
//         {
//             courseId: courseProfessional._id,
//             title: "Sales pitch",
//             type: "speaking",
//             content: "Practice delivering a sales pitch to a company owner.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/sales_pitch.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/company_owner.jpg",
//             name: "Company owner",
//             category: "Professional"
//         },
//         {
//             courseId: courseProfessional._id,
//             title: "Job interview",
//             type: "speaking",
//             content: "Learn to answer questions in a job interview with an HR person.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/job_interview.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/hr_preson.jpg",
//             name: "HR person",
//             category: "Professional"
//         },
//         {
//             courseId: courseProfessional._id,
//             title: "Networking event",
//             type: "speaking",
//             content: "Practice making connections at a networking event.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/networking_event.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/michelle.jpg",
//             name: "Michelle",
//             category: "Professional"
//         },
//         {
//             courseId: courseProfessional._id,
//             title: "Yearly review",
//             type: "speaking",
//             content: "Learn to discuss your performance with your manager.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/yearly_review.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/your_manager.jpg",
//             name: "Your manager",
//             category: "Professional"
//         },
//         {
//             courseId: courseProfessional._id,
//             title: "Negotiation",
//             type: "speaking",
//             content: "Practice negotiating terms with a company representative.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/negotiation.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/company_representative.jpg",
//             name: "Company representative",
//             category: "Professional"
//         },
//         {
//             courseId: courseProfessional._id,
//             title: "Getting fired",
//             type: "speaking",
//             content: "Learn to respond professionally when discussing termination with your boss.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/getting_fired.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/your_boss.jpg",
//             name: "Your boss",
//             category: "Professional"
//         },
//         {
//             courseId: courseProfessional._id,
//             title: "Ordering office supplies",
//             type: "speaking",
//             content: "Practice ordering supplies with a vendor.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/ordering_office_supplies.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/vendor.jpg",
//             name: "Vendor",
//             category: "Professional"
//         },
//         {
//             courseId: courseProfessional._id,
//             title: "Visiting car mechanic",
//             type: "speaking",
//             content: "Learn to discuss car repairs with a mechanic.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/visiting_car_mechanic_.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/mechanic.jpg",
//             name: "Mechanic",
//             category: "Professional"
//         },
//         {
//             courseId: courseProfessional._id,
//             title: "Tech support",
//             type: "speaking",
//             content: "Practice resolving technical issues with a tech support representative.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/asking_for_tech_support_for_computer_issues.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/tech_support_representative.jpg",
//             name: "Tech support representative",
//             category: "Professional"
//         },
//         {
//             courseId: courseProfessional._id,
//             title: "Managing customer complaints",
//             type: "speaking",
//             content: "Learn to handle complaints from a customer.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/handling_customer_complaints.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/customer.jpg",
//             name: "Customer",
//             category: "Professional"
//         },
//         {
//             courseId: courseProfessional._id,
//             title: "Discussing a promotion",
//             type: "speaking",
//             content: "Practice discussing a promotion with an HR manager.",
//             thumbnail: "https://files.talkpal.ai/roleplays-mode/cover/discussing_a_promotion_.jpg",
//             aiImg: "https://files.talkpal.ai/roleplays-mode/image/hr_manager_.jpg",
//             name: "HR manager",
//             category: "Professional"
//         }
//     ]);

//     console.log("✅ Seed dữ liệu thành công");
// }

// seedData().catch(console.error);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})