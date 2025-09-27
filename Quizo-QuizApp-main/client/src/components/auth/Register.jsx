import { useState } from "react";
import { registerUser } from "../../api";
import { RiUser3Line, RiLock2Line } from "react-icons/ri";
import bgImage from "../../assets/auth-bg.png";
import { useNavigate } from "react-router-dom";
import {
  InputField,
  PasswordField,
  ValidatePassword,
  ValidateEmail,
} from "../../utils";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [facultyCode, setFacultyCode] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  
  // Faculty registration code (in a real app, this should be in env variables)
  const FACULTY_REGISTRATION_CODE = "FACULTY2024";
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!ValidateEmail(email)) errors.email = "Invalid email format.";
    const passwordValidation = ValidatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = "Password must meet security criteria.";
    }
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match.";
    if (userType === "faculty" && facultyCode !== FACULTY_REGISTRATION_CODE) {
      errors.facultyCode = "Invalid faculty registration code.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    // console.log({ name,email, password });
    setMessage("");
    if (!validateForm()) {
      return;
    }
    try {
      await registerUser(name, email, password, userType);
      setMessage("✅ Registration successful");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage(`❌ ${error}`);
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="relative h-screen flex items-center justify-center">
      {/* Background image */}
      <img
        src={bgImage}
        alt="login background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative bg-white/10 border-2 border-white mx-6 p-8 rounded-xl backdrop-blur-md sm:w-[400px] sm:p-12">
        <h1 className="text-center text-3xl font-medium text-gray-900 mb-8">
          Register
        </h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-6 mb-6">
            {/* Name input */}
            <InputField
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
              }}
              required={true}
              error={errors.name}
              Icon={<RiUser3Line />}
            />

            {/* Email input */}
            <InputField
              type="email"
              name="email"
              placeholder="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
              }}
              error={errors.email}
              Icon={<RiUser3Line />}
              required={true}
            />

            {/* Password input */}

            <PasswordField
              name="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
              }}
              error={errors.password}
              showChecklist={true}
              required={true}
              Icon={<RiLock2Line />}
            />
            {/* Confirm-Password input */}
            <PasswordField
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  confirmPassword: "",
                }));
              }}
              error={errors.confirmPassword}
              showChecklist={false}
              Icon={<RiLock2Line />}
            />
            
            {/* User Type Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Register as:</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="student"
                    checked={userType === "student"}
                    onChange={(e) => {
                      setUserType(e.target.value);
                      setErrors((prevErrors) => ({ ...prevErrors, facultyCode: "" }));
                    }}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Student</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="faculty"
                    checked={userType === "faculty"}
                    onChange={(e) => setUserType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Faculty</span>
                </label>
              </div>
            </div>
            
            {/* Faculty Registration Code (only shown for faculty) */}
            {userType === "faculty" && (
              <InputField
                type="text"
                name="facultyCode"
                placeholder="Faculty Registration Code"
                value={facultyCode}
                onChange={(e) => {
                  setFacultyCode(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, facultyCode: "" }));
                }}
                error={errors.facultyCode}
                required={true}
                Icon={<RiLock2Line />}
              />
            )}
          </div>

          <a
            href="#"
            className="text-sm text-slate-700 hover:underline flex justify-end"
          >
            Forgot Password?
          </a>
          <div className="flex items-center gap-2">
            {/* Consent checkbox */}

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className=""
              />

              <span className="">
                By continuing, you agree to Quizos{" "}
                <a href="#" className="text-blue-500">
                  Terms of Service
                </a>{" "}
                &{" "}
                <a href="#" className="text-blue-500">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            className={`w-full py-3 font-medium rounded-lg ${
              isChecked
                ? "bg-white text-gray-900 hover:bg-gray-200"
                : "bg-gray-200 cursor-not-allowed"
            }`}
            disabled={!isChecked}
          >
            Resister
          </button>
          {message && (
            <p className="mt-4 text-center text-red-600">{message}</p>
          )}
        </form>
        <p className="text-center text-sm text-gray-700 mt-6">
          Have an account?{" "}
          <a href="/login" className="font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
