<?php

namespace App\Http\Controllers;

use Log;

use Illuminate\Http\Request;

use App\Http\Requests;

class VideosController extends Controller
{
    // Use this page as root path
    public function index() {
      Log::info('Showing user profile for user: ');
      return view('videos.index');
    }

    // This page contain list of videos
    public function all() {
      return response()->json(['name' => 'Abigail', 'state' => 'CA']);
    }

    public function create(Request $request) {
      Log::info('Showing user profile for user: ');
      $video = $request->input('video');
      $newVideo = new Video;
      $newVideo->video = $video;
      $newVideo->save();

    }
}
