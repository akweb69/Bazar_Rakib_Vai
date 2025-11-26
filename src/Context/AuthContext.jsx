import { createContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const base_url = import.meta.env.VITE_BASE_URL;

    const signup = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        setLoading(true);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

            // If user not logged in → set null
            if (!currentUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            // Fetch user from database
            axios.get(`${base_url}/users?email=${currentUser.email}`)
                .then((res) => {
                    const userData = res.data[0] || null;
                    setUser(userData);
                })
                .catch(() => {
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        signup,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
