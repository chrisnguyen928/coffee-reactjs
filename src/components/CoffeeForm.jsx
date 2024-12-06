import React from 'react'
import Authentication from './Authentication'
import Modal from './Modal'
import {coffeeOptions} from '../utils'
import {useState} from 'react'
import { useAuth } from '../context/AuthContext'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default function CoffeeForm(props) {
    // This component handles the form for tracking Coffee

    const {isAuthenticated} = props
    const [showModal, setShowModal] = useState(false)

    // selectedCoffee is for the first 5 options that guests can select
    // showCoffeeType is for the button that says Other
    const [selectedCoffee, setSelectedCoffee] = useState(null)
    const [showCoffeeType, setShowCoffeeType] = useState(false)
    const [coffeeCost, setCoffeeCost] = useState(0)
    const [hour, setHour] = useState(0)
    const [min, setMin] = useState(0)

    const {globalData, setGlobalData, globalUser} = useAuth()

    async function handleSubmitForm() {
        // if guests try to click "Add Entry" and they're not logged in, authentication window will pop up
        if (!isAuthenticated){
            setShowModal(true)
            return
        }

         // define a guard clause that only submits form if filled out completely
         if (!selectedCoffee) {
            return
        }

        try {
            // create new data object bc we cannot modify original state, so make new object to override old one
            const newGlobalData = {
                // newGlobalData is empty object in case globalData is null 
                ...(globalData || {})
            }

            const nowTime = Date.now()

            // convert time to milliseconds
            const timeToSubtract = (hour * 60 * 60 * 1000) + (min * 60 * 1000)

            // timestamp of when person consumed coffee
            const timestamp = nowTime - timeToSubtract

            const newData = {
                name: selectedCoffee, 
                cost: coffeeCost
            }

            newGlobalData[timestamp] = newData

            console.log(timestamp, selectedCoffee, coffeeCost)

            // update global state 
            setGlobalData(newGlobalData)

            // persist data in Firebase Firestore
            const userRef = doc(db, 'users', globalUser.uid)

            // await operator is used to wait for a Promise and get fulfillment value (can only use in async function)
            // pass in userRef (reference we are writing to), object (timestamp key and associated value), 
            // and secondary argument which is an object defined as merge: true; instead of overwriting exisiting data, merges data with new entry
            const response = await setDoc(userRef, {
                [timestamp]: newData
            }, {merge: true})

            // resets form after submission
            setSelectedCoffee(null)
            setHour(0)
            setMin(0)
            setCoffeeCost(0)
        }
        catch (err) {
            console.log(err.message)
        }
    }

    function handleCloseModal () {
        setShowModal(false)
    }

    return (
        <>
            {showModal && (
                <Modal handleCloseModal={handleCloseModal}>
                    <Authentication handleCloseModal={handleCloseModal}/>
                </Modal>
            )}
            <div className="section-header">
                <i className="fa-solid fa-pencil"></i>
                <h2>Start Tracking Today</h2>
            </div>
            <h4>Select Coffee Type</h4>
            <div className="coffee-grid">
                {/* slice method extracts a portion of an array and returns it as a new array */}
                {/* syntax: array.slice(start, end) where start is inclusive and end is exclusive */}
                {/* map method creates a new array populated with the results of arrow function */}
                {coffeeOptions.slice(0,5).map((option, optionIndex) => {
                    return(
                        // need key index to access option array, which was spliced from coffeeOptions array
                        // onClick function sets selected coffee type to what user clicked on 
                        // in the className JavaScript line, if option.name is equal to the selected coffee type, then the button will darken when clicked on  
                        <button onClick={() => {
                            setSelectedCoffee(option.name)
                            setShowCoffeeType(false)
                        }} className={"button-card" + (option.name === selectedCoffee ? 'coffee-button-selected':'')} key={optionIndex}>
                            <h4>{option.name}</h4>
                            <p>{option.caffeine} mg</p>
                         </button>
                    )
                })}
                 <button onClick={() => {
                    // setSelectedCoffee(null) so that it removes border from other coffee types when Other is selected
                    setShowCoffeeType(true)
                    setSelectedCoffee(null)
                 }} className={"button-card" + (showCoffeeType ? 'coffee-button-selected':'')}>
                    <h4>Other</h4>
                    <p>N/A</p>
                </button>
            </div>
            {/* select is an html element that makes a dropdown menu of options */}
            {/* if showCoffeeType is true, display the select dropdown menu, if not true, then don't display */}
            {showCoffeeType && (
                <select onChange={(event) => {
                    // this onChange function sets selected coffee to what guest selects on dropdown menu
                    // if selected coffee type is the same as the first 5 buttons, button will be highlighted
                    // event.target.value saves value that guest selected
                    setSelectedCoffee(event.target.value)
                }} id="coffee-list" name="coffee-list">
                <option value={null}>Select Type</option>
                {coffeeOptions.map((option, optionIndex) => {
                    return(
                        <option value={option.name} key={optionIndex}>
                            {option.name} {option.caffeine} mg
                        </option>
                    )
                })}
            </select>)}
            <h4>Add the Cost ($)</h4>
            <input className="w-full" type="number" value={coffeeCost} onChange={(event) => {
                // value should always match value associated with state variable
                // in event of a change, we always do setVariable(event.target.value), which gets value of an input
                setCoffeeCost(event.target.value)
            }} placeholder="4.50" />
            <h4>Time Since Consumption</h4>
            <div className="time-entry">
                <div>
                    <h6>Hours</h6>
                    <select onChange={(event) => {
                        setHour(event.target.value)
                    }} id="time-entry">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((hour, hourIndex) => {
                            return(
                                <option key={hourIndex} value={hour}>{hour}</option>
                            )
                        })}
                    </select>
                </div>
                <div>
                    <h6>Minutes</h6>
                    <select onChange={(event) => {
                        setMin(event.target.value)
                    }} id="time-entry">
                        {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((min, minIndex) => {
                            return(
                                <option key={minIndex} value={min}>{min}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
            <button onClick={handleSubmitForm}>
                {/* displays what guest selected in the console when they add an entry */}
                <p>Add Entry</p>
            </button>
        </>
    )
}
