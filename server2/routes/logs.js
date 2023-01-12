import express from 'express';

import {getImageLogs, createLog} from '../controllers/log.js';

const router = express.Router();

router.get('/', getImageLogs);
router.post('/',  createLog);

export default router;