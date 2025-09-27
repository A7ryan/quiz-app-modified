import { User } from "../models/user.model.js";
import { Score } from "../models/score.model.js";
import Quiz from "../models/quiz.model.js";

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalStudents = await User.countDocuments({ userType: "student" });
    const totalFaculty = await User.countDocuments({ userType: "faculty" });
    const totalQuestions = await Quiz.countDocuments();
    const totalQuizAttempts = await Score.countDocuments();

    // Get recent quiz attempts
    const recentAttempts = await Score.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate average score
    const allScores = await Score.find();
    const avgScore = allScores.length > 0 
      ? (allScores.reduce((acc, score) => acc + (score.correctAnswers / score.totalQuestions) * 100, 0) / allScores.length).toFixed(2)
      : 0;

    // Get top performers (top 5)
    const topPerformers = await Score.aggregate([
      {
        $addFields: {
          percentage: {
            $multiply: [
              { $divide: ["$correctAnswers", "$totalQuestions"] },
              100
            ]
          }
        }
      },
      { $sort: { percentage: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          userName: "$user.name",
          userEmail: "$user.email",
          score: "$percentage",
          totalQuestions: 1,
          correctAnswers: 1,
          createdAt: 1
        }
      }
    ]);

    res.status(200).json({
      message: "Dashboard statistics retrieved successfully",
      data: {
        stats: {
          totalStudents,
          totalFaculty,
          totalQuestions,
          totalQuizAttempts,
          averageScore: avgScore
        },
        recentAttempts: recentAttempts.map(attempt => ({
          id: attempt._id,
          studentName: attempt.user.name,
          studentEmail: attempt.user.email,
          score: ((attempt.correctAnswers / attempt.totalQuestions) * 100).toFixed(2),
          totalQuestions: attempt.totalQuestions,
          correctAnswers: attempt.correctAnswers,
          date: attempt.createdAt
        })),
        topPerformers
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      message: "Error fetching dashboard statistics",
      error: error.message
    });
  }
};

/**
 * Get all students with their quiz performance
 */
export const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await User.find({ userType: "student" })
      .select("name email createdAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalStudents = await User.countDocuments({ userType: "student" });

    // Get quiz performance for each student
    const studentsWithPerformance = await Promise.all(
      students.map(async (student) => {
        const quizAttempts = await Score.find({ user: student._id });
        
        let totalAttempts = quizAttempts.length;
        let totalScore = 0;
        let bestScore = 0;
        let avgScore = 0;

        if (totalAttempts > 0) {
          totalScore = quizAttempts.reduce((acc, attempt) => 
            acc + ((attempt.correctAnswers / attempt.totalQuestions) * 100), 0);
          avgScore = (totalScore / totalAttempts).toFixed(2);
          bestScore = Math.max(...quizAttempts.map(attempt => 
            (attempt.correctAnswers / attempt.totalQuestions) * 100)).toFixed(2);
        }

        return {
          id: student._id,
          name: student.name,
          email: student.email,
          joinedDate: student.createdAt,
          quizAttempts: totalAttempts,
          averageScore: parseFloat(avgScore),
          bestScore: parseFloat(bestScore)
        };
      })
    );

    res.status(200).json({
      message: "Students retrieved successfully",
      data: {
        students: studentsWithPerformance,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalStudents / limit),
          totalStudents,
          hasNextPage: page * limit < totalStudents,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      message: "Error fetching students data",
      error: error.message
    });
  }
};

/**
 * Get detailed quiz results
 */
