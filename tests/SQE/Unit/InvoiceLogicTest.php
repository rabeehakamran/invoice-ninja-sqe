<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Invoice;
use App\Models\Client;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceLogicTest extends TestCase
{
    // --- SECTION A: CORE BUSINESS LOGIC ---

    /**
     * I01: Verify Draft invoice is payable
     */
    public function test_draft_invoice_is_payable()
    {
        $invoice = new Invoice();
        $invoice->status_id = 1; // Draft
        $invoice->is_deleted = false;
        
        $this->assertTrue($invoice->isPayable());
    }

    /**
     * I02: Verify Paid invoice is NOT payable
     */
    public function test_paid_invoice_is_not_payable()
    {
        $invoice = new Invoice();
        $invoice->status_id = 4; // Paid
        $invoice->balance = 0;
        
        $this->assertFalse($invoice->isPayable());
    }

    /**
     * I03: Verify Overdue Logic
     */
    public function test_invoice_becomes_overdue()
    {
        $invoice = new Invoice();
        $invoice->status_id = 2; // Sent
        $invoice->due_date = '2020-01-01'; // Past date
        
        // Status -1 means Overdue in Invoice Ninja Logic
        $this->assertEquals(-1, $invoice->status);
    }

    /**
     * I04: Verify Invoice is Refundable
     */
    public function test_invoice_is_refundable_if_paid()
    {
        $invoice = new Invoice();
        $invoice->amount = 100;
        $invoice->balance = 0; // Fully paid
        
        $this->assertTrue($invoice->isRefundable());
    }

    /**
     * I05: Verify Partial Status Logic
     */
    public function test_invoice_is_partial()
    {
        $invoice = new Invoice();
        $invoice->status_id = 3; // 3 = Partial
        
        $this->assertTrue($invoice->isPartial());
    }

    /**
     * I06: Verify Payable Amount
     */
    public function test_payable_amount_check()
    {
        $invoice = new Invoice();
        $invoice->amount = 500;
        $invoice->balance = 200; 
        
        $this->assertEquals(200, $invoice->getPayableAmount());
    }

    /**
     * I07: Verify HTML Badge Logic
     */
    public function test_badge_html_generation()
    {
        // Static method call check
        $html = Invoice::badgeForStatus(2); // 2 = Sent
        
        // Hum check kar rahe hain ke HTML string mein 'badge-primary' class hai ya nahi
        $this->assertStringContainsString('badge-primary', $html);
    }

    // --- SECTION B: RELATIONSHIPS & DATA TYPES ---

    /**
     * I08: Verify Relation with Client
     */
    public function test_invoice_belongs_to_client()
    {
        $invoice = new Invoice();
        $this->assertInstanceOf(BelongsTo::class, $invoice->client());
    }

/**
     * I09: Verify Line Items Casting
     */
    public function test_line_items_casting()
    {
        $invoice = new Invoice();
        
        // Input: Array of items
        $invoice->line_items = [['product_key' => 'Item 1']];
        
        // Correction: Ye ek 'Array' return karta hai jiske andar Objects hote hain
        // Isliye hum 'assertIsArray' use karenge
        $this->assertIsArray($invoice->line_items);
        
        // Extra check: Andar wala item Object hona chahiye
        $this->assertIsObject($invoice->line_items[0]);
    }
}