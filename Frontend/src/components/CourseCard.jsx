import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import axios from "axios";
import { studentCourseEnrollment } from "../APIRoutes";

const SquishyCard = ({
  name,
  description,
  branch,
  studentId,
  students = [],
  id,
  enrollmentKey,
  background
}) => {
  return (
    <section className="px-4 py-12">
      <motion.div
        className="carousel-container"
        style={{ display: "flex", overflow: "hidden", cursor: "grab" }} // Set overflow to hidden
        whileTap={{ cursor: "grabbing" }}
        drag="x"
        dragConstraints={{ left: -300, right: 300 }}
        dragElastic={0.2}
      >
        <Card
          name={name}
          branch={branch}
          description={description}
          studentId={studentId}
          students={students}
          courseId={id}
          enrollmentKey={enrollmentKey}
          background={background}
        />
        {/* Add more cards as needed */}
      </motion.div>
    </section>
  );
};

const Card = ({
  name,
  description,
  branch,
  studentId,
  students = [],
  courseId,
  background=''
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("user"));

  const [isEnrolled, setIsEnrolled] = useState(students.includes(studentId));
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const [formData, setFormData] = useState({ key: "" });
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(isEnrolled);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ key: e.target.value });
  };

  const clickHandler = () => {
    if (enrollmentSuccess || user.role.toLowerCase() === "teacher") {
      navigate(`/home/course-details/${courseId}`);
    } else {
      setIsOpen(true);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${studentCourseEnrollment}/${user._id}`, {
        enrollmentKey: formData.key,
        courseId: courseId,
      })
      .then((response) => {
        if (response.status === 201) {
          toast({
            title: "Enrollment Success",
            description: "You have successfully enrolled.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setEnrollmentSuccess(true);
          setIsOpen(false);
          // Close dialog on successful enrollment
        }
      })
      .catch((error) => {
        toast({
          title: "Enrollment Error",
          description:
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <motion.div
        whileHover="hover"
        transition={{
          duration: 1,
          ease: "backInOut",
        }}
        variants={{
          hover: {
            scale: 1.05,
          },
        }}
        className="relative h-96 w-80 shrink-0 overflow-hidden rounded-xl bg-indigo-500 p-8"
        style={{ marginRight: '20px' }} // Add some margin for spacing
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(1px)", // Apply blur to the background image
          }}
        ></div>

        <div className="relative z-10 text-white">
          <span className="mb-3 block w-fit rounded-full bg-white/30 px-3 py-0.5 text-sm font-light text-white">
            {branch}
          </span>
          <motion.span
            initial={{ scale: 0.85 }}
            variants={{
              hover: {
                scale: 1,
              },
            }}
            transition={{
              duration: 1,
              ease: "backInOut",
            }}
            className="my-2 block origin-top-left font-mono text-3xl font-black leading-[1.2]"
          >
            {name}
          </motion.span>
          <p className="line-clamp-3 text-ellipsis overflow-hidden">
            {description}
          </p>
        </div>

        <button
          className="absolute bottom-4 left-4 right-4 z-20 rounded border-2 border-white bg-white py-2 text-center font-mono font-black uppercase text-neutral-800 backdrop-blur transition-colors hover:bg-white/30 hover:text-white"
          onClick={clickHandler}
        >
          {(user.role.toLowerCase() === "teacher" || enrollmentSuccess)
            ? "Open course"
            : "Enroll now"}
        </button>

        <Background />
      </motion.div>

      {/* Enrollment Popup with Form */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Enroll in Course
            </AlertDialogHeader>

            <AlertDialogBody>
              <FormControl id="key" mb={4}>
                <FormLabel>Enrollment Key</FormLabel>
                <Input
                  type="text"
                  name="key"
                  value={formData.key}
                  onChange={handleInputChange}
                />
              </FormControl>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleEnroll}
                ml={3}
                isLoading={isLoading}
              >
                Enroll
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

const Background = () => {
  return (
    <motion.svg
      width="320"
      height="384"
      viewBox="0 0 320 384"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 z-0"
      variants={{
        hover: {
          scale: 1.5,
        },
      }}
      transition={{
        duration: 1,
        ease: "backInOut",
      }}
    >
      <motion.circle
        variants={{
          hover: {
            scaleY: 0.5,
            y: -25,
          },
        }}
        transition={{
          duration: 1,
          ease: "backInOut",
          delay: 0.2,
        }}
        cx="160.5"
        cy="114.5"
        r="101.5"
        fill="#262626"
      />
      <motion.ellipse
        variants={{
          hover: {
            scaleY: 2.25,
            y: -25,
          },
        }}
        transition={{
          duration: 1,
          ease: "backInOut",
          delay: 0.2,
        }}
        cx="160.5"
        cy="265.5"
        rx="101.5"
        ry="43.5"
        fill="#262626"
      />
    </motion.svg>
  );
};

export default SquishyCard;
