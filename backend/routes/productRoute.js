import  express  from "express";

import {isAuthenticatedUser, authorizeRoles} from "../middleware/auth.js";
import { getAllProduct , createProductReview,createProduct, updateProduct, deleteProduct,getProductDetails} from "../controller/productController.js";

const router = express.Router();
router.get("/products",getAllProduct);
router.get("/product/:id",getProductDetails);

router.post("/admin/product/new",isAuthenticatedUser,authorizeRoles('admin'), createProduct);
router.put("/admin/product/:id",isAuthenticatedUser,authorizeRoles('admin'), updateProduct);
router.delete("/admin/product/:id",isAuthenticatedUser,authorizeRoles('admin'),  deleteProduct);

router.put('/review',isAuthenticatedUser,createProductReview);

export default router;