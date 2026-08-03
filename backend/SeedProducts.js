const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

const sampleProducts = [
  // {
  //   title: "A Short History Of Nearly Everything",
  //   author: "Ap Bokifa",
  //   price: 261.95,
  //   description : "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
  //   image: "/images/book-posters/bo_pro_15.jpg",
  //   rating: 4,
  //   category: "highlights",
  //   isFeatured: true,
  //   stock: 25,
  // },
  // {
  //   title: "Complete Set of 7 Books: 30 Days to Change Yourself...",
  //   author: "Ap Bokifa",
  //   price: 220.95,
  //   description : "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
  //   image: "/images/book-posters/bo_pro_7.jpg",
  //   rating: 4,
  //   category: "highlights",
  //   isFeatured: true,
  //   stock: 12,
  // },
  // {
  //   title: "Love In The Time of Cholera",
  //   author: "Ap Bokifa",
  //   price: 246.95,
  //   description : "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",

  //   image: "/images/book-posters/bo_pro_9.jpg",
  //   rating: 4,
  //   category: "highlights",
  //   isFeatured: true,
  //   stock: 30,
  // },
  // {
  //   title: "One Hundred Years Of Solitude",
  //   author: "Ap Bokifa",
  //   price: 264.95,
  //   description : "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
  //   image: "/images/book-posters/bo_pro_4.jpg",
  //   rating: 4,
  //   category: "highlights",
  //   isFeatured: true,
  //   stock: 18,
  // },
  // {
  //   title: "The Brief Wondrous Life Of Oscar Wao",
  //   author: "Ap Bokifa",
  //   price: 282.95,
  //   description : "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
  //   image: "/images/book-posters/bo_pro_27.jpg",
  //   rating: 4,
  //   category: "highlights",
  //   isFeatured: true,
  //   stock: 20,
  // },
  // {
  //   title: "The Girl With The Dragon Tattoo",
  //   author: "Ap Bokifa",
  //   price: 26.95,
  //   description : "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
  //   image: "/images/book-posters/bo_pro_19.jpg",
  //   rating: 4,
  //   category: "highlights",
  //   isFeatured: true,
  //   stock: 40,
  // },
  // {
  //   title: "Unbearable Lightness of Being",
  //   author: "Ap Bokifa",
  //   description : "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
  //   price: 26.95,
  //   image: "/images/book-posters/bo_pro_19.jpg",
  //   rating: 4,
  //   category: "highlights",
  //   isFeatured: true,
  //   stock: 40,
  // },
  {
    title: "A Prayer for Owen Meany",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 26.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_26.jpg?v=1728615762&width=520",
    rating: 4,
    category: ["Books", "Fiction", "Horror"],
    isFeatured: true,
    stock: 30,
  },
  {
    title: "All the Light We Cannot See",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 26.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_18.jpg?v=1728615507&width=520",
    rating: 3,
    category: ["Books", "Fiction", "Horror"],
    isFeatured: true,
    stock: 25,
  },
  {
    title: "Extremely Loud and Incredibly Close",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 230.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_30.jpg?v=1728615904&width=520",
    rating: 3,
    category: ["Books", "Fiction", "Horror"],
    isFeatured: true,
    stock: 20,
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 238.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_30.jpg?v=1728615904&width=520",
    rating: 3,
    category: ["Books", "Fiction", "Family"],
    isFeatured: true,
    stock: 28,
  },
  {
    title: "Memoirs Of A Geisha",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 256.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_17.jpg?v=1728615478&width=520",
    rating: 3,
    category: ["Books", "Fiction", "Family"],
    isFeatured: true,
    stock: 28,
  },
  {
    title: "Scattershot: Life, Music, Elton, And Me ",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 274.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_2.jpg?v=1728614778&width=520",
    rating: 3,
    category: ["Books", "Fiction", "Family"],
    isFeatured: true,
    stock: 25,
  },
  {
    title: "The Brief Wondrous Life Of Oscar Wao",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 283.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_27.jpg?v=1728615792&width=520",
    rating: 3,
    category: ["Books", "Fiction"],
    isFeatured: true,
    stock: 25,
  },
  {
    title: "The Catcher In The Rye",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 291.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_7.jpg?v=1728615154&width=520",
    rating: 3,
    category: ["Books", "Fiction", "Family"],
    isFeatured: true,
    stock: 25,
  },
  {
    title: "The City And Its Uncertain Walls: A Novel",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 300.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_29.jpg?v=1728615878&width=520",
    rating: 3,
    category: ["Books", "Fiction", "Family"],
    isFeatured: true,
    stock: 25,
  },
  {
    title: "The Curious Incident Of The Dog In The Night-Time",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 309.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_3.jpg?v=1728615010&width=520",
    rating: 3,
    category: ["Books", "Fiction", "Horror"],
    isFeatured: true,
    stock: 25,
  },
  {
    title: "The Elegance Of The Hedgehog",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 318.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_22.jpg?v=1728615626&width=520",
    rating: 3,
    category: ["Books", "Fiction", "Horror"],
    isFeatured: true,
    stock: 25,
  },
  {
    title: "The House Of The Spirits",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 26.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_21.jpg?v=1728615595&width=520",
    rating: 3,
    category: ["Books", "Fiction", "Family"],
    isFeatured: true,
    stock: 25,
  },
  {
    title: "The Seven Husbands Of Evelyn Hugo",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 26.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_5.jpg?v=1728615088&width=520",
    rating: 3,
    category: ["Books", "Fiction"],
    isFeatured: true,
    stock: 22,
  },
  {
    title: "Absolution",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 26.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_6.jpg?v=1728615125&width=520",
    rating: 3,
    category: ["Books", "Fiction"],
    isFeatured: true,
    stock: 22,
  },
  {
    title: "Haunt Sweet Home",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 26.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_10.jpg?v=1728615264&width=520",
    rating: 2,
    category: ["Books", "Fiction"],
    isFeatured: true,
    stock: 22,
  },
  {
    title: "Entitlement",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 27.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_16.jpg?v=1728615440&width=520",
    rating: 1,
    category: ["Books", "Fiction"],
    isFeatured: true,
    stock: 22,
  },
  {
    title: "The Iliad Homer",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 27.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_20.jpg?v=1728615566&width=520",
    rating: 1,
    category: ["Books", "Fiction"],
    isFeatured: true,
    stock: 22,
  },
  {
    title: "The Housemaid",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 27.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_24.jpg?v=1728615695&width=520",
    rating: 1,
    category: ["Books", "Fiction"],
    isFeatured: true,
    stock: 21,
  },
  {
    title: "The Saint Of Bright Doors",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 27.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_28.jpg?v=1728615853&width=520",
    rating: 1,
    category: ["Books", "Fiction"],
    isFeatured: true,
    stock: 22,
  },
  {
    title: "The Shadow Of The Wind",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 28.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_8.jpg?v=1728615197&width=520",
    rating: 1,
    category: ["Books", "Fiction", "Horror"],
    isFeatured: true,
    stock: 22,
  },
  {
    title: "The Unbearable Lightness Of Being",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 28.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_23.jpg?v=1728615657&width=520",
    rating: 4,
    category: ["Books", "Fiction"],
    isFeatured: true,
    stock: 22,
  },
  {
    title: "The Wind-Up Bird Chronicle",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 28.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_13.jpg?v=1728615379&width=520",
    rating: 2,
    category: ["Books", "Fiction", "Horror"],
    isFeatured: true,
    stock: 22,
  },
  {
    title: "The Word According To Garp",
    author: "Ap Bokifa",
    description:
      "From the author of The Longest Ride and The Return comes a novel about the enduring legacy of first love, and the decisions that haunt us forever. 1996 was the year that changed everything for Maggie Dawes. Sent away at sixteen to live with an aunt she barely knew in Ocracoke, a remote village on North Carolina's Outer Banks, she could think only of the friends and family she left behind . . . until she met Bryce Trickett, one of the few teenagers on the island.",
    price: 28.95,
    image:
      "https://ap-bokifa.myshopify.com/cdn/shop/files/bo_pro_25.jpg?v=1728615733&width=520",
    rating: 3,
    category: ["Books", "Fiction", "Family"],
    isFeatured: true,
    stock: 22,
  },
];

async function seed() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/bokifa",
    );
    console.log("Connected to MongoDB");

    await Product.deleteMany({ category: "highlights" });
    await Product.insertMany(sampleProducts);

    console.log(`Seeded ${sampleProducts.length} products.`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
