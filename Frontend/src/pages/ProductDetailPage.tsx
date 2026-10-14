import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ShoppingCart, Heart, Truck, ShieldCheck, RotateCcw, 
  CheckCircle, ChevronRight, Zap, Tag,
  MapPin, Star, ThumbsUp, CreditCard, ChevronDown, ChevronUp
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductGallery from "../components/product/ProductGallery";
import ProductCard from "../components/product/ProductCard";
import { allProducts, categories } from "../data/products";
import { useCart } from "../context/CartContext";
import { useAddress } from "../context/AddressContext";

const DUMMY_REVIEWS = [
  {
    id: 1,
    author: "Rahul Sharma",
    rating: 5,
    title: "Must buy!",
    comment: "Excellent product, value for money! Fast delivery and packaging was very good. Exceeded my expectations.",
    date: "2 days ago",
    verified: true,
    likes: 42,
  },
  {
    id: 2,
    author: "Priya Patel",
    rating: 4,
    title: "Good choice",
    comment: "Nice build quality and looks premium. Working great so far. Delivery was on time.",
    date: "1 week ago",
    verified: true,
    likes: 18,
  },
  {
    id: 3,
    author: "Amit Kumar",
    rating: 5,
    title: "Awesome experience",
    comment: "Original genuine product with manufacturer warranty. Best price compared to other platforms.",
    date: "2 weeks ago",
    verified: true,
    likes: 31,
  },
  {
    id: 4,
    author: "Sneha Reddy",
    rating: 3,
    title: "Decent performance",
    comment: "Battery life is good, but camera in low light is average. Overall fine for the price.",
    date: "3 weeks ago",
    verified: true,
    likes: 12,
  },
];

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { getDefaultAddress } = useAddress();

  const [selectedColor, setSelectedColor] = useState("Midnight Black");
  const [selectedStorage, setSelectedStorage] = useState("128 GB");
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);

  const defaultAddr = getDefaultAddress();
  const [pincode, setPincode] = useState(defaultAddr?.pincode || "");
  const [pincodeChecked, setPincodeChecked] = useState(!!defaultAddr?.pincode);
  const [pincodeError, setPincodeError] = useState(false);
  const [showAllOffers, setShowAllOffers] = useState(false);

  useEffect(() => {
    if (defaultAddr?.pincode && !pincode) {
      setPincode(defaultAddr.pincode);
      setPincodeChecked(true);
    }
  }, [defaultAddr]);

  const product = allProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center py-20 max-w-sm">
            <span className="text-6xl block mb-4">😕</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Product not found</h2>
            <p className="text-sm text-gray-500 mb-6">
              The product you are looking for might have been removed or is temporarily unavailable.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#2874f0] text-white font-bold px-6 py-3 rounded-md shadow-sm hover:bg-[#1e65d8] transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const {
    id, name, image, price, mrp, discount, rating = 4.3, 
    ratingCount = 1420, brand, description, specifications, 
    deliveryDate, category
  } = product;

  const wishlisted = isInWishlist(id);
  const categoryObj = categories.find((c) => c.id === category);

  // Similar products
  const similar = allProducts
    .filter((p) => p.id !== productId && p.category === category)
    .slice(0, 5);

  const discountSavings = mrp && mrp > price ? mrp - price : 0;
  const emiPerMonth = Math.round(price / 12);

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/checkout");
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode)) {
      setPincodeChecked(true);
      setPincodeError(false);
    } else {
      setPincodeError(true);
      setPincodeChecked(false);
    }
  };

  const galleryImages = [image, image, image];

  const offers = [
    "Bank Offer 5% Unlimited Cashback on Flipkart Axis Bank Credit Card",
    "Bank Offer 10% Instant Discount on HDFC Bank Credit Card EMI up to ₹1,500",
    "Special Price Get extra ₹4,000 off (price inclusive of discount)",
    "Partner Offer Sign up for ShopZone Pay Later & get free Times Prime worth ₹1,199",
    "No Cost EMI on Bajaj Finserv EMI Card on cart value above ₹2,999",
  ];

  const filteredReviews = selectedRatingFilter
    ? DUMMY_REVIEWS.filter((r) => r.rating === selectedRatingFilter)
    : DUMMY_REVIEWS;

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Header />

      <main className="max-w-[1440px] mx-auto w-full px-3 sm:px-6 py-3 sm:py-5 flex-1 pb-24 lg:pb-8">
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-gray-500 mb-3 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-[#2874f0]">Home</Link>
          <span>›</span>
          {categoryObj && (
            <>
              <Link to={`/category/${category}`} className="hover:text-[#2874f0]">
                {categoryObj.name}
              </Link>
              <span>›</span>
            </>
          )}
          {brand && (
            <>
              <span className="hover:text-[#2874f0] cursor-pointer">{brand}</span>
              <span>›</span>
            </>
          )}
          <span className="text-gray-900 font-medium truncate max-w-xs">{name}</span>
        </div>

        {/* Main Product Container */}
        <div className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden mb-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* LEFT COLUMN: Gallery & CTA Buttons (Sticky on desktop) */}
            <div className="lg:col-span-5 p-4 sm:p-6 lg:border-r border-gray-100 lg:sticky lg:top-20 self-start">
              <div className="relative">
                {/* Wishlist Heart Icon */}
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className="absolute top-2 right-2 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-xs cursor-pointer"
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </button>

                <ProductGallery images={galleryImages} name={name} />
              </div>

              {/* Desktop Dual Action Buttons (Flipkart Gold & Orange) */}
              <div className="hidden lg:grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center justify-center gap-2 bg-[#ff9f00] hover:bg-[#f39700] text-white font-bold py-3.5 px-4 rounded shadow-xs active:scale-[0.98] transition-all cursor-pointer text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  ADD TO CART
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 bg-[#fb641b] hover:bg-[#e85a18] text-white font-bold py-3.5 px-4 rounded shadow-xs active:scale-[0.98] transition-all cursor-pointer text-sm"
                >
                  <Zap className="w-4 h-4" />
                  BUY NOW
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Details & Specs */}
            <div className="lg:col-span-7 p-4 sm:p-6 space-y-4">
              {/* Brand & Title */}
              <div>
                {brand && (
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {brand}
                  </p>
                )}
                <h1 className="text-base sm:text-xl font-semibold text-gray-900 leading-snug">
                  {name}
                </h1>
              </div>

              {/* Rating + Assured Badge */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-[#388e3c] text-white text-xs font-bold px-2 py-0.5 rounded">
                    {rating} <Star className="w-3 h-3 fill-white" />
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    {ratingCount.toLocaleString("en-IN")} Ratings & Reviews
                  </span>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-bold italic text-[#2874f0] bg-blue-50/80 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2874f0]" />
                  <span>Assured</span>
                </div>
              </div>

              {/* Special Price Tag */}
              <div className="text-xs font-bold text-[#388e3c]">Special price</div>

              {/* Pricing Section */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    ₹{Number(price).toLocaleString("en-IN")}
                  </span>
                  {mrp && mrp > price && (
                    <span className="text-sm sm:text-base text-gray-400 line-through">
                      ₹{Number(mrp).toLocaleString("en-IN")}
                    </span>
                  )}
                  {discount && (
                    <span className="text-sm sm:text-base font-bold text-[#388e3c]">
                      {discount}% off
                    </span>
                  )}
                </div>
                {discountSavings > 0 && (
                  <p className="text-xs text-[#388e3c] font-semibold">
                    You save ₹{discountSavings.toLocaleString("en-IN")}!
                  </p>
                )}
                <p className="text-xs text-gray-600 flex items-center gap-1 pt-1">
                  <CreditCard className="w-3.5 h-3.5 text-[#2874f0]" />
                  <span>
                    No Cost EMI starting from <strong>₹{emiPerMonth.toLocaleString("en-IN")}/month</strong>.{" "}
                    <span className="text-[#2874f0] font-bold cursor-pointer hover:underline">View Plans</span>
                  </span>
                </p>
              </div>

              {/* VARIANT SELECTOR: Color & Storage Options */}
              <div className="border-t border-b border-gray-100 py-3 space-y-3">
                {/* Color Selection */}
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1.5">
6                    Color: <strong className="text-gray-900">{selectedColor}</strong>
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {["Midnight Black", "Deep Blue", "Natural Titanium", "Silver"].map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`text-xs px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                          selectedColor === col
                            ? "border-[#2874f0] text-[#2874f0] bg-blue-50 font-bold"
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Storage / Size Selection */}
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1.5">
                    Storage: <strong className="text-gray-900">{selectedStorage}</strong>
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {["128 GB", "256 GB", "512 GB"].map((stor) => (
                      <button
                        key={stor}
                        onClick={() => setSelectedStorage(stor)}
                        className={`text-xs px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                          selectedStorage === stor
                            ? "border-[#2874f0] text-[#2874f0] bg-blue-50 font-bold"
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {stor}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Available Offers */}
              <div className="border border-gray-100 rounded-lg p-3 sm:p-4 bg-gray-50/50 space-y-2.5">
                <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#388e3c]" />
                  Available offers
                </p>
                <div className="space-y-2">
                  {(showAllOffers ? offers : offers.slice(0, 3)).map((offer, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                      <Tag className="w-3.5 h-3.5 text-[#388e3c] shrink-0 mt-0.5" />
                      <p className="leading-snug">
                        {offer}{" "}
                        <span className="text-[#2874f0] font-bold cursor-pointer hover:underline">
                          T&C
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
                {offers.length > 3 && (
                  <button
                    onClick={() => setShowAllOffers(!showAllOffers)}
                    className="text-xs font-bold text-[#2874f0] hover:underline cursor-pointer pt-1"
                  >
                    {showAllOffers ? "View Less Offers" : `+${offers.length - 3} More Offers`}
                  </button>
                )}
              </div>

              {/* Delivery & Pincode Checker */}
              <div className="pt-1">
                <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-500" />
                  Delivery
                </p>
                <form onSubmit={handlePincodeCheck} className="flex items-center gap-2 max-w-xs">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter Delivery Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className={`border rounded px-3 py-1.5 text-xs w-full focus:outline-hidden ${
                      pincodeError ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#2874f0]"
                    }`}
                  />
                  <button
                    type="submit"
                    className="text-xs font-bold text-[#2874f0] px-3 py-1.5 border border-[#2874f0] rounded hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                  >
                    Check
                  </button>
                </form>

                {pincodeChecked && (
                  <div className="mt-2 text-xs text-gray-700 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#388e3c]" />
                    <span>
                      Delivery by <strong className="text-gray-900">{deliveryDate || "Tomorrow"}</strong> |{" "}
                      <span className="text-[#388e3c] font-bold">Free ₹40</span>
                    </span>
                  </div>
                )}
                {pincodeError && (
                  <p className="mt-1 text-[11px] text-red-500">Please enter a valid 6-digit pincode</p>
                )}
              </div>

              {/* Guarantees Strip */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100">
                <div className="flex flex-col items-center text-center p-2 rounded bg-gray-50">
                  <ShieldCheck className="w-5 h-5 text-[#2874f0] mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">100% Genuine</span>
                  <span className="text-[10px] text-gray-400">Verified Seller</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded bg-gray-50">
                  <RotateCcw className="w-5 h-5 text-[#2874f0] mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">7 Days Return</span>
                  <span className="text-[10px] text-gray-400">Hassle-Free</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded bg-gray-50">
                  <Truck className="w-5 h-5 text-[#2874f0] mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">Free Delivery</span>
                  <span className="text-[10px] text-gray-400">Across India</span>
                </div>
              </div>

              {/* Seller Information */}
              <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div>
                  <span className="text-gray-500">Seller: </span>
                  <span className="font-bold text-[#2874f0]">SuperComNet</span>
                  <span className="ml-2 inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                    4.8 ★
                  </span>
                </div>
                <span className="text-gray-500 font-medium">GST invoice available</span>
              </div>

              {/* SEGMENTED SPECIFICATIONS TABLES (Flipkart Standard) */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Specifications</h3>
                <div className="border border-gray-200 rounded-md divide-y divide-gray-200 overflow-hidden text-xs">
                  {/* General */}
                  <div className="p-3 bg-gray-50/80 font-bold text-gray-800 text-xs">
                    General
                  </div>
                  <div className="divide-y divide-gray-100">
                    <div className="flex py-2 px-3 gap-4">
                      <span className="w-36 text-gray-500 font-medium shrink-0">In The Box</span>
                      <span className="text-gray-900 font-semibold">Handset, USB-C Charge Cable, SIM Eject Tool, Documentation</span>
                    </div>
                    <div className="flex py-2 px-3 gap-4">
                      <span className="w-36 text-gray-500 font-medium shrink-0">Model Name</span>
                      <span className="text-gray-900 font-semibold">{name}</span>
                    </div>
                    <div className="flex py-2 px-3 gap-4">
                      <span className="w-36 text-gray-500 font-medium shrink-0">Color</span>
                      <span className="text-gray-900 font-semibold">{selectedColor}</span>
                    </div>
                    <div className="flex py-2 px-3 gap-4">
                      <span className="w-36 text-gray-500 font-medium shrink-0">SIM Type</span>
                      <span className="text-gray-900 font-semibold">Dual SIM (Nano + eSIM)</span>
                    </div>
                  </div>

                  {/* Display Features */}
                  <div className="p-3 bg-gray-50/80 font-bold text-gray-800 text-xs">
                    Display Features
                  </div>
                  <div className="divide-y divide-gray-100">
                    <div className="flex py-2 px-3 gap-4">
                      <span className="w-36 text-gray-500 font-medium shrink-0">Display Size</span>
                      <span className="text-gray-900 font-semibold">15.49 cm (6.1 inch) Super Retina XDR</span>
                    </div>
                    <div className="flex py-2 px-3 gap-4">
                      <span className="w-36 text-gray-500 font-medium shrink-0">Resolution</span>
                      <span className="text-gray-900 font-semibold">2556 x 1179 Pixels</span>
                    </div>
                  </div>

                  {/* Additional Product Specs if provided */}
                  {specifications && specifications.length > 0 && (
                    <>
                      <div className="p-3 bg-gray-50/80 font-bold text-gray-800 text-xs">
                        Other Features
                      </div>
                      <div className="divide-y divide-gray-100">
                        {specifications.map(({ key, value }) => (
                          <div key={key} className="flex py-2 px-3 gap-4">
                            <span className="w-36 text-gray-500 font-medium shrink-0">{key}</span>
                            <span className="text-gray-900 font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Product Description */}
              {description && (
                <div className="pt-2">
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">Product Description</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ratings & Reviews Section (Flipkart style with Filter Tabs) */}
        <div className="bg-white rounded-lg shadow-xs border border-gray-100 p-4 sm:p-6 mb-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Ratings & Reviews
            </h2>
            <button
              onClick={() => alert("Rate Product feature available after purchase delivery!")}
              className="text-xs font-bold text-gray-700 border border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded shadow-xs cursor-pointer"
            >
              Rate Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pb-6 border-b border-gray-100">
            {/* Big Score */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-gray-900">{rating}</span>
                <Star className="w-7 h-7 text-[#388e3c] fill-[#388e3c]" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {ratingCount.toLocaleString("en-IN")} Ratings & Reviews
              </p>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="md:col-span-2 space-y-1.5 text-xs text-gray-600">
              {[
                { star: 5, pct: "75%", count: "1,065" },
                { star: 4, pct: "15%", count: "213" },
                { star: 3, pct: "5%", count: "71" },
                { star: 2, pct: "3%", count: "42" },
                { star: 1, pct: "2%", count: "29" },
              ].map(({ star, pct, count }) => (
                <div
                  key={star}
                  onClick={() => setSelectedRatingFilter(selectedRatingFilter === star ? null : star)}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded"
                >
                  <span className="w-8 flex items-center gap-0.5 font-medium">
                    {star} ★
                  </span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        star >= 4 ? "bg-[#388e3c]" : star === 3 ? "bg-amber-400" : "bg-red-400"
                      }`}
                      style={{ width: pct }}
                    />
                  </div>
                  <span className="w-12 text-right text-gray-400 text-[11px]">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 py-3 border-b border-gray-100 flex-wrap">
            <span className="text-xs font-bold text-gray-500">Filter Reviews:</span>
            <button
              onClick={() => setSelectedRatingFilter(null)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                selectedRatingFilter === null
                  ? "bg-[#2874f0] text-white border-[#2874f0] font-bold"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All ({DUMMY_REVIEWS.length})
            </button>
            {[5, 4, 3].map((star) => (
              <button
                key={star}
                onClick={() => setSelectedRatingFilter(selectedRatingFilter === star ? null : star)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                  selectedRatingFilter === star
                    ? "bg-[#388e3c] text-white border-[#388e3c] font-bold"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {star} ★
              </button>
            ))}
          </div>

          {/* Customer Reviews List */}
          <div className="divide-y divide-gray-100 pt-2">
            {filteredReviews.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No reviews found for this rating.</p>
            ) : (
              filteredReviews.map((rev) => (
                <div key={rev.id} className="py-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                      {rev.rating} ★
                    </span>
                    <span className="text-xs font-bold text-gray-900">{rev.title}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">{rev.author}</span>
                      {rev.verified && (
                        <span className="flex items-center gap-0.5 text-gray-400">
                          <CheckCircle className="w-3 h-3 text-gray-400" /> Certified Buyer
                        </span>
                      )}
                      <span>•</span>
                      <span>{rev.date}</span>
                    </div>
                    <button className="flex items-center gap-1 text-gray-400 hover:text-gray-700 cursor-pointer">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{rev.likes}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div className="bg-white rounded-lg shadow-xs border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Similar Products
              </h2>
              {categoryObj && (
                <button
                  onClick={() => navigate(`/category/${category}`)}
                  className="flex items-center gap-1 text-xs font-bold text-[#2874f0] hover:underline cursor-pointer"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {similar.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={addToCart}
                  onWishlist={toggleWishlist}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-14 sm:bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-2 sm:p-3 flex gap-2 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => addToCart(product)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#ff9f00] hover:bg-[#f39700] text-white text-xs sm:text-sm font-bold py-2.5 rounded shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#fb641b] hover:bg-[#e85a18] text-white text-xs sm:text-sm font-bold py-2.5 rounded shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Buy Now</span>
        </button>
      </div>

      <Footer />
    </div>
  );
}
