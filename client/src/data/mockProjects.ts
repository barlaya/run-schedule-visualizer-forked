export interface Project {
  id: string;
  username: string;
  projectAbbreviation: string;
  deadline: Date;
  topsisScore: number;
  department: string;
  fileSize: number;
  duration: number; // in days
}

// Function to calculate priority based on deadline and TOPSIS score
export const calculatePriority = (project: Project): 'high' | 'medium' | 'low' => {
  const today = new Date();

  const daysTillDeadline = Math.ceil((project.deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysTillDeadline <= 2) return 'high';
  if (project.topsisScore >= 0.85) return 'high';
  if (daysTillDeadline <= 5 || project.topsisScore >= 0.75) return 'medium';
  return 'low';
};

function mapProjects(parsedResponse: object[]): Project[] {
  return parsedResponse.map((project: object) => {
    project['deadline'] = new Date(project['deadline']);

    return project as Project;
  });
}

export async function loadProjects(): Promise<Project[]> {
  const response = await fetch('http://localhost:5000/api/projects');

  //fetch
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return mapProjects(await response.json());

}

export async function addProjectToBackend(project: Omit<Project, 'id' | 'topsisScore'>): Promise<Project[]> {
  const response = await fetch('http://localhost:5000/api/addProject', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });

  if (response.ok) {
    return mapProjects(await response.json());
  }
}
