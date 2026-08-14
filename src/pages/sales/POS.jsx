import { useEffect, useState } from "react";
import { serverTimestamp } from "firebase/firestore";

import {
  FaSearch,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";

import {
  Plus,
  Minus,
  Trash2,
  Package,
  ShoppingBag,
  CreditCard,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getProducts,
  updateProduct,
} from "../../services/productService";

import {
  addSale,
} from "../../services/salesService";

import {
  getCategories,
} from "../../services/categoryService";


function POS() {

  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [customerName, setCustomerName] = useState("");

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [checkingOut, setCheckingOut] = useState(false);


  /* ========================================
     LOAD DATA
  ======================================== */

  useEffect(() => {

    loadProducts();

    loadCategories();

  }, []);


  const loadProducts = async () => {

    try {

      const data = await getProducts();

      setProducts(data || []);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load products"
      );

    } finally {

      setLoading(false);

    }

  };


  const loadCategories = async () => {

    try {

      const data = await getCategories();

      setCategories(data || []);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load categories"
      );

    }

  };


  /* ========================================
     ADD TO CART
  ======================================== */

  const addToCart = (product) => {

    if (product.quantity <= 0) {

      toast.error(
        "Product is out of stock."
      );

      return;

    }


    const existing = cart.find(
      item => item.id === product.id
    );


    if (existing) {

      if (
        existing.quantity >=
        product.quantity
      ) {

        toast.error(
          "Not enough stock."
        );

        return;

      }


      setCart(

        cart.map(item =>

          item.id === product.id

            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }

            : item

        )

      );

    } else {

      setCart([

        ...cart,

        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: 1,
        },

      ]);

    }

  };


  /* ========================================
     INCREASE QUANTITY
  ======================================== */

  const increaseQty = (id) => {

    const product = products.find(
      p => p.id === id
    );

    const item = cart.find(
      c => c.id === id
    );


    if (!product || !item) {
      return;
    }


    if (
      item.quantity >=
      product.quantity
    ) {

      toast.error(
        "Not enough stock."
      );

      return;

    }


    setCart(

      cart.map(item =>

        item.id === id

          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }

          : item

      )

    );

  };


  /* ========================================
     DECREASE QUANTITY
  ======================================== */

  const decreaseQty = (id) => {

    const updated = cart

      .map(item =>

        item.id === id

          ? {
              ...item,
              quantity:
                item.quantity - 1,
            }

          : item

      )

      .filter(
        item => item.quantity > 0
      );


    setCart(updated);

  };


  /* ========================================
     REMOVE ITEM
  ======================================== */

  const removeItem = (id) => {

    setCart(

      cart.filter(
        item => item.id !== id
      )

    );

  };


  /* ========================================
     TOTAL
  ======================================== */

  const total = cart.reduce(

    (sum, item) =>

      sum +
      Number(item.price) *
      item.quantity,

    0

  );


  const totalItems = cart.reduce(

    (sum, item) =>

      sum + item.quantity,

    0

  );


  /* ========================================
     CHECKOUT
  ======================================== */

  const checkout = async () => {

    if (checkingOut) {
      return;
    }


    if (cart.length === 0) {

      toast.error(
        "Cart is empty."
      );

      return;

    }


    try {

      setCheckingOut(true);


      /* Check stock */

      for (const item of cart) {

        const product =
          products.find(
            p => p.id === item.id
          );


        if (
          !product ||
          product.quantity <
            item.quantity
        ) {

          toast.error(
            `${item.name} is out of stock`
          );

          setCheckingOut(false);

          return;

        }

      }


      /* Invoice */

      const invoice =
        "INV-" + Date.now();


      /* Save sale */

      await addSale({

        invoice: invoice,

        customerName:
          customerName.trim(),

        items: cart,

        total: total,

        status: "completed",

        date: serverTimestamp(),

      });


      /* Update product stock */

      for (const item of cart) {

        const product =
          products.find(
            p => p.id === item.id
          );


        if (product) {

          await updateProduct(

            product.id,

            {

              name: product.name,

              price: product.price,

              quantity:
                product.quantity -
                item.quantity,

              category:
                product.category,

            }

          );

        }

      }


      toast.success(
        "Sale completed successfully!"
      );


      setCart([]);

      setCustomerName("");

      await loadProducts();


    } catch (error) {

      console.error(error);

      toast.error(
        "Checkout failed"
      );

    } finally {

      setCheckingOut(false);

    }

  };


  /* ========================================
     FILTER
  ======================================== */

  const filteredProducts =
    products.filter(product => {

      const matchName =

        product.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );


      const matchCategory =

        category === "All"

          ||

        product.category ===
          category;


      return (
        matchName &&
        matchCategory
      );

    });


  /* ========================================
     RENDER
  ======================================== */

  return (

    <div className="pos-page">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="pos-header">

        <div>

          <h1>
            POS Sales
          </h1>

          <p>
            Create a new sales transaction
          </p>

        </div>


        <div className="pos-header-cart">

          <ShoppingBag size={18} />

          <span>
            {totalItems} items
          </span>

        </div>

      </div>


      {/* ==================================
          POS LAYOUT
      ================================== */}

      <div className="pos-layout">


        {/* =================================
            PRODUCTS
        ================================= */}

        <section className="pos-products">


          <div className="pos-section-header">

            <div>

              <h2>
                Products
              </h2>

              <span>
                {filteredProducts.length}
                {" "}products available
              </span>

            </div>


            <div className="pos-filter">

              <div className="pos-search">

                <FaSearch />

                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>


              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All Categories
                </option>


                {categories.map(cat => (

                  <option
                    key={cat.id}
                    value={cat.name}
                  >

                    {cat.name}

                  </option>

                ))}

              </select>

            </div>

          </div>


          {/* Product Grid */}

          {loading ? (

            <div className="pos-empty">

              Loading products...

            </div>

          ) : filteredProducts.length === 0 ? (

            <div className="pos-empty">

              <Package size={40} />

              <h3>
                No products found
              </h3>

              <p>
                Try another search or category.
              </p>

            </div>

          ) : (

            <div className="pos-product-grid">

              {filteredProducts.map(
                product => {

                  const outOfStock =
                    product.quantity <= 0;


                  return (

                    <button
                      key={product.id}
                      type="button"
                      className={
                        `pos-product-card ${
                          outOfStock
                            ? "out-of-stock"
                            : ""
                        }`
                      }
                      onClick={() =>
                        addToCart(product)
                      }
                      disabled={outOfStock}
                    >

                      <div className="pos-product-icon">

                        <Package />

                      </div>


                      <div className="pos-product-info">

                        <strong>
                          {product.name}
                        </strong>

                        <span>
                          {product.category ||
                            "General"}
                        </span>

                      </div>


                      <div className="pos-product-bottom">

                        <strong>
                          $
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </strong>


                        <span
                          className={
                            product.quantity <= 5
                              ? "low-stock"
                              : ""
                          }
                        >
                          {outOfStock
                            ? "Out of stock"
                            : `${product.quantity} in stock`}
                        </span>

                      </div>

                    </button>

                  );

                }

              )}

            </div>

          )}

        </section>


        {/* =================================
            CART
        ================================= */}

        <aside className="pos-cart">


          {/* Cart Header */}

          <div className="pos-cart-header">

            <div>

              <h2>
                Current Order
              </h2>

              <span>
                {totalItems} items
              </span>

            </div>


            <div className="cart-icon">

              <FaShoppingCart />

            </div>

          </div>


          {/* Customer */}

          <div className="pos-customer">

            <label>
              Customer
            </label>

            <div className="pos-customer-input">

              <FaUser />

              <input
                type="text"
                placeholder="Walk-in Customer"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* Cart Items */}

          <div className="pos-cart-items">


            {cart.length === 0 ? (

              <div className="empty-cart">

                <ShoppingBag size={42} />

                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Select products to add them
                  to your order.
                </p>

              </div>

            ) : (

              cart.map(item => (

                <div
                  className="cart-item"
                  key={item.id}
                >


                  <div className="cart-item-main">

                    <div className="cart-item-icon">

                      <Package />

                    </div>


                    <div>

                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        $
                        {Number(
                          item.price
                        ).toFixed(2)}
                        {" "}each
                      </span>

                    </div>

                  </div>


                  <div className="cart-item-bottom">


                    <div className="quantity-control">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQty(
                            item.id
                          )
                        }
                      >

                        <Minus size={14} />

                      </button>


                      <span>
                        {item.quantity}
                      </span>


                      <button
                        type="button"
                        onClick={() =>
                          increaseQty(
                            item.id
                          )
                        }
                      >

                        <Plus size={14} />

                      </button>

                    </div>


                    <strong>

                      $
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toFixed(2)}

                    </strong>


                    <button
                      type="button"
                      className="remove-cart-item"
                      title="Remove item"
                      onClick={() =>
                        removeItem(
                          item.id
                        )
                      }
                    >

                      <Trash2 size={16} />

                    </button>

                  </div>

                </div>

              ))

            )}

          </div>


          {/* Summary */}

          <div className="pos-summary">

            <div>

              <span>
                Subtotal
              </span>

              <strong>
                ${total.toFixed(2)}
              </strong>

            </div>


            <div>

              <span>
                Tax
              </span>

              <strong>
                $0.00
              </strong>

            </div>


            <div className="pos-total">

              <span>
                Total
              </span>

              <strong>
                ${total.toFixed(2)}
              </strong>

            </div>

          </div>


          {/* Checkout */}

          <button
            type="button"
            className="checkout-btn"
            onClick={checkout}
            disabled={
              cart.length === 0 ||
              checkingOut
            }
          >

            <CreditCard size={19} />

            {checkingOut
              ? "Processing..."
              : "Complete Checkout"}

          </button>


        </aside>


      </div>

    </div>

  );

}


export default POS;