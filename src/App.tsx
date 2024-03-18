import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import NotificationModal from "./components/Modals/NotificationModal";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppSelector";
import categories from "./http/categories";
import discounts from "./http/discounts";
import materials from "./http/materials";
import partners from "./http/partners";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import Categories from "./pages/Categories";
import Discounts from "./pages/Discounts";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Materials from "./pages/Materials";
import Partners from "./pages/Partners";
import Products from "./pages/Products";
import { setListItem } from "./store/slices/appSlice";
import { hideNotification } from "./store/slices/notificationSlice";

export default function App() {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((c) => c.userItems);

  useEffect(() => {
    dispatch(hideNotification());
  }, []);

  useEffect(() => {
    if (user) fetchAllCategories().finally(fetchAllPartners).finally(fetchAllMaterials).finally(fetchAllDiscounts);
  }, [user]);

  const fetchAllCategories = async () =>
    await categories
      .getListCategory()
      .then((response) => dispatch(setListItem({ listName: "categories", stateValue: response.data.items })))
      .catch((errorResponse) => {});

  const fetchAllPartners = async () =>
    await partners
      .getListPartner()
      .then((response) => dispatch(setListItem({ listName: "partners", stateValue: response.data.items })))
      .catch((errorResponse) => {});

  const fetchAllMaterials = async () =>
    await materials
      .getListMaterial()
      .then((response) => dispatch(setListItem({ listName: "materials", stateValue: response.data.items })))
      .catch((errorResponse) => {});

  const fetchAllDiscounts = async () =>
    await discounts
      .getListDiscount()
      .then((response) => dispatch(setListItem({ listName: "discounts", stateValue: response.data.items })))
      .catch((errorResponse) => {});

  return (
    <>
      <Helmet titleTemplate="%s | Mystery Bijouterie Yönetim Sistemi" defaultTitle="Mystery Bijouterie Yönetim Sistemi" />
      <Header />
      <Routes>
        <Route path="/giris-yap" element={!user ? <Login /> : <Navigate to={"/"} />} />
        <Route path="/" element={user ? <Home /> : <Navigate to={"/giris-yap"} />} />
        <Route path="/urunler" element={user ? <Products /> : <Navigate to={"/giris-yap"} />} />
        <Route
          path="/kategoriler"
          element={user ? <Categories fetchAllCategories={fetchAllCategories} /> : <Navigate to={"/giris-yap"} />}
        />
        <Route path="/partnerler" element={user ? <Partners fetchAllPartners={fetchAllPartners} /> : <Navigate to={"/giris-yap"} />} />
        <Route path="/materyaller" element={user ? <Materials fetchAllMaterials={fetchAllMaterials} /> : <Navigate to={"/giris-yap"} />} />
        <Route path="/indirimler" element={user ? <Discounts fetchAllDiscounts={fetchAllDiscounts} /> : <Navigate to={"/giris-yap"} />} />
        <Route path="/hata/:code" element={<Error />} />
        <Route path="*" element={<Navigate to={"/hata/404"} />} />
      </Routes>
      <Footer />
      <NotificationModal />
      <ToastContainer position="bottom-right" autoClose={5000} draggable={false} theme="colored" />
    </>
  );
}
