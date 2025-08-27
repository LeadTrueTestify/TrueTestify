import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { InvoicesService } from './invoices.service'

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  /**
   * Creates a new invoice record, typically triggered by a Stripe webhook.
   * @param body The invoice details including billing account, Stripe invoice ID, amount, and status.
   */
  @Post()
  async createInvoice(
    @Body()
    body: {
      billingAccountId: string
      stripeInvoiceId: string
      amountDueCents: number
      status: string
    }
  ) {
    return this.invoicesService.createInvoice(
      body.billingAccountId,
      body.stripeInvoiceId,
      body.amountDueCents,
      body.status
    )
  }

  /**
   * Retrieves all invoices for a specific billing account.
   * @param billingAccountId The ID of the billing account.
   */
  @Get('billing/:billingAccountId')
  async getInvoicesByBillingAccount(@Param('billingAccountId') billingAccountId: string) {
    return this.invoicesService.getInvoicesByBillingAccount(billingAccountId)
  }

  /**
   * Retrieves a single invoice by its ID.
   * @param id The ID of the invoice.
   */
  @Get(':id')
  async getInvoiceById(@Param('id') id: string) {
    return this.invoicesService.getInvoiceById(id)
  }
}