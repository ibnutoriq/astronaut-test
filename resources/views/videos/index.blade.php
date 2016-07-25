@extends('layouts.application')

@section('content')

<input type="hidden" name="_token" id="csrf-token" value="{{ Session::token() }}" />
<div id="content"></div>

@stop
