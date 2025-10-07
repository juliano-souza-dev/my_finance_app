import { nanoid } from "nanoid";
import { CategoryRepository } from "../repositories/CategoryRepository";
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async get(){
    return this.categoryRepository.getAll();
  }

}
