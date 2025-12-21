import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { facultyService } from '../services/facultyService';
import CyberCard from '../components/CyberCard';

const FacultyForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        Faculty_Name: '',
        Location: '',
        Contact_Email: '',
        University_ID: 1 // Default to 1 for now as we don't have University CRUD
    });

    useEffect(() => {
        if (isEdit) {
            loadFaculty();
        }
    }, [id]);

    const loadFaculty = async () => {
        try {
            const response = await facultyService.getById(id);
            setFormData(response.data.data);
        } catch (error) {
            console.error('Failed to load faculty', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await facultyService.update(id, formData);
            } else {
                await facultyService.create(formData);
            }
            navigate('/faculties');
        } catch (error) {
            alert('OPERATION FAILED: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/faculties')} className="hover:text-primary transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-primary tracking-wider">
                    {isEdit ? 'EDIT_FACULTY_RECORD' : 'NEW_FACULTY_ENTRY'}
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                <CyberCard title="Faculty Details">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Faculty Name</label>
                            <input
                                name="Faculty_Name"
                                value={formData.Faculty_Name}
                                onChange={handleChange}
                                className="cyber-input"
                                required
                                placeholder="e.g. Faculty of Engineering"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Location</label>
                            <input
                                name="Location"
                                value={formData.Location || ''}
                                onChange={handleChange}
                                className="cyber-input"
                                placeholder="e.g. Building A, Main Campus"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Contact Email</label>
                            <input
                                type="email"
                                name="Contact_Email"
                                value={formData.Contact_Email || ''}
                                onChange={handleChange}
                                className="cyber-input"
                                placeholder="dean@eng.uni.edu"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
                        <button
                            type="button"
                            onClick={() => navigate('/faculties')}
                            className="cyber-button-outline"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="cyber-button flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'PROCESSING...' : 'SAVE_RECORD'}
                        </button>
                    </div>
                </CyberCard>
            </form>
        </div>
    );
};

export default FacultyForm;
