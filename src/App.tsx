import { Helmet } from "react-helmet";
import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import { useAppSelector } from "./hooks/useAppSelector";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Login from "./pages/Login";

const App = () => {
  const { user } = useAppSelector((c) => c.userItems);

  return (
    <>
      <Helmet titleTemplate="%s | Mystery Bijouterie Yönetim Sistemi" defaultTitle="Mystery Bijouterie Yönetim Sistemi" />
      <Header />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to={"/hata/401"} />} />
        <Route path="/giris-yap" element={!user ? <Login /> : <Navigate to={"/"} />} />
        <Route path="/hata/:code" element={<Error />} />
        <Route path="*" element={<Navigate to={"/hata/404"} />} />
      </Routes>
      <Footer />
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
};

export default App;
