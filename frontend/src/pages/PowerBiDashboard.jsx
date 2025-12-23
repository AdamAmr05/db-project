import React, { useState } from 'react';

const PowerBiDashboard = () => {
    // TODO: User needs to replace this with their actual Embed URL
    const [embedUrl, setEmbedUrl] = useState('');

    // Instructions for the user if URL is missing
    if (!embedUrl) {
        return (
            <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent tracking-tighter">
                            ANALYTICS <span className="text-primary">DASHBOARD</span>
                        </h1>
                        <p className="text-muted mt-2 font-mono text-sm tracking-wide">POWER BI INTEGRATION</p>
                    </div>
                </div>

                <div className="bg-surface border border-border p-8 rounded-lg text-center space-y-6">
                    <div className="w-16 h-16 bg-surfaceHighlight rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-white">Ready to Embed</h2>
                    <p className="text-muted max-w-md mx-auto">
                        To see your dashboard here, paste your Power BI "Publish to Web" URL into the input below.
                    </p>

                    <div className="max-w-xl mx-auto">
                        <input
                            type="text"
                            placeholder="Paste your https://app.powerbi.com/... link here"
                            className="w-full bg-background border border-border text-primary px-4 py-3 rounded focus:border-accent focus:outline-none font-mono text-sm"
                            onChange={(e) => setEmbedUrl(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent tracking-tighter">
                        ANALYTICS <span className="text-white">DASHBOARD</span>
                    </h1>
                    <p className="text-muted mt-2 font-mono text-sm tracking-wide">POWER BI INTEGRATION</p>
                </div>
            </div>

            <div className="flex-1 bg-surface border border-border rounded-lg overflow-hidden relative group">
                {/* Cyber decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-accent z-10" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-accent z-10" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-accent z-10" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-accent z-10" />

                <iframe
                    title="Power BI Dashboard"
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    frameBorder="0"
                    allowFullScreen={true}
                    className="w-full h-full"
                />
            </div>
        </div>
    );
};

export default PowerBiDashboard;
