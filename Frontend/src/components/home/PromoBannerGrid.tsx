import { promoBanners } from "../../data/products";

export default function PromoBannerGrid() {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {promoBanners.map((banner) => (
        <div
          key={banner.id}
          style={{ backgroundColor: banner.bgColor }}
          className="rounded-md p-5 flex flex-col justify-between h-40 cursor-pointer hover:shadow-md transition-shadow duration-200 overflow-hidden relative group"
        >
          <div>
            <h3 className="text-base font-semibold text-gray-900">{banner.title}</h3>
            <p className="text-sm text-gray-600 mt-0.5">{banner.subtitle}</p>
          </div>
          <img
            src={banner.image}
            alt={banner.title}
            className="absolute -right-2 -bottom-2 w-24 h-24 object-cover rounded-full opacity-90 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ))}
    </section>
  );
}