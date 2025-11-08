import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserDocument } from 'src/modules/core/user/schema/user-schema';

// export async function hashPassword(
//   this: UserDocument,
//   password: string,
// ): Promise<UserDocument> {
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(password, salt);
//   this.password = hash;
//   return await this.save();
// }

// export const comparePassword = async function (
//   this: UserDocument,
//   password: string,
// ) {
//   return await bcrypt.compare(password, this.password);
// };

// export const generateAccessToken = function (this: UserDocument): string {
//   const secret: jwt.Secret = (process.env.GENERATE_TOKEN_SECRET || '').trim();

//   // explicitly type the union so TS picks the correct overload
//   const expiry: jwt.SignOptions['expiresIn'] = (
//     process.env.TOKEN_EXPIERY || '10d'
//   ).trim() as jwt.SignOptions['expiresIn'];

//   return jwt.sign(
//     {
//       id: this._id,
//       name: this.name,
//       email: this.email,
//       role: this.role,
//     },
//     secret,
//     { expiresIn: expiry },
//   );
// };
// export const generateRefreshToken = function (this: UserDocument) {
//   const secret = process.env.GENERATE_TOKEN_SECRET as string;
//   const expiry = process.env
//     .REFRESH_TOKEN_EXPIERY as jwt.SignOptions['expiresIn'];
//   return jwt.sign(
//     {
//       id: this.id as string,
//       role: this.role,
//     },
//     secret,
//     { expiresIn: expiry },
//   );
// };
