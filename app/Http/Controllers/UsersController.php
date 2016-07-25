<?php

namespace App\Http\Controllers;

use Log;

use Validator;

use File;

use Carbon\Carbon;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\User;

class UsersController extends Controller
{
    // Use this page as root path
    public function index() {
      return view('users.index');
    }

    // This page contain list of users
    public function all() {
      $users = User::orderBy('created_at', 'desc')->get();
      return response()->json($users);
    }

    public function create(Request $request) {
      $validator = Validator::make($request->all(), [
        'name' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:6|confirmed',
        'profile_picture' => 'required|mimes:jpg,jpeg,png,gif|max:50000'
      ]);

      if ($validator->fails()) {
        return response()->json($validator->errors(), 401);
      } else {
        $profilePicture = Carbon::now() . '.' . $request->file('profile_picture')->getClientOriginalExtension();

        $user = new User(array(
          'name' => $request->get('name'),
          'email' => $request->get('email'),
          'password' => bcrypt($request->get('password')),
          'profile_picture' => $profilePicture
        ));

        $user->save();


        $request->file('profile_picture')->move(
          base_path() . '/public/profile_pictures/', $profilePicture
        );

        return response()->json($user);
      }
    }

    public function edit($id) {
      $user = User::find($id);
      return response()->json($user);
    }

    public function update($id, Request $request) {
      $user = User::find($id);

      $validator = Validator::make($request->all(), [
        'name' => 'required',
        'email' => 'required|email',
        'password' => 'min:6|confirmed',
        'profile_picture' => 'mimes:jpg,jpeg,png,gif|max:50000'
      ]);

      if ($validator->fails()) {
        return response()->json($validator->errors(), 401);
      } else {
        $user->name = $request->get('name');
        $user->email = $request->get('email');

        if ($request->get('password') !== null) {
          $user->password = bcrypt($request->get('password'));
        }

        if ($request->file('profile_picture') !== null) {
          File::Delete('users/' . $user->profile_picture);
          $profilePicture = Carbon::now() . '.' . $request->file('profile_picture')->getClientOriginalExtension();
          $request->file('profile_picture')->move(
            base_path() . '/public/profile_pictures/', $profilePicture
          );
          $user->profile_picture = $profilePicture;
        }

        $user->save();

        return response()->json($user);
      }

    }

    public function destroy($id) {
      $user = User::find($id);
      File::Delete('users/' . $user->profile_picture);
      $user->delete();
      return response(200);
    }
}
