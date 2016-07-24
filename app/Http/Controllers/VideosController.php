<?php

namespace App\Http\Controllers;

use Log;

use Validator;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Video;

class VideosController extends Controller
{
    // Use this page as root path
    public function index() {
      return view('videos.index');
    }

    // This page contain list of videos
    public function all() {
      return response()->json(['name' => 'Abigail', 'state' => 'CA']);
    }

    public function create(Request $request) {
      $validator = Validator::make($request->all(), [
        'name' => 'required',
        'video_file' => 'required'
      ]);

      if ($validator->fails()) {
        return response()->json($validator->errors());
      } else {
        $video = new Video(array(
          'name' => $request->get('name')
        ));

        $video->save();

        $imageName = $video->id . '.' .
          $request->file('video_file')->getClientOriginalExtension();

        $request->file('video_file')->move(
          base_path() . '/public/videos/', $imageName
        );

        return response()->json($video);
      }
    }
}
