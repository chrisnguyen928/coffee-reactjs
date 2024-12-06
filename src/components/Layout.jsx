import React from 'react'
import {useState} from 'react'
import Authentication from './Authentication'
import Modal from './Modal'
import { useAuth } from '../context/AuthContext'

export default function Layout(props) {
    // Layout component is reused by other pages and uses the same format as this component. 
    // This is done by having all other components inside <Layout> section in App.jsx
    const {children} = props

    // by default, modal is not shown
    const [showModal, setShowModal] = useState(false)

    // global states accessed from AuthContext.jsx
    const {globalUser, logout} = useAuth()
   
    const header = (
        <header>
            <div>
                <h1 className='text-gradient'>Brewly</h1>
                <p>For Coffee Addicts</p>
            </div>
            {globalUser ? (
                <button onClick={logout}>
                <p>Logout</p>
                </button>
            ) : (
                <button onClick={() => {setShowModal(true)}}>
                <p>Sign Up For Free</p>
                <i className="fa-solid fa-mug-hot"></i>
                </button>
        )}
        </header>
    )
    
    const footer = (
        <footer>
            {/* target="_blank" means to open up link in new tab */}
            <p><span className="text-gradient">Brewly</span> was made using the <a href="https://www.fantacss.smoljames.com" target="_blank">FantaCSS</a> design library made by SmolJames</p>
        </footer>
    )

    function handleCloseModal () {
        setShowModal(false)
    }

    return (
        <>
            {/* if and only if showModel is true, show authentication pop up */}
            {showModal && (
                <Modal handleCloseModal={handleCloseModal}>
                    <Authentication handleCloseModal={handleCloseModal}/>
                </Modal>)}
            {header}
            <main>
                {children}
            </main>
            {footer}
        </>
    )
}
