import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "../Layout";
import { Home, Profile, Quiz } from "../pages";
import {
  ResetPassword,
  Login,
  Register,
  Questions,
  QuizCreation,
  RoleProtectedRoute,
} from "../components";
import AdminDashboard from "../components/admin/AdminDashboard";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />
        <Route path="resetPassword" element={<ResetPassword />} />
        {/* Students can take quizzes */}
        <Route path="quiz" element={
          <RoleProtectedRoute allowedRoles="student">
            <Quiz />
          </RoleProtectedRoute>
        } />
        {/* Faculty can manage questions */}
        <Route path="questions" element={
          <RoleProtectedRoute allowedRoles="faculty">
            <Questions />
          </RoleProtectedRoute>
        } />
        {/* Faculty can create custom quizzes */}
        <Route path="customQuiz" element={
          <RoleProtectedRoute allowedRoles="faculty">
            <QuizCreation />
          </RoleProtectedRoute>
        } />
        {/* Admin dashboard */}
        <Route path="admin" element={
          <RoleProtectedRoute allowedRoles="admin">
            <AdminDashboard />
          </RoleProtectedRoute>
        } />
      </Route>
    </Route>
  )
);

export { router };
