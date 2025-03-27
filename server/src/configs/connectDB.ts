import mongoose from 'mongoose'
export async function connectDB() {

    try {
        const connectedBD = await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: "speak-up",
        });
        if (!connectedBD) {
            console.log("Couldn't connect to MongoDB");
            process.exit(1)
        } else {
            console.log("Connected to MongoDB");
        }
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
};
