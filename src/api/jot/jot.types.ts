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

interface IJotWithOwnerAndGroup extends Omit<IJot, "jotGroupId"> {
  owner: {
    id: string;
    name: string;
  };
  jotGroup: {
    id: string;
    totalFiles: number;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface IJotGroupsWithCount {
  jotGroups: IJotGroup[];
  count: number;
}

type IJotDTO = Omit<IJot, "id" | "jotGroupId">;
type IJotWithoutId = Omit<IJot, "id">;

export type IJotNew = Omit<IJot, "id" | "createdAt" | "updatedAt">;
export type IJotGroupNew = Omit<IJotGroup, "id" | "createdAt" | "updatedAt">;
export {
  IJot,
  IJotGroup,
  IJotWithOwnerAndGroup,
  IJotDTO,
  IJotGroupsWithCount,
  IJotWithoutId,
};
