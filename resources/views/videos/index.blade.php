@extends('layouts.application')

@section('content')

<input type="hidden" name="_token" id="csrf-token" value="{{ Session::token() }}" />
<div id="js-video-content"></div>
<script type="text/babel" src="{!! asset('js/Video.js') !!}"></script>

@stop
