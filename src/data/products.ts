export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  /** Optional maximum retail price (shown struck-through when > price) */
  mrp?: number;
  unit: string;
  /** Primary image URL (used when images is not provided) */
  image?: string;
  /** Optional list of image URLs for gallery view */
  images?: string[];
  description?: string;
}

export const categories = [
  "All",
  "Cheese",
  "Mayonnaise",
  "Ketchup",
  "Sauce",
  "Spread",
  "Cream",
  "Butter",
] as const;

export const products: Product[] = [
  // Veeba
  { id: "1", name: "Classic Mayonnaise", brand: "Veeba", category: "Mayonnaise", price: 185, unit: "1 Kg", description: "Rich and creamy classic mayonnaise, perfect for sandwiches and burgers." },
  { id: "2", name: "Tandoori Mayonnaise", brand: "Veeba", category: "Mayonnaise", price: 195, unit: "1 Kg", description: "Tandoori flavored mayo with authentic Indian spices." },
  { id: "3", name: "Cheese & Chilli Sandwich Spread", brand: "Veeba", category: "Spread", price: 210, unit: "1 Kg", description: "Spicy cheese spread ideal for sandwiches and wraps." },
  { id: "4", name: "Tomato Ketchup", brand: "Veeba", category: "Ketchup", price: 120, unit: "1 Kg", description: "Premium tomato ketchup made from ripe tomatoes." },
  { id: "5", name: "Sweet Chilli Sauce", brand: "Veeba", category: "Sauce", price: 165, unit: "1 Kg", description: "Sweet and tangy chilli sauce for dipping and cooking." },
  { id: "6", name: "Chipotle Southwest Dressing", brand: "Veeba", category: "Sauce", price: 225, unit: "1 Kg", description: "Smoky chipotle dressing for salads and wraps." },
  { id: "7", name: "Mint Mayonnaise", brand: "Veeba", category: "Mayonnaise", price: 195, unit: "1 Kg", description: "Refreshing mint-flavored mayonnaise." },
  { id: "8", name: "Burger Mayonnaise", brand: "Veeba", category: "Mayonnaise", price: 190, unit: "1 Kg", description: "Specially crafted mayo for burgers." },

  // Lactilas
  { id: "9", name: "Mozzarella Cheese Block", brand: "Lactilas", category: "Cheese", price: 380, unit: "1 Kg", description: "Premium mozzarella cheese block, ideal for pizzas and pastas." },
  { id: "10", name: "Cheddar Cheese Slice", brand: "Lactilas", category: "Cheese", price: 340, unit: "500 g (24 slices)", description: "Smooth cheddar cheese slices for burgers and sandwiches." },
  { id: "11", name: "Cream Cheese", brand: "Lactilas", category: "Cream", price: 290, unit: "1 Kg", description: "Smooth and creamy cheese spread for bagels and desserts." },
  { id: "12", name: "Processed Cheese Block", brand: "Lactilas", category: "Cheese", price: 320, unit: "1 Kg", description: "Versatile processed cheese for cooking and snacking." },
  { id: "13", name: "Shredded Mozzarella", brand: "Lactilas", category: "Cheese", price: 410, unit: "1 Kg", description: "Pre-shredded mozzarella for quick pizza prep." },
  { id: "14", name: "Pizza Cheese Blend", brand: "Lactilas", category: "Cheese", price: 395, unit: "1 Kg", description: "Special blend of cheeses optimized for pizza topping." },
  { id: "15", name: "Cooking Butter", brand: "Lactilas", category: "Butter", price: 480, unit: "1 Kg", description: "Premium unsalted cooking butter." },

  // Wizzie
  { id: "16", name: "Hazelnut Chocolate Spread", brand: "Wizzie", category: "Spread", price: 350, unit: "1 Kg", description: "Rich hazelnut chocolate spread for desserts and toast." },
  { id: "17", name: "Peanut Butter Creamy", brand: "Wizzie", category: "Spread", price: 280, unit: "1 Kg", description: "Smooth and creamy peanut butter." },
  { id: "18", name: "Peanut Butter Crunchy", brand: "Wizzie", category: "Spread", price: 285, unit: "1 Kg", description: "Crunchy peanut butter with real peanut pieces." },
  { id: "19", name: "Strawberry Jam", brand: "Wizzie", category: "Spread", price: 160, unit: "1 Kg", description: "Sweet strawberry jam made from real fruit." },
  { id: "20", name: "Mixed Fruit Jam", brand: "Wizzie", category: "Spread", price: 155, unit: "1 Kg", description: "Delicious mixed fruit jam." },
];
