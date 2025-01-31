import {Injectable} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {User, UserDocument} from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(username: string, pass: string): Promise<Partial<User> | null> {
        const user: UserDocument | null = await this.usersService.findOne(username);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user._id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            role: user.role
        };
    }

    async register(username: string, password: string, role: string) {
        const newUser: UserDocument = await this.usersService.create(username, password, role as any);
        const { password: pwd, ...result } = newUser.toObject();
        return result;
    }
}
