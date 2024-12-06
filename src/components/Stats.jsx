import React from 'react'
import { calculateCoffeeStats, calculateCurrentCaffeineLevel, coffeeConsumptionHistory, getTopThreeCoffees, statusLevels } from '../utils'
import { useAuth } from '../context/AuthContext'

// We create a component just for this file that we will use repeatedly as a template for the Stats Card
function StatsCard(props) {
    const {lg, title, children} = props

    return(
        // if stat card is large (passed as a prop), span across 2 columns
        <div className={"card stat-card" + (lg ? ' col-span-2' : '')}>
            <h4>{title}</h4>
            {/* children contents are whats displayed between the opening and closing tag of component tag*/}
            {children}
        </div>
    )
}

export default function Stats() {
    // This component handles collecting info from users and displaying it on the screen 

    const {globalData} = useAuth()

    const stats = calculateCoffeeStats(globalData)
    console.log(stats)
    
    const caffeineLevel = calculateCurrentCaffeineLevel(globalData)

    // need to figure out what warning level we are in 
    // use nested if statements, if caffeineLevel < statusLevels['low'].maxLevel, then caffeineLevel is low
    // else, if caffeineLevel < statusLevels['moderate'].maxLevel, then caffeineLevel is moderate, if not true, then caffeineLevel is high
    const warningLevel = caffeineLevel < statusLevels['low'].maxLevel ? 
        'low' : 
        caffeineLevel < statusLevels['moderate'].maxLevel ? 
            'moderate' : 
            'high'

    return (
        <>
            <div className="section-header">
                <i className="fa-solid fa-chart-simple"></i>
                <h2>Stats</h2>
            </div>
            <div className="stats-grid">
                <StatsCard lg title="Active Caffeine Level">
                    <div className="status">
                        <p>
                            <span className="stat-text">{caffeineLevel}</span> mg
                        </p>
                        {/* do not use inline styling regularly, only using it for this specific case b/c styling is dependent on current caffeine level */}
                        {/* temporarily hard coding for now to display text */}
                        <h5 style={{color: statusLevels[warningLevel].color, background: statusLevels[warningLevel].background}}>{warningLevel}</h5>
                    </div>
                    <p>{statusLevels[warningLevel].description}</p>
                </StatsCard>
                <StatsCard title="Daily Caffeine">
                    <p>
                        <span className="stat-text">{stats.daily_caffeine}</span> mg
                    </p>
                </StatsCard>
                <StatsCard title="Average Amount of Coffee">
                    <p>
                        <span className="stat-text">{stats.average_coffees}</span> cups
                    </p>
                </StatsCard>
                <StatsCard title="Daily Cost ($)">
                    <p>
                        $ <span className="stat-text">{stats.daily_cost}</span> 
                    </p>
                </StatsCard>
                <StatsCard title="Total Cost ($)">
                    <p>
                        $ <span className="stat-text">{stats.total_cost}</span> 
                    </p>
                </StatsCard>
                <table className="stat-table">
                    {/* thead is label for each column */}
                    <thead>
                        <tr>
                            <th>Coffee Name</th>
                            <th>Number of Purchases</th>
                            <th>Percentage of Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getTopThreeCoffees(globalData).map((coffee, coffeeIndex) => {
                            return(
                                <tr key={coffeeIndex}>
                                    <td>{coffee.coffeeName}</td>
                                    <td>{coffee.count}</td>
                                    <td>{coffee.percentage}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}
