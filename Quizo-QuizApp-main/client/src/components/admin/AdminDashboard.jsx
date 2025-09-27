import { useState, useEffect } from "react";
import { 
  getDashboardStats, 
  getAllStudents, 
  getQuizResults,
  downloadStudentData,
  downloadQuizResults 
} from "../../api/adminApi";
import {
  FiUsers,
  FiUserCheck,
  FiFileText,
  FiTrendingUp,
  FiDownload,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw
} from "react-icons/fi";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  
  // Pagination states
  const [studentsPage, setStudentsPage] = useState(1);
  const [studentsPagination, setStudentsPagination] = useState({});
  const [resultsPage, setResultsPage] = useState(1);
  const [resultsPagination, setResultsPagination] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === "students") {
      loadStudents();
    } else if (activeTab === "results") {
      loadQuizResults();
    }
  }, [activeTab, studentsPage, resultsPage]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDashboardStats();
      setStats(data.data);
    } catch (err) {
      setError(err.toString());
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await getAllStudents(studentsPage, 10);
      setStudents(data.data.students);
      setStudentsPagination(data.data.pagination);
    } catch (err) {
      setError(err.toString());
    }
  };

  const loadQuizResults = async () => {
    try {
      const data = await getQuizResults(resultsPage, 20);
      setQuizResults(data.data.results);
      setResultsPagination(data.data.pagination);
    } catch (err) {
      setError(err.toString());
    }
  };

  const handleDownload = async (type, format) => {
    try {
      setDownloadLoading(true);
      if (type === "students") {
        await downloadStudentData(format);
      } else if (type === "results") {
        await downloadQuizResults(format);
      }
    } catch (err) {
      setError(err.toString());
    } finally {
      setDownloadLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className="text-3xl" style={{ color }} />
      </div>
    </div>
  );

  const PaginationControls = ({ pagination, currentPage, onPageChange }) => (
    <div className="flex items-center justify-between mt-4 px-4 py-2 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-600">
        Page {pagination.currentPage} of {pagination.totalPages} 
        ({pagination.totalStudents || pagination.totalResults} total)
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="p-2 rounded-md bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <FiChevronLeft />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="p-2 rounded-md bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <FiRefreshCw className="animate-spin text-2xl text-blue-500" />
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor quiz performance and student data</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
            {[
              { id: "overview", label: "Overview", icon: FiTrendingUp },
              { id: "students", label: "Students", icon: FiUsers },
              { id: "results", label: "Quiz Results", icon: FiFileText }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={FiUsers}
                title="Total Students"
                value={stats.stats.totalStudents}
                color="#3B82F6"
              />
              <StatCard
                icon={FiUserCheck}
                title="Faculty Members"
                value={stats.stats.totalFaculty}
                color="#10B981"
              />
              <StatCard
                icon={FiFileText}
                title="Total Questions"
                value={stats.stats.totalQuestions}
                color="#F59E0B"
              />
              <StatCard
                icon={FiTrendingUp}
                title="Quiz Attempts"
                value={stats.stats.totalQuizAttempts}
                color="#EF4444"
              />
            </div>

            {/* Average Score */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stats.stats.averageScore}%
                </div>
                <div className="text-gray-600">Average Quiz Score</div>
              </div>
            </div>

            {/* Recent Attempts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Quiz Attempts</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Student</th>
                      <th className="text-left py-2">Score</th>
                      <th className="text-left py-2">Questions</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentAttempts.map((attempt) => (
                      <tr key={attempt.id} className="border-b border-gray-100">
                        <td className="py-2">{attempt.studentName}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            parseFloat(attempt.score) >= 70 
                              ? "bg-green-100 text-green-800" 
                              : parseFloat(attempt.score) >= 50
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {attempt.score}%
                          </span>
                        </td>
                        <td className="py-2">{attempt.correctAnswers}/{attempt.totalQuestions}</td>
                        <td className="py-2">{new Date(attempt.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Performers */}
            {stats.topPerformers && stats.topPerformers.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
                <div className="space-y-3">
                  {stats.topPerformers.map((performer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{performer.userName}</div>
                        <div className="text-sm text-gray-600">{performer.userEmail}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{performer.score.toFixed(2)}%</div>
                        <div className="text-sm text-gray-600">
                          {performer.correctAnswers}/{performer.totalQuestions}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Students List</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload("students", "csv")}
                    disabled={downloadLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    <FiDownload />
                    CSV
                  </button>
                  <button
                    onClick={() => handleDownload("students", "txt")}
                    disabled={downloadLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <FiDownload />
                    TXT
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Quiz Attempts</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Best Score</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{student.name}</td>
                      <td className="py-3 px-4 text-gray-600">{student.email}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(student.joinedDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center">{student.quizAttempts}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          student.averageScore >= 70 
                            ? "bg-green-100 text-green-800" 
                            : student.averageScore >= 50
                            ? "bg-yellow-100 text-yellow-800"
                            : student.averageScore > 0
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {student.averageScore > 0 ? `${student.averageScore}%` : "No attempts"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          student.bestScore >= 70 
                            ? "bg-green-100 text-green-800" 
                            : student.bestScore >= 50
                            ? "bg-yellow-100 text-yellow-800"
                            : student.bestScore > 0
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {student.bestScore > 0 ? `${student.bestScore}%` : "No attempts"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationControls
              pagination={studentsPagination}
              currentPage={studentsPage}
              onPageChange={setStudentsPage}
            />
          </div>
        )}

        {/* Quiz Results Tab */}
        {activeTab === "results" && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Quiz Results</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload("results", "csv")}
                    disabled={downloadLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    <FiDownload />
                    CSV
                  </button>
                  <button
                    onClick={() => handleDownload("results", "txt")}
                    disabled={downloadLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <FiDownload />
                    TXT
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Correct/Total</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Wrong</th>
                  </tr>
                </thead>
                <tbody>
                  {quizResults.map((result) => (
                    <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{result.studentName}</td>
                      <td className="py-3 px-4 text-gray-600">{result.studentEmail}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(result.completedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          parseFloat(result.score) >= 70 
                            ? "bg-green-100 text-green-800" 
                            : parseFloat(result.score) >= 50
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {result.score}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {result.correctAnswers}/{result.totalQuestions}
                      </td>
                      <td className="py-3 px-4 text-center text-red-600">{result.wrongAnswers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationControls
              pagination={resultsPagination}
              currentPage={resultsPage}
              onPageChange={setResultsPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;