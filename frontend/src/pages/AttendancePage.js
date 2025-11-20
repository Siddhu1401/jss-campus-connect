import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { attendanceAPI } from '../api/api';
import '../styles/AttendancePage.css';

const AttendancePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [subjectName, setSubjectName] = useState('');

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const response = await attendanceAPI.getSubjects();
            setSubjects(response.data || []);
            setError('');
        } catch (err) {
            setError('Failed to load subjects');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();

        if (!subjectName.trim()) {
            setError('Please enter a subject name');
            return;
        }

        try {
            setLoading(true);
            await attendanceAPI.addSubject({ subject_name: subjectName });
            setSubjectName('');
            setShowForm(false);
            fetchSubjects();
            setError('');
        } catch (err) {
            setError('Failed to add subject');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceChange = async (subjectId, attended) => {
        try {
            await attendanceAPI.updateAttendance(subjectId, { attended });
            fetchSubjects();
        } catch (err) {
            setError('Failed to update attendance');
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const goToDashboard = () => {
        navigate('/dashboard');
    };

    const calculateAttendancePercentage = () => {
        if (subjects.length === 0) return 0;
        const attended = subjects.filter(s => s.attended).length;
        return Math.round((attended / subjects.length) * 100);
    };

    return (
        <div className="attendance-container">
            <header className="attendance-header">
                <div className="header-content">
                    <div className="header-left">
                        <button className="back-button" onClick={goToDashboard}>
                            ← Dashboard
                        </button>
                        <h1 className="header-title">Attendance</h1>
                    </div>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="attendance-main">
                <div className="attendance-summary">
                    <div className="summary-card">
                        <p className="summary-label">Total Classes</p>
                        <p className="summary-value">{subjects.length}</p>
                    </div>
                    <div className="summary-card">
                        <p className="summary-label">Attendance Rate</p>
                        <p className="summary-value">{calculateAttendancePercentage()}%</p>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="attendance-controls">
                    <button
                        className="add-button"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '✕ Cancel' : '+ Add Subject'}
                    </button>
                </div>

                {showForm && (
                    <form className="subject-form" onSubmit={handleAddSubject}>
                        <div className="form-group">
                            <label htmlFor="subjectName">Subject Name</label>
                            <input
                                type="text"
                                id="subjectName"
                                value={subjectName}
                                onChange={(e) => setSubjectName(e.target.value)}
                                placeholder="Enter subject name"
                                disabled={loading}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Subject'}
                        </button>
                    </form>
                )}

                <div className="subjects-list">
                    {loading && !showForm && (
                        <div className="loader-container">
                            <div className="loader"></div>
                        </div>
                    )}

                    {!loading && subjects.length === 0 && (
                        <div className="empty-state">
                            <p>No subjects found. Add one to track attendance!</p>
                        </div>
                    )}

                    {subjects.map((subject) => (
                        <div key={subject.id} className="subject-card">
                            <div className="subject-content">
                                <h3 className="subject-name">{subject.subject_name}</h3>
                            </div>
                            <div className="subject-actions">
                                <label className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        checked={subject.attended || false}
                                        onChange={(e) =>
                                            handleAttendanceChange(subject.id, e.target.checked)
                                        }
                                        disabled={loading}
                                    />
                                    <span className="checkmark"></span>
                                    <span className="checkbox-label">
                                        {subject.attended ? 'Present' : 'Absent'}
                                    </span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AttendancePage;
