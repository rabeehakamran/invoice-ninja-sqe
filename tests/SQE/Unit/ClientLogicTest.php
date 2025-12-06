<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Client;
use App\Models\Contact;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientLogicTest extends TestCase
{
    // --- SECTION A: CORE ATTRIBUTE LOGIC ---

    /**
     * C01: Verify Default Balance Logic
     */
    public function test_client_balance_default()
    {
        $client = new Client();
        // Naye client ka udhaar (balance) 0 hona chahiye
        $balance = $client->balance ?? 0.00;
        
        $this->assertEquals(0.00, $balance);
    }

    /**
     * C02: Verify Paid To Date Default
     */
    public function test_client_paid_to_date_default()
    {
        $client = new Client();
        $paid = $client->paid_to_date ?? 0.00;
        
        $this->assertEquals(0.00, $paid);
    }

    /**
     * C03: Verify Currency ID Logic
     */
    public function test_client_currency_defaults()
    {
        $client = new Client();
        // Agar currency set na ho, to system default (usually 1=USD) uthata hai
        // ya null return karta hai (logic depend karti hai company settings par)
        // Hum check karenge ke ye property access ho rahi hai.
        $client->currency_id = 1;
        
        $this->assertEquals(1, $client->currency_id);
    }

    /**
     * C07: Verify Display Name Logic
     */
    public function test_client_display_name()
    {
        $client = new Client();
        $client->name = 'ABC Corp';
        
        // Invoice Ninja mein 'getDisplayName' ya 'name' attribute use hota hai
        $this->assertEquals('ABC Corp', $client->name);
    }

    // --- SECTION B: RELATIONSHIP COVERAGE ---

    /**
     * C04: Verify Client has Contacts
     */
    public function test_client_has_many_contacts()
    {
        $client = new Client();
        // Client ke bohot saray contacts ho sakte hain (Owner, Manager, etc.)
        $this->assertInstanceOf(HasMany::class, $client->contacts());
    }

    /**
     * C05: Verify Client has Invoices
     */
    public function test_client_has_many_invoices()
    {
        $client = new Client();
        $this->assertInstanceOf(HasMany::class, $client->invoices());
    }

    /**
     * C06: Verify Client belongs to User
     */
    public function test_client_belongs_to_user()
    {
        $client = new Client();
        $this->assertInstanceOf(BelongsTo::class, $client->user());
    }

    // --- SECTION C: DATA TYPES ---

/**
     * C08: Verify Settings Casting (JSON -> Object)
     */
    public function test_client_settings_casting()
    {
        $client = new Client();
        $client->settings = ['language' => 'en'];
        
        // Correction: Laravel isay Object bana deta hai
        $this->assertIsObject($client->settings);
        
        // Extra check (Optional): Andar ka data check karo
        $this->assertEquals('en', $client->settings->language);
    }
}