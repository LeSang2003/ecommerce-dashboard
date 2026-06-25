import { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const res = await API.get("/newsletter");

      setSubscribers(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load subscribers");
    }
  };

  const exportExcel = async () => {
    try {
      const res = await API.get("/newsletter/export/excel", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");

      link.href = url;
      link.download = "newsletter.xlsx";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      toast.success("Excel exported");
    } catch (err) {
      console.log(err);
      toast.error("Export failed");
    }
  };
  const exportPdf = async () => {
    try {
      const res = await API.get("/newsletter/export/pdf", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");

      link.href = url;

      link.download = "newsletter.pdf";

      link.click();

      toast.success("PDF exported");
    } catch (err) {
      console.log(err);

      toast.error("Export failed");
    }
  };
  const deleteSubscriber = async (id) => {
    const confirmDelete = window.confirm("Delete this subscriber?");

    if (!confirmDelete) return;

    try {
      const res = await API.delete(`/newsletter/${id}`);

      toast.success(res.data.message);

      loadSubscribers();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>

          <p className="text-gray-500 mt-1">
            Total Subscribers: {subscribers.length}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportExcel}
            className="
      bg-green-600
      text-white
      px-4
      py-2
      rounded
    "
          >
            Excel
          </button>

          <button
            onClick={exportPdf}
            className="
      bg-red-600
      text-white
      px-4
      py-2
      rounded
    "
          >
            PDF
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className=" border  px-4 py-3 mb-6 w-96 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
            "
      />

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Subscribed At</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredSubscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-t">
                <td className="p-4">{subscriber.id}</td>

                <td className="p-4">
                  <span
                    className="
                      bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm
                    "
                  >
                    {subscriber.email}
                  </span>
                </td>

                <td className="p-4">
                  {new Date(subscriber.subscribedAt).toLocaleString("vi-VN")}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => deleteSubscriber(subscriber.id)}
                    className="
                         bg-red-500  hover:bg-red-600 text-white px-3  py-1 rounded "
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminNewsletterPage;
