import prisma from "../lib/prisma.js";

export async function getHomeData(req, res) {
  const [products, categories, offers] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, take: 8 }),
    prisma.category.findMany(),
    prisma.offer.findMany(),
  ]);
  res.json({ products, categories, offers });
}

export async function getProducts(req, res) {
  const products = await prisma.product.findMany({
    include: { category: true },
  });
  res.json(products);
}

export async function createProduct(req, res) {
  const { name, description, price, image, categoryId } = req.body;
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      image,
      categoryId: Number(categoryId),
    },
    include: { category: true },
  });
  res.status(201).json(product);
}

export async function getCategories(req, res) {
  const categories = await prisma.category.findMany();
  res.json(categories);
}

export async function createCategory(req, res) {
  const { name, icon } = req.body;
  const category = await prisma.category.create({ data: { name, icon } });
  res.status(201).json(category);  
}

export async function getOffers(req, res) {
  const offers = await prisma.offer.findMany();
  res.json(offers);
}

export async function createOffer(req, res) {
  const { title, subtitle } = req.body;
  const offer = await prisma.offer.create({ data: { title, subtitle } });
  res.status(201).json(offer);
}
