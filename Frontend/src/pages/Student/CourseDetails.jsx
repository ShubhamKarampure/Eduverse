import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
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
  FormControl,
  FormLabel,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { CheckCircleIcon, TimeIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { generateRoadmap, getAssignments, gradeAssignment, submitAssignment } from "../../APIRoutes/index.js";
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
  const navigate = useNavigate();
  const selectedCourse = courses.find((course) => course._id === id);
  const roadmap = selectedCourse?.roadmap ? selectedCourse.roadmap : [];
  const [roadmaps, setRoadmaps] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [file, setFile] = useState(null);
  const [grades, setGrades] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState({});
  const [histo, setHisto] = useState(false);
  const [studentMarks, setStudentMarks] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    deadline: "",
    course: id,
    description: "",
    criteria: ["", "", ""],
  });
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

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
        console.log("Error fetching assignments:", error);
      }
    };
    fetchAssignments();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCriteriaChange = (index, value) => {
    const updatedCriteria = [...newAssignment.criteria];
    updatedCriteria[index] = value;
    setNewAssignment((prev) => ({
      ...prev,
      criteria: updatedCriteria,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (assignmentId) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

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
      toast({
        title: "Upload failed",
        description: "There was an error uploading your assignment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
      console.log("Error fetching leaderboard:", error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleTakeQuiz = (id) => {
    navigate(`/home/quiz/${id}`);
  };

  const handleGenerateQuiz = async () => {
    try {
      const response = await axios.get(`${host}/teacher/course/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        console.log("Quiz generated:", response.data);
        toast({
          title: `Success`,
          description: `Quiz generated successfully`,
          status: `success`,
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("Error generating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to generate quiz.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCreateAssignment = async () => {
    // Validate the form inputs
    const { deadline, course, description, criteria } = newAssignment;
    if (!deadline || !course || !description || criteria.some(c => !c)) {
      toast({
        title: "Incomplete Form",
        description: "Please fill out all fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const assignmentData = {
      deadline,
      course,
      description,
      criteria,
    };

    try {
      const response = await axios.post(`${host}/teacher/assignment`, assignmentData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response.data.success) {
        toast({
          title: "Assignment Created",
          description: "Your assignment has been created successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setShowAssignmentForm(false);
        setNewAssignment({
          deadline: "",
          course: id,
          description: "",
          criteria: ["", "", ""],
        });
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
            console.log("Error fetching assignments:", error);
          }
        };
        fetchAssignments();
      } else {
        toast({
          title: "Failed to Create Assignment",
          description: response.data.message || "Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("Error creating assignment:", error);
      toast({
        title: "Error",
        description: "There was an error creating the assignment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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
      console.log("Error fetching grade:", error);
      toast({
        title: "Error",
        description: "Failed to fetch grade.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGenerateRoadmap = async () => {
    try {
      const response = await axios.get(`${generateRoadmap}/${id}`, {
        withCredentials: true
      });
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Roadmap generated",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setRoadmaps(response.data.roadmap);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to generate roadmap.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <VStack align="start" justify="center" spacing={4}>
          <Heading as="h1" size="2xl">
            {selectedCourse.name}
          </Heading>
          <Text fontSize="xl" color="gray.600" w="full">
            {truncateText(selectedCourse.description, 400)}
          </Text>
          <HStack>
            <Badge colorScheme="gray">12 weeks</Badge>
            <Badge colorScheme="gray">Online</Badge>
          </HStack>
        </VStack>
      </Box>
      <Button color={"teal"} onClick={() => handleTakeQuiz(id)} m={5}>
        {user.role == 'Teacher' ? `Take Quiz` : 'View Quiz'}
      </Button>
      {user.role == 'Teacher' && <Button color={"teal"} onClick={() => handleGenerateQuiz()} m={5}>
        Generate Quiz
      </Button>}
      {user.role == 'Teacher' && roadmaps.length === 0 && roadmap.length === 0 && <Button color={"teal"} onClick={() => handleGenerateRoadmap()} m={5}>
        Generate Roadmap
      </Button>}
      {/* Conditionally render the "Take Quiz" button */}
      {selectedCourse.name === "Sign Language" && (
        <Button
          color={"teal"}
          onClick={() => window.open("http://localhost:8502/")}
          m={5}
        >
          Learn
        </Button>
      )}

      {/* Assignments List */}
      {assignments.length !== 0 && <Heading as="h2" size="xl" mt={12} mb={6}>
        Assignments
      </Heading>}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {assignments.map((item, index) => (
          <Card key={item._id} display="flex" flexDirection="column" height="100%">
            <CardBody display="flex" flexDirection="column" flexGrow={1}>
              <HStack mb={2}>
                <Icon as={TimeIcon} color="red.500" />
                <Heading size="md">{item.description}</Heading>
              </HStack>
              <HStack className="flex flex-wrap">
                {item.criteria.map((c, idx) => (
                  <Badge colorScheme="gray" key={idx}>
                    {c}
                  </Badge>
                ))}
              </HStack>
              <Text fontWeight="semibold">
                Deadline: {new Date(item.deadline).toLocaleDateString()}
              </Text>

              {user.role === 'Student' && (
                <>
                  <Button
                    as="label"
                    htmlFor={`file-input-${index}`}
                    colorScheme="teal"
                    width="100%"
                    mt="auto"
                    size="lg"
                    cursor="pointer"
                  >
                    {hasSubmitted[item._id] ? "Uploaded" : "Upload Assignment"}
                    <Input
                      id={`file-input-${index}`}
                      type="file"
                      display="none"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {!hasSubmitted[item._id] && (
                    <Button
                      colorScheme="teal"
                      className="my-4"
                      onClick={() => handleFileUpload(item._id)}
                      isDisabled={!file}
                    >
                      Submit
                    </Button>
                  )}

                  <Button
                    colorScheme="teal"
                    className="my-4"
                    onClick={() => handleGrade(item._id)}
                  >
                    See Grade
                  </Button>
                </>
              )}

              {grades[item._id] && (
                <Flex direction="column" mt={4}>
                  <Text fontWeight="bold" fontSize="lg">
                    Grade: {grades[item._id].grade}
                  </Text>
                  {Object.entries(grades[item._id])
                    .filter(([key]) => key !== "grade")
                    .map(([key, value]) => (
                      <Text key={key}>
                        <span style={{ fontWeight: "bold" }}>{key}:</span> {value}
                      </Text>
                    ))}
                </Flex>
              )}
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Create Assignment Form (Teacher Only) */}
      {user.role === 'Teacher' && (
        <>
          {showAssignmentForm ? (
            <Box p={6} borderWidth="1px" borderRadius="lg" mb={6} mt={8}>
              <Heading as="h3" size="lg" mb={6}>
                Create New Assignment
              </Heading>

              <FormControl mb={4}>
                <FormLabel>Deadline</FormLabel>
                <Input
                  type="date"
                  name="deadline"
                  value={newAssignment.deadline}
                  onChange={handleInputChange}
                />
              </FormControl>

              {/* <FormControl mb={4}>
                <FormLabel>Course</FormLabel>
                <Select
                  name="course"
                  placeholder="Select course"
                  value={newAssignment.course}
                  onChange={handleInputChange}
                >
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </Select>
              </FormControl> */}

              <FormControl mb={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={newAssignment.description}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Criteria 1</FormLabel>
                <Input
                  value={newAssignment.criteria[0]}
                  onChange={(e) => handleCriteriaChange(0, e.target.value)}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Criteria 2</FormLabel>
                <Input
                  value={newAssignment.criteria[1]}
                  onChange={(e) => handleCriteriaChange(1, e.target.value)}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Criteria 3</FormLabel>
                <Input
                  value={newAssignment.criteria[2]}
                  onChange={(e) => handleCriteriaChange(2, e.target.value)}
                />
              </FormControl>

              <Button colorScheme="teal" onClick={handleCreateAssignment}>
                Submit Assignment
              </Button>
              <Button mx={2} colorScheme="teal" onClick={() => { setShowAssignmentForm(false) }}>
                Back
              </Button>
            </Box>
          ) : (
            <Button colorScheme="teal" onClick={() => setShowAssignmentForm(true)} m={2}>
              Create Assignment
            </Button>
          )}
        </>
      )}

      {/* Leaderboard */}
      {(roadmap.length !== 0 || roadmaps.length !== 0) && <Heading as="h2" size="xl" mt={12} mb={6}>
        Course Roadmap
      </Heading>}

      {roadmap.length !== 0 && <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {roadmap.map((item, index) => (
          <Card key={index}>
            <CardBody>
              <HStack mb={2}>
                <Icon as={CheckCircleIcon} color="green.500" />
                <Heading size="md">{item.title}</Heading>
              </HStack>
              <Text color="gray.600">{item.description}</Text>
              {user.role === "Teacher" && <Button colorScheme="teal">Upload Content</Button>}
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>}

      {roadmaps.length !== 0 && <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {roadmaps.map((item, index) => (
          <Card key={index}>
            <CardBody>
              <HStack mb={2}>
                <Icon as={CheckCircleIcon} color="green.500" />
                <Heading size="md">{item.title}</Heading>
              </HStack>
              <Text color="gray.600">{item.description}</Text>
              {user.role === "Teacher" && <Button colorScheme="teal">Upload Content</Button>}
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>}

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

