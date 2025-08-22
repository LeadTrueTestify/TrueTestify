import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstanse";
import { API_PATHS } from "../utils/apiPaths";

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
  const [tenant, setTenant] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(
    getInitialData("subscription", {
      plan: "Starter",
      status: "inactive", // inactive | pending | active
      startedAt: null,
    })
  );

  const [billingInfo, setBillingInfo] = useState(
    getInitialData("billingInfo", null)
  );

  // Check for existing user and token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = getInitialData("user", null);
      
      if (token && savedUser) {
        try {
          // Verify token is still valid by fetching user info
          const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO(savedUser.id));
          setUser(response.data);
          
          // Get tenant information if user has memberships
          if (response.data.memberships && response.data.memberships.length > 0) {
            const tenantSlug = response.data.memberships[0].tenant;
            if (tenantSlug) {
              setTenant(tenantSlug);
              await fetchTenantInfo(tenantSlug);
            }
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          // Clear invalid token and user data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const fetchTenantInfo = async (slug) => {
    try {
      const response = await axiosInstance.get(API_PATHS.TENANTS.GET_TENANT_BY_SLUG(slug));
      // Store tenant info if needed
      return response.data;
    } catch (error) {
      console.error("Failed to fetch tenant info:", error);
    }
  };

  // Set The User
  const updateUser = (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };
  
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      
      const { token, user: userData, tenant: tenantData } = response.data;
      
      if (token) {
        localStorage.setItem("token", token);
        updateUser(userData);
        
        // Set tenant if available
        if (tenantData) {
          setTenant(tenantData.slug);
        }
        
        toast.success("Login successful!");
        return { success: true, user: userData, tenant: tenantData };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const loginPlatform = async (platform) => {
    // For platform-specific logins (Shopify, WordPress)
    // This would typically redirect to OAuth flow
    const mockUser = {
      id: `platform_${platform}_${Date.now()}`,
      role: "admin",
      businessName: `My ${platform} Store`,
      publicReviewUrl: `my-${platform}-store`,
    };
    
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
    toast.success(`Connected to ${platform}.`);
    return mockUser;
  };

  const signup = async (userData) => {
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, userData);
      
      const { token, user: newUser, tenant: tenantData } = response.data;
      
      if (token) {
        localStorage.setItem("token", token);
        updateUser(newUser);
        
        if (tenantData) {
          setTenant(tenantData.slug);
        }
        
        toast.success("Account created successfully!");
        return { success: true, user: newUser, tenant: tenantData };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (_) {}
    setUser(null);
    setTenant("");
    setSubscription({ plan: "Starter", status: "inactive", startedAt: null });
    setBillingInfo(null);
    toast.success("Logged out successfully.");
  };

  const selectPlan = (planName) => {
    const updated = {
      plan: planName,
      status: "pending",
      startedAt: new Date().toISOString(),
    };
    localStorage.setItem("subscription", JSON.stringify(updated));
    setSubscription(updated);
    toast.success(`${planName} plan selected. Add billing to activate.`);
  };

  const saveBilling = (info) => {
    localStorage.setItem("billingInfo", JSON.stringify(info));
    setBillingInfo(info);
    const updated = { ...subscription, status: "active" };
    localStorage.setItem("subscription", JSON.stringify(updated));
    setSubscription(updated);
    toast.success("Billing information saved. Subscription active.");
  };

  const planFeatures = {
    Starter: new Set(["basic_moderation", "widget_embed", "layout_carousel"]),
    Pro: new Set([
      "basic_moderation",
      "advanced_moderation",
      "widget_embed",
      "analytics",
      "priority_support",
      "layout_carousel",
      "layout_grid",
      "layout_wall",
      "layout_spotlight",
    ]),
    Enterprise: new Set([
      "basic_moderation",
      "advanced_moderation",
      "widget_embed",
      "analytics",
      "priority_support",
      "api_access",
      "layout_carousel",
      "layout_grid",
      "layout_wall",
      "layout_spotlight",
    ]),
  };

  const hasFeature = (feature) => {
    const plan = subscription?.plan || "Starter";
    return planFeatures[plan]?.has(feature) || false;
  };

  const value = {
    user,
    updateUser,
    loading,
    login,
    signup,
    logout,
    getInitialData,
    loginPlatform,
    subscription,
    billingInfo,
    selectPlan,
    saveBilling,
    hasFeature,
    setTenant,
    tenant
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
