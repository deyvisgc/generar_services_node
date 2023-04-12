import { Router } from "express";
import { generarService } from '../controllers/DefaultController';
const router: Router = Router();
router.post("/", generarService)
export default router;