export default function ClassHeader({ classData }) {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-semibold text-gray-800">{classData.title}</h1>
      <p className="text-xl text-gray-600">Instructor: {classData.instructor}</p>
      <div className="mt-4 flex gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
          Schedule Class
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
          Upload Assignment
        </button>
      </div>
    </header>
  );
}
