import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Clock, MessageCircle, Calendar, TrendingUp, User } from 'lucide-react';

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

// Sample data - replace with your actual data
interface MetricsDashboardProps {
    data: MetricsData;
}

const Metrics: React.FC<MetricsDashboardProps> = ({ data }) => {
    const [selectedReply, setSelectedReply] = useState<string | null>(null);

    // Helper functions
    const formatTime = (minutes: number): string => {
        const hrs = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        const secs = Math.floor((minutes % 1) * 60);
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getReplyTimeColor = (minutes: number): string => {
        if (minutes < 5) return '#10B981'; // green
        if (minutes <= 15) return '#F59E0B'; // yellow
        return '#EF4444'; // red
    };

    const getReplyPercentageColor = (percentage: number): string => {
        if (percentage === 100) return '#10B981';
        if (percentage >= 50) return '#F59E0B';
        return '#EF4444';
    };

    const getLastReplyColor = (timestamp: string): string => {
        const now = new Date();
        const lastReply = new Date(timestamp);
        const diffHours = (now.getTime() - lastReply.getTime()) / (1000 * 3600);

        if (diffHours < 1) return '#10B981';
        if (diffHours <= 24) return '#F59E0B';
        return '#EF4444';
    };

    const formatLastReply = (timestamp: string): string => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSentimentValue = (sentiment: string): number => {
        switch (sentiment) {
            case 'positive': return 1;
            case 'negative': return -1;
            default: return 0;
        }
    };

    const getSentimentColor = (sentiment: string): string => {
        switch (sentiment) {
            case 'positive': return '#10B981';
            case 'negative': return '#EF4444';
            default: return '#6B7280';
        }
    };

    // Prepare data for charts
    const replyTimeData = [
        { name: 'Reply Time', value: data.avg_reply_time, max: 30 }
    ];

    const comparisonData = [
        {
            name: 'Messages',
            sent: data.total_messages_sent,
            replies: data.total_replies
        }
    ];

    const sentimentTrendData = data.replies.map((reply, index) => ({
        sequence: index + 1,
        sentiment: getSentimentValue(reply.sentiment),
        timestamp: reply.timestamp
    }));

    const parseTimeStringToMinutes = (timeStr: string): number => {
        const [hh, mm, ss] = timeStr.split(':').map(Number);
        return hh * 60 + mm + ss / 60;
    };

    const avgReplyMinutes = parseTimeStringToMinutes(data.avg_reply_time);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <TrendingUp className="text-blue-600" />
                    Communication Metrics Dashboard
                </h1>

                {/* Top Row - Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    {/* Average Reply Time - Radial Chart */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Clock className="text-blue-600" size={20} />
                                Average Reply Time
                            </h3>
                        </div>
                        <div className="relative flex justify-center items-center">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { value: avgReplyMinutes, color: getReplyTimeColor(avgReplyMinutes) },
                                            { value: 30 - avgReplyMinutes, color: '#E5E7EB' }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                    >
                                        <Cell fill={getReplyTimeColor(avgReplyMinutes)} />
                                        <Cell fill="#E5E7EB" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-2xl font-bold" style={{ color: getReplyTimeColor(avgReplyMinutes) }}>
                                        {formatTime(avgReplyMinutes)}
                                    </div>
                                    <div className="text-xs text-gray-500">avg time</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reply Percentage - Progress Bar */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <MessageCircle className="text-blue-600" size={20} />
                                Reply Rate
                            </h3>
                        </div>

                        <div className="flex flex-col items-center space-y-4 mt-10">
                            {/* Percentage */}
                            <div className="text-3xl font-bold" style={{ color: getReplyPercentageColor(data.reply_percentage) }}>
                                {data.reply_percentage}%
                            </div>

                            {/* Progress Bar */}
                            <div className="w-3/4 bg-gray-200 rounded-full h-4">
                                <div
                                    className="h-4 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${data.reply_percentage}%`,
                                        backgroundColor: getReplyPercentageColor(data.reply_percentage)
                                    }}
                                ></div>
                            </div>

                            {/* Message Count */}
                            <div className="text-sm text-gray-600 text-center">
                                {data.total_replies} of {data.total_messages_sent} messages
                            </div>
                        </div>
                    </div>



                    {/* Last Reply At - Info Box */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Calendar className="text-blue-600" size={20} />
                                Last Activity
                            </h3>
                        </div>
                        <div className="text-center space-y-2 mt-16">
                            <div
                                className="text-lg font-semibold"
                                style={{ color: getLastReplyColor(data.last_reply_at) }}
                            >
                                {formatLastReply(data.last_reply_at)}
                            </div>
                            <div className="text-sm text-gray-600">Last replied</div>
                            <div className="flex justify-center">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: getLastReplyColor(data.last_reply_at) }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row - Charts and Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Messages vs Replies Comparison */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <User className="text-blue-600" size={20} />
                            Message Engagement
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#F8FAFC',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="sent" fill="#3B82F6" name="Messages Sent" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="replies" fill="#10B981" name="Replies Received" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Sentiment Trend */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6">Reply Sentiment Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={sentimentTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="sequence" tick={{ fontSize: 12 }} label={{ value: 'Reply Sequence', position: 'insideBottom', offset: 0 }} />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    domain={[-1.2, 1.2]}
                                    tickFormatter={(value: any) => {
                                        if (value > 0) return 'Positive';
                                        if (value < 0) return 'Negative';
                                        return 'Neutral';
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#F8FAFC',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: any) => {
                                        if (value > 0) return ['Positive', 'Sentiment'];
                                        if (value < 0) return ['Negative', 'Sentiment'];
                                        return ['Neutral', 'Sentiment'];
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sentiment"
                                    stroke="#8B5CF6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Replies Table */}
                <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200 overflow-hidden">
                    <div className="p-6 border-b border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Replies</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-blue-50/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-100">
                                {data.replies.map((reply) => (
                                    <tr key={reply.id} className="hover:bg-blue-50/30">
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-md truncate">{reply.message}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatLastReply(reply.timestamp)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                                                style={{ backgroundColor: getSentimentColor(reply.sentiment) }}
                                            >
                                                {reply.sentiment}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedReply(selectedReply === reply.id ? null : reply.id)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                            >
                                                {selectedReply === reply.id ? 'Hide' : 'Summarize'}
                                            </button>
                                            {selectedReply === reply.id && (
                                                <div className="mt-2 p-3 bg-blue-50/50 rounded-lg text-sm text-gray-700 border border-blue-200">
                                                    <strong>Summary:</strong> This reply shows a {reply.sentiment} sentiment and was sent on {formatLastReply(reply.timestamp)}.
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Metrics;