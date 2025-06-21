interface IJot {
  id: string;
  name: string;
  extension: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  jotGroupId: string;
}

interface IJotGroup {
  id: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IJotWithOwnerAndGroup
  extends Omit<IJot, "jotGroupId" | "description"> {
  owner: {
    id: string;
    name: string;
  };
  jotGroup: {
    id: string;
    totalFiles: number;
    description: string | null;
  };
}

interface IJotGroupsWithCount {
  jotGroups: IJotGroup[];
  count: number;
}

type IJotDTO = Omit<IJot, "id" | "jotGroupId">;
type IJotWithoutId = Omit<IJot, "id">
export { IJot, IJotGroup, IJotWithOwnerAndGroup, IJotDTO, IJotGroupsWithCount, IJotWithoutId };
