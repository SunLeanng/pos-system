import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaPlus,
  FaBoxOpen,
} from "react-icons/fa";

import {
  SquarePen,
  Trash2,
  Package,
  AlertTriangle,
  Boxes,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getProducts,
  deleteProduct,
} from "../../services/productService";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ========================================
     LOAD PRODUCTS
  ======================================== */

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ========================================
     DELETE PRODUCT
  ======================================== */

const handleDelete = (id) => {
  toast(
    (t) => (
      <div
        style={{
          width: "360px",
          background: "#ffffff",
          borderRadius: "12px",
          padding: "18px",
          boxShadow: "0 8px 30px rgba(15, 23, 42, 0.15)",
        }}
      >
        {/* Warning Header */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#FEF3C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: "20px",
              }}
            >
              ⚠️
            </span>
          </div>

          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "600",
                color: "#1E293B",
              }}
            >
              Delete Product
            </h3>

            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: "#64748B",
              }}
            >
              This action cannot be undone.
            </p>
          </div>
        </div>


        {/* Message */}

        <p
          style={{
            margin: "0 0 18px",
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#475569",
          }}
        >
          Are you sure you want to delete this product?
        </p>


        {/* Buttons */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >

          {/* Cancel */}

          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            style={{
              padding: "9px 16px",
              border: "1px solid #E2E8F0",
              borderRadius: "7px",
              background: "#F8FAFC",
              color: "#475569",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>


          {/* Delete */}

          <button
            onClick={async () => {
              toast.dismiss(t.id);

              try {
                await deleteProduct(id);

                toast.success(
                  "Product deleted successfully",
                  {
                    duration: 3000,
                  }
                );

                await loadProducts();

              } catch (error) {

                console.error(error);

                toast.error(
                  "Failed to delete product"
                );
              }
            }}
            style={{
              padding: "9px 16px",
              border: "none",
              borderRadius: "7px",
              background: "#DC2626",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Delete
          </button>

        </div>

      </div>
    ),
    {
      duration: Infinity,
      position: "top-center",
      style: {
        padding: 0,
        background: "transparent",
        boxShadow: "none",
      },
    }
  );
};

  /* ========================================
     CATEGORIES
  ======================================== */

  const categories = useMemo(() => {
    const categoryList = products
      .map((product) => product.category)
      .filter(Boolean);

    return [
      "All",
      ...new Set(categoryList),
    ];
  }, [products]);

  /* ========================================
     FILTER PRODUCTS
  ======================================== */

  const filteredProducts = products.filter(
    (product) => {
      const matchesSearch =
        product.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  /* ========================================
     STOCK STATUS
  ======================================== */

  const getStockStatus = (quantity) => {
    const stock = Number(quantity || 0);

    if (stock === 0) {
      return {
        label: "Out of Stock",
        className: "out-stock",
      };
    }

    if (stock <= 5) {
      return {
        label: "Low Stock",
        className: "low-stock",
      };
    }

    return {
      label: "In Stock",
      className: "in-stock",
    };
  };

  return (
    <div className="products-page">

      {/* ==================================
          HEADER
      ================================== */}

      <div className="products-header">

        <div>
          <h1>
            Products
          </h1>

          <p>
            Manage your products and inventory.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() =>
            navigate("/add-product")
          }
        >
          <FaPlus />

          Add Product
        </button>

      </div>


      {/* ==================================
          SUMMARY
      ================================== */}

      <div className="product-summary">

        {/* Total Products */}

        <div className="summary-card">

          <div className="summary-icon blue">
            <Package />
          </div>

          <div>
            <span>
              Total Products
            </span>

            <strong>
              {products.length}
            </strong>
          </div>

        </div>


        {/* In Stock */}

        <div className="summary-card">

          <div className="summary-icon green">
            <Boxes />
          </div>

          <div>
            <span>
              In Stock
            </span>

            <strong>
              {
                products.filter(
                  (product) =>
                    Number(
                      product.quantity || 0
                    ) > 0
                ).length
              }
            </strong>
          </div>

        </div>


        {/* Low Stock */}

        <div className="summary-card">

          <div className="summary-icon orange">
            <AlertTriangle />
          </div>

          <div>
            <span>
              Low Stock
            </span>

            <strong>
              {
                products.filter(
                  (product) => {
                    const quantity =
                      Number(
                        product.quantity || 0
                      );

                    return (
                      quantity > 0 &&
                      quantity <= 5
                    );
                  }
                ).length
              }
            </strong>
          </div>

        </div>


        {/* Out Of Stock */}

        <div className="summary-card">

          <div className="summary-icon red">
            <FaBoxOpen />
          </div>

          <div>
            <span>
              Out of Stock
            </span>

            <strong>
              {
                products.filter(
                  (product) =>
                    Number(
                      product.quantity || 0
                    ) === 0
                ).length
              }
            </strong>
          </div>

        </div>

      </div>


      {/* ==================================
          FILTER BAR
      ================================== */}

      <div className="products-toolbar">

        {/* Search */}

        <div className="product-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              className="clear-search"
              onClick={() =>
                setSearch("")
              }
            >
              ×
            </button>
          )}

        </div>


        {/* Category */}

        <div className="category-filter">

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            {categories.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}

          </select>

        </div>

      </div>


      {/* ==================================
          PRODUCT TABLE
      ================================== */}

      <div className="products-table-card">

        <div className="table-top">

          <div>

            <h2>
              Product Inventory
            </h2>

            <p>
              {filteredProducts.length} products found
            </p>

          </div>

        </div>


        <div className="products-table-wrapper">

          <table className="products-table">

            <thead>

              <tr>

                <th>
                  Product
                </th>

                <th>
                  Category
                </th>

                <th>
                  Price
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Status
                </th>

                <th className="action-column">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {/* Loading */}

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="table-message"
                  >
                    Loading products...
                  </td>

                </tr>

              ) : filteredProducts.length > 0 ? (

                /* Products */

                filteredProducts.map(
                  (product) => {

                    const stockStatus =
                      getStockStatus(
                        product.quantity
                      );

                    return (

                      <tr
                        key={product.id}
                      >

                        {/* Product */}

                        <td>

                          <div className="product-name-cell">

                            <div className="product-avatar">
                              <Package />
                            </div>

                            <div>

                              <strong>
                                {product.name}
                              </strong>

                              <span>
                                Product ID:{" "}
                                {product.id?.slice(
                                  0,
                                  6
                                )}
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* Category */}

                        <td>

                          <span className="category-badge">

                            {product.category ||
                              "Uncategorized"}

                          </span>

                        </td>


                        {/* Price */}

                        <td>

                          <strong className="product-price">

                            $
                            {Number(
                              product.price || 0
                            ).toFixed(2)}

                          </strong>

                        </td>


                        {/* Stock */}

                        <td>

                          <strong className="stock-number">

                            {product.quantity || 0}

                          </strong>

                          <span className="stock-label">
                            units
                          </span>

                        </td>


                        {/* Status */}

                        <td>

                          <span
                            className={`stock-status ${stockStatus.className}`}
                          >

                            <span className="status-circle"></span>

                            {stockStatus.label}

                          </span>

                        </td>


                        {/* Actions */}

                        <td>

                          <div className="product-actions">

                            {/* Edit */}

                            <button
                              className="icon-action edit"
                              title="Edit Product"
                              onClick={() =>
                                navigate(
                                  `/edit-product/${product.id}`
                                )
                              }
                            >
                              <SquarePen />
                            </button>


                            {/* Delete */}

                            <button
                              className="icon-action delete"
                              title="Delete Product"
                              onClick={() =>
                                handleDelete(
                                  product.id
                                )
                              }
                            >
                              <Trash2 />
                            </button>

                          </div>

                        </td>

                      </tr>

                    );
                  }
                )

              ) : (

                /* No Products */

                <tr>

                  <td
                    colSpan="6"
                    className="empty-products"
                  >

                    <div>

                      <FaBoxOpen />

                      <h3>
                        No products found
                      </h3>

                      <p>
                        Try changing your search
                        or category filter.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default ProductList;