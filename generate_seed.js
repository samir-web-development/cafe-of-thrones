import { createClient } from "@supabase/supabase-js";

// Load environment variables if any, though we are using hardcoded values here for the seed script
const supabaseUrl = "https://bkjeoirmhsduobfceoli.supabase.co";
// Need service role key to bypass RLS for inserting products if we want to be safe, but since anyone can read and we didn't restrict insert to admins specifically in the migration (wait, products RLS is enabled, but we only added a select policy for products! So we MUST use the service_role key to insert, OR disable RLS temporarily, OR create an insert policy. Let's use the MCP to execute raw SQL instead for seeding, it's much easier and bypasses RLS.)

// Actually, generating a SQL script from the JSON is easier and more robust using the execute_sql MCP tool.
import * as fs from 'fs';

const menuItems = [
    { name: "Mix Veg Momos", price: 80, rating: 4.5, image_url: "/cafe-items/snaks/mix veg momos.jpg", tags: ["Snacks"] },
    { name: "Schezwan Momos", price: 100, rating: 4.6, image_url: "/cafe-items/snaks/Schezwan Momos.jpg", tags: ["Snacks"], description: "Spicy schezwan filling" },
    { name: "Corn & Cheese Momos", price: 120, rating: 4.8, image_url: "/cafe-items/snaks/Corn Cheese Momos.jpg", tags: ["Snacks"], description: "Melty cheese and sweet corn" },
    { name: "Paneer Momos", price: 140, rating: 4.7, image_url: "/cafe-items/snaks/Paneer Momos.jpg", tags: ["Snacks"] },
    { name: "Paneer Tikka Momos", price: 150, rating: 4.8, image_url: "/cafe-items/snaks/Paneer Tikka Momo.jpg", tags: ["Snacks"], description: "Crunchy paneer tikka style" },
    { name: "French Fries", price: 60, rating: 4.5, image_url: "/cafe-items/snaks/french fries.jpg", tags: ["Snacks"] },
    { name: "Chinese Fries", price: 100, rating: 4.7, image_url: "/cafe-items/snaks/chinese fries.jpg", tags: ["Snacks"], description: "Saucy Indo-Chinese style" },
    { name: "Popcorn Fries", price: 110, rating: 4.6, image_url: "/cafe-items/snaks/popcorn fries.jpg", tags: ["Snacks"] },
    { name: "Masala Fries", price: 70, rating: 4.5, image_url: "/cafe-items/snaks/masala fries.jpg", tags: ["Snacks"], description: "Spicy Indian masala sprinkle" },
    { name: "Peri Peri Fries", price: 90, rating: 4.7, image_url: "/cafe-items/snaks/peri peri fries.jpg", tags: ["Snacks"], description: "Tangy & spicy peri peri" },
    { name: "Aloo Tikki Sandwich", price: 60, rating: 4.4, image_url: "/cafe-items/Sandwich/Aloo Tikki Sandwich.jpg", tags: ["Sandwich"] },
    { name: "Aloo Tikki Cheese Sandwich", price: 70, rating: 4.6, image_url: "/cafe-items/Sandwich/Aloo Tikki chese sandwich.jpg", tags: ["Sandwich"] },
    { name: "Veg Grill Sandwich", price: 80, rating: 4.5, image_url: "/cafe-items/Sandwich/veg grill sandwitch.jpg", tags: ["Sandwich"] },
    { name: "Veg Cheese Grill Sandwich", price: 90, rating: 4.7, image_url: "/cafe-items/Sandwich/veg cheese grill Sandwich.jpg", tags: ["Sandwich"] },
    { name: "Corn Cheese Grill Sandwich", price: 100, rating: 4.8, image_url: "/cafe-items/Sandwich/corn Cheese grill  Sandwiche.jpg", tags: ["Sandwich"] },
    { name: "Paneer Cheese Grill Sandwich", price: 120, rating: 4.9, image_url: "/cafe-items/Sandwich/paneer Cheese grill Sandwich.jpg", tags: ["Sandwich"] },
    { name: "Veg Burger", price: 70, rating: 4.5, image_url: "/cafe-items/burger/Veg Burger.jpg", tags: ["Burger"] },
    { name: "Veg Cheese Burger", price: 80, rating: 4.7, image_url: "/cafe-items/burger/veg cheese Burger.jpg", tags: ["Burger"] },
    { name: "Aloo Tikki Burger", price: 60, rating: 4.4, image_url: "/cafe-items/burger/Aloo tikki burger.jpg", tags: ["Burger"] },
    { name: "Spicy Burger", price: 90, rating: 4.6, image_url: "/cafe-items/burger/Spicy  Burger.jpg", tags: ["Burger"] },
    { name: "Double Tikki Cheese Burger", price: 110, rating: 4.9, image_url: "/cafe-items/burger/Double Tikki chese burger.jpg", tags: ["Burger"], description: "Double the patty, double the cheese" },
    { name: "Schezwan Pizza", price: 140, rating: 4.6, image_url: "/cafe-items/pizza/SCHEZWAN  PIZZA.jpg", tags: ["Pizza"] },
    { name: "Paneer Pizza", price: 150, rating: 4.7, image_url: "/cafe-items/pizza/PANEER PIZZA.jpg", tags: ["Pizza"] },
    { name: "Italian Pizza", price: 170, rating: 4.8, image_url: "/cafe-items/pizza/Italian Pizza.jpg", tags: ["Pizza"] },
    { name: "Paneer Double Cheese Pizza", price: 190, rating: 4.9, image_url: "/cafe-items/pizza/Paneer Double Cheese Pizza.jpg", tags: ["Pizza"] },
    { name: "Sweet Corn Double Cheese Pizza", price: 190, rating: 4.8, image_url: "/cafe-items/pizza/Sweet Corn Double Cheese Pizza.jpg", tags: ["Pizza"] },
    { name: "Plain Cheese Pizza", price: 120, rating: 4.5, image_url: "/cafe-items/pizza/plain cheese pizza.jpg", tags: ["Pizza"] },
    { name: "Sweet Corn Pizza", price: 130, rating: 4.6, image_url: "/cafe-items/pizza/sweet corn pizza.jpg", tags: ["Pizza"] },
    { name: "Double Cheese Pizza", price: 160, rating: 4.7, image_url: "/cafe-items/pizza/double cheese pizza.jpg", tags: ["Pizza"], description: "Extra loaded double cheese" },
    { name: "Hot Coffee", price: 25, rating: 4.5, image_url: "/cafe-items/coffee/Hot Coffeen.jpg", tags: ["Coffee"] },
    { name: "Cold Coffee (Plain)", price: 40, rating: 4.6, image_url: "/cafe-items/coffee/Cold Coffee (Plain).jpg", tags: ["Coffee"] },
    { name: "Cold Coffee (Vanilla)", price: 70, rating: 4.7, image_url: "/cafe-items/coffee/Cold Coffee (Vanilla).jpg", tags: ["Coffee"] },
    { name: "Cold Coffee (Crush)", price: 70, rating: 4.7, image_url: "/cafe-items/coffee/Cold Coffee (Crush).jpg", tags: ["Coffee"] },
    { name: "Cold Coffee With Chocolate", price: 80, rating: 4.8, image_url: "/cafe-items/coffee/Cold Coffee with Chocolate Ice Cream.jpg", tags: ["Coffee"], description: "With ice cream" },
    { name: "Black Coffee", price: 25, rating: 4.6, image_url: "/cafe-items/coffee/Black Coffee.jpg", tags: ["Coffee"] },
    { name: "Green Apple Mocktail", price: 80, rating: 4.7, image_url: "/cafe-items/Mocktails/Green Apple Mocktail.jpg", tags: ["Mocktail"] },
    { name: "Blue Curacao Mocktail", price: 80, rating: 4.8, image_url: "/cafe-items/Mocktails/Blue Curacao Mocktail.jpg", tags: ["Mocktail"] },
    { name: "Rose Mocktail", price: 80, rating: 4.6, image_url: "/cafe-items/Mocktails/Rose Mocktail.jpg", tags: ["Mocktail"] },
];

let sql = `INSERT INTO public.products (name, description, price, image_url, rating, tags, is_available) VALUES\n`;

const values = menuItems.map(item => {
    const desc = item.description ? `'${item.description.replace(/'/g, "''")}'` : 'NULL';
    const tags = `ARRAY[${item.tags.map(t => `'${t}'`).join(',')}]`;
    return `('${item.name.replace(/'/g, "''")}', ${desc}, ${item.price}, '${item.image_url}', ${item.rating}, ${tags}, true)`;
});

sql += values.join(',\n') + ';';

fs.writeFileSync('seed.sql', sql);
console.log('SQL generated.');
