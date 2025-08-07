import {plans} from "../mock/pricing"


const PricingPage = () => {

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-primary mb-8">
        Choose Your Plan
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white rounded-xl shadow p-6 text-center"
          >
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-3xl font-bold text-primary mb-4">{plan.price}</p>
            <ul className="text-gray-600 space-y-2 mb-6">
              {plan.features.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>
            <button className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600">
              Get Started
            </button>
          </div>
        ))}
      </div>
        <span className="text-gray-400 text-sm flex justify-center items-center py-2">All plans include: Unlimited widgets • Public review pages • Basic analytics • GDPR compliance</span>
    </div>
  );
};

export default PricingPage;
