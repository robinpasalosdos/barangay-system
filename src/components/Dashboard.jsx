import React, { useContext, useState, useEffect } from "react";
import { MainContext } from "../context/MainContext";
import { FaUsers, FaFileAlt, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
    const { user } = useContext(MainContext);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const chartColors = {
        primary: '#FB991C',
        secondary: '#022539',
        accent: '#1C768F',
        background: '#FBF3F2'
    };

    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Police Clearance Requests',
                data: [65, 59, 80, 81, 56, 55],
                fill: true,
                borderColor: chartColors.primary,
                backgroundColor: 'rgba(251, 153, 28, 0.1)',
                tension: 0.4,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: chartColors.primary,
            },
        ],
    };

    const doughnutData = {
        labels: ['Resolved', 'Pending', 'In Progress'],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: [
                    chartColors.primary,
                    chartColors.secondary,
                    chartColors.accent,
                ],
                borderColor: chartColors.background,
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: chartColors.background, // Changed to light color for dark background
                    font: {
                        family: 'Plus Jakarta Sans',
                        size: 12
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(251, 243, 242, 0.1)', // Lighter grid lines
                },
                ticks: {
                    color: chartColors.background, // Changed to light color for dark background
                    font: {
                        family: 'Plus Jakarta Sans',
                        size: 12
                    }
                }
            },
            x: {
                grid: {
                    color: 'rgba(251, 243, 242, 0.1)', // Lighter grid lines
                },
                ticks: {
                    color: chartColors.background, // Changed to light color for dark background
                    font: {
                        family: 'Plus Jakarta Sans',
                        size: 12
                    }
                }
            }
        }
    };
    
    const doughnutOptions = {
        ...chartOptions,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: chartColors.background, // Changed to light color for dark background
                    font: {
                        family: 'Plus Jakarta Sans',
                        size: 12
                    },
                    padding: 20
                }
            }
        }
    };

    return (
        <div className="dashboard-container content">
            <div className="welcome-section">
                <div className="welcome-header">
                    <h1>Welcome back, {user?.username}!</h1>
                    <p className="current-time">
                        {currentTime.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FaUsers size={24} />
                    </div>
                    <div className="stat-details">
                        <h3>Total Residents</h3>
                        <p className="stat-number">2,547</p>
                        <span className="stat-change positive">+12% from last month</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FaFileAlt size={24} />
                    </div>
                    <div className="stat-details">
                        <h3>Clearance Requests</h3>
                        <p className="stat-number">156</p>
                        <span className="stat-change">Active requests</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FaShieldAlt size={24} />
                    </div>
                    <div className="stat-details">
                        <h3>Police Reports</h3>
                        <p className="stat-number">89</p>
                        <span className="stat-change negative">-5% from last month</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FaExclamationTriangle size={24} />
                    </div>
                    <div className="stat-details">
                        <h3>Pending Cases</h3>
                        <p className="stat-number">24</p>
                        <span className="stat-change">Requires attention</span>
                    </div>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-card">
                    <h3>Monthly Clearance Requests</h3>
                    <Line data={lineChartData} options={chartOptions} />
                </div>

                <div className="chart-card">
                    <h3>Case Status Overview</h3>
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;