<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detections', function (Blueprint $table) {
            $table->id();
            $table->string('plate')->index();
            $table->string('camera');
            $table->string('location');
            $table->string('vehicle');
            $table->float('confidence');
            $table->string('status')->default('Pending');
            $table->boolean('watchlisted')->default(false);
            $table->dateTime('captured_at')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detections');
    }
};
