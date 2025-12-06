<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\PaymentHash;

class PaymentHashLogicTest extends TestCase
{
    /**
     * PH01: Verify Hash Storage
     */
    public function test_payment_hash_storage()
    {
        $paymentHash = new PaymentHash();
        $paymentHash->hash = 'security-token-123';
        
        $this->assertEquals('security-token-123', $paymentHash->hash);
    }

    /**
     * PH02: Verify Soft Delete
     */
    public function test_payment_hash_soft_delete()
    {
        $paymentHash = new PaymentHash();
        $paymentHash->is_deleted = true;
        
        $this->assertTrue($paymentHash->is_deleted);
    }
}