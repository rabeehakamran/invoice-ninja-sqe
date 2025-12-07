<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::middleware('web')->group(function () {

    Route::get('/__cypress__/csrf_token', function () {
        return csrf_token();
    });

    Route::post('/__cypress__/login', function (Request $request) {
        $user = \App\Models\User::factory()->create($request->attributes ?? []);
        auth()->login($user);
        return $user;
    });

    Route::post('/__cypress__/logout', function () {
        auth()->logout();
        return response()->noContent();
    });

    Route::post('/__cypress__/current-user', function () {
        return auth()->user();
    });

    Route::post('/__cypress__/artisan', function (Request $request) {
        \Artisan::call($request->command, $request->parameters ?? []);
        return ['output' => \Artisan::output()];
    });

    Route::post('/__cypress__/factory', function (Request $request) {
        $model = $request->model;
        return $model::factory()
            ->count($request->count ?? 1)
            ->create($request->attributes ?? []);
    });

});

