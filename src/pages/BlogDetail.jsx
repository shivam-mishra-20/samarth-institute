import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { blogPosts } from '../data/blogData';
import { motion } from 'framer-motion';
import { 
  FiClock, 
  FiCalendar, 
  FiArrowLeft,
  FiShare2,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiTag
} from 'react-icons/fi';

const BlogDetail = () => {
  const { slug } = useParams();
  
  // Directly derive post from data
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    // Scroll to top on mount or slug change
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
      return (
          <div className="min-h-screen bg-samarth-bg flex items-center justify-center">
              <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
                  <Link to="/blog" className="text-blue-600 hover:underline flex items-center justify-center gap-2">
                      <FiArrowLeft /> Back to Blog
                  </Link>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navbar />

      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.5 }}
         className="pt-24 pb-20"
      >
        {/* Article Header */}
        <div className="container-custom max-w-4xl mx-auto mb-10">
            <Link to="/blog" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
                <FiArrowLeft className="mr-2" /> Back to All Articles
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold uppercase tracking-wide text-xs">
                    {post.category}
                </span>
                <span className="flex items-center gap-1"><FiCalendar /> {post.date}</span>
                <span className="flex items-center gap-1"><FiClock /> {post.readTime}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
            </h1>

            <div className="flex items-center gap-4 py-6 border-t border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {post.author.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">{post.author}</h4>
                    <p className="text-sm text-gray-500">{post.role}</p>
                </div>
                
                <div className="ml-auto flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><FiShare2 /></button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><FiFacebook /></button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><FiTwitter /></button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><FiLinkedin /></button>
                </div>
            </div>
        </div>

        {/* Featured Image */}
        <div className="container-custom max-w-5xl mx-auto mb-12">
            <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
        </div>

        {/* Article Body */}
        <div className="container-custom max-w-3xl mx-auto">
            {/* Custom typography styles since @tailwindcss/typography is likely missing */}
            <article 
                className="text-gray-700 leading-relaxed 
                           [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-4 
                           [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-3 
                           [&>p]:mb-6 [&>p]:text-lg 
                           [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 
                           [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2 
                           [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-8 [&>blockquote]:bg-gray-50 [&>blockquote]:p-4 [&>blockquote]:rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
            >
            </article>

            {/* Tags / Footer of Article */}
            <div className="mt-12 pt-8 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiTag className="text-blue-600" /> Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                    {['Education', 'Exam Tips', 'Student Life', 'Success'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 cursor-pointer transition-colors">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </motion.div>

      {/* Related Articles Strip */}
      <section className="bg-gray-50 py-16">
          <div className="container-custom">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-8">
                  {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map(related => (
                      <Link to={`/blog/${related.slug}`} key={related.id} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                          <div className="h-48 overflow-hidden">
                              <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="p-6">
                              <div className="text-xs text-blue-600 font-bold uppercase mb-2">{related.category}</div>
                              <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                                  {related.title}
                              </h4>
                              <p className="text-gray-500 text-sm">{related.date}</p>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogDetail;
