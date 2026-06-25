// App.jsx

import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// PAGES
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import OrderDetail from "./pages/OrderDetail";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import ProductPage from "./pages/ProductPage";
import UserLayout from "./pages/user/UserLayout";
import UserProfile from "./pages/user/UserProfile";
import UserOrders from "./pages/user/UserOrders";
import ChangePassword from "./pages/user/ChangePassword";
import Register from "./pages/Register";
import UserOrderDetail from "./pages/user/UserOrderDetail";
import Wishlist from "./pages/Wishlist";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import AdminCoupons from "./pages/AdminCoupons";
import Home from "./pages/Home";
import CollectionPage from "./pages/CollectionPage";
import AdminCollections from "./pages/AdminCollections";
import LookbookPage from "./pages/LookbookPage";
import LookbookDetailPage from "./pages/LookbookDetailPage";
import AdminLookbookPage from "./pages/AdminLookbookPage";
import AdminNewsletterPage from "./pages/AdminNewsletterPage";
import ContactPage from "./pages/ContactPage";
import AdminContactPage from "./pages/AdminContactPage";
import FaqPage from "./pages/FaqPage";
import AboutPage from "./pages/AboutPage";
import ShippingReturnsPage from "./pages/ShippingReturnsPage";
// ECOMMERCE
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

// LAYOUTS
import MainLayout from "./layouts/MainLayout";
import ShopLayout from "./layouts/ShopLayout";

// COMPONENTS
import ProtectedRoute from "./components/ProtectedRoute";
import AccessDenied from "./components/AccessDenied";
import PageWrapper from "./components/PageWrapper";
import GlobalLoading from "./components/GlobalLoading";

// LOADING
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import { bindLoading } from "./utils/loadingBridge";

// TOAST
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Verify email
import VerifyEmail from "./pages/VerifyEmail";

//Forgot and reset password
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
// =========================
// BIND LOADING
// =========================

function LoadingBinder() {
  const { show, hide } = useLoading();

  bindLoading(show, hide);

  return null;
}

function App() {
  const location = useLocation();

  // =========================
  // AUTO REDIRECT ROOT
  // =========================

  const token = localStorage.getItem("token");

  let defaultRedirect = "/login";

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      defaultRedirect = payload.role === "ADMIN" ? "/admin" : "/user/profile";
    } catch (err) {
      console.log(err);
      localStorage.removeItem("token");
    }
  }

  return (
    <LoadingProvider>
      <LoadingBinder />

      <GlobalLoading />

      <ToastContainer position="top-right" autoClose={2000} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ========================= */}
          {/* ROOT */}
          {/* ========================= */}
          <Route
            path="/"
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />
          {/* ========================= */}
          {/* PUBLIC */}
          {/* ========================= */}
          <Route
            path="/login"
            element={
              <PageWrapper>
                <Login />
              </PageWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <PageWrapper>
                <Register />
              </PageWrapper>
            }
          />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route
            path="/verify-email"
            element={
              <PageWrapper>
                <VerifyEmail />
              </PageWrapper>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageWrapper>
                <ForgotPassword />
              </PageWrapper>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PageWrapper>
                <ResetPassword />
              </PageWrapper>
            }
          />
          <Route
            path="/payment-success"
            element={
              <PageWrapper>
                <PaymentSuccess />
              </PageWrapper>
            }
          />
          <Route
            path="/payment-failed"
            element={
              <PageWrapper>
                <PaymentFailed />
              </PageWrapper>
            }
          />
          <Route
            path="/contact"
            element={
              <PageWrapper>
                <ContactPage />
              </PageWrapper>
            }
          />
          <Route
            path="/faq"
            element={
              <PageWrapper>
                <FaqPage />
              </PageWrapper>
            }
          />

          <Route
            path="/about"
            element={
              <PageWrapper>
                <AboutPage />
              </PageWrapper>
            }
          />

          <Route
            path="/shipping-returns"
            element={
              <PageWrapper>
                <ShippingReturnsPage />
              </PageWrapper>
            }
          />
          {/* ========================= */}
          {/* SHOP */}
          {/* ========================= */}
          <Route element={<ShopLayout />}>
            <Route
              path="/shop"
              element={
                <PageWrapper>
                  <Shop />
                </PageWrapper>
              }
            />
            <Route
              path="/collection/:slug"
              element={
                <PageWrapper>
                  <CollectionPage />
                </PageWrapper>
              }
            />
            <Route
              path="/product/:id"
              element={
                <PageWrapper>
                  <ProductDetail />
                </PageWrapper>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <CartPage />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <CheckoutPage />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Wishlist />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/lookbook"
              element={
                <PageWrapper>
                  <LookbookPage />
                </PageWrapper>
              }
            />

            <Route
              path="/lookbook/:slug"
              element={
                <PageWrapper>
                  <LookbookDetailPage />
                </PageWrapper>
              }
            />
          </Route>
          {/* ========================= */}
          {/* ADMIN */}
          {/* ========================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* DASHBOARD */}
            <Route
              index
              element={
                <PageWrapper>
                  <Dashboard />
                </PageWrapper>
              }
            />

            {/* ORDERS */}
            <Route
              path="orders"
              element={
                <PageWrapper>
                  <Orders />
                </PageWrapper>
              }
            />

            {/* PRODUCTS */}
            <Route
              path="products"
              element={
                <PageWrapper>
                  <ProductPage />
                </PageWrapper>
              }
            />

            {/* Collection */}
            <Route
              path="collections"
              element={
                <PageWrapper>
                  <AdminCollections />
                </PageWrapper>
              }
            />

            {/* USERS */}
            <Route
              path="users"
              element={
                <PageWrapper>
                  <Users />
                </PageWrapper>
              }
            />
            {/* COUPONS */}
            <Route
              path="coupons"
              element={
                <PageWrapper>
                  <AdminCoupons />
                </PageWrapper>
              }
            />
            {/* Newsletter */}
            <Route
              path="newsletter"
              element={
                <PageWrapper>
                  <AdminNewsletterPage />
                </PageWrapper>
              }
            />
            {/* Contact */}
            <Route
              path="contacts"
              element={
                <PageWrapper>
                  <AdminContactPage />
                </PageWrapper>
              }
            />
            {/* ORDER DETAIL */}
            <Route
              path="orders/:id"
              element={
                <PageWrapper>
                  <OrderDetail />
                </PageWrapper>
              }
            />
            {/* Lookbook */}
            <Route
              path="lookbooks"
              element={
                <PageWrapper>
                  <AdminLookbookPage />
                </PageWrapper>
              }
            />
          </Route>

          {/* ========================= */}
          {/* USER */}
          {/* ========================= */}
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="profile" replace />} />

            <Route
              path="profile"
              element={
                <PageWrapper>
                  <UserProfile />
                </PageWrapper>
              }
            />

            <Route
              path="orders"
              element={
                <PageWrapper>
                  <UserOrders />
                </PageWrapper>
              }
            />

            {/* ORDER DETAIL */}
            <Route
              path="orders/:id"
              element={
                <PageWrapper>
                  <UserOrderDetail />
                </PageWrapper>
              }
            />

            <Route
              path="change-password"
              element={
                <PageWrapper>
                  <ChangePassword />
                </PageWrapper>
              }
            />
          </Route>

          {/* ========================= */}
          {/* 404 */}
          {/* ========================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </LoadingProvider>
  );
}

export default App;
