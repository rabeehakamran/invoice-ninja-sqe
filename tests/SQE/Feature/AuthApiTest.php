<?php

namespace Tests\Feature;

use Tests\TestCase;

class AuthApiTest extends TestCase
{
    // NOTE: Yahan koi 'use' trait nahi hona chahiye (Safe Mode)
    
    /**
     * INT-AUTH-01: Check Empty Request (Validation Test)
     */
    public function test_api_validates_empty_login_request()
    {
        $response = $this->postJson('/api/v1/login', []);
        $response->assertStatus(422);
    }

    /**
     * INT-AUTH-02: Check Missing Password
     */
    public function test_api_validates_missing_password()
    {
        $response = $this->postJson('/api/v1/login', [
            'email' => 'admin@test.com'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }

    /**
     * INT-AUTH-03: Check Missing Email
     */
    public function test_api_validates_missing_email()
    {
        $response = $this->postJson('/api/v1/login', [
            'password' => 'secret'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    /**
     * INT-AUTH-04: Check Wrong HTTP Method
     */
    public function test_api_rejects_get_request()
    {
        $response = $this->getJson('/api/v1/login');
        $response->assertStatus(405);
    }
}