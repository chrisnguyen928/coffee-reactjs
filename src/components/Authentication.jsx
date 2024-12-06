import React from 'react'
import {useState} from 'react'
import { useAuth } from '../context/AuthContext'

export default function Authentication(props) {
    const {handleCloseModal} = props

    // for variables that have Boolean states, use "is" keyword
    // ex: isAuthenticating only has value of true or false
    const [isRegistered, setIsRegistered] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [error, setError] = useState(null)

    // import signup and login from AuthContext.jsx
    const {signup, login} = useAuth()

    async function handleAuthenticate() {
        if (!email || !email.includes('@') || !password || password.length < 6 || isAuthenticating) {
            return
        }

        try {
            setIsAuthenticating(true)
            setError(null)

            if (isRegistered) {
                // register a user
                await signup(email, password)
            }
            else {
                // sign in a user
                await login(email, password)
            }

            // closes Sign Up Modal when we finish signing up
            handleCloseModal()
        } catch (err) {
            console.log(err.message)
            setError(err.message)
        } finally {
            setIsAuthenticating(false)
        }
    }

    return (
        <>
            {/* If isRegistered is true, then title says Sign Up, else title is Log In */}
            <h2 className="sign-up-text">{isRegistered ? 'Sign Up':'Log In'}</h2>
            <p>{isRegistered ? 'Create an Account':'Sign In to Your Account'}</p>
            {error && (
                <p>❌ {error}</p>
            )}
            <input value={email} onChange={(event) => {setEmail(event.target.value)}} placeholder="Email"></input>
            <input value={password} onChange={(event) => {setPassword(event.target.value)}} placeholder="********" type="password"></input>
            <button onClick={handleAuthenticate}><p>{isAuthenticating ? 'Authenticating...':'Submit'}</p></button>
            <hr />
            <div className="register-content">
                <p>{isRegistered ? 'Already have an account?':"Don't have an account?"}</p>
                {/* when button is clicked, reverses isRegistered state */}
                <button onClick={() => {setIsRegistered(!isRegistered)}}><p>{isRegistered ? 'Sign In':'Sign Up'}</p></button>
            </div>
        </>
  )
}
