import React, { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  useColorModeValue,
} from '@chakra-ui/react'
import { AddIcon, EditIcon } from '@chakra-ui/icons'

export default function YourCourses() {
  const [courses, setCourses] = useState([
    { id: 1, title: "Introduction to React", description: "Learn the basics of React development" },
    { id: 2, title: "Advanced JavaScript", description: "Deep dive into JavaScript concepts" },
    { id: 3, title: "Web Design Fundamentals", description: "Master the principles of web design" },
  ])

  const handleCreateCourse = () => {
    const newCourse = {
      id: courses.length + 1,
      title: `New Course ${courses.length + 1}`,
      description: "Course description goes here",
    }
    setCourses([...courses, newCourse])
  }

  const bgColor = useColorModeValue('blue.50', 'blue.900')
  const cardBgColor = useColorModeValue('white', 'blue.800')
  const textColor = useColorModeValue('blue.800', 'white')

  return (
    <Box bg={bgColor} minHeight="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h1" size="2xl" color="blue.600">Your Courses</Heading>
            <Button 
              leftIcon={<AddIcon />} 
              colorScheme="blue" 
              onClick={handleCreateCourse}
            >
              Create New Course
            </Button>
          </Flex>

          <Flex alignItems="center" gap={4}>
            <Avatar size="xl" name="Jane Doe" src="/placeholder-avatar.jpg" />
            <Box>
              <Heading as="h2" size="lg" color={textColor}>Jane Doe</Heading>
              <Text color="blue.600">Web Development Expert</Text>
            </Box>
          </Flex>

          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
            {courses.map((course) => (
              <Card key={course.id} bg={cardBgColor} shadow="md">
                <CardHeader>
                  <Heading size="md" color={textColor}>{course.title}</Heading>
                </CardHeader>
                <CardBody>
                  <Text color={textColor}>{course.description}</Text>
                </CardBody>
                <CardFooter>
                  <Button 
                    leftIcon={<EditIcon />} 
                    colorScheme="blue" 
                    variant="outline" 
                    width="full"
                  >
                    Edit Course
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  )
}