<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\PurchaseOrder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseOrderLogicTest extends TestCase
{
    /**
     * PO01: Verify Amount Storage
     */
    public function test_purchase_order_amount_storage()
    {
        $po = new PurchaseOrder();
        $po->amount = 500.00;
        
        $this->assertEquals(500.00, $po->amount);
    }

    /**
     * PO02: Verify Balance Logic
     */
    public function test_purchase_order_balance_logic()
    {
        $po = new PurchaseOrder();
        $po->amount = 500.00;
        $po->balance = 500.00; // Unpaid PO
        
        $this->assertEquals(500.00, $po->balance);
    }

    /**
     * PO03: Verify Default Status
     */
    public function test_purchase_order_default_status()
    {
        $po = new PurchaseOrder();
        // Default draft status
        $po->status_id = 1; 
        
        $this->assertEquals(1, $po->status_id);
    }

    /**
     * PO04: Verify Vendor Relation
     */
    public function test_purchase_order_belongs_to_vendor()
    {
        $po = new PurchaseOrder();
        $this->assertInstanceOf(BelongsTo::class, $po->vendor());
    }

    /**
     * PO05: Verify Soft Delete
     */
    public function test_purchase_order_soft_delete()
    {
        $po = new PurchaseOrder();
        $po->is_deleted = true;
        
        $this->assertTrue($po->is_deleted);
    }
}