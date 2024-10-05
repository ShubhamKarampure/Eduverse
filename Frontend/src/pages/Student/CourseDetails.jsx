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
} from "@chakra-ui/react";
import { CheckCircleIcon, TimeIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getAssignments, submitAssignment } from "../../APIRoutes/index.js";
import { getAllCoursesByInstructor } from "../../APIRoutes/index.js";

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
  const navigate = useNavigate();
  const [isButtonDisabled, setButtonDisabled] = useState(false);
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
    formData.append("assignmentId", assignmentId); // Append the file

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
        alert("File uploaded successfully");
      }
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  if (!selectedCourse) {
    return (
      <Container maxW="container.xl" py={8}>
        <Heading>Course not found</Heading>
      </Container>
    );
  }
  const handleViewQuiz=()=>{
    if(user.role==='Teacher'){
        navigate(`/home/quiz/${id}`)
    }
  }
  const handleTakeQuiz = (id_) => {
    navigate(`/home/quiz/${id_}`);
  };
  const handleButton = (e, id) => {
    e.preventDefault();
    setButtonDisabled(true);
    if (user.role === "Student") {
      handleTakeQuiz(id);
    } else {
      handleGenerateQuiz(id);
    }
    setButtonDisabled(false);
  };
  const handleGenerateQuiz = (id) => {
    // console.log(id);

    axios
      .get(`${getAllCoursesByInstructor}/${id}`)
      .then((response) => {
        // console.log(response.data);
        toast({
          title: "Generation Success",
          description: "You have successfully generated a quiz.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((e) => {
        console.log(e);
        toast({
          title: "Generation Failed",
          description: "An error occured." + { e },
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };
  return (
    <Container maxW="container.xl" py={8}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <VStack align="start" justify="center" spacing={4}>
          <Heading as="h1" size="2xl">
            {selectedCourse.name}
          </Heading>
          <Text
            fontSize="xl"
            color="gray.600"
            className="line-clamp-3 text-ellipsis overflow-hidden"
          >
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
            alt={`${selectedCourse.name} Course Cover`}
            objectFit="cover"
            layout="fill"
          />
        </Box>
      </SimpleGrid>
      <Button
        my={6}
        color={"teal"}
        onClick={(e) => handleButton(e, id)}
        disabled={isButtonDisabled}
      >
        {user.role === "Student" ? "Take Quiz" : "Generate Quiz"}
      </Button>
      <Button
        mx={6}
        color={"teal"}
        className={user.role === "Student" ? "hidden" : ""}
        onClick={handleViewQuiz}
      >
        View Quiz
      </Button>
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
              <Text className="font-semibold text-sm">
                Deadline: {item.deadline.toString().slice(0, 10)}
              </Text>
              {/* Spacer to push the input to the bottom */}
              <Box flexGrow={1}></Box>

              {/* Styled Input */}
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
                  accept=".pdf" // Only accept PDF files
                  onChange={handleFileChange} //
                />
              </Button>
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

// Dummy roadmap items
const roadmapItems = [
  {
    title: "Introduction to ML Concepts",
    description:
      "Learn the fundamental concepts and terminology of Machine Learning.",
  },
  {
    title: "Data Preprocessing",
    description:
      "Understand how to clean, transform, and prepare data for ML models.",
  },
  {
    title: "Supervised Learning",
    description: "Explore algorithms for classification and regression tasks.",
  },
  {
    title: "Unsupervised Learning",
    description: "Discover clustering and dimensionality reduction techniques.",
  },
  {
    title: "Model Evaluation",
    description:
      "Learn how to assess and improve the performance of ML models.",
  },
  {
    title: "Deep Learning Basics",
    description:
      "Introduction to neural networks and deep learning frameworks.",
  },
];
