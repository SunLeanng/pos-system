import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/dashboard/Dashboard";

import ProductList from "./pages/products/ProductList";
import AddProduct from "./pages/products/AddProduct";
import EditProduct from "./pages/products/EditProduct";

import CategoryList from "./pages/categories/CategoryList";
import AddCategory from "./pages/categories/AddCategory";
import EditCategory from "./pages/categories/EditCategory";

import UserList from "./pages/users/UserList";

import POS from "./pages/sales/POS";
import SalesHistory from "./pages/sales/SalesHistory";


/* ========================================
   PAGE TITLES
======================================== */

function getPageTitle(pathname) {

  if (pathname === "/dashboard") {
    return "Dashboard";
  }

  if (pathname === "/products") {
    return "Products";
  }

  if (pathname === "/add-product") {
    return "Add Product";
  }

  if (pathname.startsWith("/edit-product")) {
    return "Edit Product";
  }

  if (pathname === "/categories") {
    return "Categories";
  }

  if (pathname === "/add-category") {
    return "Add Category";
  }

  if (pathname.startsWith("/edit-category")) {
    return "Edit Category";
  }

  if (pathname === "/sales") {
    return "POS Sales";
  }

  if (pathname === "/sales-history") {
    return "Sales History";
  }

  if (pathname === "/users") {
    return "Users";
  }

  return "POS System";
}


/* ========================================
   MAIN LAYOUT
======================================== */

function Layout({ children }) {

  const location = useLocation();

  const pageTitle = getPageTitle(
    location.pathname
  );

  return (

    <div className="app-layout">

      {/* Sidebar */}
      <Sidebar />


      {/* Right Side */}
      <div className="content-area">

        <Navbar title={pageTitle} />

        <main className="main-content">

          {children}

        </main>

      </div>

    </div>

  );
}


/* ========================================
   APP
======================================== */

function App() {

  return (

    <BrowserRouter>

      {/* Toast Notifications */}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#1e293b",
            color: "#fff",
          },
        }}
      />


      <Routes>

        {/* ==================================
            AUTHENTICATION
        ================================== */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==================================
            DASHBOARD
        ================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* ==================================
            PRODUCTS
        ================================== */}

        <Route
          path="/products"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <ProductList />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-product"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <AddProduct />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-product/:id"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <EditProduct />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* ==================================
            CATEGORIES
        ================================== */}

        <Route
          path="/categories"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <CategoryList />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-category"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <AddCategory />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-category/:id"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <EditCategory />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* ==================================
            POS SALES
        ================================== */}

        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Layout>
                <POS />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* ==================================
            SALES HISTORY
        ================================== */}

        <Route
          path="/sales-history"
          element={
            <ProtectedRoute>
              <Layout>
                <SalesHistory />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* ==================================
            USERS
        ================================== */}

        <Route
          path="/users"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <UserList />
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;