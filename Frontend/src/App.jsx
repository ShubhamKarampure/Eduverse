import { useState } from 'react'
import { Outlet } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='text-center bg-white h-screen text-black'>Test</h1>
    </>
  )
}

export default App
