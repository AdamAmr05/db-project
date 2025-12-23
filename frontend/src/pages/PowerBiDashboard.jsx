import React from 'react';

const PowerBiDashboard = () => {
    // Power BI Embedded Demo URL from the Playground
    // Added parameters to help with sizing
    const embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=86aa4ca9-96e5-46b9-bef9-b6c131e71662&autoAuth=true&embeddedDemo=true';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent tracking-tighter">
                        ANALYTICS <span className="text-primary">DASHBOARD</span>
                    </h1>
                    <p className="text-muted mt-2 font-mono text-sm tracking-wide">POWER BI INTEGRATION</p>
                </div>
            </div>

            <div
                className="bg-surface border border-border rounded-lg overflow-hidden relative"
                style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}
            >
                {/* Cyber decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-accent z-10" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-accent z-10" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-accent z-10" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-accent z-10" />

                <iframe
                    title="DB_Project_Powerbi Finallllllll"
                    src={embedUrl}
                    frameBorder="0"
                    allowFullScreen={true}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none'
                    }}
                />
            </div>
        </div>
    );
};

export default PowerBiDashboard;
