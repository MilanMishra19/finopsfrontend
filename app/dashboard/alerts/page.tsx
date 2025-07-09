"use client";

import AccountCards from "@/app/ui/dashboard/statcard/Accountcard";
import { useEffect, useState } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
interface AlertData {
  alertId: string;
  name: string;
  severity: string;
  amount: number;
  reason: string;
  status: "PENDING" | "UNRESOLVED" | "RESOLVED" | "INVESTIGATING";
  createdAt: string;
  resolvedBy?: string | null;
  transaction?: {
    txnId: string;
  };
}

export default function Account() {
  const [alertData, setAlertData] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedBy, setResolvedBy] = useState("");
  const [updateStatusMessage, setUpdateStatusMessage] = useState("");
  const [updatingAlertId, setUpdatingAlertId] = useState<string | null>(null);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/alerts/active`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setAlertData(data.content || []);
    } catch (err) {
      console.error("Failed to fetch alerts: ", err);
      setError("Failed to fetch alerts. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchResolvedBy = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/analysts/me`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Unable to fetch user info");

      const data = await res.json();
      setResolvedBy(data.id); 
    } catch (err) {
      console.error("Failed to fetch analyst ID", err);
    }
  };

  fetchResolvedBy();
  fetchAlerts();
}, []);

  const handleResolveAlert = async (
    alertId: string,
    newStatus: AlertData["status"]
  ) => {
    setUpdatingAlertId(alertId);
    setUpdateStatusMessage("");

    try {
      if (!resolvedBy.trim()) {
        throw new Error("Please enter your name/ID in the Resolved By field.");
      }

      const url = `${BACKEND_URL}/api/alerts/resolve/${alertId}?status=${newStatus}&resolvedBy=${encodeURIComponent(
        resolvedBy.trim()
      )}`;
      const res = await fetch(url, {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update alert.");
      }

      setUpdateStatusMessage(
        `Alert ID ${alertId} status updated to ${newStatus}.`
      );

      setAlertData((prev) =>
        prev.map((alert) =>
          alert.alertId === alertId
            ? { ...alert, status: newStatus, resolvedBy: resolvedBy.trim() }
            : alert
        )
      );
    } catch (err) {
  if (err instanceof Error) {
    setUpdateStatusMessage(`Error: ${err.message}`);
    console.error("Update error:", err);
  } else {
    setUpdateStatusMessage("An unexpected error occurred.");
    console.error("Unknown error:", err);
  }
} finally {
  setUpdatingAlertId(null);
}
  };

  return (
    <>
      <div className="grid px-4 grid-cols-12 gap-3 pb-3">
        <div className="col-span-11 p-2 rounded">
          <h1 className="uppercase tracking-widest leading-none font-bold text-white">
            Alerts Overview
          </h1>
        </div>
      </div>

      <div className="grid px-2 grid-cols-12 gap-3">
        <AccountCards />
        <div className="col-span-12 bg-transparent border border-stone-300 rounded">
          <div className="p-4 flex items-center space-x-4 bg-gray-900 rounded-t">
            <label
              htmlFor="resolved-by-input"
              className="font-semibold text-white"
            >
              Resolved By:
            </label>
            <input
              id="resolved-by-input"
              type="text"
              value={resolvedBy}
              readOnly
              placeholder="Loading ID..."
              className="flex-grow bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none"
            />
          </div>

          {updateStatusMessage && (
            <p
              className={`p-4 text-sm font-semibold ${
                updateStatusMessage.startsWith("Error")
                  ? "text-red-400"
                  : "text-green-400"
              } bg-gray-900`}
            >
              {updateStatusMessage}
            </p>
          )}

          <table className="min-w-full divide-y divide-gray-200 rounded">
            <thead>
              <tr className="bg-black">
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-black divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4">
                    <div className="border border-t-white animate-spin rounded-full h-6 w-6"></div>
                    <span className="animate-spin text-white text-sm">
                      Loading...
                    </span>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-red-400">
                    {error}
                  </td>
                </tr>
              ) : alertData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-white/70">
                    No active alerts found.
                  </td>
                </tr>
              ) : (
                alertData.map((alert) => (
                  <tr key={alert.alertId} className="hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm text-white">
                      {alert.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {alert.severity}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      ₹{alert.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {alert.reason}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={alert.status}
                        onChange={(e) =>
                          handleResolveAlert(
                            alert.alertId,
                            e.target.value as AlertData["status"]
                          )
                        }
                        className={`text-xs rounded-full p-1 
                          ${
                            alert.status === "RESOLVED"
                              ? "bg-green-100 text-green-500"
                              : alert.status === "INVESTIGATING"
                              ? "bg-yellow-100 text-yellow-500"
                              : "bg-red-100 text-red-500"
                          }`}
                        disabled={
                          updatingAlertId === alert.alertId ||
                          !resolvedBy.trim()
                        }
                      >
                        <option value="UNRESOLVED">UNRESOLVED</option>
                        <option value="INVESTIGATING">INVESTIGATING</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {new Date(alert.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
