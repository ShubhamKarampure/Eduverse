import React, { useState } from "react";
import {
    FiChevronDown,
    FiChevronsRight,
    FiHome,
} from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdAssignment } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { MdOutlineMenuBook } from "react-icons/md";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useToast } from '@chakra-ui/react';

export const Example = () => {
    return (
        <div className="flex bg-indigo-50">
            <Sidebar />
            <ExampleContent />
        </div>
    );
};

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const [selected, setSelected] = useState("Dashboard");
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <motion.nav
            layout
            className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2"
            style={{
                width: open ? "225px" : "fit-content",
            }}
        >
            <TitleSection open={open} />

            <div className="space-y-1">
                <Link to={`${user.role === "Student" ? "/home" : "/home/teacher"}`} >
                    <Option
                        Icon={FiHome}
                        title="Dashboard"
                        selected={selected}
                        setSelected={setSelected}
                        open={open}
                    />
                </Link>
                <Link>
                    <Option
                        Icon={MdAssignment}
                        title="Assignments"
                        selected={selected}
                        setSelected={setSelected}
                        open={open}
                        notifs={3}
                    />
                </Link>
                {
                    user.role === "Student" && <Link to={'/home/mycourses'}>
                        <Option
                            Icon={MdOutlineMenuBook}
                            title="My Courses"
                            selected={selected}
                            setSelected={setSelected}
                            open={open}
                        />
                    </Link>
                }
                <Link to={'/home/calendar'}>
                    <Option
                        Icon={FaCalendarAlt}
                        title="Calendar"
                        selected={selected}
                        setSelected={setSelected}
                        open={open}
                    />
                </Link>
                <Link to={user.role==='Student'?'/home/profile':'/home/teacherProfile'}>
                    <Option
                        Icon={CgProfile}
                        title="Profile"
                        selected={selected}
                        setSelected={setSelected}
                        open={open}
                    />
                </Link>
            </div>

            <ToggleClose open={open} setOpen={setOpen} />
        </motion.nav>
    );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs }) => {
    return (
        <motion.button
            layout
            onClick={() => setSelected(title)}
            className={`relative flex h-12 w-full items-center rounded-md transition-colors 
                ${selected === title ? "bg-indigo-100 text-indigo-800" : "text-slate-500"}
                ${!selected && "hover:bg-slate-100 hover:text-slate-700"}`} // Added hover effect
        >
            <motion.div
                layout
                className="grid h-full w-10 place-content-center text-lg"
            >
                <Icon />
            </motion.div>
            {open && (
                <motion.span
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.125 }}
                    className="text-xs font-medium"
                >
                    {title}
                </motion.span>
            )}

            {notifs && open && (
                <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    style={{ y: "-50%" }}
                    transition={{ delay: 0.5 }}
                    className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
                >
                    {notifs}
                </motion.span>
            )}
        </motion.button>
    );
};


const TitleSection = ({ open }) => {
    return (
        <div className="mb-3 border-b border-slate-300 pb-3">
            <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100 hover:text-black">
                <div className="flex items-center gap-2">
                    <Logo />
                    {open && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.125 }}
                        >
                            <span className="block text-xs font-semibold text-black">EduVerse</span>
                            <span className="block text-xs text-black">Pro Plan</span>
                        </motion.div>
                    )}
                </div>
                {open && <FiChevronDown className="mr-2" />}
            </div>
        </div>
    );
};

const Logo = () => {
    // Temp logo from https://logoipsum.com/
    return (
        <motion.div
            layout
            className="grid size-10 shrink-0 place-content-center rounded-md bg-indigo-600"
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 50 39"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-slate-50"
            >
                <path
                    d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
                    stopColor="#000000"
                ></path>
                <path
                    d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
                    stopColor="#000000"
                ></path>
            </svg>
        </motion.div>
    );
};

const ToggleClose = ({ open, setOpen }) => {
    return (
        <motion.button
            layout
            onClick={() => setOpen((pv) => !pv)}
            className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
        >
            <div className="flex items-center p-2">
                <motion.div
                    layout
                    className="grid size-10 place-content-center text-lg"
                >
                    <FiChevronsRight
                        className={`transition-transform ${open && "rotate-180"} text-black`}
                    />
                </motion.div>
                {open && (
                    <motion.span
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.125 }}
                        className="text-xs font-medium text-black"
                    >
                        Hide
                    </motion.span>
                )}
            </div>
        </motion.button>
    );
};

const ExampleContent = () => <div className="h-[100vh] w-full"></div>;