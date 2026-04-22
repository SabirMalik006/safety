export const products = [
  {
    id: 1,
    name: "Safety Helmet",
    slug: "industrial-safety-helmet",
    price: 3599,
    originalPrice: 4000,
    discount: 10,
    category: "head-eye-protection",
    colors: ["Yellow", "White", "Blue", "Orange"],
    images: [
      "https://images.pexels.com/photos/8470064/pexels-photo-8470064.jpeg",
      "https://images.pexels.com/photos/8470842/pexels-photo-8470842.jpeg"
    ],
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: 2,
    name: "Safety Glasses",
    slug: "protective-safety-glasses",
    price: 2999,
    originalPrice: 3300,
    discount: 9,
    category: "head-eye-protection",
    colors: ["Clear", "Black", "Tinted"],
    images: [
      "https://images.pexels.com/photos/4687151/pexels-photo-4687151.jpeg",
      "https://images.pexels.com/photos/4687150/pexels-photo-4687150.jpeg"
    ],
    badge: "Sale",
    inStock: true,
  },
  {
    id: 3,
    name: "Drilling Machine",
    slug: "industrial-drilling-machine",
    price: 2550,
    originalPrice: 2999,
    discount: 15,
    category: "power-tools",
    colors: ["Yellow", "Industrial Green"],
    images: [
      "https://images.pexels.com/photos/8853535/pexels-photo-8853535.jpeg",
      "https://images.pexels.com/photos/8961527/pexels-photo-8961527.jpeg"
    ],
    badge: "Hot Deal",
    inStock: true,
  },
  {
    id: 4,
    name: "Tire Tread Depth",
    slug: "tire-tread-depth-gauge",
    price: 4299,
    originalPrice: 4999,
    discount: 14,
    category: "measuring-tools",
    colors: ["Steel", "Black"],
    images: [
      "https://images.pexels.com/photos/37091334/pexels-photo-37091334.jpeg",
      "https://images.pexels.com/photos/34357282/pexels-photo-34357282.jpeg"
    ],
    badge: "Premium",
    inStock: true,
  },
  {
    id: 5,
    name: "Hammer",
    slug: "professional-claw-hammer",
    price: 2799,
    originalPrice: 2799,
    discount: 0,
    category: "hand-tools",
    colors: ["Steel/Black"],
    images: [
      "https://images.pexels.com/photos/7285927/pexels-photo-7285927.jpeg",
      "https://images.pexels.com/photos/7285933/pexels-photo-7285933.jpeg"
    ],
    badge: "Essential",
    inStock: true,
  },
  {
    id: 6,
    name: "Measuring Tape",
    slug: "digital-measuring-tape",
    price: 3299,
    originalPrice: 3320,
    discount: 1,
    category: "measuring-tools",
    colors: ["Yellow", "Black"],
    images: [
      "https://images.pexels.com/photos/5973887/pexels-photo-5973887.jpeg",
      "https://images.pexels.com/photos/5973895/pexels-photo-5973895.jpeg"
    ],
    badge: "New",
    inStock: true,
  },
  {
    id: 7,
    name: "Sandpaper",
    slug: "industrial-sandpaper-set",
    price: 3199,
    originalPrice: 3600,
    discount: 11,
    category: "hand-tools",
    colors: ["Multi-grit"],
    images: [
      "https://images.pexels.com/photos/7482640/pexels-photo-7482640.jpeg",
      "https://images.pexels.com/photos/7482645/pexels-photo-7482645.jpeg"
    ],
    badge: "Sale",
    inStock: true,
  },
  {
    id: 8,
    name: "Hand Tools Set",
    slug: "essential-hand-tools-set",
    price: 1999,
    originalPrice: 2500,
    discount: 20,
    category: "hand-tools",
    colors: ["Industrial Red", "Steel"],
    images: [
      "https://images.pexels.com/photos/4312846/pexels-photo-4312846.jpeg",
      "https://images.pexels.com/photos/4312860/pexels-photo-4312860.jpeg"
    ],
    badge: "Popular",
    inStock: true,
  },
  {
    id: 9,
    name: "Pliers",
    slug: "precision-pliers",
    price: 1499,
    originalPrice: 1800,
    discount: 17,
    category: "hand-tools",
    colors: ["Black", "Orange"],
    images: [
      "https://images.pexels.com/photos/5583071/pexels-photo-5583071.jpeg",
      "https://images.pexels.com/photos/5583067/pexels-photo-5583067.jpeg"
    ],
    badge: "Sale",
    inStock: true,
  },
  {
    id: 10,
    name: "Screwdrivers",
    slug: "professional-screwdriver-set",
    price: 2199,
    originalPrice: 2500,
    discount: 12,
    category: "hand-tools",
    colors: ["Red", "Yellow"],
    images: [
      "https://images.pexels.com/photos/5583097/pexels-photo-5583097.jpeg",
      "https://images.pexels.com/photos/5583107/pexels-photo-5583107.jpeg"
    ],
    badge: "Premium",
    inStock: true,
  },
  {
    id: 11,
    name: "Impact Kit",
    slug: "industrial-impact-kit",
    price: 2299,
    originalPrice: 2699,
    discount: 15,
    category: "power-tools",
    colors: ["Yellow", "Blue"],
    images: [
      "https://images.pexels.com/photos/3877525/pexels-photo-3877525.jpeg",
      "https://images.pexels.com/photos/5974048/pexels-photo-5974048.jpeg"
    ],
    badge: "Trending",
    inStock: true,
  },
  {
    id: 12,
    name: "Screws Bulk",
    slug: "industrial-screws-bulk",
    price: 2499,
    originalPrice: 2999,
    discount: 17,
    category: "hand-tools",
    colors: ["Zinc", "Brass"],
    images: [
      "https://images.pexels.com/photos/5583084/pexels-photo-5583084.jpeg",
      "https://images.pexels.com/photos/5583069/pexels-photo-5583069.jpeg"
    ],
    badge: "New",
    inStock: true,
  },
];

