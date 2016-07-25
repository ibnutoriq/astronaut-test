var VideoForm = React.createClass({
  componentDidMount: function() {
    $('.js-video-csrf-token').val($('#csrf-token').val())
  },
  render: function() {
    return(
      <form className="form-horizontal" method="POST" action="/videos/create" encType="multipart/form-data" id="js-video-form">
        <input type="hidden" name="_token" className='js-video-csrf-token' />
        <div className="form-group">
          <label htmlFor="inputName">Video name</label>
          <input type="input" className="form-control js-video-name" name="name" placeholder="Video name..." />
        </div>
        <div className="form-group">
          <label htmlFor="inputFile">File input</label>
          <input type="file" className="js-video-filename" name="filename" />
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
  displayList: function() {
    var videos;
    if (!_.isEmpty(this.state.getVideosValue)) {
      videos = this.state.getVideosValue.map(function(video, index) {
        return(
          <div className='col-md-3'>
            <div className='thumbnail video-wrap'>
              <div className='img-video'>
                <img src={"/videos/" + video.filename} />
              </div>
              <div className='title'>
                <h4>video.name</h4>
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
      getFilenameValue: ''
    }
  },
  handleSubmitClick: function() {
    var csrfToken = $('input[name="_token"]').val();
    var name = $('.js-video-name').val();
    var filename = $('.js-video-filename').val();

    var form = $('#js-video-form').ajaxSubmit({
      beforeSubmit: function(arr, $form, options) {
        NProgress.start();
      }
    });

    var xhr = form.data('jqxhr');
    xhr.done(this.fetchDataDone);
    xhr.done(this.fetchDataFail);
  },
  fetchDataDone: function(data, textStatus, jqXHR) {
    var videos = this.state.getVideosValue;
    videos.push(data);
    this.setState({
      getVideosValue: videos
    });
    NProgress.done();
  },
  fetchDataFail: function(xhr, status, err) {
    console.log(err);
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
        <VideoForm handleSubmitClick={this.handleSubmitClick} handleFilenameChange={this.handleFilenameChange} />
        <VideoList getVideosValue={this.state.getVideosValue} />
      </div>
    );
  }
});

ReactDOM.render(<Video />, document.getElementById('content'));