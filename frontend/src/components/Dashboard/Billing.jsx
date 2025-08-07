const Billing = () => {
  // Mock data
  const billingInfo = {
    plan: 'Pro Plan',
    storageUsed: '3.5 GB',
    storageLimit: '10 GB',
    nextBillDate: 'Oct 25, 2025',
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Billing</h2>
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Current Plan</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600">Plan:</span>
            <span className="font-medium text-gray-800">{billingInfo.plan}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600">Storage Used:</span>
            <span className="font-medium text-gray-800">{billingInfo.storageUsed} / {billingInfo.storageLimit}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Next Bill Date:</span>
            <span className="font-medium text-gray-800">{billingInfo.nextBillDate}</span>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button className="px-6 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-colors">
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billing