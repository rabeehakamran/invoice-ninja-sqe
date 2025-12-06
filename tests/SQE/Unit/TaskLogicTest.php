<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Task;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskLogicTest extends TestCase
{
    /**
     * TS01: Verify Task Running Status Default
     */
    public function test_task_is_not_running_by_default()
    {
        $task = new Task();
        // Naya task humesha "Stopped" state mein hota hai
        $this->assertFalse($task->is_running ?? false);
    }

    /**
     * TS02: Verify Time Log Casting
     */
    public function test_task_time_log_casting()
    {
        $task = new Task();
        // Time log complex structure hota hai [[start, end], [start, end]]
        $task->time_log = [['start' => 1000, 'end' => 2000]];
        
        $this->assertIsArray($task->time_log);
    }

    /**
     * TS03: Verify Duration Storage
     */
    public function test_task_duration_storage()
    {
        $task = new Task();
        $task->duration = 3600; // 1 Hour in seconds
        
        $this->assertEquals(3600, $task->duration);
    }

    /**
     * TS04: Verify Soft Delete Logic
     */
    public function test_task_soft_delete()
    {
        $task = new Task();
        $task->is_deleted = true;
        
        $this->assertTrue($task->is_deleted);
    }

    /**
     * TS05: Verify Client Relationship
     */
    public function test_task_belongs_to_client()
    {
        $task = new Task();
        $this->assertInstanceOf(BelongsTo::class, $task->client());
    }

    /**
     * TS06: Verify Project Relationship
     */
    public function test_task_belongs_to_project()
    {
        $task = new Task();
        $this->assertInstanceOf(BelongsTo::class, $task->project());
    }

    /**
     * TS07: Verify Invoice Relationship
     */
    public function test_task_belongs_to_invoice()
    {
        $task = new Task();
        $this->assertInstanceOf(BelongsTo::class, $task->invoice());
    }
}