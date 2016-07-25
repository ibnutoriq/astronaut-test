<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Astronaut Test</title>
    <link rel="stylesheet" href="{!! asset('css/bootstrap.min.css') !!}">
    <link rel="stylesheet" href="{!! asset('css/nprogress.css') !!}">
    <link rel="stylesheet" href="{!! asset('css/style.css') !!}">
    <script src="{!! asset('js/react.js') !!}"></script>
    <script src="{!! asset('js/react-dom.js') !!}"></script>
    <script src="{!! asset('js/browser.min.js') !!}"></script>
    <script src="{!! asset('js/jquery.min.js') !!}"></script>
    <script src="{!! asset('js/lodash.min.js') !!}"></script>
    <script src="{!! asset('js/nprogress.js') !!}"></script>
    <script src="{!! asset('js/jquery.form.js') !!}"></script>
    <script src="{!! asset('js/jquery.scrollTo.min.js') !!}"></script>
  </head>
  <body>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Astronaut Test</a>
        </div>
        <div class="nav navbar-nav navbar-right">
          <li><a href="#">Home</a></li>
        </div>
      </div>
    </nav>

    <div class="container">
      <div class='js-scroll-top'></div>
      @yield('content')
      <div class='js-scroll-bottom'></div>
    </div>
    <script type="text/babel" src="{!! asset('js/Video.js') !!}"></script>
  </body>
</html>