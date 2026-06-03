interface Window {
  Projects: {
    sendTemp: (text: string) => void;
    createProject: (project_name: string) => Promise<string | null>;
    getProjects: () => Promise<string[]>;
  };
  Files: {
    getResource: (path: string, file_name?: string) => Promise<string>;
    save: (
      path: string,
      new_content: string,
      file_name?: string,
    ) => Promise<boolean>;
    getResourceArray: (path: string, file_name?: string) => Promise<string[]>;
    saveToPdf: (path: string, file_name?: string) => Promise<void>;
  };
}
