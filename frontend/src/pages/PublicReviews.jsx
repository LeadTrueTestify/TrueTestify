import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MOCK_REVIEWS } from "../assets/mockData";
import ReviewCard from "../components/UI/ReviewCard";



const PublicReviews = ({ isPreview = false, layout: initialLayout }) => {
  const { getInitialData } = useContext(AuthContext);
  const [reviews, setReviews] = useState(
    getInitialData("reviews", MOCK_REVIEWS)
  );
  const { businessName } = useParams();

  useEffect(() => {
    const handleStorageChange = () => {
      setReviews(getInitialData("reviews", MOCK_REVIEWS));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!isPreview) {
      const current = Number(localStorage.getItem('widgetViews') || '0');
      localStorage.setItem('widgetViews', String(current + 1));
    }
  }, [isPreview]);

  let approvedReviews = reviews.filter((r) => r.status === "approved");
  if (businessName && approvedReviews.some(r => r.publicReviewUrl)) {
    approvedReviews = approvedReviews.filter(r => r.publicReviewUrl === businessName);
  }
  approvedReviews = approvedReviews.sort((a, b) => b.id - a.id); // Show most recent first

  const brandLogoUrl = localStorage.getItem('brandLogoUrl') ? JSON.parse(localStorage.getItem('brandLogoUrl')) : null;
  const brandPrimaryColor = localStorage.getItem('brandPrimaryColor') ? JSON.parse(localStorage.getItem('brandPrimaryColor')) : null;

  // Determine layout: use prop, or fallback to 'carousel' for direct usage
  const layout = initialLayout || 'carousel';

  return (
    <div className="p-8 bg-white shadow-sm border border-gray-200">
      {brandLogoUrl && (
        <div className="flex items-center justify-between mb-6 border-b pb-4" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center gap-3">
            <img src={brandLogoUrl} alt="Brand Logo" className="h-10 w-10 object-contain" />
            <h3 className="text-2xl font-bold" style={{ color: brandPrimaryColor || '#111827' }}>{businessName}</h3>
          </div>
          {!isPreview && (
            <Link to={`/record/${businessName}`} className="px-4 py-2 bg-orange-500 text-white font-semibold hover:bg-orange-600">Leave a Review</Link>
          )}
        </div>
      )}
      {approvedReviews.length > 0 ? (
        <>
          {layout === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
          {layout === "carousel" && (
            <div className="overflow-x-scroll flex space-x-6 pb-4">
              {approvedReviews.map((review) => (
                <div key={review.id} className="min-w-[300px] max-w-[300px]">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          )}
          {layout === "wall" && (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
              {approvedReviews.map((review) => (
                <div key={review.id} className="mb-6 break-inside-avoid">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          )}
          {layout === "spotlight" && approvedReviews.length > 0 && (
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Featured Testimonial
              </h3>
              <ReviewCard review={approvedReviews[0]} />
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          No approved reviews to display for this business yet.
        </p>
      )}

      {!isPreview && (
        <div className="text-center mt-8">
          <Link
            to={`/record/${businessName}`}
            className="inline-block px-8 py-3 bg-orange-500 text-white font-bold tracking-wide transition-colors hover:bg-orange-600"
          >
            Leave Your Own Review!
          </Link>
        </div>
      )}
    </div>
  );
};
export default PublicReviews;
