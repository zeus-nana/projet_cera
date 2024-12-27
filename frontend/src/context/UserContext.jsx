// import { createContext, useState, useEffect } from "react";
// import AuthService from "../services/authService";
// import PropTypes from "prop-types"; // Assurez-vous que le chemin est correct
//
// export const UserContext = createContext();
//
// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await AuthService.verifyToken();
//         if (response.success) {
//           setUser(response.user);
//         }
//       } catch (error) {
//         console.error(
//           "Erreur lors de la vérification de l'authentification",
//           error,
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };
//
//     checkAuth();
//   }, []);
//
//   const updateUser = (userData) => {
//     setUser(userData);
//   };
//
//   const clearUser = () => {
//     setUser(null);
//   };
//
//   return (
//     <UserContext.Provider value={{ user, updateUser, clearUser, isLoading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
//
// UserProvider.propTypes = {
//   children: PropTypes.node,
// };
//
// export default UserProvider;
