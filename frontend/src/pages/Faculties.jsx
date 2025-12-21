import React, { useEffect, useState } from 'react';
import { Building2, Search, Plus } from 'lucide-react';
import { facultyService } from '../services/facultyService';
import CyberCard from '../components/CyberCard';

const Faculties = () => {
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFaculties();
    }, []);

    const loadFaculties = async () => {
        try {
            const response = await facultyService.getAll();
            setFaculties(response.data.data);
        } catch (error) {
            console.error('Failed to load faculties', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary tracking-wider flex items-center gap-3">
                    <Building2 className="w-6 h-6" /> FACULTY_INDEX
                </h1>
                <button
                    onClick={() => window.location.href = '/faculties/new'}
                    className="cyber-button flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> ADD_FACULTY
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-3 text-center text-muted animate-pulse font-mono">SCANNING_DATABASE...</div>
                ) : faculties.map((faculty) => (
                    <CyberCard key={faculty.Faculty_ID} title={`ID: ${String(faculty.Faculty_ID).padStart(4, '0')}`} className="hover:border-primary transition-colors cursor-pointer">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-primary">{faculty.Faculty_Name}</h3>
                                <p className="text-xs text-muted font-mono mt-1">{faculty.University_Name || 'Unknown University'}</p>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-border">
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-muted">LOCATION</span>
                                    <span className="text-primary text-right">{faculty.Location}</span>
                                </div>
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-muted">CONTACT</span>
                                    <span className="text-primary text-right">{faculty.Contact_Email}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = `/faculties/${faculty.Faculty_ID}`;
                                    }}
                                    className="flex-1 cyber-button-outline text-xs py-2"
                                >
                                    EDIT
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm('DELETE_CONFIRMATION_REQUIRED')) {
                                            facultyService.delete(faculty.Faculty_ID)
                                                .then(() => loadFaculties())
                                                .catch(err => alert(err.message));
                                        }
                                    }}
                                    className="flex-1 cyber-button-outline text-xs py-2 text-red-500 hover:text-red-400 border-red-900/50 hover:border-red-500/50"
                                >
                                    DELETE
                                </button>
                            </div>
                        </div>
                    </CyberCard>
                ))}
            </div>
        </div>
    );
};

export default Faculties;
