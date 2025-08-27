import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { BillingService } from './billing.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  /**
   * Ensures a Stripe customer exists for a given tenant. If not, it creates one.
   * @param tenantId The ID of the tenant.
   */
  @Post('ensure-customer/:tenantId')
  async ensureCustomer(@Param('tenantId') tenantId: string) {
    return this.billingService.ensureCustomer(tenantId)
  }

  /**
   * Manually marks a tenant as having a payment failure, triggering MVP rules.
   * @param tenantId The ID of the tenant.
   */
  @Post('payment-failed/:tenantId')
  async markPaymentFailed(@Param('tenantId') tenantId: string) {
    await this.billingService.handlePaymentFailure(tenantId)
    return { message: 'Tenant marked as unpaid/hidden' }
  }

  /**
   * Manually marks a tenant as having resolved their payment, restoring services.
   * @param tenantId The ID of the tenant.
   */
  @Post('payment-resolved/:tenantId')
  async markPaymentResolved(@Param('tenantId') tenantId: string) {
    await this.billingService.handlePaymentResolved(tenantId)
    return { message: 'Tenant restored to active' }
  }

  /**
   * Triggers a scheduled cleanup task to delete old reviews for unpaid accounts.
   * This is intended to be called by a cron job or similar scheduler.
   */
  @Post('cleanup')
  async cleanupUnpaidAccounts() {
    await this.billingService.deleteOldReviews()
    return { message: 'Cleanup complete' }
  }

  /**
   * Creates a one-off invoice for a tenant and returns the Stripe invoice ID.
   * @param tenantId The ID of the tenant.
   * @param body The amount to bill in cents.
   * @returns The newly created Stripe invoice ID.
   */
  @Post('create-invoice/:tenantId')
  async createStripeInvoice(
    @Param('tenantId') tenantId: string,
    @Body() body: { amount: number }
  ) {
    return this.billingService.createOneOffInvoice(tenantId, body.amount)
  }
}