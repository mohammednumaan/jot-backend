import { IUser } from "../user/user.types";
import { IJot, IJotGroup } from "./jot.types";

export default class JotMapper {
  mapToJotsWithOwnerAndGroup(jots: IJot[], user: IUser, group: IJotGroup) {
    return {
      jots,
      owner: {
        id: user.id,
        name: user.username,
      },
      jotGroup: {
        id: group.id,
        description: group.description,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
      },
    };
  }
  mapToSingleJotWithOwner(
    jot: IJot,
    user: IUser,
    group: IJotGroup,
    totalFiles: number
  ) {
    return {
      ...jot,
      owner: {
        id: user.id,
        name: user.username,
      },
      jotGroup: {
        id: group.id,
        totalFiles: totalFiles,
        description: group.description,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
      },
    };
  }
}
