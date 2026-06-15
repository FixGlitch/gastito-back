import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, data: Partial<{ name: string; email: string; password: string; avatarUrl: string }>) {
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    avatarUrl?: string;
  }): Promise<User> {
    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      password: data.password,
      avatarUrl: data.avatarUrl,
    });
    return this.userRepository.save(user);
  }
}
