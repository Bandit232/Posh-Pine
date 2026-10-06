import React from "react";

export default function AdminOrders({ orders, loading, error, onLogout, onChangeStatus }) {
  return (
    <section className="admin-orders section">
      <div className="container" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="section-head">
          <h2>Admin Orders</h2>
          <p>Only admins can see this list. Review orders and manage status in the backend.</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <strong>Total orders:</strong> {orders?.length ?? 0}
          </div>
          <button className="btn" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : orders && orders.length ? (
          <div className="order-table" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} style={{ borderBottom: "1px solid #eee" }}>
                    <td>{order._id.slice(-8)}</td>
                    <td>{order.shipping?.name}</td>
                    <td>{order.shipping?.phone}</td>
                    <td>{order.shipping?.city}</td>
                    <td>Tk{order.total}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => onChangeStatus(order._id, e.target.value)}
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Packed</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </section>
  );
}
