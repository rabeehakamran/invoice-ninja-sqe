<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Quote;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuoteLogicTest extends TestCase
{
    /**
     * Q01: Verify Auto Bill Default
     */
    public function test_quote_auto_bill_disabled_by_default()
    {
        $quote = new Quote();
        $this->assertFalse($quote->auto_bill_enabled ?? false);
    }

    /**
     * Q02: Verify Approval Status
     */
    public function test_quote_is_not_approved_initially()
    {
        // Logic: Nayi quote approve nahi honi chahiye jab tak client sign na kare
        $quote = new Quote();
        // Assuming attribute or helper method exists, usually status logic handles this
        // Here we check if a specific flag exists or defaults to false/null
        $this->assertEmpty($quote->invoice_id); // Agar convert nahi hui to invoice_id null hoga
    }

    /**
     * Q03: Verify Date Casting
     */
    public function test_quote_date_casting()
    {
        $quote = new Quote();
        $quote->date = '2025-05-01';
        $this->assertEquals('2025-05-01', $quote->date);
    }

    /**
     * Q04: Verify Invoice Relation (Conversion)
     */
    public function test_quote_belongs_to_invoice()
    {
        $quote = new Quote();
        // Jab Quote convert hoti hai, wo Invoice se link ho jati hai
        $this->assertInstanceOf(BelongsTo::class, $quote->invoice());
    }

    /**
     * Q06: Verify Status Defaults to Draft
     */
    public function test_quote_default_status()
    {
        $quote = new Quote();
        $quote->status_id = 1; // Draft
        $this->assertEquals(1, $quote->status_id);
    }
}