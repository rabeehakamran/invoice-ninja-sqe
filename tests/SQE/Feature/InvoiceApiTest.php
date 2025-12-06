<?php

namespace Tests\Feature;

use Tests\TestCase;

class InvoiceApiTest extends TestCase
{
    // NOTE: We rely on the 403 status code which our tests confirmed is the security response.

    /**
     * INT-INV-01: Security Check (Read Access)
     * Check: Bina login kiye Invoice list na dekh saken.
     */
    public function test_unauthenticated_user_cannot_list_invoices()
    {
        $response = $this->getJson('/api/v1/invoices');
        $response->assertStatus(403); 
    }

    /**
     * INT-INV-02: Security Check (Write Access)
     * Check: Koi bhi user login kiye baghair invoice create na kar sake.
     */
    public function test_unauthenticated_user_cannot_create_invoice()
    {
        $response = $this->postJson('/api/v1/invoices', []);
        $response->assertStatus(403); 
    }

    /**
     * INT-INV-03: Verify Method Check (Routing Test)
     * Check: Routing table sahi kaam kar raha hai aur POST ki jagah GET ko rokta hai.
     */
    public function test_api_rejects_get_on_invoice_creation_route()
    {
        $response = $this->call('GET', '/api/v1/invoices');
        $response->assertStatus(405);
    }
}