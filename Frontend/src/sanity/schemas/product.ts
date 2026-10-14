export default {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Product Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "price",
      title: "Offer Price (₹)",
      type: "number",
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: "mrp",
      title: "MRP (₹)",
      type: "number",
    },
    {
      name: "discountPercent",
      title: "Discount Percentage (%)",
      type: "number",
    },
    {
      name: "rating",
      title: "Rating (1-5)",
      type: "number",
      initialValue: 4.2,
    },
    {
      name: "ratingCount",
      title: "Total Ratings Count",
      type: "number",
      initialValue: 1200,
    },
    {
      name: "image",
      title: "Product Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "imageUrl",
      title: "External Image URL (fallback)",
      type: "url",
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    },
    {
      name: "brand",
      title: "Brand",
      type: "string",
    },
    {
      name: "section",
      title: "Homepage Section",
      type: "string",
      options: {
        list: [
          { title: "Deals of the Day", value: "deal" },
          { title: "Trending Now", value: "trending" },
          { title: "New Arrivals", value: "new" },
        ],
      },
    },
    {
      name: "isAssured",
      title: "ShopZone Assured (SZ-Assured)",
      type: "boolean",
      initialValue: true,
    },
  ],
};
