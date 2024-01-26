import { Controller, Get, Req, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ServerException } from 'src/exceptions/server.exception';
import { ErrorCode } from 'src/exceptions/error-codes';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { UseGuards } from '@nestjs/common/decorators/core';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async findMe(@AuthUser() user:User): Promise<User> {
    return await this.usersService.findOwn({
      where: {id: user.id},
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      }
    })
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateById(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.removeById(+id);
  }
}
