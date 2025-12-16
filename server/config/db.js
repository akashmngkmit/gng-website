import mongoose from 'mongoose';

const connect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connect;