import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import qp1 from "../../assignments/qp1.pdf";
import anskey1 from "../../assignments/anskey1.txt";
import penguin from "../../assets/images/penguin.png"; // Ensure correct image path

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
  const [uploads, setUploads] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const handleImageChange = (e, index) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length === 0) return;

    const updatedFiles = [...(uploads[index] || []), ...files];
    setUploads({ ...uploads, [index]: updatedFiles });
  };

  const removeImage = (index, imgIndex) => {
    const newFiles = uploads[index].filter((_, i) => i !== imgIndex);
    setUploads({ ...uploads, [index]: newFiles });
  };

  const handleUpload = async (index) => {
    const images = uploads[index] || [];

    if (images.length === 0) {
      alert("Please select image files before uploading.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Add anskey1 as first file
      const anskeyBlob = await fetch(anskey1).then((res) => res.blob());
      formData.append("images", new File([anskeyBlob], "anskey1.txt", { type: "text/plain" }));

      // Append uploaded images
      images.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch("http://localhost:3000/getScores", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Scoring failed");

      const result = await response.json();
      setResults((prev) => ({ ...prev, [index]: result }));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload or scoring failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Big Penguin Image */}
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
                    Upload Your Answer (Images Only)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />

                  <div className="flex gap-3 flex-wrap mt-2">
                    {(uploads[index] || []).map((file, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => removeImage(index, imgIndex)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          title="Remove"
                        >
                          <IoClose size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                    onClick={() => handleUpload(index)}
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload Answer"}
                  </button>
                </div>

                {results[index] && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Your Score: {results[index].score}/10
                    </h4>
                    <p className="text-green-700 text-sm whitespace-pre-line">
                      {results[index].comments || "No additional comments."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
