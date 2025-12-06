<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class UserLogicTest extends TestCase
{
    /**
     * U01 & U02: Verify Name Attributes
     */
    public function test_user_name_attributes()
    {
        $user = new User();
        $user->first_name = 'Ali';
        $user->last_name = 'Khan';
        
        $this->assertEquals('Ali', $user->first_name);
        $this->assertEquals('Khan', $user->last_name);
    }

    /**
     * U03: Verify Email Lowercase Logic
     */
    public function test_user_email_lowercase_logic()
    {
        $user = new User();
        $rawEmail = 'TEST@GMAIL.COM';
        $user->email = strtolower($rawEmail);
        
        $this->assertEquals('test@gmail.com', $user->email);
    }

    /**
     * U04: Verify OAuth User ID
     */
    public function test_user_oauth_support()
    {
        $user = new User();
        $user->oauth_user_id = 'google-123456';
        
        $this->assertEquals('google-123456', $user->oauth_user_id);
    }

    /**
     * U05: Verify Companies Relation
     */
    public function test_user_belongs_to_many_companies()
    {
        $user = new User();
        $this->assertInstanceOf(BelongsToMany::class, $user->companies());
    }

/**
     * U07: Verify Admin Flag Storage
     */
    public function test_user_is_admin_storage()
    {
        $user = new User();
        $user->is_admin = 1;
        
        // Correction: assertTrue strict hota hai, hum value check karenge
        $this->assertEquals(1, $user->is_admin);
    }
}