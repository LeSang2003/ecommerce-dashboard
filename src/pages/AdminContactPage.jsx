import { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [stats, setStats] = useState(null);
  useEffect(() => {
    loadMessages();
    loadStats();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await API.get("/contact");

      setMessages(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load messages");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await API.delete(`/contact/${id}`);

      toast.success("Message deleted");

      loadMessages();
      loadStats();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  const markRead = async (id) => {
    try {
      await API.put(`/contact/${id}/read`);

      toast.success("Marked as read");

      loadMessages();
      loadStats();
    } catch (err) {
      console.log(err);
      toast.error("Failed");
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()),
  );

  const unreadCount = messages.filter((m) => !m.readStatus).length;

  const today = new Date();

  const todayCount = messages.filter((m) => {
    const date = new Date(m.createdAt);

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }).length;

  const monthCount = messages.filter((m) => {
    const date = new Date(m.createdAt);

    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }).length;

  const openMessage = async (message) => {
    setSelectedMessage(message);

    setReplyMessage("");

    if (!message.readStatus) {
      try {
        await API.put(`/contact/${message.id}/read`);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === message.id ? { ...m, readStatus: true } : m,
          ),
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("Please enter reply message");
      return;
    }

    try {
      await API.post("/contact/reply", {
        contactId: selectedMessage.id,
        email: selectedMessage.email,
        subject: `RE: ${selectedMessage.subject}`,
        message: replyMessage,
      });

      toast.success("Reply sent");

      setReplyMessage("");
      await loadMessages();
      await loadStats();

      setSelectedMessage(null);
    } catch (err) {
      console.log(err);
      toast.error("Failed to send");
    }
  };

  const loadStats = async () => {
    try {
      const res = await API.get("/contact/stats");

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const exportExcel = () => {
    window.open("http://localhost:8085/api/contact/export/excel");
  };

  const exportPdf = () => {
    window.open("http://localhost:8085/api/contact/export/pdf");
  };
  return (
    <div className="p-6">
      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Contact Messages</h1>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">Total Messages</p>

            <p className="text-3xl font-bold">{messages.length}</p>
          </div>

          <div className="bg-red-50 rounded-xl shadow p-4">
            <p className="text-red-500 text-sm">Unread</p>

            <p className="text-3xl font-bold text-red-600">{unreadCount}</p>
          </div>

          <div className="bg-green-50 rounded-xl shadow p-4">
            <p className="text-green-500 text-sm">Today</p>

            <p className="text-3xl font-bold text-green-600">{todayCount}</p>
          </div>

          <div className="bg-blue-50 rounded-xl shadow p-4">
            <p className="text-blue-500 text-sm">This Month</p>

            <p className="text-3xl font-bold text-blue-600">{monthCount}</p>
          </div>
        </div>
      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search name, email, subject..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          border
          rounded-lg
          px-4
          py-3
          w-full
          md:w-96
          mb-6
        "
      />
      <div className="flex gap-3 mb-4">
        <button
          onClick={exportExcel}
          className="
      bg-green-600
      text-white
      px-4
      py-2
      rounded-lg
    "
        >
          Export Excel
        </button>

        <button
          onClick={exportPdf}
          className="
      bg-red-600
      text-white
      px-4
      py-2
      rounded-lg
    "
        >
          Export PDF
        </button>
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Subject</th>
              <th className="p-4 text-left">Message</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Reply</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMessages.map((m) => (
              <tr
                key={m.id}
                onClick={() => openMessage(m)}
                className={`
                 cursor-pointer
                 border-t
                 ${!m.readStatus ? "bg-blue-50" : ""}
                 `}
              >
                <td className="p-4">{m.id}</td>

                <td className="p-4 font-medium">{m.name}</td>

                <td className="p-4">{m.email}</td>

                <td className="p-4">{m.subject}</td>

                <td className="p-4 max-w-xs">
                  {m.message?.length > 60
                    ? m.message.substring(0, 60) + "..."
                    : m.message}
                </td>

                <td className="p-4">
                  {m.readStatus ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      READ
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                      NEW
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {m.replied ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      REPLIED
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      PENDING
                    </span>
                  )}
                </td>

                <td className="p-4">
                  {new Date(m.createdAt).toLocaleString()}
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(m.id);
                      }}
                      className="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        px-3
                        py-1
                        rounded
                      "
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredMessages.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-10 text-gray-500">
                  No messages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedMessage && (
        <div
          className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-50
    "
        >
          <div
            className="
        bg-white
        rounded-2xl
        shadow-xl
        w-full
        max-w-2xl
        p-8
      "
          >
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Contact Message</h2>

              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <strong>Name:</strong> {selectedMessage.name}
              </div>

              <div>
                <strong>Email:</strong> {selectedMessage.email}
              </div>

              <div>
                <strong>Subject:</strong> {selectedMessage.subject}
              </div>

              <div>
                <strong>Date:</strong>{" "}
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </div>

              <div>
                <strong>Message:</strong>

                <div
                  className="
      mt-2
      bg-gray-50
      p-4
      rounded-lg
      whitespace-pre-wrap
    "
                >
                  {selectedMessage.message}
                </div>
              </div>
              {selectedMessage.replied && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-bold text-lg mb-3">Reply History</h3>

                  <div className="mb-2">
                    <strong>Replied By:</strong> {selectedMessage.repliedBy}
                  </div>

                  <div className="mb-2">
                    <strong>Replied At:</strong>{" "}
                    {new Date(selectedMessage.repliedAt).toLocaleString()}
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg whitespace-pre-wrap">
                    {selectedMessage.replyContent}
                  </div>
                </div>
              )}
              {!selectedMessage.replied && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Reply</h3>

                  <textarea
                    rows={6}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="
        w-full
        border
        rounded-lg
        p-4
        outline-none
      "
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              {!selectedMessage.replied && (
                <button
                  onClick={sendReply}
                  className="
      bg-blue-500
      hover:bg-blue-600
      text-white
      px-5
      py-2
      rounded-lg
    "
                >
                  Send Reply
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedMessage(null);
                  setReplyMessage("");
                }}
                className="
      bg-black
      text-white
      px-5
      py-2
      rounded-lg
    "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminContactPage;
