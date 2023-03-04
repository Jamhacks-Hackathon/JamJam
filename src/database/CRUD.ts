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
   * @returns doc
   * @summary Returns doc object which has data requested
   */
  async readData(model: typeof mongoose.Model, docs: object): Promise<unknown> {
    let variable = `''`;
    if (await model.exists(docs)) {
      await model.findOne(docs).then((doc) => {
        variable = doc;
      });
      return variable;
    }
    return "Doesn't exist";
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
    if (await model.exists(docs)) {
      await model.deleteOne(docs);
      return true;
    }
    return false;
  }
}

export default CRUD;
