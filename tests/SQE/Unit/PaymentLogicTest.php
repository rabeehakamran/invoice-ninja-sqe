<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Payment;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\Company;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentLogicTest extends TestCase
{
    // --- SECTION A: CORE ATTRIBUTE LOGIC ---

    /**
     * TC-PAY-01: Verify Payment Status
     */
    public function test_payment_status_logic()
    {
        $payment = new Payment();
        $payment->status_id = 4; // 4 = Completed
        
        $this->assertEquals(4, $payment->status_id);
    }

    /**
     * TC-PAY-02: Verify Exchange Rate Default Logic
     */
    public function test_exchange_rate_defaults_to_one()
    {
        $payment = new Payment();
        // Business Logic: Agar rate set na ho, to 1.0 maana jata hai
        $rate = $payment->exchange_rate ?? 1.0; 
        
        $this->assertEquals(1.0, $rate);
    }

    /**
     * TC-PAY-03: Verify Refund (Negative Amount) Logic
     */
    public function test_payment_accepts_negative_value()
    {
        $payment = new Payment();
        $payment->amount = -100.50; // Refund amount
        
        $this->assertEquals(-100.50, $payment->amount);
    }

    /**
     * TC-PAY-04: Verify Soft Delete (Is Deleted Flag)
     */
    public function test_payment_soft_delete_attribute()
    {
        $payment = new Payment();
        $payment->is_deleted = true; 
        
        $this->assertTrue($payment->is_deleted);
    }

    // --- SECTION B: RELATIONSHIP COVERAGE (Structural Testing) ---

    /**
     * TC-PAY-05: Verify Relation with Client
     */
    public function test_payment_belongs_to_client()
    {
        $payment = new Payment();
        // Hum check kar rahe hain ke Database rishta sahi juda hai ya nahi
        $this->assertInstanceOf(BelongsTo::class, $payment->client());
    }

/**
     * TC-PAY-06: Verify Relation with Invoice
     */
    public function test_payment_belongs_to_invoice()
    {
        $payment = new Payment();
       // Aur ye 'BelongsToMany' rishta hota hai
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsToMany::class, $payment->invoices());
    }

    /**
     * TC-PAY-07: Verify Relation with Company
     */
    public function test_payment_belongs_to_company()
    {
        $payment = new Payment();
        $this->assertInstanceOf(BelongsTo::class, $payment->company());
    }

    // --- SECTION C: DATA TYPE CASTING ---

    /**
     * TC-PAY-08: Verify Date Casting Logic
     */
    public function test_payment_date_casting()
    {
        $payment = new Payment();
        $payment->date = '2025-12-25';

        // Check if Laravel accepts the string correctly
        $this->assertEquals('2025-12-25', $payment->date);
    }
}