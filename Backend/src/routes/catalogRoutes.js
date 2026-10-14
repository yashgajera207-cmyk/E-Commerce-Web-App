import express from "express";
import {
  getHomeData,
  getProducts,
  getCategories,
  getOffers,
} from "../controllers/catalogController.js";

const router = express.Router();

router.get("/home", getHomeData);
router.get("/products", getProducts);
router.get("/categories", getCategories);
router.get("/offers", getOffers);

export default router;
