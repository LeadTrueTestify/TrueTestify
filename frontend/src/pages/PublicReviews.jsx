import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MOCK_REVIEWS } from "../assets/mockData";
import ReviewCard from "../components/UI/ReviewCard";

//   const {getInitialData} = useContext(AuthContext)
//   const [layout, setLayout] = useState('grid');
//   const [reviews, setReviews] = useState(getInitialData('reviews', MOCK_REVIEWS));
//   // UPDATED: Get the businessName from the URL parameters
//   const { businessName } = useParams();

//   useEffect(() => {
//     const handleStorageChange = () => {
//       setReviews(getInitialData('reviews', MOCK_REVIEWS));
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   const approvedReviews = reviews.filter(r => r.status === 'approved');

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-lg mt-2">
//       <div className="flex justify-between items-center mb-6">
//         {/* UPDATED: Display the businessName from the URL */}
//         <h2 className="text-4xl font-bold text-blue-600">{businessName ? `${businessName}'s` : 'Customer'} Testimonials</h2>
//         <div className="flex space-x-2">
//           <button onClick={() => setLayout('grid')} className={`px-4 py-2 rounded-full font-semibold ${layout === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Grid</button>
//           <button onClick={() => setLayout('carousel')} className={`px-4 py-2 rounded-full font-semibold ${layout === 'carousel' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Carousel</button>
//           <button onClick={() => setLayout('spotlight')} className={`px-4 py-2 rounded-full font-semibold ${layout === 'spotlight' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Spotlight</button>
//         </div>
//       </div>

//       {layout === 'grid' && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {approvedReviews.map(review => (
//             <ReviewCard key={review.id} review={review} />
//           ))}
//         </div>
//       )}
//       {layout === 'carousel' && (
//         <div className="overflow-x-scroll flex space-x-6 pb-4">
//           {approvedReviews.map(review => (
//             <div key={review.id} className="min-w-[300px] max-w-[300px]">
//               <ReviewCard review={review} />
//             </div>
//           ))}
//         </div>
//       )}
//       {layout === 'spotlight' && approvedReviews.length > 0 && (
//         <div className="flex flex-col items-center">
//           <h3 className="text-2xl font-bold text-gray-800 mb-4">Featured Testimonial</h3>
//           <ReviewCard review={approvedReviews[0]} />
//         </div>
//       )}

//       <div className="text-center mt-8">
//         <Link to="/record" className="inline-block px-6 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-colors">
//           Leave Your Own Review!
//         </Link>
//       </div>
//     </div>
//   );
// };
const PublicReviews = ({ isPreview = false, layout: initialLayout }) => {
  const {getInitialData} = useContext(AuthContext)
  const [layout, setLayout] = useState(initialLayout || 'grid');
  const [reviews, setReviews] = useState(getInitialData('reviews', MOCK_REVIEWS));
  const { businessName } = useParams();

  useEffect(() => {
    const handleStorageChange = () => {
      setReviews(getInitialData('reviews', MOCK_REVIEWS));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const approvedReviews = reviews.filter(r => r.status === 'approved' && r.publicReviewUrl === businessName);

  return (
    <div className="p-8 bg-white shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-4 md:mb-0">{businessName ? `${businessName}'s` : 'Customer'} Testimonials</h2>
        {!isPreview && (
          <div className="flex space-x-2">
            <button onClick={() => setLayout('grid')} className={`px-4 py-2 font-medium border transition-colors ${layout === 'grid' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>Grid</button>
            <button onClick={() => setLayout('carousel')} className={`px-4 py-2 font-medium border transition-colors ${layout === 'carousel' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>Carousel</button>
            <button onClick={() => setLayout('wall')} className={`px-4 py-2 font-medium border transition-colors ${layout === 'wall' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>Wall</button>
            <button onClick={() => setLayout('spotlight')} className={`px-4 py-2 font-medium border transition-colors ${layout === 'spotlight' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>Spotlight</button>
          </div>
        )}
      </div>

      {approvedReviews.length > 0 ? (
        <>
          {layout === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
          {layout === 'carousel' && (
            <div className="overflow-x-scroll flex space-x-6 pb-4">
              {approvedReviews.map(review => (
                <div key={review.id} className="min-w-[300px] max-w-[300px]">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          )}
          {layout === 'wall' && (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
              {approvedReviews.map(review => (
                <div key={review.id} className="mb-6 break-inside-avoid">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          )}
          {layout === 'spotlight' && approvedReviews.length > 0 && (
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Featured Testimonial</h3>
              <ReviewCard review={approvedReviews[0]} />
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 text-lg">No approved reviews to display for this business yet.</p>
      )}

      {!isPreview && (
        <div className="text-center mt-8">
          <Link to={`/record/${businessName}`} className="inline-block px-8 py-3 bg-orange-500 text-white font-bold tracking-wide transition-colors hover:bg-orange-600">
            Leave Your Own Review!
          </Link>
        </div>
      )}
    </div>
  );
};
export default PublicReviews;
