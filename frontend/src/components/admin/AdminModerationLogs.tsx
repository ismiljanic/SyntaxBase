import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../../styles/AdminModerationLogs.css";
import LoadingScreen from "../LoadingScreen";
import { useNavigate } from "react-router-dom";

export function AdminModerationLogs() {
    const { getAccessTokenSilently } = useAuth0();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterUser, setFilterUser] = useState("");
    const [filterLabel, setFilterLabel] = useState("");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch("http://localhost:8080/api/admin/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setAllUsers(data);
            } catch (e) {
                console.error("Failed to load users:", e);
                setAllUsers([]);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch(
                    "http://localhost:8080/api/admin/moderation/posts",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();
                setLogs(Array.isArray(data) ? data : data.logs || []);
            } catch (e) {
                console.error("Failed to load moderation logs:", e);
                setLogs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const getLabelClass = (label: string) => {
        switch (label) {
            case "safe":
                return "label-safe";
            case "mild":
                return "label-mild";
            case "toxic":
                return "label-toxic";
            case "severe":
                return "label-severe";
            default:
                return "";
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesUser = filterUser
            ? log.username?.toLowerCase().includes(filterUser.toLowerCase())
            : true;

        const matchesLabel = filterLabel ? log.moderationLabel === filterLabel : true;

        const logDate = log.moderationTimestamp ? new Date(log.moderationTimestamp) : null;

        const matchesStartDate = filterStartDate
            ? logDate
                ? logDate >= new Date(filterStartDate)
                : false
            : true;

        const matchesEndDate = filterEndDate
            ? logDate
                ? logDate <= new Date(filterEndDate)
                : false
            : true;

        return matchesUser && matchesLabel && matchesStartDate && matchesEndDate;
    });

    const sortedLogs = filteredLogs.sort((a, b) => b.id - a.id);

    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleExpand = (postId: number) => {
        const newSet = new Set(expandedRows);
        if (newSet.has(postId)) {
            newSet.delete(postId);
        } else {
            newSet.add(postId);
        }
        setExpandedRows(newSet);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="moderation-logs-container">
            <h2>Moderation Results</h2>

            <div className="filters-container">
                <select
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                >
                    <option value="">All Users</option>
                    {allUsers.map((user) => (
                        <option key={user.id} value={user.username || user.email}>
                            {user.username || user.email}
                        </option>
                    ))}
                </select>

                <select value={filterLabel} onChange={(e) => setFilterLabel(e.target.value)}>
                    <option value="">All Labels</option>
                    <option value="safe">Safe</option>
                    <option value="mild">Mild</option>
                    <option value="toxic">Toxic</option>
                    <option value="severe">Severe</option>
                </select>

                <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    placeholder="Start Date"
                />
                <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    placeholder="End Date"
                />

                <button
                    className="clear-filters-btn"
                    onClick={() => {
                        setFilterUser("");
                        setFilterLabel("");
                        setFilterStartDate("");
                        setFilterEndDate("");
                    }}
                >
                    Clear Filters
                </button>
            </div>
            <table className="moderation-table">
                <thead>
                    <tr>
                        <th>Post ID</th>
                        <th>User</th>
                        <th>Content</th>
                        <th>Label</th>
                        <th>Confidence</th>
                        <th>Reasoning</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedLogs.map((item: any) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td className="username-cell">
                                <span
                                    className="username-link"
                                    onClick={() =>
                                        navigate(`/admin/users/${encodeURIComponent(item.userId)}`)
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    {item.username}
                                </span>
                            </td>
                            <td
                                className={`content-cell ${expandedRows.has(item.id) ? "expanded" : ""}`}
                                onClick={() => toggleExpand(item.id)}
                            >
                                {item.content}
                            </td>
                            <td className={getLabelClass(item.moderationLabel)}>{item.moderationLabel?.toUpperCase()}</td>
                            <td>
                                {item.moderationConfidence != null
                                    ? (item.moderationConfidence * 100).toFixed(2) + "%"
                                    : "—"}
                            </td>
                            <td
                                className={`reasoning-cell ${expandedRows.has(item.id) ? "expanded" : ""}`}
                                onClick={() => toggleExpand(item.id)}
                            >
                                {item.moderationReasoning || "—"}
                            </td>
                            <td>
                                {item.moderationTimestamp
                                    ? new Date(item.moderationTimestamp).toLocaleString()
                                    : "—"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}