import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, CreateUserInput, UpdateUserInput } from '@repo/shared-types';
import {
  convertPrismaUserToGraphQL,
  convertPrismaUsersToGraphQL,
} from '../common/type-converters';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return convertPrismaUsersToGraphQL(users);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? convertPrismaUserToGraphQL(user) : null;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? convertPrismaUserToGraphQL(user) : null;
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: createUserInput,
    });
    return convertPrismaUserToGraphQL(user);
  }

  async update(updateUserInput: UpdateUserInput): Promise<User> {
    const { id, ...data } = updateUserInput;
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    return convertPrismaUserToGraphQL(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    return convertPrismaUserToGraphQL(user);
  }
}
