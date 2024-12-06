import React from 'react'

export default function Hero() {
    // Hero component is the first page that guest sees. Main purpose of this page is to tell guest what app is about.
    // Another purpose is to try to get guest to become users.  
    return (
        <>
            <h1>Coffee Tracking for Coffee Addicts</h1>
            <div className="benefits-list">
                <h3 className="font-bolder">Try <span className="text-gradient">Brewly</span> and start today</h3>
                <p>✔️ Track every coffee you drink</p>
                <p>✔️ Measure your caffeine levels</p>
                <p>✔️ Manage your spending</p>
            </div>
            <div className="card info-card">
                <div>
                    <i className="fa-solid fa-circle-info"></i>
                    <h3>Did you know...</h3>
                </div>
                <h5>That caffeine&apos;s half-life is about 5 hours?</h5>
                <p>This means that after 5 hours, half the caffeine you consumed is still in your system, keeping you alert longer! So if you drink a cup of coffee with 200 mg of caffeine, 5 hours, later, you&apos;ll still have about 100 mg of caffeine in your system.</p>
            </div>
        </>
    )
}
