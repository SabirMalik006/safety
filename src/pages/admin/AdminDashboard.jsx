import { useState, useEffect } from 'react';
import { 
  FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiArrowUp, 
  FiArrowDown, FiBox, FiTrendingUp, FiCalendar
} from 'react-icons/fi';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { getProducts, getCategories } from '../../services/productService';
import api from '../../services/api';
import './AdminDashboard.css';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement,
  Filler
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    revenueChange: 0,
    ordersChange: 0,
    productsChange: 0,
    usersChange: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    revenue: { labels: [], datasets: [] },
    categories: { labels: [], datasets: [] }
  });

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
      const categories = categoriesRes.data || [];
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
      setTopProducts(products.sort((a, b) => b.price - a.price).slice(0, 5));

      // Process Revenue Data for Chart
      const monthlyRevenue = new Array(12).fill(0);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      orders.forEach(order => {
        const date = new Date(order.createdAt);
        monthlyRevenue[date.getMonth()] += order.totalPrice || 0;
      });

      const revData = {
        labels: months,
        datasets: [{
          label: 'Revenue (Rs.)',
          data: monthlyRevenue,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#f59e0b',
          pointBorderColor: '#fff',
          pointRadius: 4,
          fill: true,
          tension: 0.4,
        }]
      };

      // Process Category Data
      const catCount = {};
      products.forEach(p => {
        const catName = p.category?.name || 'Uncategorized';
        catCount[catName] = (catCount[catName] || 0) + 1;
      });

      const catData = {
        labels: Object.keys(catCount),
        datasets: [{
          data: Object.values(catCount),
          backgroundColor: ['#f59e0b', '#0f172a', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'],
          borderWidth: 0,
        }]
      };

      setChartData({ revenue: revData, categories: catData });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 11 } } },
      tooltip: { backgroundColor: '#0f172a', titleColor: '#f59e0b' }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { callback: (value) => `Rs.${value >= 1000 ? value/1000 + 'k' : value}` }
      },
      x: { grid: { display: false } }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { font: { size: 10 }, padding: 20 } }
    },
    cutout: '70%'
  };

  const StatCard = ({ title, value, icon, change, changeType }) => (
    <div className="stat-card">
      <div className="stat-icon-circle">{icon}</div>
      <div className="stat-content">
        <p className="stat-label">{title}</p>
        <h3 className="stat-number">{typeof value === 'number' ? `Rs.${value.toLocaleString()}` : value}</h3>
        <div className={`stat-trend ${changeType}`}>
          {changeType === 'up' ? <FiArrowUp /> : <FiArrowDown />}
          <span>{change}% vs last month</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="admin-loading"><div className="spinner"></div><p>Analyzing industrial data...</p></div>;
  }

  return (
    <div className="admin-dashboard-v2">
      <div className="dashboard-top">
        <div className="welcome-msg">
          <h1>Industrial Insights</h1>
          <p>Real-time overview of The Horizon Hub operations.</p>
        </div>
        <div className="date-picker">
          <FiCalendar /> <span>This Month</span>
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
          title="Active Inventory" 
          value={stats.totalProducts} 
          icon={<FiBox />}
          change={stats.productsChange}
          changeType="up"
        />
        <StatCard 
          title="Total Customers" 
          value={stats.totalUsers} 
          icon={<FiUsers />}
          change={stats.usersChange}
          changeType="up"
        />
      </div>

      <div className="charts-layout">
        <div className="chart-card main-chart">
          <div className="chart-info">
            <h3>Revenue Projection</h3>
            <p>Monthly growth and income tracking</p>
          </div>
          <div className="chart-container">
            <Line data={chartData.revenue} options={chartOptions} />
          </div>
        </div>
        
        <div className="chart-card side-chart">
          <div className="chart-info">
            <h3>Inventory Split</h3>
            <p>Product distribution by category</p>
          </div>
          <div className="chart-container">
            <Doughnut data={chartData.categories} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="data-sections">
        <div className="data-card recent-activity">
          <div className="card-top">
            <h3>Recent Shipments</h3>
            <button className="btn-link" onClick={() => window.location.href = '/admin/orders'}>View Logistics</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id?.slice(-6).toUpperCase()}</td>
                    <td>{order.user?.name || 'Guest'}</td>
                    <td>Rs.{order.totalPrice?.toLocaleString()}</td>
                    <td><span className={`status-pill ${order.orderStatus}`}>{order.orderStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="data-card elite-products">
          <div className="card-top">
            <h3>Premium Inventory</h3>
          </div>
          <div className="elite-list">
            {topProducts.map((product) => (
              <div key={product._id} className="elite-item">
                <div className="item-img">
                  <img src={product.images?.[0]?.url || product.image || '/images/placeholder.jpg'} alt="" />
                </div>
                <div className="item-details">
                  <h4>{product.name}</h4>
                  <p>{product.category?.name || 'General'}</p>
                </div>
                <div className="item-price">Rs.{product.price?.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}