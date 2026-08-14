import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Package,
  Tag,
  DollarSign,
  Boxes,
  Folder,
  ArrowLeft,
} from "lucide-react";

import toast from "react-hot-toast";

import { addProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";


function AddProduct() {

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
  });


  /* ========================================
     LOAD CATEGORIES
  ======================================== */

  useEffect(() => {

    loadCategories();

  }, []);


  const loadCategories = async () => {

    try {

      const data = await getCategories();

      setCategories(data);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load categories"
      );

    }

  };


  /* ========================================
     HANDLE INPUT
  ======================================== */

  const handleChange = (e) => {

    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });

  };


  /* ========================================
     SUBMIT
  ======================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      await addProduct({

        name: product.name.trim(),

        price: parseFloat(
          product.price
        ),

        quantity: parseInt(
          product.quantity
        ),

        category: product.category,

      });


      toast.success(
        "Product added successfully"
      );

      navigate("/products");

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to add product"
      );

    }

  };


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
            Add Product
          </h1>

          <p>
            Add a new product to your inventory.
          </p>

        </div>

      </div>


      {/* ==================================
          FORM CARD
      ================================== */}

      <div className="product-form-card">


        <div className="form-card-header">

          <div className="form-header-icon">

            <Package />

          </div>

          <div>

            <h2>
              Product Information
            </h2>

            <p>
              Enter the details of your new product.
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
                placeholder="e.g. Coca Cola"
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

              Save Product

            </button>

          </div>


        </form>

      </div>


    </div>

  );
}

export default AddProduct;