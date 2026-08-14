import { useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  FolderPlus,
  Save,
  ArrowLeft,
} from "lucide-react";

import { addCategory } from "../../services/categoryService";


function AddCategory() {

  const navigate = useNavigate();

  const [name, setName] = useState("");


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await addCategory({
        name: name.trim(),
      });

      toast.success(
        "Category added successfully"
      );

      navigate("/categories");

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to add category"
      );

    }

  };


  return (

    <div className="category-form-page">


      {/* Header */}

      <div className="category-form-header">

        <button
          type="button"
          className="back-btn"
          onClick={() =>
            navigate("/categories")
          }
        >
          <ArrowLeft size={18} />

          Back to Categories
        </button>


        <div>

          <h1>
            Add Category
          </h1>

          <p>
            Create a new product category.
          </p>

        </div>

      </div>


      {/* Form Card */}

      <div className="category-form-card">


        <div className="category-form-icon">

          <FolderPlus size={28} />

        </div>


        <div className="category-form-title">

          <h2>
            Category Information
          </h2>

          <p>
            Enter the information for your new category.
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="category-form"
        >


          <div className="category-form-group">

            <label>
              Category Name
            </label>

            <input
              type="text"
              placeholder="e.g. Beverages"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

            <span>
              Choose a clear name that describes
              the products in this category.
            </span>

          </div>


          {/* Buttons */}

          <div className="category-form-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate("/categories")
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className="save-btn"
            >

              <Save size={17} />

              Save Category

            </button>

          </div>


        </form>

      </div>

    </div>

  );

}


export default AddCategory;