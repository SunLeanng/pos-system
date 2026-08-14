import { useEffect, useState } from "react";

import {
  Package,
  FolderOpen,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  Receipt,
} from "lucide-react";

import { FaFileInvoiceDollar } from "react-icons/fa";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  getProductCount,
  getCategoryCount,
  getUserCount,
  getSalesData,
} from "../../services/dashboardService";

import { listenToSales } from "../../services/salesService";


function Dashboard() {

  const [products, setProducts] = useState(0);
  const [categories, setCategories] = useState(0);
  const [users, setUsers] = useState(0);
  const [sales, setSales] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const [recentSales, setRecentSales] = useState([]);
  const [salesChart, setSalesChart] = useState([]);


  /* ========================================
     STATIC SALES STATUS DATA
  ======================================== */

  const statusData = [
    {
      name: "Completed",
      value: 80,
      color: "#22C55E",
    },
    {
      name: "Pending",
      value: 10,
      color: "#F59E0B",
    },
    {
      name: "Cancelled",
      value: 10,
      color: "#EF4444",
    },
  ];


  /* ========================================
     LOAD DASHBOARD DATA
  ======================================== */

  useEffect(() => {

    loadDashboard();


    const unsubscribe = listenToSales((data) => {

      /* ========================================
         RECENT SALES
      ======================================== */

      setRecentSales(data.slice(0, 5));


      /* ========================================
         DAILY SALES GRAPH

         Multiple sales on the same day
         are combined together.
      ======================================== */

      const dailySales = {};


      data.forEach((sale) => {

        let saleDate;


        try {

          /* Firestore Timestamp */

          if (sale.date?.toDate) {

            saleDate = sale.date.toDate();

          }


          /* JavaScript Date / String */

          else if (sale.date) {

            saleDate = new Date(sale.date);

          }


          /* Invalid date */

          if (
            !saleDate ||
            isNaN(saleDate.getTime())
          ) {

            return;

          }


          /* Create date key */

          const dateKey = [

            saleDate.getFullYear(),

            String(
              saleDate.getMonth() + 1
            ).padStart(2, "0"),

            String(
              saleDate.getDate()
            ).padStart(2, "0"),

          ].join("-");


          /* Sale amount */

          const saleAmount =
            Number(sale.total || 0);


          /* Add to daily total */

          if (!dailySales[dateKey]) {

            dailySales[dateKey] = 0;

          }


          dailySales[dateKey] += saleAmount;


        } catch (error) {

          console.error(
            "Graph date error:",
            error
          );

        }

      });


      /* ========================================
         CONVERT DAILY SALES TO CHART DATA
      ======================================== */

      const chartData = Object.entries(
        dailySales
      )

        .sort(([dateA], [dateB]) => {

          return (
            new Date(dateA) -
            new Date(dateB)
          );

        })

        .slice(-7)

        .map(([date, total]) => {

          const dateObject =
            new Date(`${date}T00:00:00`);


          return {

            date:
              dateObject.toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                }
              ),

            revenue:
              Number(total.toFixed(2)),

          };

        });


      setSalesChart(chartData);

    });


    return () => unsubscribe();

  }, []);


  /* ========================================
     GET DASHBOARD DATA
  ======================================== */

  const loadDashboard = async () => {

    try {

      const productTotal =
        await getProductCount();


      const categoryTotal =
        await getCategoryCount();


      const userTotal =
        await getUserCount();


      const salesData =
        await getSalesData();


      setProducts(productTotal);

      setCategories(categoryTotal);

      setUsers(userTotal);

      setSales(salesData.count);

      setRevenue(salesData.revenue);


    } catch (error) {

      console.error(
        "Dashboard error:",
        error
      );

    }

  };


  /* ========================================
     FORMAT MONEY
  ======================================== */

  const formatMoney = (amount) => {

    return `$${Number(
      amount || 0
    ).toFixed(2)}`;

  };


  /* ========================================
     FORMAT DATE
  ======================================== */

  const formatDate = (date) => {

    if (!date) {

      return "N/A";

    }


    try {

      if (date?.toDate) {

        return date
          .toDate()
          .toLocaleDateString();

      }


      return new Date(date)
        .toLocaleDateString();


    } catch {

      return "N/A";

    }

  };


  return (

    <div className="dashboard-content">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="dashboard-header">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Here's what's happening with your store today.
          </p>

        </div>


        <div className="dashboard-date">

          <Receipt />

          <span>
            Sales Overview
          </span>

        </div>

      </div>



      {/* ==================================
          STATISTICS
      ================================== */}

      <div className="dashboard-cards">


        {/* PRODUCTS */}

        <div className="stat-card product-card">

          <div className="stat-card-top">

            <div className="stat-icon blue">

              <Package />

            </div>


            <div className="stat-arrow">

              <ArrowUpRight />

            </div>

          </div>


          <div className="stat-card-info">

            <span>
              Total Products
            </span>

            <h2>
              {products}
            </h2>

          </div>

        </div>



        {/* CATEGORIES */}

        <div className="stat-card category-card">

          <div className="stat-card-top">

            <div className="stat-icon purple">

              <FolderOpen />

            </div>


            <div className="stat-arrow">

              <ArrowUpRight />

            </div>

          </div>


          <div className="stat-card-info">

            <span>
              Total Categories
            </span>

            <h2>
              {categories}
            </h2>

          </div>

        </div>



        {/* SALES */}

        <div className="stat-card sales-card">

          <div className="stat-card-top">

            <div className="stat-icon orange">

              <ShoppingCart />

            </div>


            <div className="stat-arrow">

              <ArrowUpRight />

            </div>

          </div>


          <div className="stat-card-info">

            <span>
              Total Sales
            </span>

            <h2>
              {sales}
            </h2>

          </div>

        </div>



        {/* REVENUE */}

        <div className="stat-card revenue-card">

          <div className="stat-card-top">

            <div className="stat-icon green">

              <DollarSign />

            </div>


            <div className="stat-arrow">

              <ArrowUpRight />

            </div>

          </div>


          <div className="stat-card-info">

            <span>
              Total Revenue
            </span>

            <h2>
              {formatMoney(revenue)}
            </h2>

          </div>

        </div>

      </div>



      {/* ==================================
          GRAPH + SALES STATUS
      ================================== */}

      <div className="dashboard-graph-row">


        {/* ==================================
            SALES GRAPH
        ================================== */}

        <div className="dashboard-panel sales-chart-panel">


          <div className="panel-header">

            <div>

              <h2>
                Sales Overview
              </h2>

              <p>
                Daily revenue from your latest sales
              </p>

            </div>


            <div className="panel-icon">

              <DollarSign />

            </div>

          </div>



          <div
            className="sales-chart"
            style={{
              width: "100%",
              height: "320px",
              paddingTop: "10px",
            }}
          >


            {salesChart.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={salesChart}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 5,
                  }}
                >


                  <defs>

                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#2563EB"
                        stopOpacity={0.30}
                      />

                      <stop
                        offset="100%"
                        stopColor="#2563EB"
                        stopOpacity={0.03}
                      />

                    </linearGradient>

                  </defs>



                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />



                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748B",
                      fontSize: 12,
                    }}
                  />



                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748B",
                      fontSize: 12,
                    }}
                    tickFormatter={(value) =>
                      `$${value}`
                    }
                  />



                  <Tooltip

                    formatter={(value) => [

                      `$${Number(
                        value
                      ).toFixed(2)}`,

                      "Daily Revenue",

                    ]}

                    labelFormatter={(label) =>
                      `Date: ${label}`
                    }

                    contentStyle={{
                      backgroundColor:
                        "#ffffff",

                      border: "none",

                      borderRadius:
                        "10px",

                      boxShadow:
                        "0 8px 25px rgba(0,0,0,0.12)",

                      padding:
                        "10px 14px",
                    }}

                    labelStyle={{
                      color: "#334155",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}

                  />



                  <Area

                    type="monotone"

                    dataKey="revenue"

                    stroke="#2563EB"

                    strokeWidth={3}

                    fill="url(#salesGradient)"

                    dot={{
                      r: 4,
                      fill: "#2563EB",
                      strokeWidth: 0,
                    }}

                    activeDot={{
                      r: 6,
                      fill: "#2563EB",
                    }}

                  />


                </AreaChart>

              </ResponsiveContainer>

            ) : (

              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94A3B8",
                }}
              >

                <div
                  style={{
                    textAlign: "center",
                  }}
                >

                  <Receipt
                    size={40}
                    style={{
                      marginBottom: "10px",
                    }}
                  />

                  <p>
                    No sales data available
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>



        {/* ==================================
            STATIC SALES STATUS
        ================================== */}

        <div className="dashboard-panel sales-status-panel">


          <div className="panel-header">

            <div>

              <h2>
                Sales Status
              </h2>

              <p>
                Overview of sales status
              </p>

            </div>


            <div className="panel-icon">

              <ShoppingCart />

            </div>

          </div>



          <div className="status-chart-container">


            {/* DONUT */}

            <div className="status-donut">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie

                    data={statusData}

                    cx="50%"

                    cy="50%"

                    innerRadius={62}

                    outerRadius={88}

                    paddingAngle={3}

                    dataKey="value"

                    stroke="none"

                  >

                    {statusData.map(
                      (entry, index) => (

                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />

                      )
                    )}

                  </Pie>

                </PieChart>

              </ResponsiveContainer>



              <div className="status-donut-center">

                <strong>
                  100%
                </strong>

                <span>
                  Total
                </span>

              </div>

            </div>



            {/* STATUS LIST */}

            <div className="status-list">

              {statusData.map((item) => (

                <div
                  className="status-item"
                  key={item.name}
                >

                  <div className="status-item-left">

                    <span
                      className="status-circle"
                      style={{
                        backgroundColor:
                          item.color,
                      }}
                    ></span>

                    <span>
                      {item.name}
                    </span>

                  </div>


                  <strong>
                    {item.value}%
                  </strong>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>



      {/* ==================================
          SECOND ROW
      ================================== */}

      <div className="dashboard-bottom">


        {/* ==================================
            RECENT SALES
        ================================== */}

        <div className="dashboard-panel recent-sales-panel">


          <div className="panel-header">

            <div>

              <h2>
                Recent Sales
              </h2>

              <p>
                Latest transactions from your store
              </p>

            </div>


            <div className="panel-icon">

              <ShoppingCart />

            </div>

          </div>



          <div className="table-container">

            <table className="dashboard-table">


              <thead>

                <tr>

                  <th>
                    Invoice
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>



              <tbody>

                {recentSales.length > 0 ? (

                  recentSales.map((sale) => (

                    <tr key={sale.id}>


                      {/* INVOICE */}

                      <td>

                        <div className="invoice-cell">

                          <FaFileInvoiceDollar />

                          <strong>
                            {sale.invoice ||
                              "N/A"}
                          </strong>

                        </div>

                      </td>



                      {/* CUSTOMER */}

                      <td>

                        <div className="customer-cell">

                          <div className="customer-avatar">

                            {(
                              sale.customerName ||
                              "Walk-in Customer"
                            )
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <span>

                            {sale.customerName ||
                              "Walk-in Customer"}

                          </span>

                        </div>

                      </td>



                      {/* TOTAL */}

                      <td>

                        <strong
                          className="sale-total"
                        >

                          {formatMoney(
                            sale.total
                          )}

                        </strong>

                      </td>



                      {/* DATE */}

                      <td>

                        <span
                          className="sale-date"
                        >

                          {formatDate(
                            sale.date
                          )}

                        </span>

                      </td>



                      {/* STATUS */}

                      <td>

                        <span className="status-badge">

                          {sale.status ||
                            "completed"}

                        </span>

                      </td>


                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="empty-sales"
                    >

                      <Receipt />

                      <span>
                        No sales yet
                      </span>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>



        {/* ==================================
            USERS OVERVIEW
        ================================== */}

        <div className="dashboard-panel users-panel">


          <div className="panel-header">

            <div>

              <h2>
                Users
              </h2>

              <p>
                System users
              </p>

            </div>


            <div className="panel-icon">

              <Users />

            </div>

          </div>



          <div className="users-overview">


            <div className="users-icon-large">

              <Users />

            </div>


            <h3>
              {users}
            </h3>


            <span>
              Registered Users
            </span>


            <div className="users-status">

              <span className="status-dot"></span>

              System Active

            </div>

          </div>

        </div>


      </div>


    </div>

  );

}


export default Dashboard;