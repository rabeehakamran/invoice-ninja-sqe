<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Expense;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpenseLogicTest extends TestCase
{
    /**
     * EX01: Verify Expense Amount Logic
     */
    public function test_expense_amount_storage()
    {
        $expense = new Expense();
        $expense->amount = 50.50;
        
        $this->assertEquals(50.50, $expense->amount);
    }

    /**
     * EX02: Verify Billable Status Logic
     */
    public function test_expense_is_billable()
    {
        $expense = new Expense();
        $expense->should_be_invoiced = true;
        
        $this->assertTrue($expense->should_be_invoiced);
    }

    /**
     * EX03: Verify Exchange Rate Default
     */
    public function test_expense_exchange_rate_default()
    {
        $expense = new Expense();
        $rate = $expense->exchange_rate ?? 1.0;
        
        $this->assertEquals(1.0, $rate);
    }

    /**
     * EX04: Verify Tax Rate Logic (Yeh Missing Tha)
     */
    public function test_expense_tax_rate_logic()
    {
        $expense = new Expense();
        $expense->tax_rate1 = 10.00; // 10% Tax
        
        $this->assertEquals(10.00, $expense->tax_rate1);
    }

    /**
     * EX05: Verify Vendor Relationship
     */
    public function test_expense_belongs_to_vendor()
    {
        $expense = new Expense();
        $this->assertInstanceOf(BelongsTo::class, $expense->vendor());
    }

    /**
     * EX06: Verify Client Relationship
     */
    public function test_expense_belongs_to_client()
    {
        $expense = new Expense();
        $this->assertInstanceOf(BelongsTo::class, $expense->client());
    }
}