<?php

namespace Database\Factories;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

class VehicleFactory extends Factory
{
    protected $model = Vehicle::class;

    public function definition(): array
    {
        return [
            'agency_id' => 1,
            'brand' => $this->faker->company(),
            'model' => $this->faker->word(),
            'year' => $this->faker->year(),
            'color' => $this->faker->safeColorName(),
            'license_plate' => strtoupper($this->faker->unique()->bothify('??###??')),
            'vin' => strtoupper($this->faker->unique()->bothify('###############')),
            'mileage' => $this->faker->numberBetween(10000, 100000),
            'engine_type' => $this->faker->randomElement(['V6', 'V8', 'Electric', 'Hybrid']),
            'transmission' => $this->faker->randomElement(['manual', 'automatic']),
            'fuel_type' => $this->faker->randomElement(['petrol', 'diesel', 'electric']),
            'seats' => $this->faker->numberBetween(2, 7),
            'doors' => $this->faker->numberBetween(2, 5),
            'type' => $this->faker->randomElement(['car', 'motorcycle', 'truck']),
            'price_per_day' => $this->faker->randomFloat(2, 20, 150),
            'price_per_week' => $this->faker->randomFloat(2, 150, 800),
            'price_per_month' => $this->faker->randomFloat(2, 600, 3000),
            'discount_rate' => $this->faker->randomFloat(2, 0, 20),
            'minimum_rental_days' => $this->faker->numberBetween(1, 7),
            'status' => 'available',
            'description' => $this->faker->paragraph(),
            'images' => [
                $this->faker->imageUrl(640, 480, 'cars', true),
                $this->faker->imageUrl(640, 480, 'cars', true)
            ],
            'features' => ['AC', 'GPS', 'Bluetooth'],
            'delivery_fee_per_km' => $this->faker->randomFloat(2, 0, 5),
            'available_from' => now(),
            'available_to' => now()->addMonths(6),
            'blackout_dates' => json_encode([now()->addDays(10)->toDateString()]),
        ];
    }
}
