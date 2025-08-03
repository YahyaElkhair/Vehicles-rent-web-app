<?php

namespace Database\Seeders;

use App\Models\Post;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // Create 10 vehicles for agency_id = 1
        $vehicles = Vehicle::factory()->count(10)->create([
            'agency_id' => 1
        ]);

        // Create 1 post per vehicle (unique vehicle_id)
        foreach ($vehicles as $vehicle) {
            Post::factory()->create([
                'vehicle_id' => $vehicle->id,
                'agency_id' => 1,
            ]);
        }
    }
}
