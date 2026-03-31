import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Eye,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  Link2,
  Image as ImageIcon,
  CreditCard,
  MapPin,
  Hash,
  Instagram,
  Facebook,
  Linkedin,
  Trash2
} from "lucide-react";
import { serverurl } from "../../App";

/* ================= MERKOVA ADMIN BACKGROUND ================= */
const MerkovaBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#1b102f] via-black to-[#2a155a]" />
    <div className="absolute w-[700px] h-[700px] bg-purple-700/20 blur-[160px] -top-96 -left-96 rounded-full" />
    <div className="absolute w-[700px] h-[700px] bg-indigo-700/20 blur-[160px] bottom-0 right-0 rounded-full" />
  </div>
);

const SellerShopapproval = () => {
  const [requests, setrequests] = useState([]);
  const [loading, setloading] = useState(false);
  const [selected, setselected] = useState(null);
  const [statusloading, setstatusloading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reviewerComments, setReviewerComments] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchrequests = async () => {
    try {
      setloading(true);
      const res = await axios.get(`${serverurl}/shoprequest/all`, {
        withCredentials: true,
      });
      if (res.data.success) setrequests(res.data.requests || []);
    } catch {
      toast.error("Failed to load shop requests");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchrequests();
  }, []);

  const updatestatus = async (id, status) => {
    try {
      setstatusloading(true);
      const payload = { status };
      if (status === "Rejected") payload.rejectionReason = rejectionReason;
      if (reviewerComments) payload.reviewerComments = reviewerComments;

      const res = await axios.patch(
        `${serverurl}/shoprequest/update-status/${id}`,
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(`Request ${status}`);
        fetchrequests();
        setselected(null);
        setRejectionReason("");
        setReviewerComments("");
      }
    } catch {
      toast.error("Status update failed");
    } finally {
      setstatusloading(false);
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      setstatusloading(true);
      const res = await axios.delete(`${serverurl}/shoprequest/delete/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Request deleted successfully");
        fetchrequests();
        setselected(null);
      }
    } catch {
      toast.error("Failed to delete request");
    } finally {
      setstatusloading(false);
    }
  };

  // Filter requests by status
  const filteredRequests = filterStatus === "All"
    ? requests
    : requests.filter(r => r.status === filterStatus);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 text-white">
      <MerkovaBackground />
      <Toaster position="top-right" />

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-purple-300 mb-10">
        SuperAdmin · Seller Shop Approval
      </h1>

      {/* ================= FILTER BUTTONS ================= */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {["All", "Pending", "Approved", "Rejected"].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              filterStatus === status
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-purple-500/30"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ================= REQUEST GRID ================= */}
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredRequests.map((item) => (
            <div
              key={item._id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold truncate">{item.name}</h2>
                <p className="text-sm text-gray-300 line-clamp-2 mt-1">
                  {item.description}
                </p>
                <p className="text-xs text-purple-300 mt-2 break-words">
                  {item.storetype} · {item.storeaddress}
                </p>
              </div>

              <div className="flex items-center justify-between mt-5">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    item.status === "Approved"
                      ? "bg-green-500/20 text-green-400"
                      : item.status === "Rejected"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {item.status}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setselected(item)}
                    className="hover:text-purple-300 transition"
                  >
                    <Eye />
                  </button>
                  <button
                    onClick={() => deleteRequest(item._id)}
                    className="hover:text-red-400 transition"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= FULL INSPECTION MODAL ================= */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 overflow-y-auto"
          >
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-purple-300">
                    {selected.name}
                  </h2>
                  <p className="text-gray-400 mt-1 text-sm">
                    Created: {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>

                <span className="self-start px-4 py-2 rounded-full text-sm border border-white/20">
                  Status: {selected.status}
                </span>
              </div>

              {/* BODY */}
              <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
                {/* OWNER PANEL */}
                <div className="bg-white/5 border border-white/15 rounded-2xl p-5 lg:sticky lg:top-6 h-fit">
                  <h3 className="text-lg font-bold text-purple-300 mb-4">
                    Owner Profile
                  </h3>

                  <div className="space-y-3 text-sm break-words">
                    <p className="flex gap-2">
                      <User size={15} />
                      Seller Name {selected.owner?.name}
                    </p>
                    <p className="flex gap-2">
                      <Mail size={15} />
                      Personal Email {selected.owner?.email}
                    </p>
                    <p className="flex gap-2">
                      <Mail size={15} /> Bussiness Email{" "}
                      {selected.owner?.bussinessEmail}
                    </p>
                    <p className="flex gap-2">
                      <Phone size={15} />
                      Seller Mobile {selected.owner?.mobile}
                    </p>
                    <p className="flex gap-2">
                      <Phone size={15} />
                      Seller AlternateMobile {selected.owner?.alternateMobile}
                    </p>
                    <p className="flex gap-2">
                      <Calendar size={15} /> Date of Birth
                      {new Date(
                        selected.owner?.dateOfBirth
                      ).toLocaleDateString()}
                    </p>
                    <p className="flex gap-2">
                      <User size={15} /> NidNumber {selected.owner?.nidNumber}{" "}
                    </p>
                    <p className="flex gap-2">
                      <Globe size={15} /> Seller Nationality
                      {selected.owner?.nationality}
                    </p>
                    <p className="flex gap-2">
                      <Link2 size={15} />
                      Seller Website Link{" "}
                      {selected.owner?.socialLinks?.website || "N/A"}
                    </p>

                    {/* BANK DETAILS */}
                    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mx-auto">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        Seller Bank Details
                      </h2>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors">
                          <CreditCard className="text-purple-500" />
                          <span className="font-bold">
                            <strong>Account Number:</strong>{" "}
                            {selected?.owner?.bankDetails?.accountNumber}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors">
                          <span className="font-bold">
                            <strong>Bank Name:</strong>{" "}
                            {selected?.owner?.bankDetails?.bankName}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors">
                          <MapPin className="text-purple-500" />
                          <span className="font-bold">
                            <strong>Branch:</strong>{" "}
                            {selected?.owner?.bankDetails?.branch}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors">
                          <Hash className="text-purple-500" />
                          <span className="font-bold">
                            <strong>Bank Code:</strong>{" "}
                            {selected?.owner?.bankDetails?.BankCode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-5 text-purple-300">
                    {selected.owner?.socialLinks?.instagram && (
                      <a
                        href={selected.owner.socialLinks.instagram}
                        target="_blank"
                      >
                        <Instagram />
                      </a>
                    )}
                    {selected.owner?.socialLinks?.facebook && (
                      <a
                        href={selected.owner.socialLinks.facebook}
                        target="_blank"
                      >
                        <Facebook />
                      </a>
                    )}
                    {selected.owner?.socialLinks?.linkedin && (
                      <a
                        href={selected.owner.socialLinks.linkedin}
                        target="_blank"
                      >
                        <Linkedin />
                      </a>
                    )}
                  </div>
                </div>

                {/* DOCUMENT VAULT */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-purple-300 mb-6">
                    Document Vault
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                    {[
                      "nidfrontimage",
                      "nidbackimage",
                      "birthCertificateImage",
                      "bankcheckbookimage",
                      "profileImage",
                      "shopThumbnail",
                      "physicalStoreImage",
                    ].map(
                      (key) =>
                        selected.owner?.[key] && (
                          <div
                            key={key}
                            className="bg-white/5 border border-white/15 rounded-xl overflow-hidden"
                          >
                            <div className="px-3 py-2 text-xs text-gray-400 flex gap-1 items-center">
                              <ImageIcon size={12} /> {key}
                            </div>
                            <img
                              src={selected.owner[key]}
                              className="w-full h-36 sm:h-44 object-cover hover:scale-105 transition"
                            />
                          </div>
                        )
                    )}

                    {Array.isArray(selected.owner?.additionalDocuments) &&
                      selected.owner.additionalDocuments.map((doc, i) => (
                        <div
                          key={i}
                          className="bg-white/5 border border-white/15 rounded-xl overflow-hidden"
                        >
                          <div className="px-3 py-2 text-xs text-gray-400 flex gap-1 items-center">
                            <ImageIcon size={12} /> additional-{i + 1}
                          </div>
                          <img
                            src={doc}
                            className="w-full h-36 sm:h-44 object-cover hover:scale-105 transition"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* ACTION ZONE */}
              <div className="mt-10 bg-white/5 border border-white/15 rounded-2xl p-5">
                <textarea
                  placeholder="Reviewer comments"
                  value={reviewerComments}
                  onChange={(e) => setReviewerComments(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-4 mb-4"
                />

                {selected.status !== "Approved" && (
                  <textarea
                    placeholder="Rejection reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full bg-black/40 border border-red-500 rounded-xl p-4 mb-6 text-red-400"
                  />
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <button
                    onClick={() => updatestatus(selected._id, "Approved")}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl flex gap-2 justify-center items-center"
                  >
                    <CheckCircle /> Approve
                  </button>
                  <button
                    onClick={() => updatestatus(selected._id, "Rejected")}
                    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl flex gap-2 justify-center items-center"
                  >
                    <XCircle /> Reject
                  </button>
                  <button
                    onClick={() => deleteRequest(selected._id)}
                    className="bg-red-500/20 hover:bg-red-600/30 px-6 py-3 rounded-xl flex gap-2 justify-center items-center"
                  >
                    <Trash2 /> Delete
                  </button>
                  <button
                    onClick={() => setselected(null)}
                    className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerShopapproval;
