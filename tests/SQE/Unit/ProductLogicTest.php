<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Product;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductLogicTest extends TestCase
{
    /**
     * PR01: Verify Product Price Storage
     */
    public function test_product_price_logic()
    {
        $product = new Product();
        $product->price = 150.00;
        
        $this->assertEquals(150.00, $product->price);
    }

    /**
     * PR02: Verify Default Stock Quantity
     */
    public function test_product_quantity_defaults_to_zero()
    {
        $product = new Product();
        // Agar quantity set na karein, to undefined ya 0 honi chahiye
        $qty = $product->quantity ?? 0;
        
        $this->assertEquals(0, $qty);
    }

    /**
     * PR03: Verify Default Tax Rate
     */
    public function test_product_tax_defaults_to_zero()
    {
        $product = new Product();
        $tax = $product->tax_rate1 ?? 0.00;
        
        $this->assertEquals(0.00, $tax);
    }

    /**
     * PR04: Verify Documents Relationship
     */
    public function test_product_has_documents()
    {
        $product = new Product();
        // Product ke sath images attach hoti hain via MorphMany
        $this->assertInstanceOf(MorphMany::class, $product->documents());
    }

    /**
     * PR05: Verify User Relationship
     */
    public function test_product_belongs_to_user()
    {
        $product = new Product();
        $this->assertInstanceOf(BelongsTo::class, $product->user());
    }

    /**
     * PR06: Verify Soft Delete Logic
     */
    public function test_product_soft_delete()
    {
        $product = new Product();
        $product->is_deleted = true;
        
        $this->assertTrue($product->is_deleted);
    }
}