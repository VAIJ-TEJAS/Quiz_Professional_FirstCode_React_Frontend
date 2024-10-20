import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from '@mui/material/Button';

const Quiz = ({ quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [buttonStates, setButtonStates] = useState({});
  const [isAnswering, setIsAnswering] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(new Set()); // Track selected options

  const currentQuestion = quiz[currentQuestionIndex];
  const totalQuestions = quiz.length;
  const correctAnswers = new Set(currentQuestion.correct_option);
  const requiredSelections = correctAnswers.size; // Required number of selections

  // Handle button click
  const handleSelect = (option) => {
    if (isAnswering) return; // Prevent clicking while answering

    // Update selected options
    const updatedSelections = new Set(selectedOptions);
    if (updatedSelections.has(option)) {
      updatedSelections.delete(option); // Deselect if already selected
    } else {
      updatedSelections.add(option); // Add to selected options
    }

    setSelectedOptions(updatedSelections);

    // Set the button state for immediate feedback
    setButtonStates((prevState) => ({
      ...prevState,
      [option]: correctAnswers.has(option) ? "correct" : "wrong",
    }));

    // If the number of selected options equals required selections, show the result
    if (updatedSelections.size === requiredSelections) {
      setIsAnswering(true);

      const isCorrect = [...updatedSelections].every((option) =>
        correctAnswers.has(option)
      );
      // Show result message
      setTimeout(() => {
        if (isCorrect) {
          handleNext(); // Move to next question if correct
        } else {
          resetQuestion(); // Reload question if incorrect
        }
      }, 1200);
    }
  };

  // Reset for the current question
  const resetQuestion = () => {
    setSelectedOptions(new Set()); // Reset selected options
    setButtonStates({});
    setIsAnswering(false);
  };

  // Handle navigating to the next question
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetQuestion();
    }
  };

  // Handle navigating to the previous question
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetQuestion();
    }
  };

  return (
    <div style={styles.container} className="font-inter bg-gradient-to-tr from-[#36ABFF] to-[#03bdc3]">
      <div style={styles.quizBox} className="w-[720px]">

        {/* Display result message */}
        {isAnswering && (
            <h4 style={styles.resultMessage}>
              {Array.from(selectedOptions).every((option) =>
                correctAnswers.has(option)
              )
                ? "Correct!"
                : "Wrong!"}
            </h4>
          )}

        {/* Display the current question */}
        <div key={currentQuestionIndex} className="flex flex-col">
          {currentQuestion.image_url && (
            <div style={styles.imageContainer} className="m-4">
              <img
                src={currentQuestion.image_url}
                className="h-[360px] rounded-lg"
                alt={`Image for question ${currentQuestion.question}`}
              />
            </div>
          )}

          <div className="text-xl text-left">{currentQuestion.question}</div>

          {/* Render buttons for options in two columns */}
          <div style={styles.buttonContainer}>
            {currentQuestion.options.map((option, idx) => (
              <button
                className={`border-2 p-4 rounded-xl ${
                  buttonStates[option] === "correct"
                    ? "bg-green-100 border-green-600"
                    : buttonStates[option] === "wrong"
                    ? "bg-red-100 border-red-600"
                    : ""
                }`}
                key={idx}
                onClick={() => handleSelect(option)}
                style={{
                  cursor: isAnswering ? "not-allowed" : "pointer",
                }}
                disabled={isAnswering} // Disable buttons while answering
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Previous and Next buttons */}
        <div style={styles.navigationContainer} className="">
          <div className="flex items-center gap-2 shadow p-1 rounded-xl border-[0.5px]">
            <Button
              variant="text"
              className="flex items-center gap-2 p-2"
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
            >
              <div>
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              Prev
            </Button>
            <h4 style={styles.questionNumber} className="text-slate-600">
              {currentQuestionIndex + 1}/{totalQuestions}
            </h4>
            <Button
              variant="text"
              className="flex items-center gap-2 p-2"
              onClick={handleNext}
              disabled={currentQuestionIndex === totalQuestions - 1}
            >
              Next
              <div>
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// CSS styles for centering
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
  },
  quizBox: {
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    textAlign: "center",
  },
  buttonContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // Two columns
    gap: "10px",
    marginTop: "20px",
  },
  navigationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
  questionNumber: {
    margin: "0 15px",
  },
  resultMessage: {
    fontSize: "18px",
    fontWeight: "bold",
  },
};

export default Quiz;
