@extends('layouts.application')

@section('content')

<input type="hidden" name="_token" id="csrf-token" value="{{ Session::token() }}" />
<div id="js-user-content"></div>
<script type="text/babel" src="{!! asset('js/User.js') !!}"></script>

@stop
