import React from 'react'
import { calculateCurrentCaffeineLevel, coffeeConsumptionHistory, getCaffeineAmount, timeSinceConsumption } from '../utils'
import { useAuth } from '../context/AuthContext'

export default function History() {
    const {globalData} = useAuth()

    return (
        <>
            <div className="section-header">
                <i className="fa-solid fa-timeline"></i>
                <h2>History</h2>
            </div>
            <p><i>Hover for more information</i></p>
            <div className="coffee-history">
                {/* if b - a is positive, sort one way, if negative, sort the other way */}
                {/* ordered from newest to oldest */}
                {Object.keys(globalData).sort((a, b) => b - a).map((utcTime, coffeeIndex) => {
                    const coffee = globalData[utcTime]
                    const timeSinceConsume = timeSinceConsumption(utcTime)
                    const originalAmount = getCaffeineAmount(coffee.name)
                    const remainingAmount = calculateCurrentCaffeineLevel({
                        [utcTime] : coffee
                    })

                    // summary string shows name of coffee, when we consumed it, cost of coffee, and how much is left vs how much we started with
                    const summary = `${coffee.name} | ${timeSinceConsume} | $${coffee.cost} | ${remainingAmount} mg / ${originalAmount} mg`

                    return(
                        <div title={summary} key={coffeeIndex}>
                            <i className="fa-solid fa-mug-hot"></i>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
