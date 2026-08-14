import { useEffect, useState } from "react";
import { FaSearch, FaFileInvoiceDollar } from "react-icons/fa";
import { getSales } from "../../services/salesService";

function SalesHistory() {

    const [sales, setSales] = useState([]);

    const [search, setSearch] = useState("");


    useEffect(() => {

        loadSales();

    }, []);


    const loadSales = async () => {

        try {

            const data = await getSales();

            setSales(data);

        } catch (error) {

            console.log("Failed to load sales:", error);

        }

    };


    const filteredSales = sales.filter((sale) => {

        const invoice =
            sale.invoice?.toLowerCase() || "";

        const customer =
            sale.customerName?.toLowerCase() || "";

        const searchValue =
            search.toLowerCase();

        return (
            invoice.includes(searchValue) ||
            customer.includes(searchValue)
        );

    });


    return (

        <div className="dashboard-content">


            {/* Header */}

            <div className="product-header">

                <div>

                    <h1>
                        Sales History
                    </h1>

                    <p className="page-description">
                        View and manage all completed sales
                    </p>

                </div>

            </div>



            {/* Search */}

            <div className="search-container">

                <FaSearch className="search-icon" />

                <input
                    type="text"
                    placeholder="Search invoice or customer..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>



            {/* Sales Table */}

            <div className="table-container">

                <table className="product-table">

                    <thead>

                        <tr>

                            <th>
                                Invoice
                            </th>

                            <th>
                                Customer
                            </th>

                            <th>
                                Date
                            </th>

                            <th>
                                Items
                            </th>

                            <th>
                                Total
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {filteredSales.length > 0 ? (

                            filteredSales.map((sale) => (

                                <tr key={sale.id}>


                                    {/* Invoice */}

                                    <td>

                                        <div className="invoice-cell">

                                            <FaFileInvoiceDollar />

                                            <strong>
                                                {sale.invoice || "N/A"}
                                            </strong>

                                        </div>

                                    </td>



                                    {/* Customer */}

                                    <td>

                                        {sale.customerName ||
                                            "Walk-in Customer"}

                                    </td>



                                    {/* Date */}

                                    <td>

                                        {sale.date?.toDate

                                            ? sale.date
                                                .toDate()
                                                .toLocaleString()

                                            : "N/A"}

                                    </td>



                                    {/* Items */}

                                    <td>

                                        <div className="sale-items">

                                            {sale.items?.map(
                                                (item, index) => (

                                                    <div
                                                        key={index}
                                                        className="sale-item"
                                                    >

                                                        {item.name}

                                                        <span>
                                                            x {item.quantity}
                                                        </span>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </td>



                                    {/* Total */}

                                    <td>

                                        <strong className="sale-total">

                                            $
                                            {sale.total?.toFixed
                                                ? sale.total.toFixed(2)
                                                : Number(
                                                    sale.total || 0
                                                ).toFixed(2)
                                            }

                                        </strong>

                                    </td>



                                    {/* Status */}

                                    <td>

                                        <span className="status-badge">

                                            {sale.status || "completed"}

                                        </span>

                                    </td>


                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="empty-table"
                                >

                                    No sales found

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


        </div>

    );

}

export default SalesHistory;