export const categories = [
  {
    id: 1,
    name: "Head & Eye Protection",
    slug: "head-eye-protection",
    image: "https://images.pexels.com/photos/8470064/pexels-photo-8470064.jpeg",
  },
  {
    id: 2,
    name: "Power Tools",
    slug: "power-tools",
    image: "https://images.pexels.com/photos/8961527/pexels-photo-8961527.jpeg",
  },
  {
    id: 3,
    name: "Hand Tools",
    slug: "hand-tools",
    image: "https://images.pexels.com/photos/4312846/pexels-photo-4312846.jpeg",
  },
  {
    id: 4,
    name: "Measuring Equipment",
    slug: "measuring-tools",
    image: "https://images.pexels.com/photos/5973887/pexels-photo-5973887.jpeg",
  },
];

export const reviews = [
  { id: 1, name: "Irfan Ahmed", rating: 5, comment: "Safety helmet is very high quality and durable. Great for my workshop!", location: "Lahore", date: "2 days ago" },
  { id: 2, name: "Sajid Khan", rating: 5, comment: "The drilling machine is powerful and easy to handle. Highly recommended.", location: "Karachi", date: "1 week ago" },
  { id: 3, name: "Ahsan Raza", rating: 4, comment: "Good quality hand tools for the price. Delivery was slightly delayed but worth it.", location: "Islamabad", date: "2 weeks ago" },
  { id: 4, name: "Umer Malik", rating: 5, comment: "SafetyMe is my go-to for industrial gear now. Excellent service!", location: "Rawalpindi", date: "3 weeks ago" },
  { id: 5, name: "Zainab Ali", rating: 5, comment: "The measuring equipment is very accurate. Perfect for site visits.", location: "Faisalabad", date: "1 month ago" },
  { id: 6, name: "Hassan Baig", rating: 4, comment: "Solid build on all tools. Will definitely purchase more items soon.", location: "Multan", date: "1 month ago" },
];

