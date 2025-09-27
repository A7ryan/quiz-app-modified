import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import { selectIsAuthenticated, selectIsStudent, selectIsFaculty } from "../store/authSlice";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const quizImages = [
  "/images/quiz1.png",
  "/images/quiz2.png",
  "/images/quiz3.png",
];

const questions = [
  "Ready to test your knowledge?",
  "Challenge yourself with exciting quizzes!",
  "Compete, learn, and have fun!",
];

export default function HomePage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isStudent = useSelector(selectIsStudent);
  const isFaculty = useSelector(selectIsFaculty);

  // Auto-change questions every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartQuiz = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (isStudent) {
      navigate("/quiz");
    } else if (isFaculty) {
      navigate("/customQuiz");
    }
  };

  const getButtonText = () => {
    if (!isAuthenticated) return "Login to Start";
    if (isStudent) return "Start Quiz";
    if (isFaculty) return "Create Quiz";
    return "Get Started";
  };

  const getCurrentMessage = () => {
    if (!isAuthenticated) {
      return questions[currentQuestion];
    }
    if (isStudent) {
      return "Ready to test your knowledge?";
    }
    if (isFaculty) {
      return "Ready to create engaging quizzes?";
    }
    return questions[currentQuestion];
  };

  return (
    <div className="relative w-full h-screen text-white overflow-hidden">
      {/* Background Image Slider */}
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={3000}
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        {quizImages.map((image, index) => (
          <div key={index} className="w-full h-screen">
            <img
              src={image}
              alt="Quiz Background"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        ))}
      </Carousel>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-6">
        <motion.h1
          className="text-4xl md:text-6xl font-bold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Quizo
        </motion.h1>

        {/* Dynamic Messages Based on User Role */}
        <motion.p
          key={isAuthenticated ? 'authenticated' : currentQuestion}
          className="text-lg md:text-2xl mt-4 max-w-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 1 }}
        >
          {getCurrentMessage()}
        </motion.p>

        {/* Role-based Action Buttons */}
        <motion.div
          className="mt-6 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            className="px-6 py-3 text-lg bg-yellow-500 hover:bg-yellow-600 shadow-xl text-white rounded-md transition"
            onClick={handleStartQuiz}
          >
            {getButtonText()}
          </button>
          
          {/* Additional button for faculty */}
          {isFaculty && (
            <button
              className="px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 shadow-xl text-white rounded-md transition"
              onClick={() => navigate("/questions")}
            >
              Manage Questions
            </button>
          )}
        </motion.div>
        
        {/* Role indicator */}
        {isAuthenticated && (
          <motion.div
            className="mt-4 text-sm opacity-75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ delay: 1.5 }}
          >
            Logged in as: <span className="font-semibold capitalize">{isStudent ? 'Student' : 'Faculty'}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
