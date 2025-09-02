import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReviewCard from "../components/UI/ReviewCard";
import axiosInstance from "../utils/axiosInstanse";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const PublicReviews = () => {
  const { businessName } = useParams();
  const { tenant } = useContext(AuthContext);
  
  // Filter only active widgets
  const [widgets, setWidgets] = useState(null);
  const [selectedWidgeted, setSelectedWidget] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // If only one active widget, auto-select it
  useEffect(() => {
    if (selectedWidgeted?.length > 0 && !widgets) {
      setWidgets(selectedWidgeted[0]); // Always select first active widget
    }
  }, [widgets, selectedWidgeted]);
   
  // Fetch reviews when widget is selected
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          API_PATHS.WIDGETS.FEED(tenant?.slug || businessName)
        );        
        setSelectedWidget(response.data.widgets || []);
        setReviews(response.data.items || []);
      } catch (error) {
        console.error("Failed to load reviews:", error);
        toast.error("Could not load reviews.");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [widgets]);

  // Handle widget selection
  const handleWidgetSelect = (widget) => {
    setWidgets(widget);
    setReviews([]);
    setLoading(true);
  };

  if (selectedWidgeted?.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Active Widget
        </h3>
        <p className="text-gray-500">
          There are no active widgets to display reviews.
        </p>
      </div>
    );
  }

  if (!widgets) {
    return (
      <div className="p-8 text-center bg-white border border-gray-200 rounded-lg max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          No reviews yet.
        </h3>
        <div className="space-y-3">
          {selectedWidgeted?.map((widget) => (
            <button
              key={widget.id}
              onClick={() => handleWidgetSelect(widget)}
              className="w-full px-6 py-3 text-left bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
            >
              <span className="font-medium text-gray-800">{widget.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({widget.layout})
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const { name: widgetName, layout, themeJson } = widgets;
  const theme = themeJson?.theme || "light";
  const autoplay = themeJson?.autoplay !== false; // default to true

  // Determine container classes based on theme
  const containerClass = `
    p-6 sm:p-8 rounded-lg transition-colors duration-200
    ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"}
    border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}
  `;

  const headingClass = `
    text-2xl font-bold mb-6
    ${theme === "dark" ? "text-white" : "text-gray-800"}
  `;
  

  const renderLayout = () => {
    // === DEFAULTS ===
    const DEFAULT_PRIMARY = "#f97316"; // Your brand orange
    const DEFAULT_BG = "#ffffff";
    const DEFAULT_TEXT = "#111827";

    // === THEME VALUES (with fallbacks) ===
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const themeMode =
      themeJson?.theme || (systemPrefersDark ? "dark" : "light");

    const primaryColor = themeJson?.primary || DEFAULT_PRIMARY;
    const bgColor =
      themeJson?.background || (themeMode === "dark" ? "#111827" : DEFAULT_BG);
    const textColor = themeMode === "dark" ? "#f3f4f6" : DEFAULT_TEXT;
    const cardBg = themeMode === "dark" ? "#1f2937" : "#ffffff";
    const mutedText = themeMode === "dark" ? "#9ca3af" : "#6b7280";

    const autoplay = themeJson?.autoplay !== false;

    switch (layout) {
      case "CAROUSEL":
        return (
          <div className="relative group">
            <div className="overflow-x-auto hide-scrollbar flex space-x-6 pb-5 snap-x snap-mandatory scroll-smooth">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  className="min-w-[300px] max-w-[300px] snap-start flex-shrink-0"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.35 }}
                >
                  <div
                    style={{
                      backgroundColor: cardBg,
                      color: textColor,
                      borderColor: themeMode === "dark" ? "#374151" : "#e5e7eb",
                    }}
                    className="rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <ReviewCard review={review} isPreview={autoplay} />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-md opacity-0 group-hover:opacity-80 transition-opacity flex items-center justify-center">
              <svg
                className="w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        );

      case "SPOTLIGHT":
        return (
          <div className="space-y-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  backgroundColor: index === 0 ? primaryColor : cardBg,
                  color: index === 0 ? "#ffffff" : textColor,
                  borderColor: themeMode === "dark" ? "#374151" : "#e5e7eb",
                }}
                className={`p-7 rounded-2xl border transition-all duration-300 ${
                  index === 0
                    ? "shadow-xl scale-105"
                    : "hover:shadow-md hover:scale-[1.01]"
                }`}
              >
                <ReviewCard review={review} isPreview={autoplay} />
                {index === 0 && (
                  <div
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(4px)",
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        );

      case "FLOATING_BUBBLE":
        return (
          <div className="relative h-96 sm:h-[500px]">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 70, damping: 18 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                style={{
                  backgroundColor: cardBg,
                  color: textColor,
                  borderColor: themeMode === "dark" ? "#374151" : "#e5e7eb",
                  boxShadow: `0 20px 40px -10px ${primaryColor}30`,
                }}
                className="max-w-xs w-full mx-4 rounded-3xl border overflow-hidden shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105"
              >
                <div
                  style={{ backgroundColor: primaryColor }}
                  className="h-1.5"
                ></div>

                <div className="p-6">
                  {reviews.length > 0 ? (
                    <ReviewCard review={reviews[0]} isPreview={autoplay} />
                  ) : (
                    <div className="text-center py-8">
                      <svg
                        className="w-10 h-10 mx-auto text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <p className="text-sm mt-3" style={{ color: mutedText }}>
                        No reviews yet
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-6 pb-5">
                  <span
                    style={{
                      backgroundColor: `${primaryColor}15`,
                      color: primaryColor,
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-opacity-20 border-current"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                      />
                    </svg>
                    {reviews.length}{" "}
                    {reviews.length === 1 ? "Review" : "Reviews"}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              className="absolute bottom-5 right-5"
            >
              <Link
                to={`/record/${businessName}`}
                style={{ backgroundColor: primaryColor }}
                className="flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300"
                aria-label="Leave a review"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </Link>
            </motion.div>

            <div
              className="absolute inset-0 pointer-events-none opacity-10 blur-3xl -z-10"
              style={{
                background: `radial-gradient(ellipse at center, ${primaryColor}60 0%, transparent 70%)`,
              }}
            ></div>
          </div>
        );

      case "GRID":
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -4 }}
              >
                <div
                  style={{
                    backgroundColor: cardBg,
                    color: textColor,
                    borderColor: themeMode === "dark" ? "#374151" : "#e5e7eb",
                  }}
                  className="rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <ReviewCard
                    review={review}
                    theme={theme}
                    isPreview={autoplay}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={containerClass}>
      {/* Widget Title */}
      <h2 className={headingClass}>{widgetName}</h2>

      {/* Layout Rendering */}
      {loading ? (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
          Loading reviews...
        </p>
      ) : reviews.length === 0 ? (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
          No reviews available yet.
        </p>
      ) : (
        renderLayout()
      )}

      {/* CTA Button (only if not in floating mode) */}
      {layout !== "FLOATING_BUBBLE" && (
        <div className="text-center mt-8">
          <Link
            to={`/record/${businessName}`}
            className="inline-block px-8 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors"
          >
            Leave Your Own Review!
          </Link>
        </div>
      )}

      {/* Widget Selector (only if multiple active widgets) */}
      {selectedWidgeted.length > 1 && (
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3
            className={`text-lg font-semibold mb-3 ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Switch Widget
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedWidgeted.map((widget) => (
              <button
                key={widget.id}
                onClick={() => handleWidgetSelect(widget)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    widgets.id === widget.id
                      ? "bg-orange-500 text-white"
                      : theme === "dark"
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }
                `}
              >
                {widget.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicReviews;