export const getQuizResults = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const results = await Score.find()
      .populate("user", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalResults = await Score.countDocuments();

    const formattedResults = results.map(result => ({
      id: result._id,
      studentName: result.user.name,
      studentEmail: result.user.email,
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      wrongAnswers: result.wrongAnswers,
      score: ((result.correctAnswers / result.totalQuestions) * 100).toFixed(2),
      percentage: ((result.correctAnswers / result.totalQuestions) * 100).toFixed(2),
      completedAt: result.createdAt,
      timeTaken: result.updatedAt - result.createdAt // in milliseconds
    }));

    res.status(200).json({
      message: "Quiz results retrieved successfully",
      data: {
        results: formattedResults,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalResults / limit),
          totalResults,
          hasNextPage: page * limit < totalResults,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({
      message: "Error fetching quiz results",
      error: error.message
    });
  }
};

/**
 * Export student data for download
 */
export const exportStudentData = async (req, res) => {
  try {
    const format = req.query.format || 'csv'; // csv or txt
    
    // Get all students with their performance data
    const students = await User.find({ userType: "student" })
      .select("name email createdAt")
      .sort({ name: 1 });

    const studentsWithPerformance = await Promise.all(
      students.map(async (student) => {
        const quizAttempts = await Score.find({ user: student._id });
        
        let totalAttempts = quizAttempts.length;
        let avgScore = 0;
        let bestScore = 0;
        let totalCorrect = 0;
        let totalQuestions = 0;

        if (totalAttempts > 0) {
          quizAttempts.forEach(attempt => {
            totalCorrect += attempt.correctAnswers;
            totalQuestions += attempt.totalQuestions;
          });
          
          const scores = quizAttempts.map(attempt => 
            (attempt.correctAnswers / attempt.totalQuestions) * 100);
          
          avgScore = (scores.reduce((acc, score) => acc + score, 0) / totalAttempts).toFixed(2);
          bestScore = Math.max(...scores).toFixed(2);
        }

        return {
          name: student.name,
          email: student.email,
          joinedDate: student.createdAt.toISOString().split('T')[0],
          totalAttempts,
          averageScore: parseFloat(avgScore),
          bestScore: parseFloat(bestScore),
          totalCorrectAnswers: totalCorrect,
          totalQuestionsAnswered: totalQuestions
        };
      })
    );

    if (format === 'csv') {
      // Generate CSV
      const csvHeader = 'Name,Email,Joined Date,Total Attempts,Average Score (%),Best Score (%),Total Correct Answers,Total Questions Answered\n';
      const csvData = studentsWithPerformance.map(student => 
        `"${student.name}","${student.email}","${student.joinedDate}",${student.totalAttempts},${student.averageScore},${student.bestScore},${student.totalCorrectAnswers},${student.totalQuestionsAnswered}`
      ).join('\n');
      
      const csvContent = csvHeader + csvData;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="students_data.csv"');
      return res.send(csvContent);
    } else {
      // Generate TXT
      let txtContent = 'STUDENT PERFORMANCE REPORT\n';
      txtContent += '=' .repeat(50) + '\n\n';
      txtContent += `Generated on: ${new Date().toISOString().split('T')[0]}\n`;
      txtContent += `Total Students: ${studentsWithPerformance.length}\n\n`;
      
      studentsWithPerformance.forEach((student, index) => {
        txtContent += `${index + 1}. ${student.name}\n`;
        txtContent += `   Email: ${student.email}\n`;
        txtContent += `   Joined: ${student.joinedDate}\n`;
        txtContent += `   Quiz Attempts: ${student.totalAttempts}\n`;
        txtContent += `   Average Score: ${student.averageScore}%\n`;
        txtContent += `   Best Score: ${student.bestScore}%\n`;
        txtContent += `   Total Correct: ${student.totalCorrectAnswers}/${student.totalQuestionsAnswered}\n`;
        txtContent += '-'.repeat(40) + '\n';
      });
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="students_data.txt"');
      return res.send(txtContent);
    }
  } catch (error) {
    console.error("Error exporting student data:", error);
    res.status(500).json({
      message: "Error exporting student data",
      error: error.message
    });
  }
};

/**
 * Export quiz results for download
 */
export const exportQuizResults = async (req, res) => {
  try {
    const format = req.query.format || 'csv';
    
    const results = await Score.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    if (format === 'csv') {
      const csvHeader = 'Student Name,Email,Date,Total Questions,Correct Answers,Wrong Answers,Score (%)\n';
      const csvData = results.map(result => {
        const score = ((result.correctAnswers / result.totalQuestions) * 100).toFixed(2);
        const date = result.createdAt.toISOString().split('T')[0];
        return `"${result.user.name}","${result.user.email}","${date}",${result.totalQuestions},${result.correctAnswers},${result.wrongAnswers},${score}`;
      }).join('\n');
      
      const csvContent = csvHeader + csvData;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="quiz_results.csv"');
      return res.send(csvContent);
    } else {
      let txtContent = 'QUIZ RESULTS REPORT\n';
      txtContent += '=' .repeat(50) + '\n\n';
      txtContent += `Generated on: ${new Date().toISOString().split('T')[0]}\n`;
      txtContent += `Total Quiz Attempts: ${results.length}\n\n`;
      
      results.forEach((result, index) => {
        const score = ((result.correctAnswers / result.totalQuestions) * 100).toFixed(2);
        const date = result.createdAt.toISOString().split('T')[0];
        
        txtContent += `${index + 1}. ${result.user.name} (${result.user.email})\n`;
        txtContent += `   Date: ${date}\n`;
        txtContent += `   Score: ${result.correctAnswers}/${result.totalQuestions} (${score}%)\n`;
        txtContent += `   Wrong Answers: ${result.wrongAnswers}\n`;
        txtContent += '-'.repeat(40) + '\n';
      });
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="quiz_results.txt"');
      return res.send(txtContent);
    }
  } catch (error) {
    console.error("Error exporting quiz results:", error);
    res.status(500).json({
      message: "Error exporting quiz results",
      error: error.message
    });
  }
};