<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
//route for root
Route::get('/', 'VideosController@index');
Route::get('/videos/all', 'VideosController@all');
//route for inserting
Route::post('/videos/create', 'VideosController@create');
//route for edit
Route::get('/videos/:id/edit', 'VideosController@edit');
//route for updating
Route::patch('/videos/:id', 'VideosController@update');
//route for deleting
Route::delete('/videos/:id', 'VideosController@destroy');
