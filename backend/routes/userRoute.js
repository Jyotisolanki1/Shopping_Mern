import express from 'express';
import { deleteUser, forgotPassword, getAllUsers, getSingleUser, getUserDetails, loginUser, logout, registerUser, resetPassword, updatePassword, updateProfile ,updateUserRole} from '../controller/userController.js';
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth.js';
import { createProductReview, deleteReview, getProductReviews } from '../controller/productController.js';
const router = express.Router();
 router.post('/register',registerUser);
 router.post('/login', loginUser);
 router.get('/logout',logout);
 router.post('/password/forgot', forgotPassword);
 router.put('/password/reset/:token',resetPassword);
 router.get("/me",isAuthenticatedUser,getUserDetails);
 router.put("/me/update",isAuthenticatedUser,updateProfile);
 router.put('/password/update',isAuthenticatedUser,updatePassword);

 router.get("/admin/users",isAuthenticatedUser,authorizeRoles("admin"),getAllUsers)
 router.get('/admin/user/:id',isAuthenticatedUser,authorizeRoles("admin"),getSingleUser);
 router.put('/admin/user/:id',isAuthenticatedUser,authorizeRoles("admin"),updateUserRole);
 router.delete('/admin/user/:id',isAuthenticatedUser,authorizeRoles("admin"),deleteUser);
 router.put('/review',isAuthenticatedUser,createProductReview);
 router.get('/reviews',getProductReviews);
 router.delete('/reviews',isAuthenticatedUser,deleteReview);
 export default router;