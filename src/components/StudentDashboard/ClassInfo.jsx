import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import qp1 from "../../assignments/qp1.pdf";
import penguin from "../../assets/images/penguin.png";

const assignments = [
  {
    title: "Assignment 1: Solve the following problems",
    description: "Give descriptive answers and make sure to include examples.",
    questionPapers: [qp1],
  },
  {
    title: "Assignment 2: Please upload the assignment solutions",
    description: "This is for your revision 1",
    questionPapers: [qp1],
  },
  {
    title: "Assignment 3: Give definitions of the following terms",
    description: "Make sure the definitions contain the keywords discussed in class",
    questionPapers: [qp1],
  },
];

export default function ClassInfo() {
  const [expanded, setExpanded] = useState(null);
  const [answerKeyFile, setAnswerKeyFile] = useState(null);
  const [studentFiles, setStudentFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
    setAnswerKeyFile(null);
    setStudentFiles([]);
    setResults(null);
    setPopupVisible(false);
  };

  const handleAnswerKeyChange = (e) => {
    if (e.target.files.length > 0) {
      setAnswerKeyFile(e.target.files[0]);
    }
  };

  const handleStudentFilesChange = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length === 0) return;
    setStudentFiles(files);
  };

  const uploadAnswerKey = async () => {
    if (!answerKeyFile) {
      alert("Please select an answer key file before uploading.");
      return false;
    }

    const formData = new FormData();
    formData.append("file", answerKeyFile);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/upload-answer-key", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload answer key");

      const json = await res.json();
      console.log("Upload answer key response:", json);

      if (json.status !== "Answer key context stored") {
        throw new Error("Unexpected response from server");
      }

      return true;
    } catch (err) {
      alert("Answer key upload failed: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadStudentAnswers = async () => {
    if (studentFiles.length === 0) {
      alert("Please select at least one student answer image to upload.");
      return;
    }

    const answerKeyUploaded = await uploadAnswerKey();
    if (!answerKeyUploaded) return;

    const formData = new FormData();
    studentFiles.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/evaluate-student", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Evaluation failed");

      const json = await res.json();
      setResults(json); // ← Store raw response
      setPopupVisible(true);
    } catch (err) {
      alert("Evaluation error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeStudentFile = (index) => {
    setStudentFiles((files) => files.filter((_, i) => i !== index));
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <img
          src={penguin}
          alt="Penguin"
          className="w-110 h-auto mx-auto rounded-xl object-contain"
        />
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Assignments</h1>

      <div className="space-y-4">
        {assignments.map((assignment, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-xl shadow-sm bg-white transition-all"
          >
            <button
              onClick={() => toggleExpand(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-gray-100 transition-all duration-200"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {assignment.title}
                </h2>
                <p className="text-sm text-gray-500">{assignment.description}</p>
              </div>
              {expanded === index ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>

            {expanded === index && (
              <div className="px-6 pb-6 pt-2 space-y-4">
                <div className="bg-gray-50 rounded-md p-4 border">
                  <h3 className="font-medium text-gray-700 mb-2">Question Papers</h3>
                  <ul className="list-disc ml-6 text-sm text-blue-600 space-y-1">
                    {assignment.questionPapers.map((file, idx) => (
                      <li key={idx}>
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {file.split("/").pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Answer Key (PDF or Image)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleAnswerKeyChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />

                  <label className="block mt-4 text-sm font-medium text-gray-700">
                    Upload Your Answer (Images Only)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleStudentFilesChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />

                  <div className="flex gap-3 flex-wrap mt-2">
                    {studentFiles.map((file, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => removeStudentFile(imgIndex)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          title="Remove"
                        >
                          <IoClose size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                    onClick={uploadStudentAnswers}
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload & Evaluate"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Grading Report Popup */}
      {popupVisible && results && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[95%] max-w-2xl shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-red-500"
              onClick={closePopup}
              aria-label="Close grading report"
            >
              <IoClose size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-center">Grading Report</h3>

            <div className="text-center font-semibold text-green-700 mb-4">
              Total Score: {results.total_score}
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {results.detailed_feedback.map((item, idx) => (
                <div key={idx} className="border rounded p-3 bg-gray-50">
                  <h4 className="font-semibold mb-1">Question {item.question}</h4>
                  <p><strong>Marks Awarded:</strong> {item.marks}</p>
                  <p><strong>Feedback:</strong> {item.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
