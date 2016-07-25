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
  decideFormBehavior: function() {
    var getVideoValue = this.props.getVideoValue
    if (!_.isEmpty(getVideoValue)) {
      $('form').removeClass('js-video-form-add');
      $('form').addClass('js-video-form-edit');
      $('.js-video-name').val(getVideoValue.name);
      $('.js-video-form-edit').attr('action', '/videos/' + getVideoValue.id);
    } else {
      $('form').removeClass('js-video-form-edit');
      $('form').addClass('js-video-form-add');
      $('.js-video-form-add').attr('action', '/videos/create');
    }
  },
  decideSubmitBtn: function() {
    if (!_.isEmpty(this.props.getVideoValue)) {
      return(
        <a href='javascript:void(0)'
          className='btn btn-primary'
          onClick={this.props.handleUpdateClick}>Submit</a>
      );
    } else {
      return(
        <a href='javascript:void(0)'
          className='btn btn-primary'
          onClick={this.props.handleSubmitClick}>Submit</a>
      );
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      getErrorsValue: nextProps.getErrorsValue
    });
  },
  componentDidMount: function() {
    $('.js-video-csrf-token').val($('#csrf-token').val());
  },
  componentDidUpdate: function() {
    this.decideFormBehavior();
  },
  render: function() {
    return(
      <form className="form-horizontal js-video-form-add" method="POST" action="/videos/create" encType="multipart/form-data">
        <input type="hidden" name="_token" className='js-video-csrf-token' />
        <div className="form-group">
          <label htmlFor="inputName">Video name</label>
          <input type="input" className="form-control js-video-name" name="name" placeholder="Video name..." />
          {this.validateName()}
        </div>
        <div className="form-group">
          <label htmlFor="inputFile">File input</label>
          <input type="file" className="js-video-filename" name="filename" />
          {this.validateFilename()}
        </div>
        <div className="form-group">
          {this.decideSubmitBtn()}
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
    var handleRemoveClick = this.props.handleRemoveClick
    var handleEditClick = this.props.handleEditClick
    if (!_.isEmpty(this.state.getVideosValue)) {
      videos = this.state.getVideosValue.map(function(video, index) {
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(video.filename)[1];
        return(
          <div className='col-md-3'>
            <div className='thumbnail video-wrap'>
              <div className='img-video'>
                <video controls preload='metadata' width='245' height='245'>
                  <source src={'videos/' + video.filename} type={'video/' + ext} />
                </video>
              </div>
              <div className='title'>
                <h4>{video.name}</h4>
              </div>
              <div className='action-btn'>
                <div className='btn-edit'>
                  <a href='javascript:void(0)'
                    className='btn btn-success'
                    data-id={video.id}
                    onClick={handleEditClick}>edit</a>
                </div>
                <div className='btn-remove'>
                  <a href='javascript:void(0)'
                    className='btn btn-danger js-video-remove'
                    data-id={video.id}
                    onClick={handleRemoveClick}>remove</a>
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
      getVideoValue: {},
      getFilenameValue: '',
      getErrorsValue: {}
    }
  },
  handleSubmitClick: function() {
    var form = $('.js-video-form-add').ajaxSubmit({
      beforeSubmit: function(arr, $form, options) {
        NProgress.start();
      }
    });

    var xhr = form.data('jqxhr');
    xhr.done(this.fetchDataDone);
    xhr.fail(this.fetchDataFail);
  },
  handleUpdateClick: function() {
    var form = $('.js-video-form-edit').ajaxSubmit({
      beforeSubmit: function(arr, $form, options) {
        NProgress.start();
      }
    });

    var xhr = form.data('jqxhr');
    xhr.done(this.fetchDataDone);
    xhr.fail(this.fetchDataFail);
  },
  fetchDataDone: function(data, textStatus, jqXHR) {
    this.resetForm();
    this.setState({
      getVideosValue: []
    })
    this.setState({
      getVideoValue: {}
    })
    this.fetchVideoList();
    NProgress.done();
  },
  fetchDataUpdateDone: function(data, textStatus, jqXHR) {
    this.resetForm();
    this.setState({
      getVideosValue: []
    })
    this.setState({
      getVideoValue: {}
    })
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
  handleRemoveClick: function(e) {
    $.ajax({
      url: '/videos/' + e.target.dataset.id + '?_token=' + $('input[name="_token"]').val(),
      method: 'DELETE',
      dataType: 'JSON',
      beforeSend: function() {
        NProgress.start();
      }
    })
    .done(this.fetchRemoveDone)
    .fail(this.fetchRemoveFail);
  },
  fetchRemoveDone: function(data, textStatus, jqXHR) {
    this.fetchVideoList();
    NProgress.done();
  },
  fetchRemoveFail: function(xhr, status, err) {
    console.log(err);
    NProgress.done();
  },
  handleEditClick: function(e) {
    $.ajax({
      url: '/videos/' + e.target.dataset.id + '/edit',
      method: 'GET',
      dataType: 'JSON',
      beforeSend: function() {
        NProgress.start();
      }
    })
    .done(this.fetchEditDone)
    .fail(this.fetchEditFail);
  },
  fetchEditDone: function(data, textStatus, jqXHR) {
    $.scrollTo('.js-scroll-top', 500);
    this.resetForm();
    this.setState({
      getVideoValue: data
    });
    NProgress.done();
  },
  fetchEditFail: function(xhr, status, err) {
    console.log(err);
    NProgress.done();
  },
  componentDidMount: function() {
    this.fetchVideoList();
  },
  resetForm: function() {
    if (!_.isEmpty(this.state.getVideoValue)) {
      $('.js-video-form-edit')[0].reset();
    } else {
      $('.js-video-form-add')[0].reset();
    }

    $('.error-message').remove();
  },
  render: function() {
    return(
      <div className='container'>
        <VideoForm
          handleSubmitClick={this.handleSubmitClick}
          handleFilenameChange={this.handleFilenameChange}
          getErrorsValue={this.state.getErrorsValue}
          getVideoValue={this.state.getVideoValue}
          handleUpdateClick={this.handleUpdateClick} />
        <VideoList
          getVideosValue={this.state.getVideosValue}
          handleRemoveClick={this.handleRemoveClick}
          handleEditClick={this.handleEditClick} />
      </div>
    );
  }
});

ReactDOM.render(<Video />, document.getElementById('content'));