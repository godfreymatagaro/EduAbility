import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-8">
        React + Vite + Tailwind CSS Demo
      </h1>

      {/* Card Component */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sample Card</h2>
        <p className="text-gray-600 mb-4">
          This is a styled card using Tailwind CSS. It includes shadows, rounded corners, and responsive text.
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
          Click Me
        </button>
      </div>

      {/* Form Component */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sample Form</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;