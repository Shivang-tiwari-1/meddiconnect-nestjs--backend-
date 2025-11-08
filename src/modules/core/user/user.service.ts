import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CrateUserDto, LoginUserDto, UpdateUserDto } from './dto/user.dto';
import { FileUploadService } from 'src/modules/common/fileUpload/fileupload.service';
import { AlsService } from 'src/modules/common/als/als.service';
import { ResponseType } from './types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user-schema';
import { HelperService } from 'src/modules/common/helpers/helper.service';
import { SuccessResponse } from 'src/common/utils/custom-response';
import { SupaBaseService } from 'src/modules/common/auth/supabase-service';
import bcrypt from 'bcrypt';
import { Doctor } from '../doctor/schema/doctor-schema';
@Injectable()
export class UserService {
  private readonly userRole: string;
  constructor(
    private readonly folderUpload: FileUploadService,
    private readonly als: AlsService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
    private helperFunctions: HelperService,
    private readonly supaBaseService: SupaBaseService,
  ) {
    // this.userRole = this.als.getRole();
  }

  public async createUser(
    body: CrateUserDto,
    file: Express.Multer.File,
  ): Promise<ResponseType> {
    const session = await this.userModel.startSession();
    try {
      session.startTransaction();
      const upload = await this.folderUpload.uploadSingleImage(file);
      if (!upload.success) {
        return {
          success: false,
          message:
            upload.message || 'something went wrong with uploading image',
        };
      }

      const hashpassword = await bcrypt.hash(body.password, 10);

      let userData;
      console.log(body.role);
      if (body.role === 'patient') {
        userData = await this.userModel.create({
          name: body.name,
          email: body.email,
          password: hashpassword,
          phone: body.phone,
          profileImage: upload.urls,
          address: body.address,
          role: body.role,
          gender: body.gender,
          city: body.city.toLowerCase(),
          state: body.state.toLowerCase(),
          coordinates: {
            type: 'Point',
            coordinates: [
              parseFloat(String(body.longitude)),
              parseFloat(String(body.latitude)),
            ],
          },
        });
      } else if (body.role === 'doctor') {
        userData = await this.doctorModel.create({
          name: body.name,
          email: body.email,
          password: body.password,
          phone: body.phone,
          profileImage: upload.urls,
          address: body.address,
          role: body.role,
          gender: body.gender,
          city: body.city.toLowerCase(),
          state: body.state.toLowerCase(),
          coordinates: {
            type: 'Point',
            coordinates: [
              parseFloat(String(body.longitude)),
              parseFloat(String(body.latitude)),
            ],
          },
        });
      }
      const { data, error } = await this.supaBaseService.client.auth.signUp({
        email: body.email,
        password: body.password,
        options: {
          data: {
            role: body.role,
            name: body.name,
            userid: String(userData?.id),
          },
        },
      });
      if (error) throw new UnauthorizedException(error.message);

      await session.commitTransaction();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      await session.abortTransaction();
      return {
        success: false,
        message:
          error instanceof Error
            ? `error occurred: ${error.message}`
            : 'An unknown error occurred',
      };
    } finally {
      await session.endSession();
    }
  }

  public async loginuser(body: LoginUserDto) {
    const user = await this.userModel.findOne({ email: body.email });
    if (!user) {
      throw new Error('invalid credentials(email)');
    }

    const { data, error } =
      await this.supaBaseService.client.auth.signInWithPassword({
        email: body.email,
        password: body.password,
      });
    if (error) throw new UnauthorizedException(error.message);

    return SuccessResponse('user logged in', {
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      user: user,
    });
  }
  public async forgotPassWord(body: { email: string }) {}
  public async logout() {}
  public async updateUser(body: UpdateUserDto) {}
  public async refreshAccessToken() {}
}
