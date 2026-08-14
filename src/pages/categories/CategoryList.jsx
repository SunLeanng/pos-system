import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaPlus,
  FaFolderOpen,
} from "react-icons/fa";

import {
  FolderOpen,
  SquarePen,
  Trash2,
  Package,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getCategories,
  deleteCategory,
} from "../../services/categoryService";


function CategoryList() {

  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  /* ========================================
     LOAD CATEGORIES
  ======================================== */

  const loadCategories = async () => {

    try {

      setLoading(true);

      const data = await getCategories();

      setCategories(data || []);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load categories"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadCategories();

  }, []);


  /* ========================================
     DELETE CATEGORY
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
            boxShadow:
              "0 8px 30px rgba(15, 23, 42, 0.15)",
          }}
        >

          {/* ================================
              WARNING HEADER
          ================================= */}

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
                Delete Category
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



          {/* ================================
              MESSAGE
          ================================= */}

          <p
            style={{
              margin: "0 0 18px",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#475569",
            }}
          >
            Are you sure you want to delete this category?
          </p>



          {/* ================================
              BUTTONS
          ================================= */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >

            {/* CANCEL */}

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



            {/* DELETE */}

            <button
              onClick={async () => {

                toast.dismiss(t.id);

                try {

                  await deleteCategory(id);

                  toast.success(
                    "Category deleted successfully",
                    {
                      duration: 3000,
                    }
                  );

                  await loadCategories();

                } catch (error) {

                  console.error(error);

                  toast.error(
                    "Failed to delete category"
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
     SEARCH
  ======================================== */

  const filteredCategories = useMemo(() => {

    return categories.filter(
      (category) =>
        category.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  }, [categories, search]);


  /* ========================================
     PAGE
  ======================================== */

  return (

    <div className="categories-page">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="categories-header">

        <div>

          <h1>
            Categories
          </h1>

          <p>
            Organize your products into categories.
          </p>

        </div>


        <button
          className="primary-btn"
          onClick={() =>
            navigate("/add-category")
          }
        >

          <FaPlus />

          Add Category

        </button>

      </div>



      {/* ==================================
          SUMMARY
      ================================== */}

      <div className="category-summary">


        {/* TOTAL CATEGORIES */}

        <div className="category-summary-card">

          <div className="category-summary-icon blue">

            <FolderOpen />

          </div>

          <div>

            <span>
              Total Categories
            </span>

            <strong>
              {categories.length}
            </strong>

          </div>

        </div>



        {/* CATEGORIES AVAILABLE */}

        <div className="category-summary-card">

          <div className="category-summary-icon green">

            <Package />

          </div>

          <div>

            <span>
              Categories Available
            </span>

            <strong>
              {categories.length}
            </strong>

          </div>

        </div>


      </div>



      {/* ==================================
          SEARCH
      ================================== */}

      <div className="category-toolbar">

        <div className="category-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          {search && (

            <button
              className="category-clear-search"
              onClick={() =>
                setSearch("")
              }
            >
              ×
            </button>

          )}

        </div>

      </div>



      {/* ==================================
          TABLE
      ================================== */}

      <div className="category-table-card">


        {/* TABLE HEADER */}

        <div className="category-table-header">

          <div>

            <h2>
              Category Management
            </h2>

            <p>
              {filteredCategories.length} categories found
            </p>

          </div>

        </div>



        {/* TABLE */}

        <div className="category-table-wrapper">

          <table className="category-table">


            {/* TABLE HEAD */}

            <thead>

              <tr>

                <th>
                  Category
                </th>

                <th>
                  ID
                </th>

                <th>
                  Status
                </th>

                <th className="category-action-column">
                  Actions
                </th>

              </tr>

            </thead>



            {/* TABLE BODY */}

            <tbody>


              {/* LOADING */}

              {loading ? (

                <tr>

                  <td
                    colSpan="4"
                    className="category-table-message"
                  >

                    Loading categories...

                  </td>

                </tr>

              ) : filteredCategories.length > 0 ? (


                /* CATEGORIES */

                filteredCategories.map(
                  (category) => (

                    <tr
                      key={category.id}
                    >


                      {/* =========================
                          CATEGORY
                      ========================== */}

                      <td>

                        <div className="category-name-cell">

                          <div className="category-avatar">

                            <FolderOpen />

                          </div>


                          <div>

                            <strong>
                              {category.name}
                            </strong>

                            <span>
                              Product Category
                            </span>

                          </div>

                        </div>

                      </td>



                      {/* =========================
                          ID
                      ========================== */}

                      <td>

                        <span className="category-id">

                          {category.id?.slice(
                            0,
                            8
                          )}

                        </span>

                      </td>



                      {/* =========================
                          STATUS
                      ========================== */}

                      <td>

                        <span className="category-status">

                          <span className="category-status-dot"></span>

                          Active

                        </span>

                      </td>



                      {/* =========================
                          ACTIONS
                      ========================== */}

                      <td>

                        <div className="category-actions">


                          {/* EDIT */}

                          <button
                            type="button"
                            className="category-icon-action edit"
                            title="Edit Category"
                            onClick={() =>
                              navigate(
                                `/edit-category/${category.id}`
                              )
                            }
                          >

                            <SquarePen />

                          </button>



                          {/* DELETE */}

                          <button
                            type="button"
                            className="category-icon-action delete"
                            title="Delete Category"
                            onClick={() =>
                              handleDelete(
                                category.id
                              )
                            }
                          >

                            <Trash2 />

                          </button>


                        </div>

                      </td>


                    </tr>

                  )
                )


              ) : (


                /* =========================
                   NO CATEGORIES
                ========================== */

                <tr>

                  <td
                    colSpan="4"
                    className="category-empty"
                  >

                    <div>

                      <FaFolderOpen />

                      <h3>
                        No categories found
                      </h3>

                      <p>
                        Try changing your search.
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


export default CategoryList;