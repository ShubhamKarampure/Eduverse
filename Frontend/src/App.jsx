import { useState } from 'react'
import SignLanguageCourse from './pages/SignLangugae/signlanguage_coursepage'
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <SignLanguageCourse/>
    </>
  )
}

export default App
