import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn, FiFilter, FiCamera } from 'react-icons/fi';
import { galleryImages, galleryCategories } from '../data/galleryData';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image, index) => {
    setLightboxImage(image);
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    const nextIndex = (lightboxIndex + 1) % filteredImages.length;
    setLightboxIndex(nextIndex);
    setLightboxImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxIndex(prevIndex);
    setLightboxImage(filteredImages[prevIndex]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-samarth-bg font-sans text-gray-800">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-indigo-900 via-samarth-blue-800 to-samarth-blue-900 text-white">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
           {/* Animated blobs */}
           <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
           <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

           <div className="container-custom relative z-10 text-center">
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
             >
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 text-sm font-medium backdrop-blur-md border border-white/10">
                    <FiCamera className="text-yellow-400" /> Life at Samarth
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Moments of Excellence</h1>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                  Explore our vibrant campus, state-of-the-art facilities, and the memorable events that shape our student community.
                </p>
             </motion.div>
           </div>
        </section>

        {/* Filter Section */}
        <section className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100 py-4 shadow-sm">
           <div className="container-custom overflow-x-auto no-scrollbar">
             <div className="flex justify-start md:justify-center gap-2 min-w-max px-2">
               {galleryCategories.map((category) => (
                 <button
                   key={category}
                   onClick={() => setSelectedCategory(category)}
                   className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                     selectedCategory === category
                       ? 'bg-samarth-blue-700 text-white shadow-lg ring-2 ring-blue-500/20 scale-105'
                       : 'bg-gray-100 text-gray-600 hover:bg-white hover:text-samarth-blue-600 hover:shadow-md'
                   }`}
                 >
                   {selectedCategory === category && <FiFilter className="w-4 h-4" />}
                   {category}
                 </button>
               ))}
             </div>
           </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 md:py-20 min-h-[600px]">
          <div className="container-custom">
            
            {filteredImages.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl">No images found in this category.</p>
                </div>
            ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredImages.map((image, index) => (
                      <motion.div
                        layout
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-2xl aspect-[4/3] bg-gray-200"
                        onClick={() => openLightbox(image, index)}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <span className="inline-block px-3 py-1 bg-samarth-blue-600 text-white text-xs font-bold rounded-lg mb-2 w-fit transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                {image.category}
                            </span>
                            <h3 className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                {image.alt}
                            </h3>
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                <FiZoomIn />
                            </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
            )}

          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-20"
            >
              <FiX size={24} />
            </button>
            
            {/* Navigation Buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-20 hidden md:block"
            >
              <FiChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-20 hidden md:block"
            >
              <FiChevronRight size={32} />
            </button>
            
            {/* Image Container */}
            <motion.div 
                className="relative max-w-6xl w-full max-h-[85vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <motion.img
                key={lightboxImage.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
                
                {/* Caption */}
                <div className="mt-6 text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{lightboxImage.alt}</h3>
                    <div className="flex items-center justify-center gap-3 text-gray-400 text-sm">
                        <span className="px-3 py-1 bg-white/10 rounded-full">{lightboxImage.category}</span>
                        <span>•</span>
                        <span>{lightboxIndex + 1} of {filteredImages.length}</span>
                    </div>
                </div>

                {/* Mobile Nav Overlay (bottom) */}
                 <div className="md:hidden flex gap-8 mt-6">
                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="p-3 bg-white/10 rounded-full text-white"><FiChevronLeft size={24}/></button>
                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="p-3 bg-white/10 rounded-full text-white"><FiChevronRight size={24}/></button>
                 </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
