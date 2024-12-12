import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useState, useEffect, useContext, createContext } from 'react'
import { auth, db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'

const AuthContext = createContext()

// this function creates custom hook that we can use to destructure values below
export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider(props) {
    const {children} = props
    const [globalUser, setGlobalUser] = useState(null)
    const [globalData, setGlobalData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // authentication handlers
    function signup(email, password) {
        return (createUserWithEmailAndPassword(auth, email, password))
    }

    function login(email, password) {
        return (signInWithEmailAndPassword(auth, email, password))
    }

    function resetPassword(email) {
        return (sendPasswordResetEmail(auth, email))
    }

    function logout() {
        setGlobalUser(null)
        setGlobalData(null)
        return (signOut(auth))
    }

    // value is a global state that can be accessed from anywhere
    const value = {globalUser, globalData, setGlobalData, isLoading, signup, login, logout}

    // useEffect takes 2 arguments, the callback function that gets executed when event is triggered
    // and dependency array, which determines when logic is run
    // onAuthStateChanged function listens to when user signs in, signs out, when they registered, etc
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // REMOVE before deploying app 
            console.log('CURRENT USER: ', user)
            // when we get user, set global state to user
            setGlobalUser(user)

            // if there is no user, empty user state and return from this listener
            if (!user) {
                console.log('No active user')
                return
            }

            // if there is a user, check to see if user has data in the database, and if they do, 
            // fetch said data and update global state

            try {
                // try to load user's data
                setIsLoading(true)

                // try to fetch data from database

                // doc method takes 3 variables: db, collection named users (from firestore), and value we're looking for 
                // in this case, we are looking for user id 

                // First, we create a reference for the document (labeled json object). Then, we get the doc and we snapshot it
                // to see if there is anything there 
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)

                let firebaseData = {}

                // if docSnap exists, overwrite empty firebaseData object with data from existing user
                if (docSnap.exists) {
                    firebaseData = docSnap.data()
                    console.log('Found user data', firebaseData)
                }

                setGlobalData(firebaseData)
            } catch (err) {
                console.log(err.message)
            } finally {
                setIsLoading(false)
            }
        })
        return unsubscribe
    }, [])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}