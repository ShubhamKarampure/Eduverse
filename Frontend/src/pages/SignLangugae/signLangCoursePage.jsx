"use client"

import React, { useState, useRef, useEffect } from 'react'
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Heading, 
  Progress, 
  Text, 
  VStack,
  HStack,
  AspectRatio,
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react'
import { FaCamera, FaPlay, FaPause } from 'react-icons/fa'
import { flaskApi } from '../../APIRoutes'
import axios from 'axios'

export default function SignLanguageCourse() {
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [accuracy, setAccuracy] = useState(0)
  const videoRef = useRef(null)
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const bgColor = useColorModeValue('blue.50', 'blue.900')
  const cardBgColor = useColorModeValue('white', 'blue.800')
  const textColor = useColorModeValue('blue.800', 'white')
  const accentColor = useColorModeValue('blue.600', 'blue.200')

  const [img,setImg]=useState()

  useEffect(() => {
    const getFeed= async()=>{
      try{
          const response=await axios.get(flaskApi+'/video_feed',{ withCredentials: true },{
            headers:{
                "Content-Type":"application/json",
            },
            withCredentials:true
          })
          console.log(response.data);
          setImg(response.data);

      }catch(e){
        console.log(e)
      }
      
    }
    getFeed()
  }, [isCameraOn])

  useEffect(() => {
    // Mock accuracy update - replace with actual assessment logic
    const interval = setInterval(() => {
      setAccuracy(prev => Math.min(100, prev + Math.random() * 10))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleCamera = () => {
    setIsCameraOn(prev => !prev)
  }

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev)
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  return (
    <Box minHeight="100vh" bg={bgColor} p={8}>
      <Container maxWidth="6xl">
        <Heading as="h1" size="2xl" color={textColor} mb={8}>Sign Language Course</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box bg={cardBgColor} borderRadius="lg" overflow="hidden" boxShadow="md">
            <VStack align="stretch" p={4}>
              <Heading as="h2" size="lg" color={textColor}>Lesson Video</Heading>
              <Text color={accentColor}>Watch and learn the sign</Text>
              <AspectRatio ratio={16/9} bg="blue.200">
                <Box position="relative">
                  <video 
                    ref={videoRef}
                    src="/placeholder.mp4"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    aria-label="Sign language lesson video"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <Button 
                    position="absolute"
                    bottom="4"
                    right="4"
                    onClick={togglePlayPause} 
                    colorScheme="blue"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </Button>
                </Box>
              </AspectRatio>
            </VStack>
          </Box>

          <Box bg={cardBgColor} borderRadius="lg" overflow="hidden" boxShadow="md">
            <VStack align="stretch" p={4}>
              <Heading as="h2" size="lg" color={textColor}>Your Practice</Heading>
              <Text color={accentColor}>Use your webcam to practice</Text>
              <AspectRatio ratio={16/9} bg="blue.100">
                <Box>
                  {}
                </Box>
              </AspectRatio>
              <Button 
                onClick={toggleCamera} 
                colorScheme="blue"
                leftIcon={<FaCamera />}
                aria-label={isCameraOn ? "Turn camera off" : "Turn camera on"}
              >
                {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>

        <Box bg={cardBgColor} borderRadius="lg" mt={8} p={4} boxShadow="md">
          <Heading as="h2" size="lg" color={textColor}>Real-time Assessment</Heading>
          <Text color={accentColor}>See how well you're performing the sign</Text>
          <VStack align="stretch" mt={4}>
            <Text color={textColor}>Accuracy</Text>
            <Progress value={accuracy} colorScheme="blue" height="4" />
            <Text color={textColor} fontWeight="bold" aria-live="polite">{Math.round(accuracy)}% Accuracy</Text>
          </VStack>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mt={8}>
          <Box bg={cardBgColor} borderRadius="lg" p={4} boxShadow="md">
            <Heading as="h3" size="md" color={textColor}>Course Progress</Heading>
            <VStack align="stretch" mt={4}>
              <Text color={textColor}>Overall Progress</Text>
              <Progress value={30} colorScheme="blue" height="4" />
              <Text color={textColor}>30% Complete</Text>
            </VStack>
          </Box>

          <Box bg={cardBgColor} borderRadius="lg" p={4} boxShadow="md">
            <Heading as="h3" size="md" color={textColor}>Next Lesson</Heading>
            <Text color={accentColor} mt={4}>Numbers and Counting</Text>
          </Box>

          <Box bg={cardBgColor} borderRadius="lg" p={4} boxShadow="md">
            <Heading as="h3" size="md" color={textColor}>Practice Stats</Heading>
            <VStack align="stretch" mt={4}>
              <Text color={accentColor}>Total practice time: 2h 30m</Text>
              <Text color={accentColor}>Signs mastered: 15</Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  )
}