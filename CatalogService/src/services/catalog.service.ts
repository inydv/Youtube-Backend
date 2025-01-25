import { ICatalogRepository } from "../interfaces/catalogRepository.interface";

export class CatalogService {
  private _repository: ICatalogRepository;

  constructor(repository: ICatalogRepository) {
    this._repository = repository;
  }

  async createProduct(input: any) {
    const data = await this._repository.create(input);
    if (!data.id) throw new Error("unable to create product");
    return data;
  }

  async updateProduct(input: any) {
    const data = await this._repository.update(input);

    // TODO: Emit event to update record in Elastic Search

    return data;
  }

  // TODO: Instead of this, we will get products from Elastic Search
  async getProducts(limit: number, offset: number) {
    const products = await this._repository.find(limit, offset);
    return products;
  }

  async getProduct(id: number) {
    const product = await this._repository.findOne(id);
    return product;
  }

  async deleteProduct(id: number) {
    const response = await this._repository.delete(id);

    // TODO: Delete record from Elastic Search

    return response;
  }
}
