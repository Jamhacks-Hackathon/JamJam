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
   */
  async readData(model: typeof mongoose.Model, docs: object): Promise<any> {
    return await model.findOne(docs);
  }

  /**
   *
   * @param model
   */
  async updateData(model: typeof mongoose.Model) {
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
