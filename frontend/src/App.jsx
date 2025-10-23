import ComposeModal from "./components/ComposeModal";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Email System
        </h1>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Welcome to Your Email System
            </h2>
            <p className="text-gray-600 mb-6">
              Click the "Compose" button in the bottom-right corner to send emails.
              The system uses a Gmail-like interface for a familiar experience.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-yellow-800">
                <strong>Note:</strong> Make sure to configure your email credentials in the backend .env file before sending emails.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ComposeModal />
    </div>
  );
}

export default App;
