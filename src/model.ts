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
  sourceProject: {
    locator: string;
  };
  name: string;
  id: string;
  copyAllAssociatedSettings: string;
};

export type Parameter = {
  name: string;
  value: string;
};

export type UpdateParameters = {
  parameters: Parameter[];
};
