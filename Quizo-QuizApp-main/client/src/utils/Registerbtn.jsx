// import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";

// const RegisterButton = ({ className }) => {
//   const navigate = useNavigate();

//   const handleRegisterClick = () => {
//     navigate("/register");
//   };

//   return (
//     <button
//       onClick={handleRegisterClick}
//       className={`px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ${
//         className || ""
//       }`}
//     >
//       Register
//     </button>
//   );
// };

// RegisterButton.propTypes = {
//   className: PropTypes.string,
// };

// RegisterButton.defaultProps = {
//   className: "",
// };

// export default RegisterButton;
import { useState } from "react";
import { registerUser } from "../api/authApi.js"; // make sure path is correct
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setError("");

    try {
      const data = await registerUser(name, email, password);
      console.log("Registered:", data);
      navigate("/login"); // redirect after successful registration
    } catch (err) {
      setError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
