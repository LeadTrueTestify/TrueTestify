import { Injectable, UnauthorizedException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BillingService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-07-30.basil',
  });
  constructor(private prisma: PrismaService) {}

  /**
   * Ensures a Stripe customer exists for a tenant.
   * @param tenantId The tenant ID.
   * @returns The Stripe customer ID.
   */
  async ensureCustomer(tenantId: string) {
    const acc = await this.prisma.billingAccount.findUnique({
      where: { tenantId },
    });
    if (!acc) throw new UnauthorizedException('Billing account missing');

    if (acc.stripeCustomerId.startsWith('pending_')) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
      });
      const customer = await this.stripe.customers.create({
        name: tenant!.name,
        metadata: { tenantId },
      });
      await this.prisma.billingAccount.update({
        where: { id: acc.id },
        data: { stripeCustomerId: customer.id },
      });
      return { customerId: customer.id };
    }
    return { customerId: acc.stripeCustomerId };
  }

  /**
   * Creates a one-off invoice for a tenant and emails it to them.
   * @param tenantId The ID of the tenant.
   * @param amountCents The amount to bill in cents.
   * @returns The newly created Stripe invoice ID.
   */
  async createOneOffInvoice(tenantId: string, amountCents: number) {
    const billingAccount = await this.prisma.billingAccount.findUnique({
      where: { tenantId },
    });

    if (!billingAccount) {
      throw new Error('Billing account not found.');
    }

    const customerId = billingAccount.stripeCustomerId;

    const invoiceItem = await this.stripe.invoiceItems.create({
      customer: customerId,
      amount: amountCents,
      currency: 'usd',
      description: 'One-off charge',
    });
   
    const invoice = await this.stripe.invoices.create({
      customer: customerId,
      collection_method: 'send_invoice', // We want Stripe to email the invoice
      auto_advance: true,
      due_date: Math.floor(Date.now() / 1000) + 86400 * 7, // Due in 7 days
    });

    // Now send the invoice
    if (invoice.id) {
      await this.stripe.invoices.sendInvoice(invoice.id);
    } else {
      throw new Error('Failed to create Stripe invoice.');
    }

    return { invoiceId: invoice.id };
  }

  /**
   * Handles payment failure by hiding widgets and setting a review deletion date.
   * @param tenantId The tenant ID.
   */
  async handlePaymentFailure(tenantId: string) {
    const now = new Date();
    const deleteAfter = new Date(now);
    deleteAfter.setMonth(deleteAfter.getMonth() + 12);
    // Update the billing account state and set the `deleteAfter` date.
    await this.prisma.billingAccount.update({
      where: { tenantId },
      data: { state: 'UNPAID_HIDDEN', unpaidSince: now, deleteAfter },
    });
    // Auto-hide the widgets by setting `isActive` to false.
    await this.prisma.widget.updateMany({
      where: { tenantId },
      data: { isActive: false },
    });
  }

  /**
   * Handles a resolved payment, reactivating services.
   * @param tenantId The tenant ID.
   */
  async handlePaymentResolved(tenantId: string) {
    // Restore the billing account state and reactivate widgets.
    await this.prisma.billingAccount.update({
      where: { tenantId },
      data: { state: 'ACTIVE', unpaidSince: null, deleteAfter: null },
    });
    await this.prisma.widget.updateMany({
      where: { tenantId },
      data: { isActive: true },
    });
  }

  /**
   * Deletes reviews for accounts that have been unpaid for more than 12 months.
   * This method is intended to be called by a recurring scheduled task.
   */
  async deleteOldReviews() {
    const now = new Date();
    const accountsToCleanup = await this.prisma.billingAccount.findMany({
      where: {
        state: 'UNPAID_HIDDEN',
        deleteAfter: { lt: now }, // `lt` means 'less than'
      },
      select: { tenantId: true },
    });

    for (const account of accountsToCleanup) {
      // Per the user request, we are now changing the state to 'DELETED'
      // but still not deleting reviews.
      await this.prisma.billingAccount.update({
        where: { tenantId: account.tenantId },
        data: { state: 'DELETED' },
      });
    }
  }
}
