import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    registerUser: jest.fn(),
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should call UsersService.registerUser and return its result', async () => {
      const dto: CreateUserDto = {
        name: 'Alice',
        email: 'alice@example.com',
      };
      const resultUser: User = {
        id: 1,
        name: dto.name,
        email: dto.email,
      };
      mockUsersService.registerUser.mockResolvedValue(resultUser);

      const result = await usersController.registerUser(dto);
      expect(usersService.registerUser).toHaveBeenCalledWith(dto);
      expect(result).toBe(resultUser);
    });
  });

  describe('findAll', () => {
    it('should call UsersService.getAllUsers and return its result', async () => {
      const users: User[] = [];
      mockUsersService.getAllUsers.mockResolvedValue(users);

      const result = await usersController.listUsers();
      expect(usersService.getAllUsers).toHaveBeenCalled();
      expect(result).toBe(users);
    });
  });

  describe('findOne', () => {
    it('should call UsersService.getUserById with numeric id and return its result', async () => {
      const user: User = {
        id: 5,
        name: 'Bob',
        email: 'bob@example.com',
      };
      mockUsersService.getUserById.mockResolvedValue(user);

      const result = await usersController.getUserById('5');
      expect(usersService.getUserById).toHaveBeenCalledWith(5);
      expect(result).toBe(user);
    });
  });

  describe('update', () => {
    it('should call UsersService.updateUser with numeric id and dto, then return its result', async () => {
      const dto: UpdateUserDto = {
        name: 'Charlie',
        email: 'charlie@example.com',
      };

      const updatedUser: Partial<User> = {
        id: 7,
        name: dto.name,
        email: dto.email,
      };

      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await usersController.updateUser('7', dto);
      expect(usersService.updateUser).toHaveBeenCalledWith(7, dto);
      expect(result).toEqual(
        expect.objectContaining({
          id: 7,
          ...dto,
        }),
      );
    });
  });

  describe('remove', () => {
    it('should call UsersService.deleteUser with numeric id', async () => {
      mockUsersService.deleteUser.mockResolvedValue(undefined);

      const result = await usersController.deleteUser('9');
      expect(usersService.deleteUser).toHaveBeenCalledWith(9);
      expect(result).toBeUndefined();
    });
  });
});
