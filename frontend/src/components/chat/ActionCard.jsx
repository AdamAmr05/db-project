import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Check, X, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

const ActionCard = ({ element }) => {
    // Guard against null/undefined element
    if (!element?.props) {
        return (
            <Card className="border border-border bg-[var(--surface)] shadow-lg">
                <CardHeader>
                    <CardTitle>Action</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted font-mono">Invalid action data.</p>
                </CardContent>
            </Card>
        );
    }

    const { title, description, fields = [], actionId } = element.props;

    // Local state for field values and UI state
    const [fieldValues, setFieldValues] = useState(() => {
        const initial = {};
        fields.forEach(field => {
            initial[field.key] = field.value ?? '';
        });
        return initial;
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [result, setResult] = useState(null); // { success: boolean, message: string }
    const [openSelect, setOpenSelect] = useState(null); // Track which dropdown is open

    if (isDismissed) {
        return null;
    }

    // Ref for click-outside handling
    const cardRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setOpenSelect(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFieldChange = (key, value) => {
        setFieldValues(prev => ({ ...prev, [key]: value }));
    };

    const handleApprove = async () => {
        setIsSubmitting(true);
        setOpenSelect(null); // Close any open dropdowns
        try {
            // Call the execute API directly
            const response = await fetch(`${API_BASE_URL}/actions/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ actionId, fields: fieldValues })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Action failed');
            }
            setResult({ success: true, message: data.message || 'Action completed successfully!' });
        } catch (error) {
            setResult({ success: false, message: error.message || 'Action failed' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setIsDismissed(true);
    };

    const renderField = (field) => {
        const { key, label, type = 'text', editable = true, options = [] } = field;
        const value = fieldValues[key] ?? '';
        const isReadOnly = !editable;

        const baseInputClass = "w-full bg-surface border border-border rounded px-4 py-2 text-primary text-sm font-mono focus:outline-none focus:border-primary transition-colors";
        const readOnlyClass = "bg-surfaceHighlight text-muted cursor-not-allowed";

        if (type === 'hidden') {
            return null;
        }

        if (type === 'textarea') {
            return (
                <div key={key} className="space-y-1">
                    <label className="block text-xs font-mono text-muted uppercase tracking-wider">{label || key}</label>
                    <textarea
                        value={value}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        disabled={isReadOnly || isSubmitting}
                        rows={3}
                        className={`${baseInputClass} resize-none ${isReadOnly ? readOnlyClass : ''}`}
                    />
                </div>
            );
        }

        if (type === 'select' && options.length > 0) {
            const isOpen = openSelect === key;
            const selectedOption = options.find(opt => opt.value === value);

            return (
                <div key={key} className="space-y-1 relative">
                    <label className="block text-xs font-mono text-muted uppercase tracking-wider">{label || key}</label>
                    <div
                        onClick={() => !isReadOnly && !isSubmitting && setOpenSelect(isOpen ? null : key)}
                        className={`${baseInputClass} cursor-pointer flex justify-between items-center ${isReadOnly ? readOnlyClass : ''}`}
                    >
                        <span className={value ? 'text-primary' : 'text-muted'}>
                            {selectedOption?.label || value || 'SELECT...'}
                        </span>
                        <span className="text-muted">▼</span>
                    </div>
                    {isOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-surface border border-primary/30 rounded-md shadow-lg max-h-40 overflow-y-auto">
                            {options.map((opt, idx) => (
                                <div
                                    key={opt.value}
                                    className={`px-4 py-2 text-xs font-mono text-primary hover:bg-primary/20 cursor-pointer ${idx < options.length - 1 ? 'border-b border-border' : ''}`}
                                    onClick={() => {
                                        handleFieldChange(key, opt.value);
                                        setOpenSelect(null);
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Default: text, number, date inputs
        return (
            <div key={key} className="space-y-1">
                <label className="block text-xs font-mono text-muted uppercase tracking-wider">{label || key}</label>
                <input
                    type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
                    value={value}
                    onChange={(e) => handleFieldChange(key, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                    disabled={isReadOnly || isSubmitting}
                    className={`${baseInputClass} ${isReadOnly ? readOnlyClass : ''}`}
                />
            </div>
        );
    };

    // Show result state
    if (result) {
        return (
            <Card className={`border shadow-lg ${result.success ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                        {result.success ? (
                            <Check className="w-5 h-5 text-green-500" />
                        ) : (
                            <X className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`text-sm font-mono ${result.success ? 'text-green-500' : 'text-red-500'}`}>
                            {result.message}
                        </span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card ref={cardRef} className="border border-primary/30 bg-[var(--surface)] shadow-lg">
            <CardHeader className="border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-wider">
                        ACTION REQUIRED
                    </span>
                </div>
                <CardTitle>{title || 'Confirm Action'}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>

            <CardContent className="space-y-4 py-4">
                {fields.filter(f => f.type !== 'hidden').map(renderField)}
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t border-border">
                <button
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-mono text-muted hover:text-primary border border-border hover:border-primary transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-[var(--primary-inverted)] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4" />
                            Approve
                        </>
                    )}
                </button>
            </CardFooter>
        </Card>
    );
};

export default ActionCard;
