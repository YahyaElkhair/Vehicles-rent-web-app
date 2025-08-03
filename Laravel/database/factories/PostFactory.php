<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        $title = $this->faker->sentence();
        return [
            'agency_id' => 1,
            'vehicle_id' => Vehicle::inRandomOrder()->first()->id,
            'title' => $title,
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['draft', 'published']),
            'delivery_options' => ['agency pickup', 'home delivery'],
            'min_driver_age' => 21,
            'min_license_years' => 2,
            'view_count' => $this->faker->numberBetween(0, 1000),
            'rental_count' => $this->faker->numberBetween(0, 100),
            'average_rating' => $this->faker->randomFloat(1, 3, 5),
            'five_star_count' => $this->faker->numberBetween(0, 20),
            'four_star_count' => $this->faker->numberBetween(0, 10),
            'three_star_count' => $this->faker->numberBetween(0, 10),
            'two_star_count' => $this->faker->numberBetween(0, 5),
            'one_star_count' => $this->faker->numberBetween(0, 5),
            'total_reviews' => $this->faker->numberBetween(0, 50),
            'slug' => Str::slug($title) . '-' . $this->faker->unique()->randomNumber(),
            'meta_title' => $title,
            'meta_description' => $this->faker->sentence(),
            'tags' => implode(',', $this->faker->words(5)),
        ];
    }
}
