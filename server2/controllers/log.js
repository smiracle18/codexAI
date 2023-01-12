import express from 'express';
import mongoose from 'mongoose';

import logMessage from '../models/logMessage.js';

const router = express.Router();

export const getImageLogs = async (req, res) => { 
    try {
        const logMessages = await logMessage.find();
        const image_urls = logMessages.filter(log => log.image_url)
        res.status(200).json(image_urls);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createLog = async (req, res) => {
    const log = req.body;
    const newLogMessage = new logMessage({ ...log, createdAt: new Date().toISOString() })

    try {
        await newLogMessage.save();
        console.log("saved")

        res.status(201).json(newLogMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


// export const deleteLog = async (req, res) => {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

//     await PostMessage.findByIdAndRemove(id);

//     res.json({ message: "Post deleted successfully." });
// }


export default router;