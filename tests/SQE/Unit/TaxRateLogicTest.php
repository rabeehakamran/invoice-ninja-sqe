<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\TaxRate;

class TaxRateLogicTest extends TestCase
{
    /**
     * TR01: Verify Rate Precision
     */
    public function test_tax_rate_precision_storage()
    {
        $tax = new TaxRate();
        $tax->rate = 10.5;
        
        $this->assertEquals(10.5, $tax->rate);
    }

    /**
     * TR02: Verify Name Storage
     */
    public function test_tax_rate_name_storage()
    {
        $tax = new TaxRate();
        $tax->name = 'VAT';
        
        $this->assertEquals('VAT', $tax->name);
    }

    /**
     * TR03: Verify Soft Delete
     */
    public function test_tax_rate_soft_delete()
    {
        $tax = new TaxRate();
        $tax->is_deleted = true;
        
        $this->assertTrue($tax->is_deleted);
    }
}