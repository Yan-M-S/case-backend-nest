import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() newUser: CreateUserDto) {
    return this.userService.registerUser(newUser);
  }

  @Get()
  async listUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    return this.userService.getUserById(userId);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updates: UpdateUserDto,
  ) {
    const userId = parseInt(id, 10);
    return this.userService.updateUser(userId, updates);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    return this.userService.deleteUser(userId);
  }
}
