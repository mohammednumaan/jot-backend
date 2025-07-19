import { IJot, IJotGroup, IJotGroupNew, IJotNew } from "../api/jot/jot.types";
import { IUser, IUserNew } from "../api/user/user.types";

export interface Database<T, TNew> {
  findAll(offset: number, limit: number): Promise<T[]>;
  findOne(id: string): Promise<T | null>;
  create(inputs: TNew): Promise<T>;
  update(id: string, inputs: TNew): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface IJotDatabase extends Database<IJot, IJotNew> {
  findByGroupId(groupId: string): Promise<IJot[]>;
  createMany(inputs: IJotNew[]): Promise<void>;
  count(): Promise<number>;
}

export interface IJotGroupDatabase
  extends Database<IJotGroup | null, IJotGroupNew> {
  findAllByUserId(
    id: string,
    offset: number,
    limit: number
  ): Promise<IJotGroupNew[]>;
  count(): Promise<number>;
}

export interface IUserDatabase extends Database<IUser | null, IUserNew> {
  findOneByUsername(username: string): Promise<IUser | null>;
}

export interface IDatabases {
  user: IUserDatabase;
  jots: IJotDatabase;
  jotGroups: IJotGroupDatabase;
}
