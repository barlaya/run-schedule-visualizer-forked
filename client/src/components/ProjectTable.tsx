

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Project, calculatePriority } from "@/data/mockProjects";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowUpDown, ChevronDown, Info } from "lucide-react";
import { ColorConstants } from '../constants/color.constants.ts';

interface ProjectTableProps {
  projects: Project[];
}

const ProjectTable = ({ projects }: ProjectTableProps) => {
  const [sortBy, setSortBy] = useState<keyof Project>("deadline");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState("");

  const handleSort = (column: keyof Project) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.username.toLowerCase().includes(filter.toLowerCase()) ||
      project.projectAbbreviation.toLowerCase().includes(filter.toLowerCase()) ||
      project.department.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "deadline") {
      return sortOrder === "asc"
        ? a.deadline.getTime() - b.deadline.getTime()
        : b.deadline.getTime() - a.deadline.getTime();
    }
    
    if (typeof a[sortBy] === "string" && typeof b[sortBy] === "string") {
      return sortOrder === "asc"
        ? (a[sortBy] as string).localeCompare(b[sortBy] as string)
        : (b[sortBy] as string).localeCompare(a[sortBy] as string);
    }
    
    return sortOrder === "asc"
      ? (a[sortBy] as number) - (b[sortBy] as number)
      : (b[sortBy] as number) - (a[sortBy] as number);
  });

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return `${ColorConstants.bgPriorityHigh10} ${ColorConstants.textPriorityHigh} ${ColorConstants.borderPriorityHigh30}`;
      case 'medium': return `${ColorConstants.bgPriorityMedium10} ${ColorConstants.textPriorityMedium} ${ColorConstants.borderPriorityMedium30}`;
      case 'low': return `${ColorConstants.bgPriorityLow10} ${ColorConstants.textPriorityLow} ${ColorConstants.borderPriorityLow30}`
      default: return '';
    }
  };

  const getTopsisColor = (score: number) => {
    if (score >= 0.8) return ColorConstants.textTopsisHigh;
    if (score >= 0.7) return ColorConstants.textTopsisMedium;
    return ColorConstants.textTopsisLow;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Project Rankings</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter projects..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="placeholder:text-[hsl(var(--foreground))] bg-white dark:bg-gray-900 border border-brand-divider dark:border-gray-700 shadow-sm dark:shadow-lg max-w-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"  className="bg-white dark:bg-gray-900 border border-brand-divider dark:border-gray-700 shadow-sm dark:shadow-lg">
                Sort by <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-gray-900 border border-brand-divider dark:border-gray-700 shadow-sm dark:shadow-lg">
              <DropdownMenuItem onClick={() => handleSort("username")}>
                Username
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("projectAbbreviation")}>
                Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("deadline")}>
                Deadline
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("topsisScore")}>
                TOPSIS Score
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table className="bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm dark:shadow-lg">
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("username")} className="cursor-pointer">
                Username <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("projectAbbreviation")} className="cursor-pointer">
                Project <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("deadline")} className="cursor-pointer">
                Deadline <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("topsisScore")} className="cursor-pointer">
                TOPSIS Score <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProjects.map((project) => {
              const priority = calculatePriority(project);
              const priorityColor = getPriorityColor(priority);
              const topsisColor = getTopsisColor(project.topsisScore);
              const daysToDeadline = Math.ceil(
                (project.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.username}</TableCell>
                  <TableCell>{project.projectAbbreviation}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{format(project.deadline, "MMM dd, yyyy")}</span>
                      <span className={`text-xs ${daysToDeadline < 0 ? 'text-priority-high' : 'text-muted-foreground'}`}>
                        {daysToDeadline < 0 
                          ? `${Math.abs(daysToDeadline)} days overdue` 
                          : daysToDeadline === 0 
                            ? "Due today" 
                            : `${daysToDeadline} days left`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${topsisColor}`}>
                      {project.topsisScore.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColor}`}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white dark:bg-gray-900 border border-brand-divider dark:border-gray-700 shadow-sm dark:shadow-lg w-80">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-sm">{project.projectAbbreviation}</h3>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>Department:</div>
                              <div>{project.department}</div>
                              <div>File Size:</div>
                              <div>{project.fileSize} MB</div>
                              <div>Duration:</div>
                              <div>{project.duration} days</div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}
            {sortedProjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No projects found matching your filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectTable;
