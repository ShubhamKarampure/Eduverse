import React from 'react'
import {
    Box,
    Container,
    SimpleGrid,
    Flex,
    Avatar,
    Text,
    Heading,
    Badge,
    Button,
    Progress,
    VStack,
    HStack,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue
} from '@chakra-ui/react'
import { FaUser, FaBook, FaGraduationCap } from 'react-icons/fa'

export default function ProfilePage() {
    // Mock user data
    const user = JSON.parse(localStorage.getItem('user'));

    // Mock courses data
    const courses = JSON.parse(localStorage.getItem('student-courses'))

    const bgColor = useColorModeValue('white', 'gray.800')
    const textColor = useColorModeValue('gray.600', 'gray.200')

    return (
        <Container maxW="container.xl" py={8}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box bg={bgColor} p={6} rounded="lg" shadow="md">
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

                <Box bg={bgColor} p={6} rounded="lg" shadow="md">
                    <Heading size="md" mb={4}>Courses Joined</Heading>
                    <Text color={textColor} mb={4}>Your learning journey</Text>
                    <VStack spacing={4} align="stretch">
                        {courses.map((course) => (
                            <Box key={course.id}>
                                <Flex justify="space-between" mb={2}>
                                    <Text fontWeight="semibold">{course.name}</Text>
                                    <Badge>4/25 lessons</Badge>
                                </Flex>
                                <Progress value="45" size="sm" colorScheme="blue" />
                            </Box>
                        ))}
                    </VStack>
                    <Button leftIcon={<FaGraduationCap />} colorScheme="blue" mt={4} width="full">
                        View All Courses
                    </Button>
                </Box>
            </SimpleGrid>

            <Box bg={bgColor} p={6} rounded="lg" shadow="md" mt={6}>
                <Heading size="md" mb={4}>Learning Statistics</Heading>
                <Text color={textColor} mb={4}>Your achievements and progress</Text>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
                    <Stat>
                        <HStack>
                            <FaBook color="blue.500" />
                            <Box>
                                <StatNumber>{courses.length}</StatNumber>
                                <StatLabel>Courses in Progress</StatLabel>
                            </Box>
                        </HStack>
                    </Stat>
                    <Stat>
                        <HStack>
                            <FaGraduationCap color="blue.500" />
                            <Box>
                                <StatNumber>48</StatNumber>
                                <StatLabel>Lessons Completed</StatLabel>
                            </Box>
                        </HStack>
                    </Stat>
                    <Stat>
                        <HStack>
                            <FaUser color="blue.500" />
                            <Box>
                                <StatNumber>12</StatNumber>
                                <StatLabel>Months Active</StatLabel>
                            </Box>
                        </HStack>
                    </Stat>
                    <Stat>
                        <HStack>
                            <FaBook color="blue.500" />
                            <Box>
                                <StatNumber>68%</StatNumber>
                                <StatLabel>Average Completion</StatLabel>
                            </Box>
                        </HStack>
                    </Stat>
                </SimpleGrid>
            </Box>
        </Container>
    )
}