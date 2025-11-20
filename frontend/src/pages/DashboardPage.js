import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [initials, setInitials] = useState('');

    useEffect(() => {
        if (user && user.name) {
            const names = user.name.split(' ');
            const initials = names.map(n => n[0]).join('').toUpperCase();
            setInitials(initials);
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1 className="header-title">Campus Connect</h1>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="profile-section">
                    <div className="profile-card">
                        <div className="profile-avatar">{initials}</div>
                        <div className="profile-info">
                            <h2 className="profile-name">{user?.name || 'User'}</h2>
                            <p className="profile-email">{user?.email || 'email@example.com'}</p>
                            <span className="profile-role">{user?.role || 'user'}</span>
                        </div>
                    </div>
                </div>

                <section className="dashboard-section">
                    <h3 className="section-title">Quick Access</h3>
                    <div className="cards-grid">
                        <Link to="/resources" className="dashboard-card">
                            <div className="card-icon">📚</div>
                            <h4 className="card-title">Resources</h4>
                            <p className="card-description">View and manage learning resources</p>
                        </Link>

                        <Link to="/attendance" className="dashboard-card">
                            <div className="card-icon">📋</div>
                            <h4 className="card-title">Attendance</h4>
                            <p className="card-description">Track and manage attendance</p>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DashboardPage;
