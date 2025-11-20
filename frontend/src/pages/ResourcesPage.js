import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resourceAPI } from '../api/api';
import '../styles/ResourcesPage.css';

const ResourcesPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        file_url: '',
    });

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const response = await resourceAPI.getAllResources();
            setResources(response.data || []);
            setError('');
        } catch (err) {
            setError('Failed to load resources');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            await resourceAPI.createResource(formData);
            setFormData({
                title: '',
                description: '',
                category: '',
                file_url: '',
            });
            setShowForm(false);
            fetchResources();
            setError('');
        } catch (err) {
            setError('Failed to create resource');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await resourceAPI.deleteResource(id);
                fetchResources();
            } catch (err) {
                setError('Failed to delete resource');
                console.error(err);
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const goToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="resources-container">
            <header className="resources-header">
                <div className="header-content">
                    <div className="header-left">
                        <button className="back-button" onClick={goToDashboard}>
                            ← Dashboard
                        </button>
                        <h1 className="header-title">Resources</h1>
                    </div>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="resources-main">
                <div className="resources-controls">
                    <button
                        className="add-button"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '✕ Cancel' : '+ Add Resource'}
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {showForm && (
                    <div className="resource-form-container">
                        <form className="resource-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="title">Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Resource title"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Resource description"
                                    disabled={loading}
                                    rows="4"
                                    required
                                ></textarea>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="category">Category</label>
                                    <input
                                        type="text"
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        placeholder="e.g., PDF, Video, etc."
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="file_url">File URL</label>
                                    <input
                                        type="url"
                                        id="file_url"
                                        name="file_url"
                                        value={formData.file_url}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/file"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Resource'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="resources-list">
                    {loading && !showForm && (
                        <div className="loader-container">
                            <div className="loader"></div>
                        </div>
                    )}

                    {!loading && resources.length === 0 && (
                        <div className="empty-state">
                            <p>No resources found. Create one to get started!</p>
                        </div>
                    )}

                    {resources.map((resource) => (
                        <div key={resource.id} className="resource-card">
                            <div className="resource-header">
                                <h3 className="resource-title">{resource.title}</h3>
                                {user?.role === 'teacher' && (
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(resource.id)}
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                            <p className="resource-description">{resource.description}</p>
                            {resource.category && (
                                <span className="resource-category">{resource.category}</span>
                            )}
                            {resource.file_url && (
                                <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="resource-link">
                                    View Resource →
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ResourcesPage;
