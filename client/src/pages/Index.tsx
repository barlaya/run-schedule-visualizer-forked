
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import DashboardHeader from "@/components/DashboardHeader";
import ProjectTable from "@/components/ProjectTable";
import GanttChart from "@/components/GanttChart";
import ScatterPlot from "@/components/ScatterPlot";
import AddProjectForm from "@/components/AddProjectForm";
import { useProjects } from "@/hooks/useProjects";


const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { projects, isLoading, isRefreshing, addProject, refreshProjects } = useProjects();

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <DashboardHeader
        onRefresh={refreshProjects}
        isRefreshing={isRefreshing}
      />

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Overview */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger className="bg-white dark:bg-gray-900 border border-brand-divider dark:border-gray-700 shadow-sm dark:shadow-lg" value="overview">Overview</TabsTrigger>
              <TabsTrigger className="bg-white dark:bg-gray-900 border border-brand-divider dark:border-gray-700 shadow-sm dark:shadow-lg" value="timeline">Timeline</TabsTrigger>
              <TabsTrigger className="bg-white dark:bg-gray-900 border border-brand-divider dark:border-gray-700 shadow-sm dark:shadow-lg" value="analysis">Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6 mt-6">
              <ProjectTable projects={projects} />
            </TabsContent>
            <TabsContent value="timeline" className="space-y-6 mt-6">
              <Card className="bg-white dark:bg-gray-900 border border-brand-divider dark:border-gray-700 shadow-sm dark:shadow-lg p-6">
                <GanttChart projects={projects} />
              </Card>
            </TabsContent>
            <TabsContent value="analysis" className="space-y-6 mt-6">
              <Card className="bg-white dark:bg-gray-900 border border-brand-divider dark:border-gray-700 rounded-lg text-sm shadow-sm dark:shadow-lg p-6">
                <ScatterPlot projects={projects} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Add Project Form */}
        <div className="md:col-span-1">
          <AddProjectForm
            onAddProject={addProject}
            isLoading={isLoading}
          />

          {/* Project Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Card className="bg-white dark:bg-gray-900 border border-brand-divider dark:border-gray-700 p-4 rounded-lg text-sm shadow-sm dark:shadow-lg">
              <div className="text-xs text-muted-foreground">Total Projects</div>
              <div className="text-2xl font-bold">{projects.length}</div>
            </Card>
            <Card className="bg-white dark:bg-gray-900 border border-brand-divider dark:border-gray-700 p-4 rounded-lg text-sm shadow-sm dark:shadow-lg">
              <div className="text-xs text-muted-foreground">High Priority</div>
              <div className="text-2xl font-bold text-priority-high">
                {projects.filter(p => p.topsisScore >= 0.8 || new Date().getTime() > p.deadline.getTime() - 2 * 24 * 60 * 60 * 1000).length}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
