import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  SimpleGrid,
  Badge,
  VStack,
  HStack,
  Card,
  CardBody,
  Icon,
  Button,
  Input,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { CheckCircleIcon, TimeIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  getAssignments,
  submitAssignment,
  gradeAssignment,
  getAllCoursesByInstructor,
} from "../../APIRoutes/index.js";

export default function CoursePage() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const courses = JSON.parse(
    localStorage.getItem(
      user.role === "Student" ? "student-courses" : "teacher-courses"
    )
  );
  const toast = useToast();
  const selectedCourse = courses.find((course) => course._id === id);
  const [assignments, setAssignments] = useState([]);
  const [file, setFile] = useState(null);
  const [grades, setGrades] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState({}); // Track submissions
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`${getAssignments}`, {
          headers: {
            course: `${id}`,
          },
          withCredentials: true,
        });
        if (response.data.success) {
          setAssignments(response.data.assignments);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAssignments();
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Save selected file
  };

  const handleFileUpload = async (assignmentId) => {
    if (!file) return; // Prevent upload if no file is selected

    const formData = new FormData();
    formData.append("submissionFile", file); // Append the file
    formData.append("assignmentId", assignmentId); // Append the assignment ID

    try {
      const response = await axios.post(
        `${submitAssignment}/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast({
          title: "File uploaded",
          description: "Your assignment was uploaded successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setFile(null); // Clear file input
        setHasSubmitted((prev) => ({ ...prev, [assignmentId]: true })); // Mark assignment as submitted
      }
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const handleGrade = async (assignmentId) => {
    if (!hasSubmitted[assignmentId]) {
      toast({
        title: "No Submission",
        description: "Please upload the assignment before checking the grade.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return; // Prevent grading if no submission
    }
    try {
      const response = await axios.get(`${gradeAssignment}`, {
        headers: {
          studentid: `${user._id}`,
          assignmentid: `${assignmentId}`,
        },
      });
      if (response.data.success) {
        setGrades((prev) => ({
          ...prev,
          [assignmentId]: response.data.evaluation,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleButton = (e, id) => {
    e.preventDefault();
    setButtonDisabled(true);
    if (user.role === "Student") {
      navigate(`/home/quiz/${id}`);
    } else {
      handleGenerateQuiz(id);
    }
    setButtonDisabled(false);
  };

  const handleGenerateQuiz = (id) => {
    axios
      .get(`${getAllCoursesByInstructor}/${id}`)
      .then(() => {
        toast({
          title: "Quiz Generated",
          description: "You have successfully generated a quiz.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Error",
          description: "An error occurred while generating quiz.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  if (!selectedCourse) {
    return (
      <Container maxW="container.xl" py={8}>
        <Heading>Course not found</Heading>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <VStack align="start" spacing={4}>
          <Heading as="h1" size="2xl">
            {selectedCourse.name}
          </Heading>
          <Text fontSize="xl" color="gray.600">
            {selectedCourse.description}
          </Text>
          <HStack>
            <Badge colorScheme="gray">12 weeks</Badge>
            <Badge colorScheme="gray">Online</Badge>
          </HStack>
        </VStack>
        <Box position="relative" height={{ base: "200px", md: "300px" }}>
          <Image
            src={selectedCourse?.image?.url || "/placeholder.svg"}
            alt={`${selectedCourse.name} Cover`}
            objectFit="cover"
          />
        </Box>
      </SimpleGrid>

      <Button
        my={6}
        colorScheme="teal"
        onClick={(e) => handleButton(e, id)}
        disabled={isButtonDisabled}
      >
        {user.role === "Student" ? "Take Quiz" : "Generate Quiz"}
      </Button>
      {user.role === "Teacher" && (
        <Button mx={6} colorScheme="teal" onClick={() => navigate(`/home/quiz/${id}`)}>
          View Quiz
        </Button>
      )}

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {assignments.map((assignment, index) => (
          <Card key={index} display="flex" flexDirection="column">
            <CardBody display="flex" flexDirection="column" flexGrow={1}>
              <HStack mb={2}>
                <Icon as={TimeIcon} color="red.500" />
                <Heading size="md">{assignment.description}</Heading>
              </HStack>
              <HStack>
                {assignment.criteria.map((criterion, i) => (
                  <Badge key={i} colorScheme="gray">
                    {criterion}
                  </Badge>
                ))}
              </HStack>
              <Text>Deadline: {assignment.deadline.slice(0, 10)}</Text>
              <Box flexGrow={1}></Box>
              <Button
                as="label"
                htmlFor={`file-input-${index}`}
                colorScheme="teal"
                width="100%"
                size="lg"
                onClick={() => handleFileUpload(assignment._id)}
              >
                Upload Assignment
                <Input
                  id={`file-input-${index}`}
                  type="file"
                  display="none"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </Button>
              <Button
                colorScheme="teal"
                my={4}
                onClick={() => handleGrade(assignment._id)}
              >
                See Grade
              </Button>
              {hasSubmitted[assignment._id] && grades[assignment._id] ? (
                <Flex direction="column">
                  <Text fontWeight="bold">Grade: {grades[assignment._id].grade}</Text>
                  {Object.entries(grades[assignment._id])
                    .filter(([key]) => key !== "grade")
                    .map(([key, value]) => (
                      <Text key={key}>
                        <strong>{key}:</strong> {value}
                      </Text>
                    ))}
                </Flex>
              ) : (
                <Text color="gray.500">Assignment not submitted yet.</Text>
              )}
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Heading as="h2" size="xl" mt={12} mb={6}>
        Course Roadmap
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {roadmapItems.map((item, index) => (
          <Card key={index}>
            <CardBody>
              <HStack mb={2}>
                <Icon as={CheckCircleIcon} color="green.500" />
                <Heading size="md">{item.title}</Heading>
              </HStack>
              <Text color="gray.600">{item.description}</Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}

const roadmapItems = [
  {
    title: "Introduction to ML Concepts",
    description: "Learn the fundamental concepts and terminology of Machine Learning.",
  },
  {
    title: "Data Preprocessing",
    description: "Understand how to prepare and clean data for model training.",
  },
  {
    title: "Model Selection",
    description: "Learn about different types of ML models and when to use them.",
  },
];
