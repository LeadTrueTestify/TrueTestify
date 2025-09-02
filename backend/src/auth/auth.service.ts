import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { StorageService } from '../storage/storage.service';

/**
 * Service for authentication: signup, login, JWT handling.
 * Handles business creation during signup.
 */
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private storageService: StorageService,
  ) {}

  async signup(
    signupDto: SignupDto,
    logoFile?: Express.Multer.File,
  ): Promise<{
    token: string;
    payload: any;
  }> {
    const {
      email,
      password,
      businessName,
      slug,
      website,
      contactEmail,
      brandColor,
    } = signupDto;

    // Check if email or slug exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) throw new BadRequestException('Email already in use');

    const existingBusiness = await this.prisma.business.findUnique({
      where: { slug },
    });
    if (existingBusiness) throw new BadRequestException('Slug already in use');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload logo to S3 if provided
    let logoUrl: string | null = null;
    if (logoFile) {
      const sanitizedFileName = logoFile.originalname.replace(/\s+/g, '_'); // Replace spaces with underscores
      logoUrl = await this.storageService.uploadFile(
        logoFile,
        `logos/${slug}/${sanitizedFileName}`,
      );
    }

    // Create user, business, and association (transaction for atomicity)
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, password: hashedPassword, name: businessName },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const business = await tx.business.create({
        data: {
          slug,
          name: businessName,
          logoUrl,
          brandColor,
          website,
          contactEmail,
        },
        select: {
          id: true,
          slug: true,
          name: true,
          logoUrl: true,
          brandColor: true,
          website: true,
          contactEmail: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      await tx.businessUser.create({
        data: { userId: user.id, businessId: business.id, role: 'owner' },
      });

      return { user, business };
    });

    // Generate JWT with business_id
    const payload = {
      sub: result.user.id,
      email: result.user.email,
      businessId: result.business.id,
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      payload,
    };
  }
  async login(loginDto: LoginDto): Promise<{ token: string; payload: any }> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Fetch business_id (assume single business per user for MVP; extend if needed)
    const businessUser = await this.prisma.businessUser.findFirst({
      where: { userId: user.id },
    });
    if (!businessUser)
      throw new UnauthorizedException('No business associated');

    const payload = {
      sub: user.id,
      email: user.email,
      businessId: businessUser.businessId,
    };
    const token = this.jwtService.sign(payload);

    return { token, payload };
  }

  async validateUser(userId: string): Promise<{
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
