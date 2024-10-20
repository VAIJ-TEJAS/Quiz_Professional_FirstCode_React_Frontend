import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import Quiz from "./pages/Quiz";

// Component to fetch quiz data directly based on the route
const LessonQuiz = () => {
  const { "*": lessonFilePath } = useParams(); // Capture the entire path

  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    const lessonPath = `/${lessonFilePath}.json`; // Construct the file path
    console.log(lessonPath);

    fetch(lessonPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load quiz file");
        }
        return response.json();
      })
      .then((data) => {
        setQuizData(data);
      })
      .catch((error) => {
        console.error("Error loading quiz:", error);
      });
  }, [lessonFilePath]);

  return (
    <div>{quizData ? <Quiz quiz={quizData} /> : <p>Loading quiz...</p>}</div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Capture everything after "/" as the path */}
        <Route path="/*" element={<LessonQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;
