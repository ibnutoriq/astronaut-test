var VideoForm = React.createClass({
  render: function() {
    return(
      <form className="form-horizontal">
        <div className="form-group">
          <label htmlFor="inputName">Video name</label>
          <input type="input" className="form-control js-video-name" placeholder="Video name..." />
        </div>
        <div className="form-group">
          <label htmlFor="inputFile">File input</label>
          <input type="file" className="js-video-video-file" />
        </div>
        <div className="form-group">
          <a href='javascript:void(0)' className="btn btn-primary" onClick={this.props.handleSubmitClick}>Submit</a>
        </div>
      </form>
    );
  }
});

var VideoList = React.createClass({
  render: function() {
    return(
      <div className='row'>
        <div className='col-md-12'>
          <div className='col-md-3'>
            <div className='thumbnail video-wrap'>
              <div className='img-video'>
                <img src='http://placehold.it/400x400' />
              </div>
              <div className='title'>
                <h4>title</h4>
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
        </div>
      </div>
    );
  }
});

var Video = React.createClass({
  getInitialState: function() {
    return {
      getVideoValue: {}
    }
  },
  handleSubmitClick: function() {
    var name = $('.js-video-name').val();
    var video_file = $('.js-video-video-file').value;

    $.ajax({
      url: '/videos/create',
      method: 'POST',
      dataType: 'JSON',
      data: {
        name: name,
        video_file: video_file
      },
      beforeSend: function() {
        NProgress.start();
      }
    })
    .done(this.fetchDataDone)
    .fail(this.fetchDataFail)
  },
  fetchDataDone: function(data, textStatus, jqXHR) {
    this.setState({
      getVideoValue: data
    });
    NProgress.done();
  },
  fetchDataFail: function(xhr, status, err) {
    console.log(err);
    NProgress.done();
  },
  render: function() {
    return(
      <div className='container'>
        <VideoForm handleSubmitClick={this.handleSubmitClick} />
        <VideoList />
      </div>
    );
  }
});

ReactDOM.render(<Video />, document.getElementById('content'));