import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  RemoveOptions,
  Repository,
  SaveOptions,
} from 'typeorm';
import { IBaseRepository } from '../../interfaces/repository.interface';

@Injectable()
export abstract class BaseRepository<Entity>
  implements IBaseRepository<Entity>
{
  protected constructor(protected repository: Repository<Entity>) {}

  async find(options?: FindManyOptions<Entity>) {
    return this.repository.find(options);
  }

  async findOne(options?: FindOneOptions<Entity>): Promise<Entity> {
    return this.repository.findOne(options);
  }

  async saveOne<T extends DeepPartial<Entity>>(
    entities: T,
    options?: SaveOptions,
  ): Promise<T & Entity> {
    return this.repository.save(entities, options);
  }

  updateOne<T extends DeepPartial<Entity>>(
    id: number,
    entities: T,
    options?: SaveOptions,
  ): Promise<T & Entity> {
    return this.repository.save(
      {
        ...entities,
        id,
      },
      options,
    );
  }

  deleteOne(entity: Entity, options?: RemoveOptions): Promise<Entity> {
    return this.repository.remove(entity, options);
  }
}
