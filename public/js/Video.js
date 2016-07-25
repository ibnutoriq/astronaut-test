var VideoForm = React.createClass({
  getInitialState: function() {
    return {
      getErrorsValue: this.props.getErrorsValue
    };
  },
  validateName: function() {
    if (!_.isEmpty(this.state.getErrorsValue.name)) {
      return(
        <div className="error-message">{this.state.getErrorsValue.name[0]}</div>
      );
    } else {
      return false
    }
  },
  validateFilename: function() {
    if (!_.isEmpty(this.state.getErrorsValue.filename)) {
      return(
        <div className="error-message">{this.state.getErrorsValue.filename[0]}</div>
      );
    } else {
      return false
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      getErrorsValue: nextProps.getErrorsValue
    });
  },
  componentDidMount: function() {
    $('.js-video-csrf-token').val($('#csrf-token').val())
  },
  render: function() {
    return(
      <form className="form-horizontal" method="POST" action="/videos/create" encType="multipart/form-data" id="js-video-form">
        <input type="hidden" name="_token" className='js-video-csrf-token' />
        <div className="form-group">
          <label htmlFor="inputName">Video name</label>
          <input type="input" className="form-control" name="name" placeholder="Video name..." />
          {this.validateName()}
        </div>
        <div className="form-group">
          <label htmlFor="inputFile">File input</label>
          <input type="file" name="filename" />
          {this.validateFilename()}
        </div>
        <div className="form-group">
          <a href='javascript:void(0)' className="btn btn-primary" onClick={this.props.handleSubmitClick}>Submit</a>
        </div>
      </form>
    );
  }
});

var VideoList = React.createClass({
  getInitialState: function() {
    return {
      getVideosValue: []
    };
  },
  displayPlayer: function() {
    if (!_.isEmpty(this.state.getVideosValue)) {
      this.state.getVideosValue.map(function(video, index) {
        jwplayer('js-video-player' + video.id).setup({
          file: '/videos/' + video.filename,
          width: '245px',
          height: '245px',
        })
      })
    }
  },
  displayList: function() {
    var videos;
    if (!_.isEmpty(this.state.getVideosValue)) {
      videos = this.state.getVideosValue.map(function(video, index) {
        return(
          <div className='col-md-3'>
            <div className='thumbnail video-wrap'>
              <div className='img-video'>
                <div id={'js-video-player' + video.id}></div>
              </div>
              <div className='title'>
                <h4>{video.name}</h4>
              </div>
              <div className='action-btn'>
                <div className='btn-edit'>
                  <a href='javascript:void(0)' className='btn btn-success'>edit</a>
                </div>
                <div className='btn-remove'>
                  <a href='javascript:void(0)' className='btn btn-danger'>remove</a>
                </div>
              </div>
            </div>
          </div>
        )
      })
    }
    return videos;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      getVideosValue: nextProps.getVideosValue
    });
  },
  componentDidUpdate: function() {
    this.displayPlayer();
  },
  componentDidMount: function() {
    this.displayPlayer();
  },
  render: function() {
    return(
      <div className='row'>
        <div className='col-md-12'>
          {this.displayList()}
        </div>
      </div>
    );
  }
});

var Video = React.createClass({
  getInitialState: function() {
    return {
      getVideosValue: [],
      getFilenameValue: '',
      getErrorsValue: {}
    }
  },
  handleSubmitClick: function() {
    var form = $('#js-video-form').ajaxSubmit({
      beforeSubmit: function(arr, $form, options) {
        NProgress.start();
      }
    });

    var xhr = form.data('jqxhr');
    xhr.done(this.fetchDataDone);
    xhr.fail(this.fetchDataFail);
  },
  fetchDataDone: function(data, textStatus, jqXHR) {
    this.fetchVideoList();
    NProgress.done();
  },
  fetchDataFail: function(errors) {
    this.setState({
      getErrorsValue: errors.responseJSON
    })
    $.scrollTo('.js-scroll-top', 500);
    NProgress.done();
  },
  fetchVideoList: function() {
    $.ajax({
      url: '/videos/all',
      method: 'GET',
      dataType: 'JSON',
      beforeSend: function() {
        NProgress.start();
      }
    })
    .done(this.fetchVideoListDone)
    .fail(this.fetchVideoListFail);
  },
  fetchVideoListDone: function(data, textStatus, jqXHR) {
    this.setState({
      getVideosValue: data
    });
    NProgress.done();
  },
  fetchVideoListFail: function(xhr, status, err) {
    console.log(err);
    NProgress.done();
  },
  handleFilenameChange: function(e) {
    this.setState({
      getFilenameValue: e.target.files
    });
  },
  componentDidMount: function() {
    this.fetchVideoList();
  },
  render: function() {
    return(
      <div className='container'>
        <VideoForm
          handleSubmitClick={this.handleSubmitClick}
          handleFilenameChange={this.handleFilenameChange}
          getErrorsValue={this.state.getErrorsValue} />
        <VideoList getVideosValue={this.state.getVideosValue} />
      </div>
    );
  }
});

ReactDOM.render(<Video />, document.getElementById('content'));