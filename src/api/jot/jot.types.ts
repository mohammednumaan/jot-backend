interface IJot {
  id: string;
  name: string;
  extension: string;
  description: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  jotGroupId: string;
}

interface IJotGroup {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IJotWithOwnerAndGroup extends Omit<IJot, "jotGroupId"> {
  owner: {
    id: string;
    name: string;
  };
  jotGroup: {
    id: string;
    totalFiles: number;
  };
}

interface IJotGroupsWithCount {
  jotGroups: IJotGroup[];
  count: number;
}

type IJotDTO = Omit<IJot, "id" | "jotGroupId">;
export { IJot, IJotGroup, IJotWithOwnerAndGroup, IJotDTO, IJotGroupsWithCount };
