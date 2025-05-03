
import { useMemo } from "react";
import { format, addDays, startOfWeek, differenceInDays } from "date-fns";
import { Project, calculatePriority } from "@/data/mockProjects";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ColorConstants } from '../constants/color.constants.ts';

interface GanttChartProps {
  projects: Project[];
}

const GanttChart = ({ projects }: GanttChartProps) => {
  // Find min and max dates to determine chart range
  const today = new Date();
  const minDate = useMemo(() => {
    const dates = [...projects.map(p => p.deadline)];
    dates.push(today); // Include today
    return startOfWeek(new Date(Math.min(...dates.map(d => d.getTime()))));
  }, [projects, today]);

  const maxDate = useMemo(() => {
    const dates = [...projects.map(p => p.deadline)];
    const latestDate = new Date(Math.max(...dates.map(d => d.getTime())));
    return addDays(latestDate, 7); // Add a week buffer
  }, [projects]);

  // Generate dates for header
  const daysToShow = differenceInDays(maxDate, minDate) + 1;
  const dates = Array.from({ length: daysToShow }, (_, i) => addDays(minDate, i));

  // Get width percentage for each bar
  const getBarWidth = (duration: number) => {
    return `${(duration / daysToShow) * 100}%`;
  };

  // Get position percentage for each bar
  const getBarPosition = (date: Date) => {
    const daysFromStart = differenceInDays(date, minDate);
    return `${(daysFromStart / daysToShow) * 100}%`;
  };

  // Get color for each bar based on priority
  const getBarColor = (project: Project) => {
    const priority = calculatePriority(project);
    switch (priority) {
      case 'high': return ColorConstants.bgPriorityHigh70;
      case 'medium': return ColorConstants.bgPriorityMedium70;
      case 'low': return ColorConstants.bgPriorityLow70;
      default: return ColorConstants.bgGray400;
    }
  };

  // Sort projects by deadline
  const sortedProjects = [...projects].sort(
    (a, b) => a.deadline.getTime() - b.deadline.getTime()
  );

  return (
    <div className=" w-full overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Project Timeline</h2>
      <div className="min-w-[800px]">
        {/* Chart Header - Dates */}
        <div className="flex border-b mb-2">
          <div className="w-1/4 min-w-[200px] pr-2">
            <div className="h-10 flex items-center font-medium">Project</div>
          </div>
          <div className="w-3/4 flex">
            {dates.map((date, index) => (
              <div 
                key={index} 
                className={`flex-1 text-center text-xs py-2 ${
                  format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') 
                    ? 'bg-blue-100 dark:bg-blue-900/20 font-medium' 
                    : ''
                }`}
              >
                <div>{format(date, 'EEE')}</div>
                <div>{format(date, 'd')}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Projects */}
        <div className=" space-y-1">
          {sortedProjects.map((project) => {
            const barWidth = getBarWidth(project.duration);
            const startDate = new Date(project.deadline);
            startDate.setDate(startDate.getDate() - project.duration + 1);
            const startPosition = getBarPosition(startDate);
            const barColor = getBarColor(project);
            const daysFromToday = differenceInDays(project.deadline, today);
            
            return (
              <div key={project.id} className="flex group">
                <div className="w-1/4 min-w-[200px] pr-2">
                  <div className="h-8 flex items-center truncate">
                    <span className="truncate font-medium">{project.projectAbbreviation}</span>
                    <span className="text-xs text-muted-foreground ml-2 truncate">
                      ({project.username})
                    </span>
                  </div>
                </div>
                <div className="w-3/4 relative h-8">
                  {/* Today marker */}
                  {dates.some(date => format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) && (
                    <div 
                      className="absolute top-0 bottom-0 w-px bg-blue-500 z-10"
                      style={{ 
                        left: getBarPosition(today),
                      }}
                    />
                  )}
                  
                  {/* Grid lines */}
                  {dates.map((date, index) => (
                    <div
                      key={index}
                      className={`absolute top-0 bottom-0 w-px ${ColorConstants.bgGray200} dark:bg-gray-700`}
                      style={{ left: `${(index / daysToShow) * 100}%` }}
                    />
                  ))}
                  
                  {/* Project bar */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={`absolute h-6 top-1 rounded transition-opacity duration-200 ${barColor} group-hover:opacity-90 cursor-pointer`}
                          style={{ 
                            width: barWidth,
                            left: startPosition,
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white dark:bg-gray-900 border border-brand-divider dark:border-gray-700 shadow-sm dark:shadow-lg">
                        <div className="text-sm space-y-1">
                          <div><span className="font-medium">{project.projectAbbreviation}</span> ({project.username})</div>
                          <div>Duration: {project.duration} days</div>
                          <div>Deadline: {format(project.deadline, 'MMM dd, yyyy')}</div>
                          <div>
                            {daysFromToday < 0 
                              ? <span className="text-priority-high font-medium">{Math.abs(daysFromToday)} days overdue</span>
                              : daysFromToday === 0 
                                ? <span className="text-priority-high font-medium">Due today</span>
                                : <span>{daysFromToday} days remaining</span>
                            }
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* Deadline marker */}
                  <div
                      className="absolute top-0 bottom-0 w-px bg-black !important dark:bg-white !important z-20"
                      style={{ left: getBarPosition(project.deadline) }}
                  >
                    <div className="w-2 h-2 rounded-full bg-black !important dark:bg-white !important absolute top-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
