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
})

var Video = React.createClass({
  getInitialState() {
    return {

    };
  },
  handleSubmitClick: function() {
    var name = $('.js-video-name').val();
    var video_file = $('.js-video-video-file').val();
    var video = {};

    if (!_.isEmpty(name)) {
      video['name'] = name;
    }

    if (!_.isEmpty(video_file)) {
      video['video_file'] = video_file;
    }

    $.ajax({
      url: '/videos',
      method: 'POST',
      dataType: 'JSON',
      data: {
        video: video
      },
      beforeSend: function() {
        NProgress.start();
      }
    })
    .done(this.fetchDataDone)
    .fail(this.fetchDataFail)
  },
  fetchDataDone: function(data, textStatus, jqXHR) {

  },
  fetchDataFail: function(xhr, status, err) {

  },
  render: function() {
    return(
      <VideoForm handleSubmitClick={this.handleSubmitClick} />
    );
  }
});

ReactDOM.render(<Video />, document.getElementById('content'));