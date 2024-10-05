import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signupRoute } from '../../APIRoutes/index.js';
import { motion } from 'framer-motion';

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
    branch: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(signupRoute, userData, {
        withCredentials: true,
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-screen h-screen flex justify-center items-center bg-gray-100"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="bg-white shadow-lg rounded-lg w-[60vw] max-w-lg p-6"
      >
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold text-center text-gray-700 py-4">
            REGISTER
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-row gap-3">
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  onChange={(event) => {
                    setUserData({
                      ...userData,
                      name: event.target.value,
                    });
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  onChange={(event) => {
                    setUserData({
                      ...userData,
                      username: event.target.value,
                    });
                  }}
                />
              </FormControl>
            </div>
            <div className="flex flex-row gap-3">
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  onChange={(event) => {
                    setUserData({
                      ...userData,
                      email: event.target.value,
                    });
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  onChange={(event) => {
                    setUserData({
                      ...userData,
                      password: event.target.value,
                    });
                  }}
                />
              </FormControl>
            </div>
            <div className="flex flex-row gap-3">
              <FormControl as="fieldset">
                <FormLabel as="legend">Branch</FormLabel>
                <Select
                  placeholder="Select Branch"
                  onChange={(event) => {
                    setUserData({
                      ...userData,
                      branch: event.target.value,
                    });
                  }}
                >
                  <option>Computer Engineering</option>
                  <option>Data Science</option>
                  <option>Machine Learning</option>
                  <option>EXTC</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel as="legend">Role</FormLabel>
                <Select
                  placeholder="Select Role"
                  onChange={(event) => {
                    setUserData({
                      ...userData,
                      role: event.target.value,
                    });
                  }}
                >
                  <option>Student</option>
                  <option>Teacher</option>
                </Select>
              </FormControl>
            </div>
          </motion.div>

          {loading ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-xl font-bold text-sky-500"
            >
              Please wait...
            </motion.p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex justify-center py-6"
            >
              <Button colorScheme="teal" size="lg" type="submit">
                REGISTER
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="flex justify-center items-center py-4"
          >
            <p className="text-center text-xl font-bold">
              Already have an account?{' '}
              <span className="text-sky-500">
                <Link to="/login">Login</Link>
              </span>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Register;
