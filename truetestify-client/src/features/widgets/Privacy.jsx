// import React from "react";

// const Privacy = () => {
//   return (
//     <div className="grid grid-cols-1">
//        <div className="grid-cols-2 gap-2">
//         <h1 className="text-2xl text-blue-500">Privacy-First Design</h1>
//         <p className="text-gray-500 text-sm font-light">
//           Built with GDPR and CCPA compliance from day one. Every video requires
//           explicit consent before recording, and customers maintain full control
//           over their data.
//         </p>
//         <ul className="">
//           <li>Explicit consent checkboxes</li>
//           <li>Right-to-deletion support</li>
//           <li>Secure video storage</li>
//           <li>Data export capabilities</li>
//         </ul>
//       </div>
//       <div>
//         <h3>Sample Consent Text</h3>
//         <div>
//           <input type="checkbox" id="agree" />
//           <p>
//             I agree to be recorded and allow [Your Business] to use my video
//             testimonial publicly on their website, marketing materials, and
//             social media.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Privacy;
import React from 'react';

const Privacy = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-[#f9f9fc] rounded-lg border border-[#e0e0f0]">
      {/* Left Section */}
      <div className="flex-1 space-y-3 border">
        <h2 className="text-lg font-semibold text-[#4a00b4] flex items-center justify-start">
          <svg className="w-5 h-5 mr-2 text-purple-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Privacy-First Design
        </h2>
        <p className="text-sm text-gray-600 items-start">
          Built with GDPR and CCPA compliance from day one.
          Every video requires explicit consent before recording,
          and customers maintain full control over their data.
        </p>
        <ul className="text-sm text-green-600 space-y-1">
          <li>✅ Explicit consent checkboxes</li>
          <li>✅ Right-to-deletion support</li>
          <li>✅ Secure video storage</li>
          <li>✅ Data export capabilities</li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="bg-[#f4f0fd] p-4 rounded-lg w-full md:w-[300px]">
        <h3 className="text-sm font-semibold text-[#4a00b4] mb-2">Sample Consent Text</h3>
        <div className="bg-white border border-gray-300 p-3 rounded shadow-sm flex items-start">
          <input type="checkbox" className="mt-1 mr-2" />
          <p className="text-sm text-red-600">
            I agree to be recorded and allow [Your Business] to use my video testimonial publicly
            on their website, marketing materials, and social media.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
