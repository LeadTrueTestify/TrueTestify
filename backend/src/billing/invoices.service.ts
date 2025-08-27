import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new invoice record in the database.
   * @param billingAccountId The ID of the associated billing account.
   * @param stripeInvoiceId The unique ID from Stripe for this invoice.
   * @param amountDueCents The total amount due in cents.
   * @param status The current status of the invoice (e.g., 'open', 'paid').
   */
  async createInvoice(
    billingAccountId: string,
    stripeInvoiceId: string,
    amountDueCents: number,
    status: string
  ) {
    return this.prisma.invoice.create({
      data: {
        billingAccountId,
        stripeInvoiceId,
        amountDueCents,
        status,
      },
    })
  }

  /**
   * Finds all invoices for a given billing account, ordered by creation date.
   * @param billingAccountId The ID of the billing account.
   */
  async getInvoicesByBillingAccount(billingAccountId: string) {
    return this.prisma.invoice.findMany({
      where: { billingAccountId },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Finds a single invoice by its ID.
   * @param id The ID of the invoice.
   */
  async getInvoiceById(id: string) {
    return this.prisma.invoice.findUnique({ where: { id } })
  }
}