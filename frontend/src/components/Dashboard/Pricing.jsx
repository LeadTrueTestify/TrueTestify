const Pricing = () => {
  const pricingPlans = [
    {
      name: 'Starter',
      price: '$0',
      description: 'The essentials for getting started with testimonials.',
      features: ['2 video testimonials', '1 GB storage', 'Basic moderation', 'Embeddable widget'],
      isRecommended: false,
    },
    {
      name: 'Pro',
      price: '$49',
      description: 'Everything you need to grow with a steady stream of reviews.',
      features: ['Unlimited video testimonials', '10 GB storage', 'Advanced moderation', 'Analytics dashboard', 'Priority support'],
      isRecommended: true,
    },
    {
      name: 'Enterprise',
      price: 'Contact Us',
      description: 'Custom solutions for large-scale operations and businesses.',
      features: ['Dedicated account manager', 'Custom storage limits', 'Advanced security', 'API access'],
      isRecommended: false,
    },
  ];

  return (
    <div className="p-8 mt-5 bg-gray-100 shadow-sm border border-gray-200">
      <h2 className="text-5xl font-extrabold text-gray-800 mb-2 text-center">Simple & Transparent Pricing</h2>
      <p className="text-center text-lg text-gray-600 mb-12">Choose the plan that's right for your business.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan, index) => (
          <div key={index} className={`bg-gray-50 p-8 border ${plan.isRecommended ? 'border-orange-500 transform scale-105 shadow-xl' : 'border-gray-200 shadow-sm'} transition-transform duration-300`}>
            {plan.isRecommended && (
              <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-orange-500 tracking-wider mb-4">
                RECOMMENDED
              </span>
            )}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              <p className="text-5xl font-extrabold text-gray-800 my-4">{plan.price}
                <span className="text-xl text-gray-500 font-normal">{plan.price !== 'Contact Us' && '/mo'}</span>
              </p>
              <p className="text-gray-500 mb-6">{plan.description}</p>
              <ul className="space-y-3 text-gray-700">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="h-5 w-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button className={`mt-8 w-full px-8 py-3 font-bold tracking-wide transition-colors ${plan.isRecommended ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}`}>
              {plan.price === 'Contact Us' ? 'Contact Sales' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing