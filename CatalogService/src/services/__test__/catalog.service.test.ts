import { ICatalogRepository } from "../../interfaces/catalogRepository.interface";
import { Product } from "../../models/product.model";
import { CatalogRepository } from "../../repositories/catalog.repository";
import { CatalogService } from "../catalog.service";
import { faker } from "@faker-js/faker";

const mockProduct = (rest?: any) => {
  return {
    name: faker.commerce.productName(),
    desciption: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 10, max: 100 }),
    price: +faker.commerce.price(),
    ...rest,
  };
};

describe("catalogService", () => {
  let repository: ICatalogRepository;

  // Setup requirement, dependencies
  beforeEach(() => {
    repository = new CatalogRepository();
  });

  // Run the test
  describe("createProduct", () => {
    test("should create product", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct();
      const result = await service.createProduct(reqBody);
      expect(result).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
        description: expect.any(String),
      });
    });

    test("should throw error with unable to create product", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct();

      jest
        .spyOn(repository, "create")
        .mockImplementationOnce(() => Promise.resolve({} as Product));

      const result = await service.createProduct(reqBody);
      expect(result).rejects.toThrow("unable to create product");
    });

    test("should throw error with product already exist", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct();

      jest
        .spyOn(repository, "create")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("product already exist"))
        );

      const result = await service.createProduct(reqBody);
      expect(result).rejects.toThrow("product already exist");
    });
  });

  // Clean up
  afterEach(() => {
    repository = {} as CatalogRepository;
  });
});
