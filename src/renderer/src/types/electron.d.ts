interface Window {
  Projects: {
    sendTemp: (text: string) => void,
    createProject: (project_name: string) => Promise<string | null>
    getProjects: () => Promise<string[]>,
  }
}
