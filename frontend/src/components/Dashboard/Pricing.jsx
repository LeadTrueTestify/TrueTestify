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
    <div className="p-4 bg-white rounded-lg shadow-lg my-2">
      <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center">Flexible Pricing Plans</h2>
      <p className="text-center text-lg text-gray-600 mb-8">Choose the plan that's right for your business.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan, index) => (
          <div key={index} className={`bg-gray-50 p-8 rounded-lg shadow-md flex flex-col justify-between border-2 ${plan.isRecommended ? 'border-orange-500 transform scale-105' : 'border-gray-200'} transition-transform duration-300`}>
            {plan.isRecommended && (
              <span className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full shadow-lg">
                Recommended
              </span>
            )}
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
              <p className="text-4xl font-extrabold text-blue-600 my-4">{plan.price}
                <span className="text-lg text-gray-500 font-normal">{plan.price !== 'Contact Us' && '/mo'}</span>
              </p>
              <p className="text-gray-500 mb-6">{plan.description}</p>
              <ul className="space-y-3 text-gray-700">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button className={`mt-8 w-full px-6 py-3 font-bold rounded-full transition-colors ${plan.isRecommended ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              {plan.price === 'Contact Us' ? 'Contact Sales' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing