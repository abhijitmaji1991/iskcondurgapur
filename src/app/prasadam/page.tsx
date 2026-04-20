'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaStar, FaPlus, FaMinus, FaArrowRight, FaTimes, FaRupeeSign } from 'react-icons/fa';

// Define the interface for a prasadam item
interface PrasadamItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isVegan: boolean;
  ingredients: string[];
}

// Sample data for prasadam items
const prasadamItems: PrasadamItem[] = [
  {
    id: '1',
    name: 'Laddu',
    description: 'Traditional sweet made from gram flour, sugar, and ghee, offered to Lord Krishna.',
    price: 5.99,
    image: '/images/prasadam/laddu.jpg',
    category: 'Sweets',
    rating: 4.8,
    isVegan: false,
    ingredients: ['Gram flour', 'Sugar', 'Ghee', 'Cardamom', 'Nuts']
  },
  {
    id: '2',
    name: 'Halwa',
    description: 'Rich semolina pudding with ghee, sugar, and dry fruits.',
    price: 4.99,
    image: '/images/prasadam/halwa.jpg',
    category: 'Sweets',
    rating: 4.6,
    isVegan: false,
    ingredients: ['Semolina', 'Sugar', 'Ghee', 'Cardamom', 'Raisins', 'Almonds']
  },
  {
    id: '3',
    name: 'Khichdi',
    description: 'Savory rice and lentil dish with spices, easy to digest and nutritious.',
    price: 7.99,
    image: '/images/prasadam/khichdi.jpg',
    category: 'Savory',
    rating: 4.7,
    isVegan: true,
    ingredients: ['Rice', 'Moong Dal', 'Ghee', 'Cumin', 'Turmeric', 'Ginger']
  },
  {
    id: '4',
    name: 'Pakoras',
    description: 'Crispy vegetable fritters made with chickpea flour and spices.',
    price: 6.99,
    image: '/images/prasadam/pakoras.jpg',
    category: 'Savory',
    rating: 4.5,
    isVegan: true,
    ingredients: ['Chickpea flour', 'Mixed vegetables', 'Spices', 'Oil']
  },
  {
    id: '5',
    name: 'Sandesh',
    description: 'Bengali sweet made from paneer and sugar, with delicate flavoring.',
    price: 8.99,
    image: '/images/prasadam/sandesh.jpg',
    category: 'Sweets',
    rating: 4.9,
    isVegan: false,
    ingredients: ['Paneer', 'Sugar', 'Cardamom', 'Saffron']
  },
  {
    id: '6',
    name: 'Vegetable Pulao',
    description: 'Fragrant rice dish with mixed vegetables and aromatic spices.',
    price: 9.99,
    image: '/images/prasadam/pulao.jpg',
    category: 'Savory',
    rating: 4.4,
    isVegan: true,
    ingredients: ['Basmati rice', 'Mixed vegetables', 'Ghee', 'Cumin', 'Cloves', 'Cinnamon']
  },
  {
    id: '7',
    name: 'Chutney',
    description: 'Sweet and tangy condiment made from fruits or vegetables.',
    price: 3.99,
    image: '/images/prasadam/chutney.jpg',
    category: 'Condiments',
    rating: 4.3,
    isVegan: true,
    ingredients: ['Fruits/Vegetables', 'Spices', 'Sugar', 'Vinegar']
  },
  {
    id: '8',
    name: 'Jalebi',
    description: 'Spiral-shaped sweet made from fermented batter, deep-fried and soaked in sugar syrup.',
    price: 6.49,
    image: '/images/prasadam/jalebi.jpg',
    category: 'Sweets',
    rating: 4.7,
    isVegan: true,
    ingredients: ['Flour', 'Yogurt', 'Sugar syrup', 'Saffron', 'Cardamom']
  }
];

// Define interface for cart item
interface CartItem extends PrasadamItem {
  quantity: number;
}

