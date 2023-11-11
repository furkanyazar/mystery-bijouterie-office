import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import NotificationModal from "./components/Modals/NotificationModal";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppSelector";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import Categories from "./pages/Categories";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Partners from "./pages/Partners";
import Products from "./pages/Products";
import { hideNotification } from "./store/slices/notificationSlice";

export default function App() {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((c) => c.userItems);

  useEffect(() => {
    dispatch(hideNotification());
  }, []);

  return (
    <>
      <Helmet titleTemplate="%s | Mystery Bijouterie Yönetim Sistemi" defaultTitle="Mystery Bijouterie Yönetim Sistemi" />
      <Header />
      <Routes>
        <Route path="/giris-yap" element={!user ? <Login /> : <Navigate to={"/"} />} />
        <Route path="/" element={user ? <Home /> : <Navigate to={"/giris-yap"} />} />
        <Route path="/urunler" element={user ? <Products /> : <Navigate to={"/giris-yap"} />} />
        <Route path="/kategoriler" element={user ? <Categories /> : <Navigate to={"/giris-yap"} />} />
        <Route path="/partnerler" element={user ? <Partners /> : <Navigate to={"/giris-yap"} />} />
        <Route path="/hata/:code" element={<Error />} />
        <Route path="*" element={<Navigate to={"/hata/404"} />} />
      </Routes>
      <Footer />
      <NotificationModal />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
