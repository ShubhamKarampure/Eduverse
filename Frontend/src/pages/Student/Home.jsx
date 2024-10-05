import React, { useEffect, useRef, useState } from 'react';
import { Navbar } from '../../components/index.js';
import { Example } from '../../components/Sidebar.jsx';
import { SquishyCard } from '../../components/index.js';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';

const Home = () => {
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login');
        }
    }, []);
    return (
        <div className='flex h-screen bg-white'>
            {/* Sidebar */}
            <div className='sticky top-0 h-screen shrink-0 bg-transparent'>
                <Example />
            </div>

            {/* Main Content */}
            <div className='flex-1 w-full overflow-y-auto'>
                <div className='flex flex-col'>
                    <Navbar />
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Home;
