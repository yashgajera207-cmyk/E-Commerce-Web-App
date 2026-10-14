export default {
  name: "heroBanner",
  title: "Hero Banner",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title / Main Device Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "eyebrow",
      title: "Brand Badge / Eyebrow (e.g. 'POCO ShopZone Unique')",
      type: "string",
    },
    {
      name: "subtitle",
      title: "Subtitle / Tagline (e.g. 'Sale on 11th Sep, 12 PM | 3.5 days power')",
      type: "string",
    },
    {
      name: "priceText",
      title: "Price Highlight (e.g. 'From ₹26,999*')",
      type: "string",
    },
    {
      name: "extraBadge",
      title: "Spec Pill / Extra Badge (e.g. '10000 mAh', 'Pure Android 16')",
      type: "string",
    },
    {
      name: "image",
      title: "Banner Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "imageUrl",
      title: "External Image URL",
      type: "url",
    },
    {
      name: "linkUrl",
      title: "Destination Link",
      type: "string",
      initialValue: "/products",
    },
    {
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 0,
    },
  ],
};
