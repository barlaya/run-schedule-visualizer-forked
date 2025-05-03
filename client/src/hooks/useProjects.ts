import { useState, useEffect } from 'react';
import { Project, loadProjects, addProjectToBackend } from '@/data/mockProjects';
import { useToast } from '@/components/ui/use-toast';

//Start with empty projects
export function useProjects() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  //first time load population, set res
  useEffect(() => {
    const fetchProjects = async () => {
      const res = await loadProjects();

      setProjects(prev => res);
    };

    fetchProjects().then();
  }, []);

  const addProject = async (project: Omit<Project, 'id' | 'topsisScore'>) => {
    try {
      setIsLoading(true);

      const projects = await addProjectToBackend(project);

      setProjects(prev => projects);

      toast({
        title: "Project Added",
        description: `${project.projectAbbreviation} has been added to the schedule.`,
      });
    } catch (error) {
      console.error("Error adding project:", error);
      toast({
        title: "Error",
        description: "Failed to add new project. Please try again.",
        variant: "destructive",
        className: "incorrectFillingToast"
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Refresh project priorities (simulate recalculation)
  const refreshProjects = async () => {
    try {
      setIsRefreshing(true);

      const projs = await loadProjects();


      setProjects(prev => projs);
      
      toast({
        title: "Priorities Refreshed",
        description: "The project priorities have been recalculated.",
      });
    } catch (error) {
      console.error("Error refreshing priorities:", error);
      toast({
        title: "Error",
        description: "Failed to refresh priorities. Please try again.",
        variant: "destructive",
        className: "incorrectFillingToast",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    projects,
    isLoading,
    isRefreshing,
    addProject,
    refreshProjects,
  };
}