export default function PrasadamPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Categories derived from the prasadam items
  const categories = Array.from(new Set(prasadamItems.map(item => item.category)));

  // Filter prasadam items based on category and search query
  const filteredItems = prasadamItems.filter(item => {
    const matchesCategory = activeCategory ? item.category === activeCategory : true;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Add an item to the cart
  const addToCart = (item: PrasadamItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove an item from the cart
  const removeFromCart = (id: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter(item => item.id !== id);
      }
    });
  };

  // Calculate total items in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <main className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-500 to-yellow-600 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Krishna Prasadam</h1>
            <p className="text-xl mb-8">
              Prasadam (प्रसाद) is food that has been sanctified by being offered to the Lord (Krishna).
              According to the Bhagavad Gita, eating such sanctified food helps to cleanse the mind and body.
              All of our prasadam items are prepared with the highest level of cleanliness and purity, following traditional Vedic practices.
              The cooks maintain a meditative state and chant mantras while preparing the food, which is then offered to Lord Krishna with devotion.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#prasadam-items" className="btn-primary">
                Browse Prasadam
              </a>
              <button
                onClick={() => setIsCartOpen(true)}
                className="btn-secondary flex items-center justify-center"
              >
                <FaShoppingCart className="mr-2" /> View Cart ({totalItems})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="prasadam-items" className="py-16">
        <div className="container mx-auto px-4">
          {/* Search and Filter */}
          <div className="mb-10 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-800">Prasadam Items</h2>
              <p className="text-gray-600 mt-2">
                Explore our selection of traditional prasadam items
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search prasadam..."
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeCategory === null
                    ? 'bg-iskcon-orange text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeCategory === category
                      ? 'bg-iskcon-orange text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prasadam Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {/* Using basic img tag as fallback */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/prasadam/placeholder.jpg";
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-bold text-iskcon-orange">
                      {item.isVegan ? 'Vegan' : 'Vegetarian'}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                      <div className="flex items-center text-yellow-500">
                        <FaStar />
                        <span className="text-sm ml-1 text-gray-700">{item.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-iskcon-orange flex items-center">
                        <FaRupeeSign className="mr-1" size={14} />{item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="px-3 py-2 bg-iskcon-orange text-white rounded-md hover:bg-iskcon-orange/90 transition-colors flex items-center"
                      >
                        <FaPlus className="mr-1" size={12} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">
                No prasadam items found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setActiveCategory(null);
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-iskcon-orange text-white rounded-md"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About Prasadam Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">About Prasadam</h2>
            <div className="prose prose-lg mx-auto">
              <p>
                Prasadam (प्रसाद) is food that has been sanctified by being offered to the Lord (Krishna).
                According to the Bhagavad Gita, eating such sanctified food helps to cleanse the mind and body.
              </p>
              <p>
                All of our prasadam items are prepared with the highest level of cleanliness and purity,
                following traditional Vedic practices. The cooks maintain a meditative state and chant mantras
                while preparing the food, which is then offered to Lord Krishna with devotion.
              </p>
              <p>
                By partaking in prasadam, you not only enjoy delicious vegetarian cuisine but also
                participate in a sacred tradition that brings spiritual benefits and helps in your journey
                toward Krishna consciousness.
              </p>
              <p>
                By partaking in prasadam, you not only enjoy delicious vegetarian cuisine but also participate in a sacred tradition that brings spiritual benefits and helps in your journey toward Krishna consciousness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Cart Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 bg-iskcon-orange text-white rounded-md hover:bg-iskcon-orange/90"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center border-b border-gray-200 pb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-4 overflow-hidden">
                      {/* Using basic img tag as fallback */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/prasadam/placeholder.jpg";
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <FaRupeeSign className="mr-1" size={10} />{item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="mx-2 w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium flex items-center">
                  <FaRupeeSign className="mr-1" size={12} />{totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium flex items-center">
                  {totalPrice > 0 ? (
                    <>
                      <FaRupeeSign className="mr-1" size={12} />50.00
                    </>
                  ) : (
                    <>
                      <FaRupeeSign className="mr-1" size={12} />0.00
                    </>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="flex items-center">
                  <FaRupeeSign className="mr-1" size={14} />
                  {totalPrice > 0 ? (totalPrice + 50).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            <button
              disabled={cart.length === 0}
              className={`w-full py-3 rounded-md flex items-center justify-center text-white font-medium ${cart.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-iskcon-orange hover:bg-iskcon-orange/90'
                }`}
            >
              Proceed to Checkout <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for cart */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}
    </main>
  );
} 