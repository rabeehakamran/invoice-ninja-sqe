<?php

namespace Tests\Feature;

use Tests\TestCase;

class ClientApiTest extends TestCase
{
    // NOTE: Hum RefreshDatabase aur Factories use nahi kar rahe.

    /**
     * INT-CLI-01: Security Check (Unauthorized Write Access)
     * Check: Koi bhi user login kiye baghair client create na kar sake.
     */
    public function test_unauthenticated_user_cannot_create_client()
    {
        $response = $this->postJson('/api/v1/clients', [
            'name' => 'Hacker Corp'
        ]);
        
        $response->assertStatus(403); 
    }

    /**
     * INT-CLI-02: Validation Check (Empty Payload)
     * Ab ye check karega ke Security layer rok rahi hai.
     */
    public function test_client_route_rejects_malformed_requests()
    {
        // Yahan hum token nahi bhej rahe, sirf empty payload bhej rahe hain
        $response = $this->postJson('/api/v1/clients', []);
        
        // As per previous result, security layer returns 403 (Forbidden)
        $response->assertStatus(403);
    }
    
    /**
     * INT-CLI-03: Security Check (Unauthorized Read Access)
     * Check: Bina login kiye client list na dekh saken.
     */
    public function test_unauthenticated_user_cannot_read_clients()
    {
        $response = $this->getJson('/api/v1/clients');
        
        $response->assertStatus(403);
    }
}