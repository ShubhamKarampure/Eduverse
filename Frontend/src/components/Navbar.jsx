import React from 'react'

const Navbar = () => {
    return (
        <nav className='flex justify-between items-center px-2 py-2 gap-5 '>
            <div className='flex'>
                <h1 className='text-3xl font-bold text-blue-600'>EduVerse</h1>
            </div>
            <div className='flex items-center justify-start gap-5'>
                <ul className='font-bold text-xl hover:border-b-black hover:border-b-4'>Home</ul>
                <ul className='font-bold text-xl hover:border-b-black hover:border-b-4'>Courses</ul>
            </div>
            <div className='flex justify-end items-center gap-4'>
                <button className='outline-none rounded-md px-4 py-2 bg-blue-600 text-white font-bold'>Login</button>
                <button className='outline-none rounded-md px-4 py-2 bg-blue-600 text-white font-bold'>Signup</button>
            </div>
        </nav>
    )
}

export default Navbar
