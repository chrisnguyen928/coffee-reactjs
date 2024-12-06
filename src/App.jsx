import { useState } from 'react'
import Layout from './components/Layout'
import Hero from './components/Hero'
import CoffeeForm from './components/CoffeeForm'
import Stats from './components/Stats'
import History from './components/History'
import { useAuth } from './context/AuthContext'

function App() {
  const {globalUser, isLoading, globalData} = useAuth()
  const isAuthenticated = globalUser
  
  // if globalData is null, return empty object
  // if length is 0, its a falsey value, !! converts object into boolean value
  // there is data to display if and only if globalData exists and length of entry > 0
  const isData = globalData && !!Object.keys(globalData || {}).length

  // content for users that are signed in, conditionally render it in return statement
  const authenticatedContent = (
    <>
      <Stats />
      <History />
    </>
  )

  return (
    <Layout>
      <Hero />
      <CoffeeForm isAuthenticated={isAuthenticated}/>
      {(isAuthenticated && isLoading) && (
        <p>Loading data...</p>
      )}
      {/* if and only if globalUser and globalData exists, show authenticated content */}
      {(isAuthenticated && isData) && (authenticatedContent)}
    </Layout>
  )
}

export default App
