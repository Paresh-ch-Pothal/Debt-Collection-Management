import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Metrics from '../Components/Metrics';

interface Reply {
    id: string;
    message: string;
    timestamp: string;
    sentiment: 'positive' | 'neutral' | 'negative';
}

interface MetricsData {
    avg_reply_time: string; // in minutes
    reply_percentage: number;
    last_reply_at: string;
    total_messages_sent: number;
    total_replies: number;
    replies: Reply[];
}

const MetricsDashboard: React.FC = () => {
    const [data, setData] = useState<MetricsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { recordId } = useParams<{ recordId: string }>();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("User not authenticated");
                
                const response = await axios.get(`${baseUrl}/api/message/get_report_details/${recordId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setData(response.data.data);
                } else {
                    setError(response.data.message || "Failed to fetch metrics");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [recordId]);

    if (loading) return <div>Loading metrics...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!data) return <div>No data found</div>;

    return <Metrics data={data} />; // now Metrics fetches its own record data
};

export default MetricsDashboard;
