import React, { useState, useEffect } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Badge,
  useColorModeValue,
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { host } from "../../APIRoutes";
import "./calendarStyles.css";

// Extend the theme for custom styles
const theme = extendTheme({
  colors: {
    brand: {
      50: "#e3f2fd",
      100: "#bbdefb",
      500: "#2196f3",
      600: "#1e88e5",
    },
  },
});

export default function AssignmentCalendar() {
  const [deadlines, setDeadlines] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const user = JSON.parse(localStorage.getItem("user"));

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await axios.get(
          `${host}/student/assignment/${user._id}`
        );
        if (response.data.success) {
          setDeadlines(response.data.deadlines);
        } else {
          setError("Failed to fetch deadlines.");
        }
      } catch (err) {
        console.error("Error fetching deadlines:", err);
        setError("Error fetching deadlines. Please try again later.");
      }
    };

    fetchDeadlines();
  }, [user._id]);

  // Function to format dates for comparison
  const formatDate = (dateString) => {
    return new Date(dateString).toDateString();
  };

  // Tailwind-based coloring for calendar tiles
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const deadline = deadlines.find(
        (d) => formatDate(d.deadline) === date.toDateString()
      );

      if (deadline) {
        return deadline.submitted
          ? "submitted" // Add specific classes for submitted
          : "unsubmitted"; // And unsubmitted
      }
    }
    return null;
  };

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center" color="brand.600">
            Assignment Calendar
          </Heading>
          <Box
            bg={bgColor}
            borderRadius="lg"
            borderWidth={1}
            borderColor={borderColor}
            p={6}
            boxShadow="lg">
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="center"
              align="center">
              <Box width={{ base: "100%", md: "auto" }} mb={{ base: 6, md: 0 }}>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileClassName={tileClassName}
                  className="mx-auto"
                />
              </Box>
              <Box
                ml={{ base: 0, md: 8 }}
                width={{ base: "100%", md: "300px" }}>
                <Heading as="h3" size="md" mb={4} color="brand.600">
                  Upcoming Deadlines
                </Heading>
                <VStack
                  align="stretch"
                  spacing={3}
                  maxH="300px"
                  overflowY="auto">
                  {deadlines.length > 0 ? (
                    deadlines.map((deadline) => (
                      <Flex
                        key={deadline._id}
                        align="center"
                        justify="space-between">
                        <Text color={textColor}>{deadline.title}</Text>
                        <Badge
                          colorScheme={deadline.submitted ? "green" : "red"}>
                          {new Date(deadline.deadline).toLocaleDateString()}
                        </Badge>
                      </Flex>
                    ))
                  ) : (
                    <Text color="gray.500">No upcoming deadlines.</Text>
                  )}
                </VStack>
              </Box>
            </Flex>
          </Box>
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </VStack>
      </Container>
    </ChakraProvider>
  );
}
