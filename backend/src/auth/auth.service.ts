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
 * Handles business creation during signup with multi-tenant scoping.
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
      name,
    } = signupDto;

    // Check if email or slug exists (case-insensitive due to citext)
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

    // Upload logo to S3 if provided, tenant-scoped
    let logoUrl: string | null = null;
    if (logoFile) {
      const sanitizedFileName = logoFile.originalname.replace(/\s+/g, '_');
      logoUrl = await this.storageService.uploadFile(
        logoFile,
        process.env.AWS_S3_BUCKET as string,
        sanitizedFileName,
      );
    }

    // Create user, business, and association (transaction for atomicity)
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          name: name || businessName, // Fallback to businessName if name not provided
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
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
          settingsJson: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        select: {
          id: true,
          slug: true,
          name: true,
          logoUrl: true,
          brandColor: true,
          website: true,
          contactEmail: true,
          settingsJson: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      await tx.businessUser.create({
        data: {
          userId: user.id,
          businessId: business.id,
          role: 'owner',
          isDefault: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
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
      payload: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          status: result.user.status,
          createdAt: result.user.createdAt,
          updatedAt: result.user.updatedAt,
        },
        business: result.business,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email, deletedAt: null },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        name: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Fetch businessId from business_users (get the default business or first available)
    const businessUser = await this.prisma.businessUser.findFirst({
      where: { userId: user.id, deletedAt: null, isDefault: true },
      select: { businessId: true },
    });

    if (!businessUser) {
      throw new UnauthorizedException('No business access for this user');
    }

    // Update lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT with businessId
    const payload = {
      sub: user.id,
      email: user.email,
      businessId: businessUser.businessId,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      payload: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        business: {
          id: businessUser.businessId,
        },
      },
    };
  }

  async validateUser(userId: string): Promise<{
    id: string;
    email: string;
    name: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    businessUsers: { businessId: string; role: string; isDefault: boolean }[];
  } | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        businessUsers: {
          select: {
            businessId: true,
            role: true,
            isDefault: true,
          },
        },
      },
    });

    if (!user || user.deletedAt || user.status !== 'active') {
      return null;
    }

    return user;
  }
}
