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
  Flex,
  useToast,
} from "@chakra-ui/react";
import { CheckCircleIcon, TimeIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getAssignments,gradeAssignment, submitAssignment } from "../../APIRoutes/index.js";
import { host } from "../../APIRoutes/index.js";
import BarGraph from "../../components/bargraph.jsx";

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
  const [hasSubmitted, setHasSubmitted] = useState({});
  const [histo, setHisto] = useState(false);
  const [studentMarks, setStudentMarks] = useState([]);
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
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (assignmentId) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("submissionFile", file);
    formData.append("assignmentId", assignmentId);

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
        setFile(null);
        setHasSubmitted((prev) => ({ ...prev, [assignmentId]: true }));
      }
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const handleLeaderBoard = async () => {
    try {
      const response = await axios.get(`${host}/course/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response.data);
      
      setStudentMarks(response.data.leaderboard);
      setHisto(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleTakeQuiz = (id) => {
    navigate(`/home/quiz/${id}`);
  };
  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  const handleGrade = async (aid) => {
    try {
      const response = await axios.get(`${gradeAssignment}`, {
        headers: {
          studentId: `${user._id}`,
          assignmentId: `${aid}`,
        },
      });
      if (response.data.success) {
        setGrades((prev) => ({
          ...prev,
          [aid]: response.data.evaluation,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container maxW="container.xl" py={8}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <VStack align="start" justify="center" spacing={4}>
          <Heading as="h1" size="2xl">
            {selectedCourse.name}
          </Heading>
          <Text fontSize="xl" color="gray.600">
            {truncateText(selectedCourse.description, 400)}
          </Text>
          <HStack>
            <Badge colorScheme="gray">12 weeks</Badge>
            <Badge colorScheme="gray">Online</Badge>
          </HStack>
        </VStack>
        <Box position="relative" height={{ base: "200px", md: "300px" }}>
          <Image
            src={selectedCourse?.image?.url || "/placeholder.svg"}
            alt={`${selectedCourse.name} Course Cover`}
            objectFit="cover"
            layout="fill"
          />
        </Box>
      </SimpleGrid>
      <Button color={"teal"} onClick={() => handleTakeQuiz(id)} m={5}>
        Take Quiz
      </Button>
      {/* Conditionally render the "Take Quiz" button */}
      {selectedCourse.name === "Sign Language" && (
        <Button
          color={"teal"}
          onClick={() => navigate("/home/signLanguage")}
          m={5}
        >
          Learn
        </Button>
      )}

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {assignments.map((item, index) => (
          <Card key={index} display="flex" flexDirection="column" height="100%">
            <CardBody display="flex" flexDirection="column" flexGrow={1}>
              <HStack mb={2}>
                <Icon as={TimeIcon} color="red.500" />
                <Heading size="md">{item.description}</Heading>
              </HStack>
              <HStack className="flex flex-wrap">
                {item.criteria.map((c, index) => (
                  <Badge colorScheme="gray" key={index}>
                    {c}
                  </Badge>
                ))}
              </HStack>
              <Text fontWeight="semibold">
                Deadline: {item.deadline.toString().slice(0, 10)}
              </Text>

              <Button
                as="label"
                htmlFor={`file-input-${index}`}
                colorScheme="teal"
                width="100%"
                mt="auto"
                size="lg"
                onClick={() => handleFileUpload(item._id)}
                cursor="pointer"
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
                className="my-4"
                onClick={() => handleGrade(item._id)}
              >
                See Grade
              </Button>
              {grades[item._id] && (
                <Flex className="flex-col">
                  <Text fontWeight="bold" fontSize="lg">
                    Grade: {grades[item._id].grade}
                  </Text>
                  {Object.entries(grades[item._id])
                    .filter(([key]) => key !== "grade")
                    .map(([key, value]) => (
                      <Text key={key}>
                        <span style={{ fontWeight: "bold" }}>{key}:</span>{" "}
                        {value}
                      </Text>
                    ))}
                </Flex>
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

      {!histo ? (
        <Button colorScheme="teal" className="my-4" onClick={handleLeaderBoard}>
          Check Leaderboard
        </Button>
      ) : (
        <Button
          colorScheme="teal"
          className="my-4"
          onClick={() => {
            setHisto(false);
            setStudentMarks([]);
          }}
        >
          Remove Leaderboard
        </Button>
      )}

      {histo && <BarGraph studentMarks={studentMarks} />}
    </Container>
  );
}

const roadmapItems = [
  {
    title: "Introduction to ML Concepts",
    description:
      "Learn the fundamental concepts and terminology of Machine Learning.",
  },
  {
    title: "Data Preprocessing",
    description: "Understand how to prepare and clean data for model training.",
  },
  {
    title: "Model Selection",
    description:
      "Learn about different types of ML models and when to use them.",
  },
];
