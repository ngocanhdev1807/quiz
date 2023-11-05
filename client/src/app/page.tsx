"use client";
import { useState, useEffect } from "react";
import MarkdownIt from "markdown-it";
import map from "lodash/map";
import { QuizData } from "@/types/quiz.types";
import utils from "@/utils/utils";
import { Timer } from "@/components/Timer/Timer";

const SERVER_WebSocket_URL = `ws://localhost:8000/quiz`;

export default function Home() {
  const md = new MarkdownIt();
  const [quizData, setQuizData] = useState<QuizData>();
  useEffect(() => {
    const ws = new WebSocket(SERVER_WebSocket_URL);

    ws.onopen = (e) => {
      console.log("Connected to the server");
    };

    ws.onclose = () => {};

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setQuizData(newData);
      console.log(newData);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    // return () => {
    //   ws.close();
    // };
  }, []);

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<string>(
    "start" || "end" || "quiz"
  );
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [currentOption, setCurrentOption] = useState<number | undefined>(
    undefined
  );
  const [score, setScore] = useState<any>({});
  const [time, setTime] = useState<number | string | null>(null);

  const question = quizData && (quizData as QuizData)[currentQuestion];
  const scoreArr = Object.entries(score);

  const handleStart = () => {
    return setCurrentScreen("quiz");
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setCurrentOption(Number(nextValue));
    setScore({
      ...score,
      [currentQuestion]: Number(nextValue) === question?._ps,
    });
  };

  const handleNext = () => {
    setLoading(true);
    setProgress(progress + 1);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    if ((quizData as QuizData).length === Number(currentQuestion) + 1)
      return setCurrentScreen("end");
    setScore({ ...score, [currentQuestion]: currentOption === question?._ps });
    setCurrentQuestion((prev) => prev + 1);
    setCurrentOption(undefined);
    return setTime(typeof time === "string" ? 0.5 : "0.5");
  };

  const handleViewAnswer = () => {
    setCurrentScreen("viewAnswers");
  };

  const handleTakeAnother = () => {
    window.location.href = "/quiz";
  };

  useEffect(() => {
    setCurrentScreen("start");
    setTime(typeof time === "string" ? 0.5 : "0.5");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setLoading(true);
    setProgress(progress + 1);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getGradientStyle = () => {
    if (currentScreen === "start") {
      return {
        background: "linear-gradient(to right, #00c6fb, #005bea)",
        WebkitBackgroundClip: "text",
        color: "transparent",
        display: "inline-block",
      };
    } else {
      return {};
    }
  };
  return (
    <div className="mb-[40rem]">
      {currentScreen === "start" && (
        <div className="py-12">
          <div className="bg-white w-11/12 md:max-w-md p-4 mt-0 mx-auto ">
            <h1
              style={getGradientStyle()}
              className="font-extrabold text-md block mr-4 text-xl mb-3"
            >
              Chào mừng bạn đến với trò chơi đố vui
            </h1>
            <div className="text-center mt-4 flex justify-between">
              <h3
                style={getGradientStyle()}
                className="font-extrabold text-md block mr-4"
              >
                Nhấn Start để bắt đầu
              </h3>
              <button
                type="submit"
                className={`h-8 px-4 pb-1 rounded-full bg-blue-500 text-white`}
                onClick={handleStart}
              >
                {"Start"}
              </button>
            </div>
          </div>
        </div>
      )}

      {currentScreen === "quiz" && (
        <div className="bg-white my-12 p-4 md:p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            {currentQuestion + 1}. {question?.question}
          </h3>

          <div className="space-y-4 ">
            {map(question?.answers, (item, idx) => (
              <label
                key={idx}
                className="flex items-center bg-gray-100 border rounded-lg p-4 cursor-pointer hover:shadow-md transition"
                style={{ minHeight: "3rem" }} // Set a fixed height
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    className="hidden"
                    value={`${idx}`}
                    checked={currentOption === idx}
                    onChange={handleOptionChange}
                  />
                  <div className="ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`w-6 h-6 ${
                        currentOption === idx
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    >
                      <circle cx="12" cy="12" r="9" />
                      {currentOption === idx && (
                        <circle cx="12" cy="12" r="5" />
                      )}
                    </svg>
                  </div>
                </div>

                <div
                  dangerouslySetInnerHTML={utils.sanitizedData(
                    md.render(item || "")
                  )}
                  className={`ml-8 ${
                    currentOption === idx ? "text-blue-500" : "text-gray-600"
                  }`}
                />
              </label>
            ))}
          </div>

          <div className="bg-gray-300 w-full mt-4">
            <div
              className={`${
                loading ? "bg-gradient-animated" : "bg-blue-500"
              } h-2`}
              style={{
                width: `${(progress / (quizData as QuizData).length) * 100}%`,
              }}
            ></div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>
              Q{currentQuestion + 1}/{(quizData as QuizData).length}{" "}
              &nbsp;&nbsp; <Timer time={time} handleNext={handleNext} />
            </div>
            <div>
              <button
                type="submit"
                className={`h-10 px-4 rounded-full ${
                  currentOption === undefined ? "bg-gray-400" : "bg-blue-500"
                } text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition`}
                onClick={handleNext}
                disabled={currentOption === undefined}
              >
                {"Next"}
              </button>
            </div>
          </div>
        </div>
      )}

      {currentScreen === "end" && (
        <div className="py-12">
          <div className="bg-white w-11/12 md:max-w-md shadow-sm p-4 mt-0 mx-auto rounded-md">
            <div className="flex flex-col items-center space-y-4">
              <span className="text-6xl text-blue-500">😊</span>
              <span className="text-lg font-semibold">
                Điểm của bạn: {utils.getStore(scoreArr)}/
                {(quizData as QuizData).length}
              </span>
              <div className="space-y-4">
                <button
                  type="submit"
                  className="w-full h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition"
                  onClick={handleViewAnswer}
                >
                  Xem câu trả lời
                </button>
                <button
                  type="submit"
                  className="w-full h-10 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300 transition"
                  onClick={handleTakeAnother}
                >
                  Chơi lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentScreen === "viewAnswers" && (
        <div className="bg-white my-12 w-11/12 md:max-w-2xl mx-auto shadow-xs rounded-md overflow-hidden">
          {map(quizData as QuizData, (quiz, index) => (
            <div key={index}>
              <h3>
                Q{index + 1}/{(quizData as QuizData).length}
              </h3>
              <p>{quiz.question}</p>
              <p>Correct Answer: {quiz.correct_answer}</p>
              <p>Your Answer: {score[index] ? "Correct" : "Incorrect"}</p>
              <hr />
            </div>
          ))}
          <button
            type="submit"
            className={`h-8 px-4 pb-1 rounded-full ${"bg-blue-500"} text-white`}
            onClick={handleTakeAnother}
          >
            {"Chơi lại"}
          </button>
        </div>
      )}
    </div>
  );
}
