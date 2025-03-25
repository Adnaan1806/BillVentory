import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, addInventory, getInventory, updateInventory, deleteInventory } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/add-inventory', authUser, addInventory)
userRouter.get('/get-inventory', authUser, getInventory)
userRouter.put('/update-inventory/:id', authUser, updateInventory)
userRouter.delete('/delete-inventory/:id', authUser, deleteInventory)

export default userRouter;