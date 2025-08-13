// import { createContext, useEffect, useState } from "react";
// import toast from "react-hot-toast";

// export const AuthContext = createContext();

// const getInitialData = (key, initialValue) => {
//   const saved = localStorage.getItem(key);
//   if (saved) {
//     try {
//       return JSON.parse(saved);
//     } catch (e) {
//       console.error(`Failed to parse localStorage item: ${key}`, e);
//       return initialValue;
//     }
//   }
//   return initialValue;
// };

// // --- Auth Context and Provider ---
// // const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(getInitialData('user', null));
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const savedUser = getInitialData('user', null);
//       if (savedUser) {
//         setUser(savedUser);
//       }
//       setLoading(false);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, []);

//   const login = (role, email = null) => {
//     const mockUser = {
//       id: email || `${role}@truetestify.com`,
//       role: role,
//       businessName: role === 'admin' ? 'TrueTestify' : null,
//       publicReviewUrl: role === 'admin' ? 'truetestify' : null,
//     };
//     localStorage.setItem('user', JSON.stringify(mockUser));
//     setUser(mockUser);
//     toast.success(`Logged in as ${mockUser.role}.`);
//   };

//   const signup = (role, businessName = null) => {
//     const mockUser = {
//       id: role === 'admin' ? 'admin@newbusiness.com' : 'newreviewer@email.com',
//       role: role,
//       businessName: role === 'admin' ? businessName : null,
//       publicReviewUrl: role === 'admin' ? businessName.toLowerCase().replace(/\s/g, '-') : null,
//     };
//     localStorage.setItem('user', JSON.stringify(mockUser));
//     setUser(mockUser);
//     toast.success(`Account created and logged in as a ${mockUser.role}!`);
//   };

//   const logout = () => {
//     localStorage.removeItem('user');
//     setUser(null);
//     toast.success("Logged out successfully.");
//   };

//   const value = { user, loading, login, signup, logout,getInitialData };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
// export default AuthProvider;

import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext();

const getInitialData = (key, initialValue) => {
const saved = localStorage.getItem(key);
if (saved) {
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error(`Failed to parse localStorage item: ${key}`, e);
    return initialValue;
  }
}
return initialValue;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialData('user', null));
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(getInitialData('subscription', {
    plan: 'Starter',
    status: 'inactive', // inactive | pending | active
    startedAt: null,
  }));
  const [billingInfo, setBillingInfo] = useState(getInitialData('billingInfo', null));

  // Simulate a delay for "loading" and check for existing user
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedUser = getInitialData('user', null);
      if (savedUser) {
        setUser(savedUser);
      }
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const login = (email, password) => {
    // Mock login logic
    const mockUser = {
      id: email, // Use email as a unique ID for this mock
      role: email === 'admin@test.com' ? 'admin' : 'reviewer'
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    toast.success(`Logged in as ${mockUser.role}.`);
  };
  
  const loginPlateForm = (role, email = null) => {
    const mockUser = {
      id: email || `${role}@truetestify.com`,
      role: role,
      businessName: role === 'admin' ? 'TrueTestify' : null,
      publicReviewUrl: role === 'admin' ? 'truetestify' : null,
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    toast.success(`Logged in as ${mockUser.role}.`);
  };

  // UPDATED: Now accepts a role, businessName, and publicReviewUrl
  const signup = (email, password, role, businessName, publicReviewUrl) => {
    // Mock signup logic
    const mockUser = {
      id: email,
      role: role, // Use the role provided by the user
      businessName: businessName || null,
      publicReviewUrl: publicReviewUrl || null,
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    toast.success(`Account created and logged in! You are a ${mockUser.role}.`);
  };

  const logout = () => {
    try {
      localStorage.clear();
    } catch (_) {}
    setUser(null);
    setSubscription({ plan: 'Starter', status: 'inactive', startedAt: null });
    setBillingInfo(null);
    toast.success("Logged out and cleared local data.");
  };

  const selectPlan = (planName) => {
    const updated = { plan: planName, status: 'pending', startedAt: new Date().toISOString() };
    localStorage.setItem('subscription', JSON.stringify(updated));
    setSubscription(updated);
    toast.success(`${planName} selected. Add billing to activate.`);
  };

  const saveBilling = (info) => {
    localStorage.setItem('billingInfo', JSON.stringify(info));
    setBillingInfo(info);
    const updated = { ...subscription, status: 'active' };
    localStorage.setItem('subscription', JSON.stringify(updated));
    setSubscription(updated);
    toast.success('Billing information saved. Subscription active.');
  };

  const planFeatures = {
    Starter: new Set(['basic_moderation', 'widget_embed', 'layout_carousel']),
    Pro: new Set(['basic_moderation', 'advanced_moderation', 'widget_embed', 'analytics', 'priority_support', 'layout_carousel', 'layout_grid', 'layout_wall', 'layout_spotlight']),
    Enterprise: new Set(['basic_moderation', 'advanced_moderation', 'widget_embed', 'analytics', 'priority_support', 'api_access', 'layout_carousel', 'layout_grid', 'layout_wall', 'layout_spotlight'])
  };

  const hasFeature = (feature) => {
    const plan = subscription?.plan || 'Starter';
    return planFeatures[plan]?.has(feature) || false;
  };

  const value = { user, loading, login, signup, logout, getInitialData, loginPlateForm, subscription, billingInfo, selectPlan, saveBilling, hasFeature };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;