import { useRef } from "react";
import { format, differenceInDays } from "date-fns";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine
} from 'recharts';
import { Project, calculatePriority } from "@/data/mockProjects";
import { Card } from "@/components/ui/card";

interface ScatterPlotProps {
    projects: Project[];
}

const ScatterPlot = ({ projects }: ScatterPlotProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const today = new Date();

    const data = projects.map(project => {
        const daysToDeadline = differenceInDays(project.deadline, today);
        const priority = calculatePriority(project);

        return {
            name: project.projectAbbreviation,
            username: project.username,
            topsisScore: project.topsisScore,
            daysToDeadline: daysToDeadline,
            deadline: format(project.deadline, "MMM dd, yyyy"),
            department: project.department,
            fileSize: project.fileSize,
            duration: project.duration,
            priority: priority
        };
    });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return '#ea384c';
            case 'medium': return '#f97316';
            case 'low': return '#10b981';
            default: return '#888888';
        }
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <Card className="bg-white dark:bg-gray-900 border-brand-divider dark:border-gray-700 shadow-lg dark:shadow-sm p-3 border">
                    <div className="text-sm font-medium">{data.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">({data.username})</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div className="font-medium">TOPSIS Score:</div>
                        <div>{data.topsisScore.toFixed(2)}</div>
                        <div className="font-medium">Deadline:</div>
                        <div>{data.deadline}</div>
                        <div className="font-medium">Days to Deadline:</div>
                        <div>
                            {data.daysToDeadline < 0
                                ? `${Math.abs(data.daysToDeadline)} days overdue`
                                : data.daysToDeadline === 0
                                    ? "Due today"
                                    : `${data.daysToDeadline} days`}
                        </div>
                        <div className="font-medium">Department:</div>
                        <div>{data.department}</div>
                        <div className="font-medium">File Size:</div>
                        <div>{data.fileSize} MB</div>
                        <div className="font-medium">Duration:</div>
                        <div>{data.duration} days</div>
                    </div>
                </Card>
            );
        }
        return null;
    };

    return (
        <div className="w-full" ref={chartRef}>
            <h2 className="text-xl font-semibold mb-4">TOPSIS Score vs Deadline</h2>
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            type="number"
                            dataKey="daysToDeadline"
                            name="Days to Deadline"
                            label={{ value: 'Days to Deadline', position: 'insideBottom', offset: -10 }}
                            domain={['dataMin - 1', 'dataMax + 1']}
                        />
                        <YAxis
                            type="number"
                            dataKey="topsisScore"
                            name="TOPSIS Score"
                            label={{ value: 'TOPSIS Score', angle: -90, position: 'insideLeft' }}
                            domain={[0, 1]}
                        />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend  wrapperStyle={{ position: 'relative', top: -20 }} />

                        {/* Draw a reference line for "today" */}
                        <ReferenceLine
                            x={0} // This is the value on the X-axis where the vertical line will appear
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                        />

                        {/* Group scatter points by priority */}
                        {['high', 'medium', 'low'].map(priority => (
                            <Scatter
                                key={priority}
                                name={`${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`}
                                data={data.filter(item => item.priority === priority)}
                                fill={getPriorityColor(priority)}
                                shape="circle"
                            />
                        ))}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ScatterPlot;
