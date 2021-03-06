<?php

namespace App\Http\Controllers;

use Log;

use Validator;

use File;

use Carbon\Carbon;

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
      $videos = Video::orderBy('created_at', 'desc')->get();
      return response()->json($videos);
    }

    public function create(Request $request) {
      $validator = Validator::make($request->all(), [
        'name' => 'required',
        'filename' => 'required | mimes:mp4,mov,ogg,qt,flv | max:200000'
      ]);

      if ($validator->fails()) {
        return response()->json($validator->errors(), 401);
      } else {
        $fileName = Carbon::now() . '.' . $request->file('filename')->getClientOriginalExtension();

        $video = new Video(array(
          'name' => $request->get('name'),
          'filename' => $fileName
        ));

        $video->save();


        $request->file('filename')->move(
          base_path() . '/public/videos/', $fileName
        );

        return response()->json($video);
      }
    }

    public function edit($id) {
      $video = Video::find($id);
      return response()->json($video);
    }

    public function update($id, Request $request) {
      $video = Video::find($id);

      $validator = Validator::make($request->all(), [
        'name' => 'required',
        'filename' => 'mimes:mp4,mov,ogg,qt,flv | max:200000'
      ]);

      $video->name = $request->input('name');

      if ($request->file('filename') !== null) {
        File::Delete('videos/' . $video->filename);
        $fileName = Carbon::now() . '.' . $request->file('filename')->getClientOriginalExtension();
        $request->file('filename')->move(
          base_path() . '/public/videos/', $fileName
        );
        $video->filename = $fileName;
      }

      $video->save();

      return response()->json($video);
    }

    public function destroy($id) {
      $video = Video::find($id);
      File::Delete('videos/' . $video->filename);
      $video->delete();
      return response(200);
    }
}
