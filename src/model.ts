export type Project = {
  id: string;
  name: string;
  parentProjectId: string;
  href: string;
  parameters: {
    property: [
      {
        name: string;
        value: string;
        inherited: boolean;
      },
    ];
  };
  projects: {
    project: Project[];
  };
};

export type NewProject = {
  parentProject: {
    locator: string;
  };
  name: string;
  id: string;
  copyAllAssociatedSettings: boolean;
};
