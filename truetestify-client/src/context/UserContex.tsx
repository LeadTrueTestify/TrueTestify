
import React,{createContext,useState} from "react";

type UserContextType = {
    user: boolean;
    reviews: Review[];
    updateUser: (userData: any) => void;
    clearUser: () => void;
    setUser: React.Dispatch<React.SetStateAction<boolean>>;
    setReviwes: React.Dispatch<React.SetStateAction<any>>;
};

interface Review {
    id: string,
    url: File | null,
    // url: string,
    content?:string,
    author: string,
    rating: Number,
    createdAt: string,
    approved: boolean,
}
export const UserContext = createContext<UserContextType>({
    user: false,
    reviews: [],
    updateUser: () => {},
    clearUser: () => {},
    setUser: () => {},
    setReviwes: ()=>{}
});

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user,setUser] = useState<boolean>(false);
     const [reviews, setReviews] = useState<Review[]>([]);
    // function to update user data
    const updateUser =(userData:any)=>{
       setUser(userData)
    }

    // function to remove user data
    const clearUser = ()=>{
        setUser(false)
    }
     
    return (
        <UserContext.Provider value={{user,updateUser,clearUser,setUser,setReviwes: setReviews,reviews}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;  // export the provider
