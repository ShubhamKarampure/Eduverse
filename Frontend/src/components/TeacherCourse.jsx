import React, { useEffect, useState } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useToast, // Import useToast for notifications
} from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { getAllCoursesByInstructor } from "../APIRoutes/index";
import axios from "axios";

export default function TeacherCourse() {
  const cour = JSON.parse(localStorage.getItem("teacher-courses")) || [];
  const user = JSON.parse(localStorage.getItem("user"));
  const [courses, setCourses] = useState(cour);
  const [obj, setObj] = useState({
    name: '',
    branch: "",
    description: "",
    instructor: user._id,
    enrollmentKey: "",
  });
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast(); // Initialize toast

  useEffect(() => {
    if (cour.length === 0) {
      axios.get(getAllCoursesByInstructor, {
        headers: { instructorid: user._id },
      })
        .then((res) => setCourses(res.data))
        .catch((e) => console.log(e));
    }
  }, [cour, user._id]);

  const handleCreateCourse = () => {
    axios.post(getAllCoursesByInstructor, obj)
      .then((res) => {
        setCourses((prevCourses) => [...prevCourses, res.data]);
        resetForm();
        setIsModalOpen(false);
        toast({
          title: "Course Created",
          description: "Your course has been created successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((e) => {
        console.log(e);
        toast({
          title: "Error",
          description: "There was an error creating the course.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleEditCourse = (course) => {
    setObj(course);
    setEditingCourseId(course._id); // Change to course._id for consistency
    setIsModalOpen(true);
  };

  const handleUpdateCourse = () => {
    axios.patch(`${getAllCoursesByInstructor}/${editingCourseId}`, obj)
      .then((res) => {
        // Make sure the response includes the full course object
        const updatedCourse = res.data.updatedCourse;

        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === editingCourseId ? updatedCourse : course
          )
        );

        resetForm();
        setIsModalOpen(false);

        toast({
          title: "Course Updated",
          description: "Your course has been updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((e) => {
        console.log(e);
        toast({
          title: "Error",
          description: "There was an error updating the course.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };


  const resetForm = () => {
    setEditingCourseId(null);
  };

  const bgColor = useColorModeValue("white", "blue.900");
  const cardBgColor = useColorModeValue("white", "blue.800");
  const textColor = useColorModeValue("blue.800", "white");

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <Box bg={bgColor} minHeight="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h1" size="2xl" color="blue.600">
              Your Courses
            </Heading>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={() => { resetForm(); setIsModalOpen(true); }}
            >
              Create New Course
            </Button>
          </Flex>

          <Flex alignItems="center" gap={4}>
            <Avatar size="xl" name={user.username} src="/placeholder-avatar.jpg" />
            <Box>
              <Heading as="h2" size="lg" color={textColor}>
                {user.username}
              </Heading>
              <Text color="blue.600">{user.role}</Text>
            </Box>
          </Flex>

          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
            {courses.map((course) => (
              <Card key={course._id} bg={cardBgColor} shadow="md">
                <CardHeader>
                  <Heading size="md" color={textColor}>
                    {course.name}
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text color={textColor}>{truncateText(course.description, 100)}</Text>
                </CardBody>
                <CardFooter>
                  <Button
                    leftIcon={<EditIcon />}
                    colorScheme="blue"
                    variant="outline"
                    width="full"
                    onClick={() => handleEditCourse(course)}
                  >
                    Edit Course
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>

          {/* Modal for Create/Edit Course */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{editingCourseId ? "Edit Course" : "Create New Course"}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input
                  placeholder="Course Title"
                  value={obj.name}
                  onChange={(e) => setObj({ ...obj, name: e.target.value })}
                  mb={4}
                />
                <Input
                  placeholder="Branch"
                  value={obj.branch}
                  onChange={(e) => setObj({ ...obj, branch: e.target.value })}
                  mb={4}
                />
                <Input
                  placeholder="Description"
                  value={obj.description}
                  onChange={(e) => setObj({ ...obj, description: e.target.value })}
                  mb={4}
                />
                <Input
                  placeholder="Enrollment Key"
                  value={obj.enrollmentKey}
                  onChange={(e) => setObj({ ...obj, enrollmentKey: e.target.value })}
                  mb={4}
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={editingCourseId ? handleUpdateCourse : handleCreateCourse}>
                  {editingCourseId ? "Update Course" : "Create Course"}
                </Button>
                <Button variant="outline" onClick={() => setIsModalOpen(false)} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </Container>
    </Box>
  );
}
