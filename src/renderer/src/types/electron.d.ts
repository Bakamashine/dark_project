interface Window {
  Projects: {
    sendTemp: (text: string) => void,
    createProject: (project_name: string) => string
    getProjects: () => Promise<string[]>,
  }
}
