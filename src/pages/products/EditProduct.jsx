import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Package,
  Tag,
  DollarSign,
  Boxes,
  ArrowLeft,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getProductById,
  updateProduct,
} from "../../services/productService";

import {
  getCategories,
} from "../../services/categoryService";


function EditProduct() {

  const { id } = useParams();

  const navigate = useNavigate();


  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);


  const [product, setProduct] = useState({

    name: "",
    price: "",
    quantity: "",
    category: "",

  });


  /* ========================================
     LOAD PRODUCT + CATEGORIES
  ======================================== */

  useEffect(() => {

    loadData();

  }, [id]);


  const loadData = async () => {

    try {

      setLoading(true);


      const productData =
        await getProductById(id);

      const categoryData =
        await getCategories();


      if (productData) {

        setProduct({

          name: productData.name || "",

          price: productData.price ?? "",

          quantity: productData.quantity ?? "",

          category:
            productData.category || "",

        });

      }


      setCategories(
        categoryData || []
      );


    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load product"
      );

    } finally {

      setLoading(false);

    }

  };


  /* ========================================
     HANDLE INPUT
  ======================================== */

  const handleChange = (e) => {

    setProduct({

      ...product,

      [e.target.name]:
        e.target.value,

    });

  };


  /* ========================================
     UPDATE PRODUCT
  ======================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      await updateProduct(id, {

        name: product.name.trim(),

        price: Number(
          product.price
        ),

        quantity: Number(
          product.quantity
        ),

        category: product.category,

      });


      toast.success(
        "Product updated successfully"
      );

      navigate("/products");


    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to update product"
      );

    }

  };


  if (loading) {

    return (

      <div className="form-loading">

        <div className="loading-spinner"></div>

        <p>
          Loading product...
        </p>

      </div>

    );

  }


  return (

    <div className="product-form-page">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="form-page-header">

        <div>

          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/products")
            }
          >

            <ArrowLeft />

            Back to Products

          </button>


          <h1>
            Edit Product
          </h1>

          <p>
            Update your product information.
          </p>

        </div>

      </div>


      {/* ==================================
          FORM CARD
      ================================== */}

      <div className="product-form-card">


        <div className="form-card-header">

          <div className="form-header-icon edit-form-icon">

            <Package />

          </div>

          <div>

            <h2>
              Product Information
            </h2>

            <p>
              Update the details of this product.
            </p>

          </div>

        </div>


        <form
          className="product-form"
          onSubmit={handleSubmit}
        >


          {/* Product Name */}

          <div className="form-group">

            <label>
              Product Name
            </label>

            <div className="input-with-icon">

              <Package />

              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={product.name}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* Price */}

          <div className="form-group">

            <label>
              Price
            </label>

            <div className="input-with-icon">

              <DollarSign />

              <input
                type="number"
                name="price"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={product.price}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* Quantity */}

          <div className="form-group">

            <label>
              Quantity
            </label>

            <div className="input-with-icon">

              <Boxes />

              <input
                type="number"
                name="quantity"
                placeholder="0"
                min="0"
                value={product.quantity}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* Category */}

          <div className="form-group">

            <label>
              Category
            </label>

            <div className="input-with-icon">

              <Tag />

              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Category
                </option>

                {categories.map(
                  (cat) => (

                    <option
                      key={cat.id}
                      value={cat.name}
                    >
                      {cat.name}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>


          {/* ==================================
              BUTTONS
          ================================== */}

          <div className="product-form-actions">

            <button
              type="button"
              className="form-cancel-btn"
              onClick={() =>
                navigate("/products")
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className="form-save-btn"
            >

              <Package />

              Update Product

            </button>

          </div>


        </form>

      </div>


    </div>

  );
}

export default EditProduct;