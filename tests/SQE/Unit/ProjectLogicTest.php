<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Project;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class ProjectLogicTest extends TestCase
{
    /**
     * PJ01: Verify Budgeted Hours
     */
    public function test_project_budget_hours_storage()
    {
        $project = new Project();
        $project->budgeted_hours = 100.5;
        
        $this->assertEquals(100.5, $project->budgeted_hours);
    }

    /**
     * PJ02: Verify Task Rate
     */
    public function test_project_task_rate_storage()
    {
        $project = new Project();
        $project->task_rate = 50.00;
        
        $this->assertEquals(50.00, $project->task_rate);
    }

    /**
     * PJ03: Verify Name Storage
     */
    public function test_project_name_storage()
    {
        $project = new Project();
        $project->name = "Website Redesign";
        
        $this->assertEquals("Website Redesign", $project->name);
    }

    /**
     * PJ04: Verify Soft Delete
     */
    public function test_project_soft_delete()
    {
        $project = new Project();
        $project->is_deleted = true;
        
        $this->assertTrue($project->is_deleted);
    }

    /**
     * PJ05: Verify Client Relation
     */
    public function test_project_belongs_to_client()
    {
        $project = new Project();
        $this->assertInstanceOf(BelongsTo::class, $project->client());
    }

    /**
     * PJ06: Verify Tasks Relation
     */
    public function test_project_has_many_tasks()
    {
        $project = new Project();
        $this->assertInstanceOf(HasMany::class, $project->tasks());
    }

    /**
     * PJ07: Verify Documents Relation
     */
    public function test_project_has_many_documents()
    {
        $project = new Project();
        $this->assertInstanceOf(MorphMany::class, $project->documents());
    }
}