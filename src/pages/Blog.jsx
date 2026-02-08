import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts, allCategories } from '../data/blogData';
import { 
  FiClock, 
  FiArrowRight, 
  FiSearch, 
  FiTrendingUp,
  FiBookOpen,
  FiCalendar
} from 'react-icons/fi';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(p => p.featured) || blogPosts[0];

  return (
    <div className="min-h-screen flex flex-col bg-samarth-bg font-sans text-gray-800">
      <Navbar />
      
      <main className="flex-grow"> {/* Added padding-top for fixed navbar */}
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden bg-gradient-to-br from-samarth-blue-900 via-blue-800 to-indigo-900 text-white">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

           <div className="container-custom relative z-10 text-center">
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
             >
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 text-sm font-medium backdrop-blur-md border border-white/10">
                    <FiBookOpen className="text-yellow-400" /> Samarth Knowledge Hub
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Expert Insights & Latest Updates</h1>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Discover study strategies, exam tips, and inspiring success stories curated by our expert faculty.
                </p>
             </motion.div>

             {/* Search Bar */}
             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-xl mx-auto relative group"
             >
                <input
                  type="text"
                  placeholder="Search articles (e.g., 'JEE Tips', 'Motivation')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/40 shadow-2xl transition-all"
                />
                <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-hover:text-blue-500 transition-colors" />
             </motion.div>
           </div>
        </section>

        {/* Featured Post Section (Show always unless searching) */}
        {!searchQuery && (
            <section className="py-16 relative z-20">
                <div className="container-custom">
                    <motion.div 
                       initial={{ opacity: 0, y: 40 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-gray-100"
                    >
                        <div className="lg:w-1/2 relative overflow-hidden group h-[300px] lg:h-auto">
                             <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-all z-10"></div>
                             <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                             <div className="absolute top-6 left-6 z-20">
                                 <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2">
                                     <FiTrendingUp /> Featured
                                 </span>
                             </div>
                        </div>
                        <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                             <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                 <span className="flex items-center gap-1.5"><FiCalendar className="text-blue-500"/> {featuredPost.date}</span>
                                 <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                 <span className="flex items-center gap-1.5"><FiClock className="text-blue-500"/> {featuredPost.readTime}</span>
                             </div>
                             <Link to={`/blog/${featuredPost.slug}`}>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-blue-700 transition-colors cursor-pointer">{featuredPost.title}</h2>
                             </Link>
                             <p className="text-gray-600 mb-8 text-lg leading-relaxed">{featuredPost.excerpt}</p>
                             <div className="flex items-center justify-between mt-auto">
                                 <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                         {featuredPost.author.charAt(0)}
                                     </div>
                                     <span className="text-sm font-semibold text-gray-800">{featuredPost.author}</span>
                                 </div>
                                 <Link to={`/blog/${featuredPost.slug}`} className="flex items-center gap-2 text-blue-600 font-bold hover:translate-x-1 transition-transform">
                                     Read Article <FiArrowRight />
                                 </Link>
                             </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        )}

        {/* Main Content Area */}
        <section className={`py-12 ${selectedCategory !== 'All' || searchQuery ? 'mt-12 bg-gray-50' : 'bg-gray-50'}`}>
           <div className="container-custom">
             
             {/* Categories */}
             <div className="flex flex-wrap justify-center gap-3 mb-12">
               {allCategories.map((category) => (
                 <button
                   key={category}
                   onClick={() => setSelectedCategory(category)}
                   className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-1 ${
                     selectedCategory === category
                       ? 'bg-samarth-blue-700 text-white shadow-lg ring-2 ring-blue-500/20'
                       : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                   }`}
                 >
                   {category}
                 </button>
               ))}
             </div>

             {/* Posts Grid */}
             {filteredPosts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-3xl">
                        <FiSearch />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
                    <p className="text-gray-500">Try adjusting your search or category filters.</p>
                </div>
             ) : (
                <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode='popLayout'>
                    {filteredPosts.map((post) => (searchQuery || post.id !== featuredPost.id) && (
                      <motion.div
                        layout
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 group flex flex-col h-full"
                      >
                         <div className="h-48 overflow-hidden relative">
                            <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full z-10 text-gray-700 shadow-sm border border-gray-100 uppercase tracking-wide">
                                {post.category}
                            </span>
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                         </div>
                         <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
                                <span className="flex items-center gap-1"><FiCalendar /> {post.date}</span>
                                <span>•</span>
                                <span>{post.readTime}</span>
                            </div>
                            <Link to={`/blog/${post.slug}`}>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer">
                                    {post.title}
                                </h3>
                            </Link>
                            <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                {post.excerpt}
                            </p>
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="text-xs font-bold text-gray-700 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                        {post.author.charAt(0)}
                                    </span>
                                    {post.author.split(' ')[0]}...
                                </div>
                                <Link to={`/blog/${post.slug}`} className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1">
                                    Read <FiArrowRight />
                                </Link>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
             )}
           </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-samarth-blue-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="container-custom relative z-10 text-center">
                <FiBookOpen className="text-5xl text-yellow-500 mx-auto mb-6" />
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Stay Ahead of the Curve</h2>
                <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-10">
                    Join 5,000+ students getting weekly exam tips, study hacks, and important updates directly in their inbox.
                </p>
                <div className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4">
                    <input 
                      type="email" 
                      placeholder="Enter your email address" 
                      className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <button className="px-8 py-4 bg-yellow-400 text-blue-900 font-bold rounded-full hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20">
                        Subscribe Now
                    </button>
                </div>
                <p className="text-xs text-blue-300 mt-6 opacity-70">No spam, unsubscribe anytime.</p>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
