import React, { createContext, useState } from "react";

// type UserContextType = {
//   user: boolean;
//   allowTextReviews: boolean;
//   reviews: Review[];
//   updateUser: (userData: any) => void;
//   clearUser: () => void;
//   setUser: React.Dispatch<React.SetStateAction<boolean>>;
//   setAllowTextReviews: React.Dispatch<React.SetStateAction<boolean>>;
//   setReviwes: React.Dispatch<React.SetStateAction<any>>;
// };

// interface Review {
//   id: string;
//   url: File | null;
//   // url: string,
//   content?: string;
//   author: string;
//   rating: Number;
//   createdAt: string;
//   approved: boolean;
// }
export const UserContext = createContext({
  user: false,
  reviews: [],
  updateUser: () => {},
  clearUser: () => {},
  setUser: () => {},
  setReviwes: () => {},
  allowTextReviews: false,
  setAllowTextReviews: () => {},
});

const UserProvider= ({
  children,
}) => {
  const [user, setUser] = useState(false);
  const [allowTextReviews, setAllowTextReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  // function to update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // function to remove user data
  const clearUser = () => {
    setUser(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        clearUser,
        setUser,
        setReviwes: setReviews,
        reviews,
        allowTextReviews,
        setAllowTextReviews,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider; // export the provider
