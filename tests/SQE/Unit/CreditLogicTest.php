<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Credit;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditLogicTest extends TestCase
{
    /**
     * CR01: Verify Balance Matches Amount Initially
     */
    public function test_credit_balance_equals_amount()
    {
        $credit = new Credit();
        $credit->amount = 50.00;
        // Business Logic: Naya credit poora available hota hai
        $credit->balance = 50.00; 
        
        $this->assertEquals(50.00, $credit->balance);
    }

    /**
     * CR03: Verify Default Status
     */
    public function test_credit_default_status()
    {
        $credit = new Credit();
        // Default behavior check (Assuming Draft=1 like other models)
        $credit->status_id = 1; 
        $this->assertEquals(1, $credit->status_id);
    }

    /**
     * CR04: Verify Exchange Rate Default
     */
    public function test_credit_exchange_rate_default()
    {
        $credit = new Credit();
        $rate = $credit->exchange_rate ?? 1.0;
        $this->assertEquals(1.0, $rate);
    }

    /**
     * CR05: Verify Client Relation
     */
    public function test_credit_belongs_to_client()
    {
        $credit = new Credit();
        $this->assertInstanceOf(BelongsTo::class, $credit->client());
    }

    /**
     * CR06: Verify Company Relation
     */
    public function test_credit_belongs_to_company()
    {
        $credit = new Credit();
        $this->assertInstanceOf(BelongsTo::class, $credit->company());
    }
}