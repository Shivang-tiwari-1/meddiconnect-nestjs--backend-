import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CrateUserDto, LoginUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Public } from 'src/common/const';
import { ProfileImageInterceptor } from 'src/modules/common/fileUpload/upload.interceptor';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}
  @Public()
  @UseInterceptors(ProfileImageInterceptor('profileImage'))
  @Post('createUser')
  public async createUser(
    @Body() body: CrateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('object');
    return this.userService.createUser(body, file);
  }
  @Public()
  @Post('loginUser')
  public async loginUser(@Body() body: LoginUserDto) {
    return this.userService.loginuser(body);
  }

  @Post('forgotPass')
  public async forgotPass(@Body() body: { email: string }) {
    return this.userService.forgotPassWord(body);
  }

  @Post('logout')
  public async logout() {
    return this.userService.logout();
  }

  @Delete('deleteAccount')
  public async deleteAccount() {}

  @Post('update')
  public async updateUser(@Body() body: UpdateUserDto) {
    return this.userService.updateUser(body);
  }

  @Post('refreshAccessToken')
  public async refreshAccessToken(@Req() req: Request) {
    return this.userService.refreshAccessToken();
  }
}
