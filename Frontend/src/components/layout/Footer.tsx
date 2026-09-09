interface FooterColumn {
  title: string;
  links: string[];
}

const columns: FooterColumn[] = [
  {
    title: "Get to Know Us",
    links: ["About ShopZone", "Careers", "Press Releases", "ShopZone Cares"],
  },
  {
    title: "Connect with Us",
    links: ["Facebook", "Instagram", "X (Twitter)", "YouTube"],
  },
  {
    title: "Make Money with Us",
    links: ["Sell on ShopZone", "Become an Affiliate", "Advertise", "Fulfilment by ShopZone"],
  },
  {
    title: "Let Us Help You",
    links: ["Your Account", "Returns & Refunds", "Shipping & Delivery", "Help Centre"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-white font-semibold text-sm mb-3">{col.title}</h4>
            <ul className="space-y-2 text-xs">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-brand-yellow hover:underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span className="font-display font-bold text-white text-base">
            Shop<span className="text-brand-yellow">Zone</span>
          </span>
          <p>© {new Date().getFullYear()} ShopZone.com, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
