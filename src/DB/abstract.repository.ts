import {
  Model,
  MongooseUpdateQueryOptions,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
  UpdateQuery,
  Document,
} from "mongoose";

export default abstract class AbstractRepository<T> {
  constructor(protected model: Model<T>) {}
  async create(item:Partial<T>):Promise<T&Document> {
    const doc = new this.model(item);
    return (await doc.save()) as unknown as T&Document;
  }
  async getOne(
    filter: RootFilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>
  ) {
    return await this.model.findOne(filter, projection, options);
  }
  async exists(
    filter: RootFilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>
  ) {
    return await this.model.findOne(filter, projection, options);
  }
  async update(
    filter: RootFilterQuery<T>,
    update: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions<T>
  ) {
    return await this.model.updateOne(filter, update, options);
  }
  async delete(filter: RootFilterQuery<T>) {
    return await this.model.deleteOne(filter);
  }
  async deleteMany(filter: RootFilterQuery<T>) {
    return await this.model.deleteMany(filter);
  }
}