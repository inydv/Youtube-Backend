import { ICatalogRepository } from "../../interfaces/catalogRepository.interface";
import { Product } from "../../models/product.model";
import { CatalogRepository } from "../../repositories/catalog.repository";
import { CatalogService } from "../catalog.service";
import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

const productFactory = new Factory<Product>()
  .attr("id", faker.number.int({ min: 1, max: 1000 }))
  .attr("name", faker.commerce.productName())
  .attr("description", faker.commerce.productDescription())
  .attr("stock", faker.number.int({ min: 10, max: 100 }))
  .attr("price", +faker.commerce.price());

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

  describe("updateProduct", () => {
    test("should update product", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct({
        id: faker.number.int({ min: 10, max: 1000 }),
      });
      const result = await service.updateProduct(reqBody);
      expect(result).toMatchObject(reqBody);
    });

    test("should throw error with product doesn't exist", async () => {
      const service = new CatalogService(repository);

      jest
        .spyOn(repository, "update")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("product doesn't exist"))
        );

      const result = await service.updateProduct({});
      expect(result).rejects.toThrow("product doesn't exist");
    });
  });

  describe("getProducts", () => {
    // test.only() will test only this test case
    test("should get products by offset and limit", async () => {
      const service = new CatalogService(repository);
      const randomLimit = faker.number.int({ min: 10, max: 50 });
      const products = productFactory.buildList(randomLimit);

      jest
        .spyOn(repository, "find")
        .mockImplementationOnce(() => Promise.resolve(products));

      const result = await service.getProducts(randomLimit, 0);

      expect(result.length).toEqual(randomLimit);
      expect(result).toMatchObject(products);
    });

    test("should throw error with products doesn't exist", async () => {
      const service = new CatalogService(repository);

      jest
        .spyOn(repository, "find")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("products doesn't exist"))
        );

      const result = await service.getProducts(0, 0);
      expect(result).rejects.toThrow("products doesn't exist");
    });
  });

  describe("getProduct", () => {
    test("should get product by id", async () => {
      const service = new CatalogService(repository);
      const product = productFactory.build();

      jest
        .spyOn(repository, "findOne")
        .mockImplementationOnce(() => Promise.resolve(product));

      const result = await service.getProduct(product.id!);
      expect(result).toMatchObject(product);
    });
  });

  describe("deleteProduct", () => {
    test("should delete product by id", async () => {
      const service = new CatalogService(repository);
      const product = productFactory.build();

      jest
        .spyOn(repository, "delete")
        .mockImplementationOnce(() => Promise.resolve({ id: product.id }));

      const result = await service.deleteProduct(product.id!);
      expect(result).toMatchObject({
        id: product.id,
      });
    });
  });

  // Clean up
  afterEach(() => {
    repository = {} as CatalogRepository;
  });
});
