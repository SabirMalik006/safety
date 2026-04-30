import { useState, useEffect } from 'react';
import { 
  FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiArrowUp, 
  FiArrowDown, FiBox, FiTrendingUp, FiCalendar
} from 'react-icons/fi';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement,
  Filler  // ✅ ADDED - Fixes the "fill" option warning
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { getProducts } from '../../services/productService';
import { getCategories } from '../../services/productService';
import api from '../../services/api';
import './AdminDashboard.css';

// ✅ Register Filler plugin as well
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement,
  Filler  // ✅ ADDED
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    revenueChange: 12.5,
    ordersChange: 8.2,
    productsChange: 5.1,
    usersChange: 15.3
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
        getProducts(),
        getCategories(),
        api.get('/orders').catch(() => ({ data: { data: [] } })),
        api.get('/users').catch(() => ({ data: { data: [] } }))
      ]);

      const products = productsRes.data || [];
      const orders = ordersRes.data?.data || [];
      const users = usersRes.data?.data || [];

      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: totalRevenue,
        revenueChange: 12.5,
        ordersChange: 8.2,
        productsChange: 5.1,
        usersChange: 15.3
      });

      setRecentOrders(orders.slice(0, 5));
      setTopProducts(products.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed: Added proper chart options to prevent errors
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        titleColor: '#c4a47a'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f0f0f0' },
        ticks: { callback: (value) => `Rs.${value.toLocaleString()}` }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { font: { size: 10 } }
      }
    }
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Revenue (Rs.)',
      data: [125000, 150000, 180000, 220000, 280000, 350000, 420000, 480000, 520000, 580000, 620000, 680000],
      borderColor: '#c4a47a',
      backgroundColor: 'rgba(196, 164, 122, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: '#c4a47a',
      pointBorderColor: '#fff',
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.4,
    }]
  };

  const categoryData = {
    labels: ['Safety', 'Tools', 'Lighting', 'Storage', 'Gadgets', 'Power', 'Essentials'],
    datasets: [{
      data: [35, 25, 15, 10, 8, 5, 2],
      backgroundColor: ['#c4a47a', '#2c3e50', '#e74c3c', '#27ae60', '#f39c12', '#3498db', '#9b59b6'],
      borderWidth: 0,
    }]
  };

  const StatCard = ({ title, value, icon, change, changeType }) => (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h3>{typeof value === 'number' ? value.toLocaleString() : value}</h3>
        <p>{title}</p>
        {change && (
          <span className={`stat-change ${changeType}`}>
            {changeType === 'up' ? <FiArrowUp /> : <FiArrowDown />} {change}%
          </span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="date-range">
          <FiCalendar />
          <span>Last 30 days</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Total Revenue" 
          value={stats.totalRevenue} 
          icon={<FiDollarSign />}
          change={stats.revenueChange}
          changeType="up"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={<FiShoppingBag />}
          change={stats.ordersChange}
          changeType="up"
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={<FiPackage />}
          change={stats.productsChange}
          changeType="up"
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<FiUsers />}
          change={stats.usersChange}
          changeType="up"
        />
      </div>

      <div className="charts-row">
        <div className="chart-card revenue-chart">
          <div className="chart-header">
            <h3>Revenue Overview</h3>
            <select>
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <Line data={revenueData} options={chartOptions} />
        </div>
        
        <div className="chart-card category-chart">
          <div className="chart-header">
            <h3>Category Distribution</h3>
          </div>
          <Doughnut data={categoryData} options={doughnutOptions} />
        </div>
      </div>

      <div className="tables-row">
        <div className="data-table recent-orders">
          <div className="table-header">
            <h3>Recent Orders</h3>
            <button className="view-all" onClick={() => window.location.href = '/admin/orders'}>View All</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id?.slice(-6)}</td>
                  <td>{order.user?.name || 'Guest'}</td>
                  <td>Rs.{order.totalPrice?.toLocaleString()}</td>
                  <td><span className={`status-badge ${order.orderStatus}`}>{order.orderStatus}</span></td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && <tr><td colSpan="5">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="data-table top-products">
          <div className="table-header">
            <h3>Top Products</h3>
          </div>
          <div className="product-list">
            {topProducts.map((product, idx) => (
              <div key={product._id} className="top-product-item">
                <span className="product-rank">#{idx + 1}</span>
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-sales">Popular item</span>
                </div>
                <span className="product-revenue">Rs.{product.price?.toLocaleString()}</span>
              </div>
            ))}
            {topProducts.length === 0 && <div className="empty-state">No products yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}