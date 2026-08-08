import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Home, ChevronRight as ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Tilt from "react-parallax-tilt";

interface GalleryImage {
  id: string;
  title: string;
  category: string | null;
  year: string | null;
  image_url: string;
}

const Gallery = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [showCategorySelection, setShowCategorySelection] = useState(true);
  const [showYearSelection, setShowYearSelection] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      }
      setLoading(false);
    };
    fetchImages();
  }, []);

  // Get unique categories and years
  const categories = [...new Set(images.map(img => img.category).filter(Boolean))];
  const years = [...new Set(images.map(img => img.year).filter(Boolean))].sort((a, b) => (b || '').localeCompare(a || ''));

  // Filter images based on selection
  const filteredImages = images.filter(img => {
    if (selectedCategory && img.category !== selectedCategory) return false;
    if (selectedYear && img.year !== selectedYear) return false;
    return true;
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategorySelection(false);
    setShowYearSelection(true);
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setShowYearSelection(false);
  };

  const resetSelection = () => {
    setSelectedCategory(null);
    setSelectedYear(null);
    setShowCategorySelection(true);
    setShowYearSelection(false);
  };

  return (
    <>
      <Helmet>
        <title>Photo Gallery | Indo American School, Jhajjar | Life at IAS</title>
        <meta name="description" content="Explore our school photo gallery showcasing student life, academic achievements, sports events, cultural festivals, and modern campus infrastructure at Indo American School, Jhajjar." />
        <meta name="keywords" content="school photos Jhajjar, school events gallery, student life photos, Indo American School pictures, education moments gallery" />
        <link rel="canonical" href="https://indoamericanschool.edu.in/gallery" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indoamericanschool.edu.in/gallery" />
        <meta property="og:title" content="Photo Gallery | Indo American School, Jhajjar | Life at IAS" />
        <meta property="og:description" content="Experience life at Indo American School through our vibrant collection of photos from various school events and activities." />
        <meta property="og:image" content="https://indoamericanschool.edu.in/indo-logo.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://indoamericanschool.edu.in/gallery" />
        <meta property="twitter:title" content="Photo Gallery | Indo American School, Jhajjar | Life at IAS" />
        <meta property="twitter:description" content="Experience life at Indo American School through our vibrant collection of photos from various school events and activities." />
        <meta property="twitter:image" content="https://indoamericanschool.edu.in/indo-logo.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Indo American School Photo Gallery",
            "description": "Visual highlights and moments from Indo American School, Jhajjar.",
            "publisher": {
              "@type": "EducationalOrganization",
              "name": "Indo American School",
              "logo": "https://indoamericanschool.edu.in/indo-logo.png"
            }
          })}
        </script>
      </Helmet>

      <Layout>
        <section className="bg-primary py-20 relative">
          {/* Breadcrumb */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
              <Link to="/" className="flex items-center gap-1 hover:text-secondary transition-colors">
                <Home size={14} />
                <span>Home</span>
              </Link>
              <ChevronRightIcon size={14} />
              <span className="text-primary-foreground font-medium">Gallery</span>
            </div>
          </div>

          <div className="container-custom text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Photo Gallery</h1>
            <p className="text-xl text-primary-foreground/80">Capturing moments of excellence</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : showCategorySelection ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">Choose a Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {categories.map((category, i) => (
                    <motion.button
                      key={category}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleCategorySelect(category!)}
                      className="bg-card hover:bg-primary hover:text-primary-foreground p-6 rounded-2xl shadow-lg border border-border transition-all duration-300"
                    >
                      <h3 className="font-semibold capitalize">{category}</h3>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : showYearSelection ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Choose a Year</h2>
                <p className="text-muted-foreground mb-8">Selected Category: <span className="font-semibold capitalize">{selectedCategory}</span></p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
                  {years.map((year, i) => (
                    <motion.button
                      key={year}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleYearSelect(year!)}
                      className="bg-card hover:bg-primary hover:text-primary-foreground p-4 rounded-xl shadow-lg border border-border transition-all duration-300"
                    >
                      <h3 className="font-semibold">{year}</h3>
                    </motion.button>
                  ))}
                </div>
                <button onClick={resetSelection} className="mt-6 text-muted-foreground hover:text-primary transition-colors">← Back to Categories</button>
              </motion.div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold">Gallery</h2>
                    <p className="text-muted-foreground">Category: <span className="font-semibold capitalize">{selectedCategory}</span> | Year: <span className="font-semibold">{selectedYear}</span></p>
                  </div>
                  <button onClick={resetSelection} className="text-primary hover:text-primary/80 transition-colors">Change Selection</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredImages.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">No images found for the selected category and year</p>
                    </div>
                  ) : (
                    filteredImages.map((img, i) => (
                      <Tilt key={img.id} tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.03} transitionSpeed={1500}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                            className="aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl hover:shadow-primary/20 transition-shadow duration-300" onClick={() => setLightbox(images.indexOf(img))}>
                            <img src={`${img.image_url}?width=800&quality=80&format=webp`} alt={img.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </motion.div>
                      </Tilt>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {lightbox !== null && (
          <div className="fixed inset-0 bg-foreground/95 z-50 flex items-center justify-center p-4">
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center text-primary-foreground"><X size={24} /></button>
            <button onClick={() => setLightbox((lightbox - 1 + images.length) % images.length)} className="absolute left-4 w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center text-primary-foreground"><ChevronLeft size={24} /></button>
            <button onClick={() => setLightbox((lightbox + 1) % images.length)} className="absolute right-4 w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center text-primary-foreground"><ChevronRight size={24} /></button>
            <img src={`${images[lightbox].image_url}?width=1200&quality=80&format=webp`} alt={images[lightbox].title} loading="lazy" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
          </div>
        )}
      </Layout>
    </>
  );
};

export default Gallery;


