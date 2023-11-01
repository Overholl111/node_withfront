import express from 'express';
import mongoose, { trusted } from 'mongoose';
import cors from 'cors';
import router from './routers/router.js'
import { PostController } from './controllers/index.js'
const PORT = 4444;
const DB_URL = 'mongodb+srv://gotovtsev223:Xeyufxfyuf123@cluster0.jrfmldq.mongodb.net/withfront?'

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/tmp', express.static('tmp'));
app.use('/api/uploads', express.static('uploads'))
app.use('/api', router);

async function startApp() {
    try {
        app.listen(PORT,() => console.log('Server: ' + PORT));
        await mongoose.connect(DB_URL, {
            useUnifiedTopology: true , useNewUrlParser: true
        }).then(console.log('DB ok'));
    } catch(e) {
        console.log(e);
    }
}

startApp();