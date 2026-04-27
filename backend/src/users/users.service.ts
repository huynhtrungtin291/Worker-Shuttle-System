import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto) {
    if (await this.checkUserAccount(createUserDto.username)) {
      throw new ConflictException('Tài khoản đã tồn tại');
    }

    try {
      const hashedPassword = await this.hashPassword(createUserDto.password);
      const user = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      await user.save();

      return {
        message: 'Tạo tài khoản thành công',
        data: {
          id: user._id,
          username: user.username,
          fullname: user.fullname,
          phone: user.phone,
          role: user.role,
          is_active: user.is_active,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      };
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
        throw new ConflictException('Tài khoản đã tồn tại');
      }

      throw new InternalServerErrorException('Không thể tạo tài khoản');
    }
  }

  async checkUserAccount(username: string): Promise<boolean> {
    const user = await this.userModel.exists({ username });
    return Boolean(user);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async checkPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async getPasswordByUsername(username: string): Promise<string | null> {
    const user = await this.userModel.findOne({ username }, { password: 1 }).exec();
    return user ? user.password : null;
  }

  async isActive(username: string): Promise<boolean> {
    const user = await this.userModel.findOne({ username }, { is_active: 1 }).exec();
    return user ? user.is_active : false;
  }

  async setAccountStatus(username: string, isActive: boolean): Promise<void> {
    await this.userModel.updateOne({ username }, { is_active: isActive }).exec();
  }

  async getRefreshTokenHashByUsername(username: string): Promise<string | null> {
    const user = await this.userModel.findOne({ username }, { refresh_token_hash: 1 }).exec();

    return user?.refresh_token_hash ?? null;
  }

  async updateRefreshTokenHash(username: string, hash: string): Promise<void> {
    await this.userModel.updateOne({ username }, { refresh_token_hash: hash }).exec();
  }

  async clearRefreshTokenHash(username: string): Promise<void> {
    await this.userModel.updateOne({ username }, { refresh_token_hash: null }).exec();
  }
}
