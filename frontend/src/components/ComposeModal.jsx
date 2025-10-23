import { useState } from "react";

export default function ComposeModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSend = async () => {
    setStatus("Sending...");
    try {
      const res = await fetch("http://localhost:5000/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStatus("✅ Sent!");
        setFormData({ to: "", subject: "", message: "" });
        setTimeout(() => setOpen(false), 1500);
      } else {
        setStatus(`❌ ${data.message || "Failed"}`);
        console.error("Email error:", data);
      }
    } catch (error) {
      setStatus("❌ Connection Error");
      console.error("Network error:", error);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-yellow-500 text-white rounded-full px-5 py-3 shadow-lg hover:bg-yellow-600 transition-colors duration-200 z-50"
        style={{ backgroundColor: '#ffda03' }}
      >
        ✉️ Compose
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border shadow-2xl rounded-xl w-96 max-w-[90vw] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-700 text-lg">New Message</h2>
              <button 
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✖️
              </button>
            </div>

            <input
              name="to"
              type="email"
              placeholder="To"
              value={formData.to}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <input
              name="subject"
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <textarea
              name="message"
              placeholder="Message..."
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 mb-4 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            ></textarea>

            <div className="flex justify-between items-center">
              <button
                onClick={handleSend}
                className="px-6 py-2 rounded-lg text-white font-medium transition-colors duration-200"
                style={{ backgroundColor: '#ffda03' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e6c400'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ffda03'}
              >
                Send
              </button>
              <p className="text-sm text-gray-500">{status}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
