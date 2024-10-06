import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Flex,
    Avatar,
    Text,
    Heading,
    Badge,
    Button,
    Progress,
    VStack,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue
} from '@chakra-ui/react';
import { FaUser, FaGraduationCap } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { getAssignments } from '../../APIRoutes';

export default function ProfilePage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const courses = JSON.parse(localStorage.getItem('student-courses'));
    console.log('Courses:', courses); // Debugging log

    const navigate = useNavigate();
    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.200');

    // State to store assignment data
    const [courseAssignments, setCourseAssignments] = useState([]);

    const handleViewCourses = () => {
        navigate(`${user.role === 'Student' ? "/home/mycourses" : "/home/teacher"}`);
    };

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const promises = courses.map(async (course) => {
                    console.log(`Fetching assignments for course: ${course.name} (${course._id})`);
                    
                    const response = await axios.get(getAssignments, {
                        headers: {
                            course: course._id
                        }
                    });
                    const assignments = response.data;
                    console.log(`Assignments for ${course.name}:`, assignments);

                    // Filter submitted assignments
                    const submittedCount = assignments.filter(a => a.isSubmitted).length;

                    return {
                        courseId: course._id,
                        courseName: course.name,
                        totalAssignments: assignments.length,
                        submittedAssignments: submittedCount,
                    };
                });

                // Wait for all promises to resolve
                const results = await Promise.all(promises);
                setCourseAssignments(results); // Store assignment data
                console.log('All course assignments:', results); // Debugging log
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };

        if (courses && courses.length > 0) {
            fetchAssignments();
        }
    }, []);

    return (
        <Container maxW="container.xl" py={8}>
            <Flex>
                {/* Left Side: User and Stats */}
                <Box className="w-1/2 pr-4">
                    {/* User Info */}
                    <Box bg={bgColor} p={6} rounded="lg" shadow="md" mb={6}>
                        <Flex alignItems="center" mb={4}>
                            <Avatar size="xl" name={user.name} src={user.avatar} mr={4} />
                            <Box>
                                <Heading size="lg">{user.name}</Heading>
                                <Text color={textColor}>@{user.username}</Text>
                            </Box>
                        </Flex>
                        <Flex alignItems="center" className='gap-3'>
                            <FaUser />
                            <Text>{user.branch}</Text>
                        </Flex>
                    </Box>

                    {/* Learning Statistics */}
                    <Box bg={bgColor} p={6} rounded="lg" shadow="md">
                        <Heading size="md" mb={4}>Learning Statistics</Heading>
                        <Text color={textColor} mb={4}>Your achievements and progress</Text>
                        <Flex justify="space-between" wrap>
                            <Stat>
                                <StatNumber>{courses?.length}</StatNumber>
                                <StatLabel>Courses in Progress</StatLabel>
                            </Stat>
                            <Stat>
                                <StatNumber>48</StatNumber>
                                <StatLabel>Lessons Completed</StatLabel>
                            </Stat>
                            <Stat>
                                <StatNumber>68%</StatNumber>
                                <StatLabel>Average Completion</StatLabel>
                            </Stat>
                        </Flex>
                    </Box>
                </Box>

                {/* Right Side: Courses */}
                <Box className="w-1/2 pl-4">
                    <Box bg={bgColor} p={6} rounded="lg" shadow="md">
                        <Heading size="md" mb={4}>Courses Joined</Heading>
                        <Text color={textColor} mb={4}>Your learning journey</Text>
                        <VStack spacing={4} align="stretch">
                            {courseAssignments.map((courseData) => (
                                <Box key={courseData.courseId}>
                                    <Flex justify="space-between" mb={2}>
                                        <Text fontWeight="semibold">{courseData.courseName}</Text>
                                        <Badge>{`${courseData.submittedAssignments}/${courseData.totalAssignments} assignments`}</Badge>
                                    </Flex>
                                    <Progress
                                        value={(courseData.submittedAssignments / courseData.totalAssignments) * 100}
                                        size="sm"
                                        colorScheme="blue"
                                    />
                                </Box>
                            ))}
                        </VStack>
                        <Button leftIcon={<FaGraduationCap />} colorScheme="blue" mt={4} width="full" onClick={handleViewCourses}>
                            View All Courses
                        </Button>
                    </Box>
                </Box>
            </Flex>
        </Container>
    );
}
