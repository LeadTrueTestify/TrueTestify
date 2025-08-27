import { Controller, Get, Param } from '@nestjs/common'
import { UsageService } from './usage.service'

@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  /**
   * Snapshots and returns the current usage for a tenant.
   * @param tenantId The tenant ID.
   */
  @Get(':tenantId')
  async snapshotUsage(@Param('tenantId') tenantId: string) {
    return this.usageService.snapshotUsage(tenantId)
  }
} 