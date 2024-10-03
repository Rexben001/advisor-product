import { Router } from 'express';
import { register, login } from '../controllers/advisor.controller';
import { validateData } from '../middlewares/validation.middleware';
import {
    advisorRegistrationRequest,
    advisorLoginRequest,
} from '../schemas/advisor.schema';

const router = Router();

router.post('/login', validateData(advisorLoginRequest), login);
router.post('/register', validateData(advisorRegistrationRequest), register);

export default router;
