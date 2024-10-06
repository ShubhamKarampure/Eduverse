import React from "react";
import {
  Box,
  Container,
  Flex,
  VStack,
  Heading,
  Text,
  Avatar,
  SimpleGrid,
  Progress,
  Card,
  CardHeader,
  CardBody,
  Icon,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaBook,
  FaStar,
  FaClipboardCheck,
  FaClock,
  FaChartBar,
  FaAward,
  FaGraduationCap,
} from "react-icons/fa";

// StatCard component
const StatCard = ({ icon, title, value }) => (
  <Card height="120px" width="100%">
    <CardHeader>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="sm" fontWeight="medium">
          {title}
        </Text>
        <Icon as={icon} w={6} h={6} color="blue.500" />
      </Flex>
    </CardHeader>
    <CardBody>
      <Text fontSize="2xl" fontWeight="bold">
        {value}
      </Text>
    </CardBody>
  </Card>
);

// MetricBar component
const MetricBar = ({ label, value }) => (
  <Box height="60px">
    <Flex justify="space-between" alignItems="center" mb={2}>
      <Text fontSize="sm">{label}</Text>
      <Text fontSize="sm" fontWeight="medium">
        {value}%
      </Text>
    </Flex>
    <Progress value={value} size="sm" colorScheme="blue" />
  </Box>
);

// Achievement component
const Achievement = ({ icon, title, description }) => (
  <Flex alignItems="center">
    <Box bg="blue.100" p={2} borderRadius="full" mr={4}>
      <Icon as={icon} w={6} h={6} color="blue.500" />
    </Box>
    <Box>
      <Text fontWeight="semibold">{title}</Text>
      <Text fontSize="sm" color="gray.600">
        {description}
      </Text>
    </Box>
  </Flex>
);

// Main TeacherProfile component
const TeacherProfile = () => {
  const user=JSON.parse(localStorage.getItem('user'))
  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="blue.600" color="white" py={6}>
        <Container maxW="container.xl">
          <Heading as="h1" size="xl">
            Eduverse Teacher Profile
          </Heading>
        </Container>
      </Box>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Card>
            <CardBody>
              <Flex alignItems="center" mb={4}>
                <Avatar size="xl" name={user.name} src={user.avatar} mr={4} />
                <Box>
                  <Heading as="h2" size="lg">
                    {user.name}
                  </Heading>
                  <Text color="gray.500">Computer Science | AI Specialist</Text>
                </Box>
              </Flex>
              <Text color="gray.600">
                Passionate educator with 10+ years of experience in AI and
                Machine Learning.
              </Text>
            </CardBody>
          </Card>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <StatCard icon={FaUsers} title="Total Students" value="15,234" />
            <StatCard icon={FaBook} title="Courses Created" value="24" />
            <StatCard icon={FaStar} title="Avg. Course Rating" value="4.8" />
          </SimpleGrid>

          <Card>
            <CardHeader>
              <Heading size="md">Performance Metrics</Heading>
            </CardHeader>
            <CardBody>
              <Flex>
                <Box flex="1" mr={4}>
                  <VStack spacing={4}>
                    <MetricBar label="Course Completion Rate" value={85} />
                    <MetricBar label="Quiz Pass Rate" value={92} />
                    <MetricBar
                      label="Assignment Grading Efficiency"
                      value={98}
                    />
                  </VStack>
                </Box>
                <Box flex="1">
                  <VStack spacing={4}>
                    <StatCard
                      icon={FaClipboardCheck}
                      title="Total Reviews"
                      value="3,756"
                    />
                    <StatCard
                      icon={FaClock}
                      title="Avg. Response Time"
                      value="2.3 hours"
                    />
                    <StatCard
                      icon={FaChartBar}
                      title="Leaderboard Rank"
                      value="#7"
                    />
                  </VStack>
                </Box>
              </Flex>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Recent Achievements</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Achievement
                  icon={FaAward}
                  title="Top AI Educator 2023"
                  description="Recognized for outstanding contributions in AI education"
                />
                <Achievement
                  icon={FaGraduationCap}
                  title="1000+ Student Milestone"
                  description="Successfully taught and mentored over 1000 students"
                />
                <Achievement
                  icon={FaStar}
                  title="5-Star Course Rating"
                  description="Maintained a perfect 5-star rating for 'Advanced Machine Learning' course"
                />
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};
export default TeacherProfile;
