import mongoose from 'mongoose';

class CRUD {
  /**
   *
   * @param model
   * @param docs
   * @returns
   */
  async createData(
    model: typeof mongoose.Model,
    docs: object
  ): Promise<boolean> {
    if (await model.create(docs)) {
      return true;
    } // Returns true if data was created successfully or else false
    return false;
  }

  /**
   *
   * @param model
   * @param docs
   * @returns
   * @summary Why the fuck does linting make the code format into the way that doesn't work
   */
  async readData(model: typeof mongoose.Model, docs: object): Promise<unknown> {
    if (await model.exists(docs)) {
      await model.findOne(docs).then((doc) => doc);
    }

    return `''`;
  }

  /**
   *
   * @param model
   */
  async updateData(model: typeof mongoose.Model, findDocs: object) {
    if (await model.exists(findDocs)) {
      await model.findOne();
    }
    return true;
  }

  /**
   *
   * @param model
   * @param docs
   * @returns
   */
  async deleteData(
    model: typeof mongoose.Model,
    docs: object
  ): Promise<boolean> {
    return false;
  }
}

export default CRUD;
