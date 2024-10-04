import { useState } from 'react'
import { Outlet } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <Outlet/>
      <h1 className='text-center'>Test</h1>
    </>
  )
}

export default App
