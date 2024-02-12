import {
  DeepPartial,
  DeleteOptions,
  FindManyOptions,
  FindOneOptions,
  SaveOptions,
} from 'typeorm';
import { RemoveOptions } from 'typeorm/repository/RemoveOptions';

export interface IBaseRepository<Entity> {
  find(options?: FindManyOptions<Entity>): Promise<Entity[]>;
  findOne(options?: FindOneOptions<Entity>): Promise<Entity>;
  saveOne<T extends DeepPartial<Entity>>(
    entities: T,
    options?: SaveOptions,
  ): Promise<T & Entity>;
  updateOne<T extends DeepPartial<Entity>>(
    id: number,
    entities: T,
    options?: SaveOptions,
  ): Promise<T & Entity>;
  deleteOne(entity: Entity, options?: RemoveOptions): Promise<Entity>;
}
