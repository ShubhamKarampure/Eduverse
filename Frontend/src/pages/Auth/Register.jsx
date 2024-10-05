import React, { useState } from 'react'
import {
    FormControl,
    FormLabel,
    Input,
    Select,
    Button
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { signupRoute } from '../../APIRoutes/index.js'

const Register = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: '',
        branch: ''
    });
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(signupRoute, userData, {
                withCredentials: true
            });
            if (response.data.success) {
                toast({
                    title: 'Account created.',
                    description: "We've created your account for you.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
                navigate('/login');
                setLoading(false);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: `${error.response.data.message}`,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    }
    return (
        <div className='w-screen bg-white h-screen py-6'>
            <div className='flex justify-center items-center mx-auto w-[60vw] bg-blue-500 rounded-lg'>
                <form className='flex flex-col px-4 w-full my-2' onSubmit={handleSubmit}>
                    <h1 className='text-2xl font-bold text-white text-center py-4'>REGISTER</h1>
                    <div className='flex flex-row gap-3'>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input type='text' onChange={(event) => {
                                setUserData({
                                    ...userData,
                                    name: event.target.value
                                })
                            }} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input type='text' onChange={(event) => {
                                setUserData({
                                    ...userData,
                                    username: event.target.value
                                })
                            }} />
                        </FormControl>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input type='email' onChange={(event) => {
                                setUserData({
                                    ...userData,
                                    email: event.target.value
                                })
                            }} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input type='password' onChange={(event) => {
                                setUserData({
                                    ...userData,
                                    password: event.target.value
                                })
                            }} />
                        </FormControl>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <FormControl as='fieldset'>
                            <FormLabel as='legend'>Branch</FormLabel>
                            <Select placeholder='Select Branch' onChange={(event) => {
                                setUserData({
                                    ...userData,
                                    branch: event.target.value
                                })
                            }}>
                                <option>Computer Engineering</option>
                                <option>Data Science</option>
                                <option>Machine Learning</option>
                                <option>EXTC</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel as='legend'>Role</FormLabel>
                            <Select placeholder='Select Role' onChange={(event) => {
                                setUserData({
                                    ...userData,
                                    role: event.target.value
                                })
                            }}>
                                <option>Student</option>
                                <option>Teacher</option>
                            </Select>
                        </FormControl>
                    </div>
                    {
                        loading ? <p className='text-center text-xl font-bold text-sky-500'>Please wait...</p> : <div className='flex flex-row gap-3 py-4 justify-center items-center'>
                            <Button colorScheme='teal' size='lg' type='submit'>
                                REGISTER
                            </Button>
                        </div>
                    }
                    <div className='flex flex-row gap-3 py-4 justify-center items-center'>
                        <p className='text-center text-xl font-bold'>Already have an account ? <span className='text-sky-500'><Link to={'/login'}>Login</Link></span></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
