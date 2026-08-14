import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  FolderPen,
  Save,
  ArrowLeft,
} from "lucide-react";

import {
  getCategoryById,
  updateCategory,
} from "../../services/categoryService";


function EditCategory() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);


  /* ========================================
     LOAD CATEGORY
  ======================================== */

  const loadCategory = async () => {

    try {

      setLoading(true);

      const data =
        await getCategoryById(id);

      if (data) {

        setName(data.name);

      } else {

        toast.error(
          "Category not found"
        );

        navigate("/categories");

      }

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load category"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadCategory();

  }, [id]);


  /* ========================================
     UPDATE CATEGORY
  ======================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await updateCategory(id, {

        name: name.trim(),

      });

      toast.success(
        "Category updated successfully"
      );

      navigate("/categories");

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to update category"
      );

    }

  };


  /* ========================================
     LOADING
  ======================================== */

  if (loading) {

    return (

      <div className="category-form-loading">

        Loading category...

      </div>

    );

  }


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
            Edit Category
          </h1>

          <p>
            Update your product category information.
          </p>

        </div>

      </div>


      {/* Form Card */}

      <div className="category-form-card">


        <div className="category-form-icon edit-icon">

          <FolderPen size={28} />

        </div>


        <div className="category-form-title">

          <h2>
            Category Information
          </h2>

          <p>
            Update the category name below.
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
              Make sure the category name is clear
              and easy to understand.
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

              Update Category

            </button>


          </div>


        </form>

      </div>


    </div>

  );

}


export default EditCategory;