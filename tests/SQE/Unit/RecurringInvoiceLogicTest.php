<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\RecurringInvoice;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RecurringInvoiceLogicTest extends TestCase
{
    /**
     * RI01: Verify Next Send Date Storage
     */
    public function test_recurring_invoice_next_date_storage()
    {
        $recurring = new RecurringInvoice();
        $recurring->next_send_date = '2025-01-01';
        
        $this->assertEquals('2025-01-01', $recurring->next_send_date);
    }

    /**
     * RI02: Verify Remaining Cycles
     */
    public function test_recurring_invoice_cycles_logic()
    {
        $recurring = new RecurringInvoice();
        $recurring->remaining_cycles = 5;
        // Logic: Agar -1 ho to infinite, positive ho to finite
        $this->assertEquals(5, $recurring->remaining_cycles);
    }

    /**
     * RI03: Verify Frequency ID
     */
    public function test_recurring_invoice_frequency_logic()
    {
        $recurring = new RecurringInvoice();
        $recurring->frequency_id = 1; // 1 = Weekly
        
        $this->assertEquals(1, $recurring->frequency_id);
    }

    /**
     * RI05: Verify Auto Bill Status
     */
    public function test_recurring_invoice_auto_bill_logic()
    {
        $recurring = new RecurringInvoice();
        $recurring->auto_bill = 'always'; 
        
        $this->assertEquals('always', $recurring->auto_bill);
    }

    /**
     * RI06: Verify Client Relation
     */
    public function test_recurring_invoice_belongs_to_client()
    {
        $recurring = new RecurringInvoice();
        $this->assertInstanceOf(BelongsTo::class, $recurring->client());
    }

    /**
     * RI07: Verify Invoices Relation
     */
    public function test_recurring_invoice_has_many_invoices()
    {
        $recurring = new RecurringInvoice();
        // Ek Recurring Invoice se bohot saray Child Invoices bante hain
        $this->assertInstanceOf(HasMany::class, $recurring->invoices());
    }
}