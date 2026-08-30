export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: string;
  discount?: string;
  rating?: number;
  reviewsCount?: number;
  unit?: string;
  emoji?: string;
  popular?: boolean;
  premium?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  coverImage: string;
  logo: string;
  openingHours: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  type: string;
  menu: MenuItem[];
}

export interface DeliveryAddress {
  id: string;
  label: string;
  address: string;
  selected: boolean;
}

export const MOCK_USER = {
  name: "Leonard Soempit",
  username: "leonard",
  ordersCount: 56,
  rating: 4.8,
  avatar: "/figma_images/Droply/Profile.jpg",
  walletBalance: 12450.00,
};

export const DELIVERY_ADDRESSES: DeliveryAddress[] = [
  {
    id: "addr-1",
    label: "Home",
    address: "36 green way, Katampe Extension",
    selected: true,
  },
  {
    id: "addr-2",
    label: "Office",
    address: "15 Bangui Street, Wuse 2, FCT Abuja",
    selected: false,
  },
  {
    id: "addr-3",
    label: "NSUK Hostel",
    address: "Block A, Room 12, NSUK Campus, Keffi",
    selected: false,
  }
];

export const CATEGORIES = [
  { id: "cat-rice",     name: "Rice & Meals",          image: "🍛", bg: "#FFF3E0", textColor: "#E85A1D" },
  { id: "cat-swallow",  name: "Swallow & Soups",        image: "🍲", bg: "#FCECEB", textColor: "#1C1C1E" },
  { id: "cat-protein",  name: "Grills & Protein",       image: "🥩", bg: "#EBF7F2", textColor: "#1C1C1E" },
  { id: "cat-grocery",  name: "Groceries & Provisions", image: "🛒", bg: "#E2F0F9", textColor: "#E85A1D" },
  { id: "cat-fastfood", name: "Burgers & Shawarma",     image: "🌯", bg: "#F9F1E2", textColor: "#1C1C1E" },
  { id: "cat-drinks",   name: "Drinks & Beverages",     image: "🥤", bg: "#F3ECFC", textColor: "#1C1C1E" },
  { id: "cat-chops",    name: "Special Chops",          image: "🍢", bg: "#FFF8E7", textColor: "#1C1C1E" },
  { id: "cat-fries",    name: "Chips & Fries",          image: "🍟", bg: "#FDECEA", textColor: "#E85A1D" },
];

const UNSPLASH = {
  jollof:       "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=70&auto=format&fit=crop",
  friedRice:    "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=70&auto=format&fit=crop",
  whitRice:     "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&q=70&auto=format&fit=crop",
  coconutRice:  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70&auto=format&fit=crop",
  seafoodRice:  "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=70&auto=format&fit=crop",
  egusi:        "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=70&auto=format&fit=crop",
  okro:         "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=70&auto=format&fit=crop",
  afang:        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=70&auto=format&fit=crop",
  fishermanSoup:"https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=70&auto=format&fit=crop",
  seafoodOkro:  "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=70&auto=format&fit=crop",
  semo:         "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=70&auto=format&fit=crop",
  poundedYam:   "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=70&auto=format&fit=crop",
  beef:         "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=70&auto=format&fit=crop",
  goatMeat:     "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=70&auto=format&fit=crop",
  chicken:      "https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=400&q=70&auto=format&fit=crop",
  catfish:      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=70&auto=format&fit=crop",
  snail:        "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=70&auto=format&fit=crop",
  yamChips:     "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=70&auto=format&fit=crop",
  frenchFries:  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=70&auto=format&fit=crop",
  plantain:     "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=70&auto=format&fit=crop",
  pepperSoup:   "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=70&auto=format&fit=crop",
  salad:        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=70&auto=format&fit=crop",
  sandwich:     "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=70&auto=format&fit=crop",
  indomie:      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=70&auto=format&fit=crop",
  spaghetti:    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=70&auto=format&fit=crop",
  beans:        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=70&auto=format&fit=crop",
  burger:       "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=70&auto=format&fit=crop",
  shawarma:     "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=70&auto=format&fit=crop",
  pepperChicken:"https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=400&q=70&auto=format&fit=crop",
  isiEwu:       "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=70&auto=format&fit=crop",
  drinks:       "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=70&auto=format&fit=crop",
  juice:        "https://images.unsplash.com/photo-1534353473418-4cfa0a56f1b1?w=400&q=70&auto=format&fit=crop",
  watermelon:   "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=70&auto=format&fit=crop",
  grocery:      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70&auto=format&fit=crop",
  eggs:         "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&q=70&auto=format&fit=crop",
  milk:         "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=70&auto=format&fit=crop",
  noodles:      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=70&auto=format&fit=crop",
};

