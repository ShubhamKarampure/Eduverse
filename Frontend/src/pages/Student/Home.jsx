import React from 'react'
import { Navbar } from '../../components/index.js'
import { Example } from '../../components/Sidebar.jsx'

const Home = () => {
    return (
        <>
            <div className='flex w-full'>
                <div>
                    <Example />
                </div>
                <div className='w-full'>
                    <div className='flex flex-col h-screen'>
                        <Navbar />
                        <div className='w-full h-[300vh] scroll-m-0 bg-red-300 '>test</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
