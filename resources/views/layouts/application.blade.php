<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Astronaut Test</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="{!! asset('css/nprogress.css') !!}">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.2.1/react.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.2.1/react-dom.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.34/browser.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script src="{!! asset('js/lodash.min.js') !!}"></script>
    <script src="{!! asset('js/nprogress.js') !!}"></script>
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
      @yield('content')
    </div>
    <script type="text/babel" src="{!! asset('js/Video.js') !!}"></script>
  </body>
</html>