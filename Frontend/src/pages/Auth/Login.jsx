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
import { loginRoute } from '../../APIRoutes/index.js'

const Login = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    });
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(loginRoute, userData, {
                withCredentials: true
            });
            if (response.data.success) {
                toast({
                    title: 'Logged in',
                    description: `${response.data.message}`,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
                localStorage.setItem('token', JSON.stringify(response.data.token));
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/home');
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
                    <h1 className='text-2xl font-bold text-white text-center py-4'>LOGIN</h1>
                    <div className='flex flex-col gap-3'>
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
                    {
                        loading ? <p className='text-center text-xl font-bold text-sky-500'>Please wait...</p> : <div className='flex flex-row gap-3 py-4 justify-center items-center'>
                            <Button colorScheme='teal' size='lg' type='submit'>
                                LOGIN
                            </Button>
                        </div>
                    }
                    <div className='flex flex-row gap-3 py-4 justify-center items-center'>
                        <p className='text-center text-xl font-bold'>Don't have an account ? <span className='text-sky-500'><Link to={'/register'}>Sign up</Link></span></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