export const RESTAURANTS: Restaurant[] = [
  // 1. MAMA CASS & CAMPUS BUKKA (MAIN DISH)
  {
    id: "mama-cass-bukka",
    name: "Mama Cass & Campus Bukka",
    address: "NSUK Main Gate Commercial Hub, Keffi",
    coverImage: "/figma_images/Droply/Merchant Page.jpg",
    logo: "MC",
    openingHours: "8am – 9pm",
    rating: 4.9,
    deliveryTime: "25 Min",
    deliveryFee: 300,
    type: "MAIN DISH",
    menu: [
      { id: "to-80",  name: "Jollof Rice",                         price: 3000,  description: "Party jollof rice — smoky, perfectly seasoned.",                                                   category: "Rice & Meals",      rating: 9.4, popular: true,  unit: "Plate",   emoji: "🍛", image: UNSPLASH.jollof },
      { id: "to-87",  name: "Jollof Rice + Chicken",               price: 5400,  description: "Perfectly seasoned party jollof rice served with fried chicken.",                                  category: "Rice & Meals",      rating: 9.2, premium: true,  unit: "Combo",   emoji: "🍛", image: UNSPLASH.jollof },
      { id: "to-81",  name: "Fried Rice",                          price: 3500,  description: "Nigerian vegetable fried rice, rich and flavourful.",                                               category: "Rice & Meals",      rating: 9.1, popular: true,  unit: "Plate",   emoji: "🍚", image: UNSPLASH.friedRice },
      { id: "to-120", name: "Chinese Fried Rice",                  price: 5000,  description: "Basmati rice sautéed with shrimps and Chinese seasonings.",                                        category: "Rice & Meals",      rating: 9.0, premium: true,  unit: "Plate",   emoji: "🍱", image: UNSPLASH.friedRice },
      { id: "to-82",  name: "Basmati White Rice",                  price: 5000,  description: "Premium basmati white rice — light & fragrant.",                                                   category: "Rice & Meals",      rating: 8.9, premium: true,  unit: "Plate",   emoji: "🍚", image: UNSPLASH.whitRice },
      { id: "to-83",  name: "Coconut Basmati Rice",                price: 5000,  description: "Fragrant coconut-infused basmati rice.",                                                            category: "Rice & Meals",      rating: 9.0, premium: true,  unit: "Plate",   emoji: "🥥", image: UNSPLASH.coconutRice },
      { id: "to-121", name: "Seafood Sauce with Basmati Rice",     price: 9200,  description: "Calamari, prawns & shrimps sauce served over basmati rice.",                                       category: "Rice & Meals",      rating: 9.6, premium: true,  unit: "Plate",   emoji: "🦐", image: UNSPLASH.seafoodRice },
      { id: "to-85",  name: "White Rice and Stew",                 price: 4000,  description: "Plain white rice served with rich tomato stew.",                                                   category: "Rice & Meals",      rating: 8.6, popular: true,  unit: "Plate",   emoji: "🍚", image: UNSPLASH.whitRice },

      // NIGERIAN SOUPS
      { id: "to-30",  name: "Ogbono Soup",                         price: 3000,  description: "Classic Nigerian ogbono draw soup — rich and hearty.",                                              category: "Swallow & Soups",   rating: 9.0, popular: true,  unit: "Bowl",    emoji: "🥣", image: UNSPLASH.okro },
      { id: "to-31",  name: "Egusi Soup",                          price: 3000,  description: "Rich melon seed soup cooked with stockfish, dry fish and assorted meat.",                           category: "Swallow & Soups",   rating: 9.3, popular: true,  unit: "Bowl",    emoji: "🥘", image: UNSPLASH.egusi },
      { id: "to-32",  name: "Okro Soup",                           price: 3000,  description: "Fresh okro soup cooked with assorted proteins and palm oil.",                                       category: "Swallow & Soups",   rating: 8.8, popular: true,  unit: "Bowl",    emoji: "🫙", image: UNSPLASH.okro },
      { id: "to-33",  name: "Afang Soup",                          price: 3500,  description: "Traditional Afang soup from Cross River — rich leafy green soup.",                                 category: "Swallow & Soups",   rating: 9.1, popular: true,  unit: "Bowl",    emoji: "🥬", image: UNSPLASH.afang },
      { id: "to-35",  name: "Vegetable Soup",                      price: 3000,  description: "Fresh ugu (pumpkin leaf) vegetable soup with fish and meat.",                                      category: "Swallow & Soups",   rating: 8.8, popular: true,  unit: "Bowl",    emoji: "🥦", image: UNSPLASH.afang },
      { id: "to-36",  name: "Fisherman Soup",                      price: 16000, description: "Premium fisherman soup bursting with seafood flavour.",                                             category: "Swallow & Soups",   rating: 9.5, premium: true,  unit: "Pot",     emoji: "🐟", image: UNSPLASH.fishermanSoup },
      { id: "to-37",  name: "Seafood Okro",                        price: 16000, description: "Premium seafood okro soup — shrimps, calamari & fresh fish.",                                      category: "Swallow & Soups",   rating: 9.6, premium: true,  unit: "Pot",     emoji: "🦑", image: UNSPLASH.seafoodOkro },

      // SWALLOW
      { id: "to-60",  name: "Semo (per wrap)",                     price: 600,   description: "Smooth semovita wrap — served with soup of choice.",                                               category: "Swallow & Soups",   rating: 8.6, popular: true,  unit: "Wrap",    emoji: "⚪", image: UNSPLASH.semo },
      { id: "to-61",  name: "Eba/Garri (per wrap)",                price: 600,   description: "Cassava garri swallow — served with soup of choice.",                                              category: "Swallow & Soups",   rating: 8.6, popular: true,  unit: "Wrap",    emoji: "🟡", image: UNSPLASH.semo },
      { id: "to-63",  name: "Plantain Flour (per wrap)",           price: 1000,  description: "Smooth plantain flour swallow.",                                                                   category: "Swallow & Soups",   rating: 8.5, popular: true,  unit: "Wrap",    emoji: "🌿", image: UNSPLASH.semo },
      { id: "to-64",  name: "Poundo Yam (per wrap)",               price: 1000,  description: "Smooth poundo yam swallow — pairs perfectly with egusi or okro.",                                  category: "Swallow & Soups",   rating: 8.8, popular: true,  unit: "Wrap",    emoji: "⚪", image: UNSPLASH.poundedYam },

      // PROTEIN
      { id: "to-50",  name: "Beef (per piece)",                    price: 1500,  description: "Fried or grilled seasoned beef — tender and peppery.",                                             category: "Grills & Protein",  rating: 8.7, popular: true,  unit: "Piece",   emoji: "🥩", image: UNSPLASH.beef },
      { id: "to-51",  name: "Goat Meat (per piece)",               price: 1500,  description: "Tender well-seasoned goat meat, fried or grilled.",                                                category: "Grills & Protein",  rating: 8.8, popular: true,  unit: "Piece",   emoji: "🍖", image: UNSPLASH.goatMeat },
      { id: "to-52",  name: "Chicken (1/8 portion)",               price: 2600,  description: "Fried or grilled chicken — 1/8 cut, crispy & juicy.",                                             category: "Grills & Protein",  rating: 8.7, popular: true,  unit: "Piece",   emoji: "🍗", image: UNSPLASH.chicken },
      { id: "to-53",  name: "Chicken (1/4 portion)",               price: 5000,  description: "Fried or grilled chicken — quarter piece, generous portion.",                                      category: "Grills & Protein",  rating: 9.3, premium: true,  unit: "Piece",   emoji: "🍗", image: UNSPLASH.chicken },
      { id: "to-54",  name: "Grilled Catfish",                     price: 5000,  description: "Fresh catfish — perfectly grilled or fried with pepper sauce.",                                    category: "Grills & Protein",  rating: 9.0, premium: true,  unit: "Piece",   emoji: "🐟", image: UNSPLASH.catfish },
      { id: "to-55",  name: "Grilled Croaker Fish",                price: 6000,  description: "Premium croaker fish — grilled or fried.",                                                          category: "Grills & Protein",  rating: 9.1, premium: true,  unit: "Piece",   emoji: "🐠", image: UNSPLASH.catfish },
      { id: "to-56",  name: "Jumbo Snail (per lobe)",              price: 7500,  description: "Giant seasoned snail — a Nigerian delicacy.",                                                       category: "Grills & Protein",  rating: 9.5, premium: true,  unit: "Lobe",    emoji: "🐌", image: UNSPLASH.snail },

      // CHIPS & FRIES
      { id: "to-1",   name: "Fried Yam Chips",                     price: 3000,  description: "Crispy fried yam chips served with tomato stew.",                                                  category: "Chips & Fries",     rating: 8.7, popular: true,  unit: "Plate",   emoji: "🟡", image: UNSPLASH.yamChips },
      { id: "to-2",   name: "Sweet Potatoes (Large)",              price: 2500,  description: "Large-size sweet potato chips served with stew.",                                                   category: "Chips & Fries",     rating: 8.6, popular: true,  unit: "Plate",   emoji: "🍠", image: UNSPLASH.yamChips },
      { id: "to-3",   name: "Sweet Potatoes (Regular)",            price: 1300,  description: "Regular sweet potato chips.",                                                                       category: "Chips & Fries",     rating: 8.5, popular: true,  unit: "Plate",   emoji: "🍠", image: UNSPLASH.yamChips },
      { id: "to-4",   name: "French Fries (Large)",                price: 2500,  description: "Crispy golden french fries served with ketchup.",                                                   category: "Chips & Fries",     rating: 9.2, popular: true,  unit: "Plate",   emoji: "🍟", image: UNSPLASH.frenchFries },
      { id: "to-5",   name: "French Fries (Regular)",              price: 1300,  description: "Golden regular-size french fries with ketchup.",                                                    category: "Chips & Fries",     rating: 8.6, popular: true,  unit: "Plate",   emoji: "🍟", image: UNSPLASH.frenchFries },
      { id: "to-6",   name: "Fried Plantain (Dodo)",               price: 2000,  description: "Sweet fried ripe plantain slices served with stew.",                                               category: "Chips & Fries",     rating: 8.7, popular: true,  unit: "Plate",   emoji: "🍌", image: UNSPLASH.plantain },
      { id: "to-7",   name: "Chef's Chips & Chicken",              price: 7200,  description: "Special crispy fries & soulfully spiced fried ¼ chicken.",                                         category: "Chips & Fries",     rating: 9.5, premium: true,  unit: "Combo",   emoji: "🍟", image: UNSPLASH.frenchFries },
      { id: "to-8",   name: "Yam Porridge (Asaro)",                price: 4000,  description: "Rich & hearty Nigerian yam porridge cooked with palm oil and crayfish.",                           category: "Chips & Fries",     rating: 8.8, popular: true,  unit: "Plate",   emoji: "🍠", image: UNSPLASH.yamChips },
    ]
  },

  // 2. 4U SUPERMARKET & PROVISIONS (MAIN DISH / PROVISIONS)
  {
    id: "4u-supermarket",
    name: "4U Supermarket & Provisions",
    address: "2 Kumasi Crescent, Wuse 2 & Campus Branch",
    coverImage: "/figma_images/Droply/Home.jpg",
    logo: "4U",
    openingHours: "8am – 10pm",
    rating: 4.7,
    deliveryTime: "30 Min",
    deliveryFee: 250,
    type: "MAIN DISH",
    menu: [
      { id: "4u-semo",        name: "Golden Penny Semovita 1kg",           price: 1800,  description: "Enriched wheat semolina — the go-to campus swallow base.",                             category: "Groceries & Provisions", popular: true,  unit: "Pack",   emoji: "🌾", image: UNSPLASH.grocery },
      { id: "4u-indomie",     name: "Indomie Onion Chicken Pack (40 pcs)", price: 12500, description: "Full carton of student-favourite Indomie noodles 120g each.",                          category: "Groceries & Provisions", premium: true,  unit: "Carton", emoji: "📦", image: UNSPLASH.noodles },
      { id: "4u-peak-milk",   name: "Peak Full Cream Milk Powder 400g",    price: 3800,  description: "Rich creamy milk powder for breakfast and cereal.",                                     category: "Groceries & Provisions", popular: true,  unit: "Tin",    emoji: "🥛", image: UNSPLASH.milk },
      { id: "4u-milo",        name: "Nestle Milo Chocolate Powder 400g",   price: 3200,  description: "Energy cocoa malt drink powder loved by students.",                                     category: "Groceries & Provisions", popular: true,  unit: "Tin",    emoji: "☕", image: UNSPLASH.grocery },
      { id: "4u-eggs",        name: "Fresh Farm Eggs (Crate of 30)",       price: 4800,  description: "Directly sourced fresh farm eggs.",                                                      category: "Groceries & Provisions", popular: true,  unit: "Crate",  emoji: "🥚", image: UNSPLASH.eggs },
      { id: "4u-rice-5kg",    name: "Mama Gold Parboiled Rice 5kg",        price: 14500, description: "Long-grain stone-free Nigerian parboiled rice.",                                         category: "Groceries & Provisions", premium: true,  unit: "Bag",    emoji: "🌾", image: UNSPLASH.whitRice },
      { id: "4u-groundnut",   name: "Roasted Groundnut 500g",              price: 900,   description: "Freshly roasted peanuts — perfect campus snack.",                                        category: "Groceries & Provisions", popular: true,  unit: "Pack",   emoji: "🥜", image: UNSPLASH.grocery },
      { id: "4u-tomatoes",    name: "Fresh Tomatoes (Medium Basket)",      price: 3500,  description: "Fresh plum tomatoes for stews and sauces.",                                              category: "Groceries & Provisions", popular: true,  unit: "Basket", emoji: "🍅", image: UNSPLASH.grocery },
    ]
  },

  // 3. MARS CAFE & FAST FOOD (FAST FOODS)
  {
    id: "mars-cafe",
    name: "Mars Cafe & Fast Food",
    address: "1 Asokoro Street, Wuye & Student Center",
    coverImage: "/figma_images/Droply/Shop By Store.jpg",
    logo: "MC",
    openingHours: "9am – 10pm",
    rating: 4.8,
    deliveryTime: "20 Min",
    deliveryFee: 200,
    type: "FAST FOODS",
    menu: [
      { id: "mc-burger-plain",    name: "Chicken/Beef Burger (no fries)",       price: 3000,  description: "Beef/chicken patty with lettuce, cheese, tomatoes, steamed onions & cucumber.",      category: "Burgers & Shawarma", popular: true,  unit: "Wrap",   emoji: "🍔", image: UNSPLASH.burger },
      { id: "mc-burger-reg",      name: "Burger with Fries (Regular)",           price: 4300,  description: "Juicy burger with regular-size crispy french fries.",                                   category: "Burgers & Shawarma", popular: true,  unit: "Combo",  emoji: "🍔", image: UNSPLASH.burger },
      { id: "mc-burger-large",    name: "Burger with Fries (Large)",             price: 5500,  description: "Juicy burger with large-size crispy french fries.",                                     category: "Burgers & Shawarma", premium: true,  unit: "Combo",  emoji: "🍔", image: UNSPLASH.burger },
      { id: "mc-shawarma-reg",    name: "Regular Shawarma (Beef/Chicken/Goat)", price: 3700,  description: "Regular-sized shawarma wrap — your choice of filling.",                                 category: "Burgers & Shawarma", popular: true,  unit: "Wrap",   emoji: "🌯", image: UNSPLASH.shawarma },
      { id: "mc-shawarma-jumbo",  name: "Jumbo Shawarma (Beef/Chicken/Goat)",  price: 4800,  description: "Jumbo shawarma — extra filling, loaded with veggies and sauce.",                        category: "Burgers & Shawarma", premium: true,  unit: "Wrap",   emoji: "🌯", image: UNSPLASH.shawarma },
      { id: "mc-extra-sausage",   name: "Extra Sausage",                         price: 800,   description: "Add an extra sausage to any order.",                                                    category: "Burgers & Shawarma", popular: true,  unit: "Piece",  emoji: "🌭", image: UNSPLASH.burger },
    ]
  },

  // 4. CHICKEN REPUBLIC EXPRESS (FAST FOODS)
  {
    id: "chicken-republic",
    name: "Chicken Republic Express",
    address: "NSUK Main Gate Commercial Plaza, Keffi",
    coverImage: "/figma_images/Droply/Home.jpg",
    logo: "CR",
    openingHours: "8am – 10pm",
    rating: 4.8,
    deliveryTime: "15 Min",
    deliveryFee: 200,
    type: "FAST FOODS",
    menu: [
      { id: "cr-refuel",   name: "Express Refuel Combo (Rice + Chicken)", price: 3800, description: "Jollof/Fried rice served with crispy fried chicken quarter & chilled Coke.", category: "Burgers & Shawarma", popular: true, unit: "Combo", emoji: "🍗", image: UNSPLASH.chicken },
      { id: "cr-wings",    name: "Zesty Spicy Wings (6 Pcs)",            price: 3500, description: "Crispy fried chicken wings tossed in fiery chilli pepper sauce.",              category: "Burgers & Shawarma", popular: true, unit: "Pack",  emoji: "🍗", image: UNSPLASH.pepperChicken },
      { id: "cr-burger",   name: "Chief Citizen Chicken Burger",         price: 4500, description: "Double crispy chicken breast fillet burger with cheese & mayo sauce.",            category: "Burgers & Shawarma", premium: true, unit: "Combo", emoji: "🍔", image: UNSPLASH.burger },
      { id: "cr-pie",      name: "Spicy Beef Meat Pie (2 Pcs)",          price: 1600, description: "Golden baked buttery pastry packed with spiced minced beef.",                    category: "Burgers & Shawarma", popular: true, unit: "Pack",  emoji: "🥧", image: UNSPLASH.sandwich },
    ]
  },

  // 5. KEFFI SUYA & PEPPER GRILL (MAIN DISH)
  {
    id: "keffi-suya-spot",
    name: "Keffi Suya & Pepper Grill Spot",
    address: "University Road, NSUK Campus, Keffi",
    coverImage: "/figma_images/Droply/Merchant Page.jpg",
    logo: "KS",
    openingHours: "4pm – 11pm",
    rating: 4.9,
    deliveryTime: "20 Min",
    deliveryFee: 250,
    type: "MAIN DISH",
    menu: [
      { id: "ks-beef-suya",  name: "Special Hausa Beef Suya (Large)", price: 3000, description: "Authentic Hausa Yaji spiced grilled beef suya with sliced onions & cabbage.",  category: "Grills & Protein", popular: true, unit: "Wrap",  emoji: "🥩", image: UNSPLASH.beef },
      { id: "ks-catfish",    name: "Grilled Peppered Catfish (Whole)", price: 6500, description: "Whole charcoal grilled catfish drenched in spicy scotch bonnet pepper sauce.",   category: "Grills & Protein", premium: true, unit: "Whole", emoji: "🐟", image: UNSPLASH.catfish },
      { id: "ks-asun",       name: "Spicy Asun Goat Meat Platter",   price: 4500, description: "Pan roasted tender goat meat tossed with scotch bonnet pepper & onions.",          category: "Grills & Protein", popular: true, unit: "Plate", emoji: "🍖", image: UNSPLASH.goatMeat },
      { id: "ks-kilishi",    name: "Abuja Special Beef Kilishi",     price: 2500, description: "Sun-dried seasoned beef jerky infused with groundnut suya spice blend.",           category: "Grills & Protein", popular: true, unit: "Pack",  emoji: "🥩", image: UNSPLASH.beef },
    ]
  },

  // 6. CHILLZ LOUNGE & DRINKS BAR (DRINKS)
  {
    id: "chillz-lounge",
    name: "Chillz Lounge & Fresh Juice Bar",
    address: "Faculty of Arts Complex, NSUK Campus",
    coverImage: "/figma_images/Droply/Shop By Store.jpg",
    logo: "CZ",
    openingHours: "9am – 10pm",
    rating: 4.7,
    deliveryTime: "15 Min",
    deliveryFee: 150,
    type: "DRINKS",
    menu: [
      { id: "cz-zobo",       name: "Ice Cold Pineapple Zobo (500ml)",  price: 1000, description: "Organic hibiscus tea freshly brewed with pineapple, ginger & cloves.",      category: "Drinks & Beverages", popular: true, unit: "Bottle", emoji: "🍷", image: UNSPLASH.drinks },
      { id: "cz-juice-blend",name: "Fresh Watermelon & Orange Juice", price: 2800, description: "100% natural cold pressed fresh fruit juice blend.",                        category: "Drinks & Beverages", popular: true, unit: "Cup",    emoji: "🍹", image: UNSPLASH.juice },
      { id: "cz-iced-coffee",name: "Cold Brewed Iced Vanilla Coffee", price: 2200, description: "Chilled espresso coffee with sweet vanilla syrup and creamy milk.",          category: "Drinks & Beverages", popular: true, unit: "Cup",    emoji: "☕", image: UNSPLASH.drinks },
      { id: "cz-mojito",     name: "Virgin Mint Mojito Mocktail",      price: 3000, description: "Refreshing fizzy mocktail infused with fresh lime juice & mint leaves.",       category: "Drinks & Beverages", premium: true, unit: "Glass",  emoji: "🍸", image: UNSPLASH.juice },
    ]
  }
];
