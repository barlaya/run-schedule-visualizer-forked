
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface AddProjectFormProps {
  onAddProject: (project: {
    username: string;
    projectAbbreviation: string;
    deadline: Date;
    department: string;
    fileSize: number;
    duration: number;
  }) => void;
  isLoading: boolean;
}

const departments = [
  "Engineering",
  "Design",
  "Marketing",
  "Finance",
  "HR",
  "Customer Support",
  "Data Science",
  "Product",
  "Security",
  "Operations",
];

const AddProjectForm = ({ onAddProject, isLoading }: AddProjectFormProps) => {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [projectAbbreviation, setProjectAbbreviation] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [department, setDepartment] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!username || !projectAbbreviation || !deadline || !department || !fileSize || !duration) {
      toast({
        title: "Missing fields",
        description: "Please fill out all fields.",
        variant: "destructive",
        className: "incorrectFillingToast"
      });
      return;
    }

    onAddProject({
      username,
      projectAbbreviation,
      deadline,
      department,
      fileSize: parseFloat(fileSize),
      duration: parseInt(duration),
    });

    // Reset form
    setUsername("");
    setProjectAbbreviation("");
    setDeadline(undefined);
    setDepartment("");
    setFileSize("");
    setDuration("");
  };

  return (
    <Card className="bg-white dark:bg-gray-900 border border-brand-divider dark:border-gray-700 p-4 rounded-lg text-sm shadow-sm dark:shadow-lg">
      <CardHeader>
        <CardTitle>Add New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                  style={{
                    backgroundColor: `hsl(var(--background))`,
                    color: `hsl(var(--foreground))`,
                  }}
                  className="placeholder:text-[hsl(var(--foreground))]"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., john_doe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectAbbreviation">Project Name</Label>
              <Input
                  style={{
                    backgroundColor: `hsl(var(--background))`,
                    color: `hsl(var(--foreground))`,
                  }}
                id="projectAbbreviation"
                  className="placeholder:text-[hsl(var(--foreground))]"
                value={projectAbbreviation}
                onChange={(e) => setProjectAbbreviation(e.target.value)}
                placeholder="e.g., UX-DESIGN"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Popover>
                <PopoverTrigger asChild style={{
                  backgroundColor: `hsl(var(--background))`,
                }}>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full text-left font-normal"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                    style={{
                      backgroundColor: `hsl(var(--background))`,
                      color: `hsl(var(--foreground))`,
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger style={{
                  backgroundColor: `hsl(var(--background))`
                }}>
                  <SelectValue
                      placeholder="Select department"
                  />
                </SelectTrigger>
                <SelectContent style={{
                  backgroundColor: `hsl(var(--background))`,
                }}>
                  {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fileSize">File Size (MB)</Label>
              <Input
                  style={{
                    backgroundColor: `hsl(var(--background))`,
                    color: `hsl(var(--foreground))`,
                  }}
                id="fileSize"
                type="number"
                min="0.1"
                step="0.1"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="e.g., 15.5"
                  className="placeholder:text-[hsl(var(--foreground))]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                  style={{
                    backgroundColor: `hsl(var(--background))`,
                    color: `hsl(var(--foreground))`,
                  }}
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 3"
                  className="placeholder:text-[hsl(var(--foreground))]"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Add Project"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProjectForm;
