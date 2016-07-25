var UserForm = React.createClass({
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
  validateEmail: function() {
    if (!_.isEmpty(this.state.getErrorsValue.email)) {
      return(
        <div className="error-message">{this.state.getErrorsValue.email[0]}</div>
      );
    } else {
      return false
    }
  },
  validatePassword: function() {
    if (!_.isEmpty(this.state.getErrorsValue.password)) {
      return(
        <div className="error-message">{this.state.getErrorsValue.password[0]}</div>
      );
    } else {
      return false
    }
  },
  validatePasswordConfirmation: function() {
    if (!_.isEmpty(this.state.getErrorsValue.password_confirmation)) {
      return(
        <div className="error-message">{this.state.getErrorsValue.password_confirmation[0]}</div>
      );
    } else {
      return false
    }
  },
  validateProfilePicture: function() {
    if (!_.isEmpty(this.state.getErrorsValue.profile_picture)) {
      return(
        <div className="error-message">{this.state.getErrorsValue.profile_picture[0]}</div>
      );
    } else {
      return false
    }
  },
  decideFormBehavior: function() {
    var getUserValue = this.props.getUserValue
    if (!_.isEmpty(getUserValue)) {
      $('form').removeClass('js-user-form-add');
      $('form').addClass('js-user-form-edit');
      $('.js-user-name').val(getUserValue.name);
      $('.js-user-email').val(getUserValue.email);
      $('.js-user-form-edit').attr('action', '/users/' + getUserValue.id);
    } else {
      $('form').removeClass('js-user-form-edit');
      $('form').addClass('js-user-form-add');
      $('.js-user-form-add').attr('action', '/users/create');
    }
  },
  decideSubmitBtn: function() {
    if (!_.isEmpty(this.props.getUserValue)) {
      return(
        <a href='javascript:void(0)'
          className='btn btn-success'
          onClick={this.props.handleUpdateClick}>Update</a>
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
    $('.js-user-csrf-token').val($('#csrf-token').val());
  },
  componentDidUpdate: function() {
    this.decideFormBehavior();
  },
  render: function() {
    return(
      <form className="form-horizontal js-user-form-add" method="POST" action="/users/create" encType="multipart/form-data">
        <input type="hidden" name="_token" className='js-user-csrf-token' />
        <div className="form-group">
          <label htmlFor="inputName">Name</label>
          <input type="input" className="form-control js-user-name" name="name" placeholder="Your name..." />
          {this.validateName()}
        </div>
        <div className="form-group">
          <label htmlFor="inputEmail">Email</label>
          <input type="email" className="form-control js-user-email" name="email" placeholder="Your email..." />
          {this.validateEmail()}
        </div>
        <div className="form-group">
          <label htmlFor="inputPassword">Password</label>
          <input type="password" className="form-control js-user-password" name="password" placeholder="Your password..." />
          {this.validatePassword()}
        </div>
        <div className="form-group">
          <label htmlFor="inputPasswordConfirmation">Password confirmation</label>
          <input type="password" className="form-control js-user-password-confirmation" name="password_confirmation" placeholder="Retype password..." />
          {this.validatePasswordConfirmation()}
        </div>
        <div className="form-group">
          <label htmlFor="inputFile">Profile picture</label>
          <input type="file" className="js-user-profile-picture" name="profile_picture" />
          {this.validateProfilePicture()}
        </div>
        <div className="form-group">
          {this.decideSubmitBtn()}
        </div>
      </form>
    );
  }
});

var UserList = React.createClass({
  getInitialState: function() {
    return {
      getUsersValue: []
    };
  },
  displayList: function() {
    var users;
    var handleRemoveClick = this.props.handleRemoveClick
    var handleEditClick = this.props.handleEditClick
    if (!_.isEmpty(this.state.getUsersValue)) {
      users = this.state.getUsersValue.map(function(user, index) {
        return(
          <div className='col-md-3'>
            <div className='thumbnail video-wrap'>
              <div className='img-video'>
                <img src={'/profile_pictures/' + user.profile_picture} />
              </div>
              <div className='title'>
                <h4>{user.name}</h4>
                <h5><a href={'mailto:' + user.email}>user.email</a></h5>
              </div>
              <div className='action-btn'>
                <div className='btn-edit'>
                  <a href='javascript:void(0)'
                    className='btn btn-success'
                    data-id={user.id}
                    onClick={handleEditClick}>edit</a>
                </div>
                <div className='btn-remove'>
                  <a href='javascript:void(0)'
                    className='btn btn-danger js-user-remove'
                    data-id={user.id}
                    onClick={handleRemoveClick}>remove</a>
                </div>
              </div>
            </div>
          </div>
        )
      })
    }
    return users;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      getUsersValue: nextProps.getUsersValue
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

var User = React.createClass({
  getInitialState: function() {
    return {
      getUsersValue: [],
      getUserValue: {},
      getFilenameValue: '',
      getErrorsValue: {}
    }
  },
  handleSubmitClick: function() {
    var form = $('.js-user-form-add').ajaxSubmit({
      beforeSubmit: function(arr, $form, options) {
        NProgress.start();
      }
    });

    var xhr = form.data('jqxhr');
    xhr.done(this.fetchDataDone);
    xhr.fail(this.fetchDataFail);
  },
  handleUpdateClick: function() {
    var form = $('.js-user-form-edit').ajaxSubmit({
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
      getUsersValue: []
    })
    this.setState({
      getUserValue: {}
    })
    this.fetchUserList();
    NProgress.done();
  },
  fetchDataUpdateDone: function(data, textStatus, jqXHR) {
    this.resetForm();
    this.setState({
      getUsersValue: []
    })
    this.setState({
      getUserValue: {}
    })
    this.fetchUserList();
    NProgress.done();
  },
  fetchDataFail: function(errors) {
    this.setState({
      getErrorsValue: errors.responseJSON
    })
    $.scrollTo('.js-scroll-top', 500);
    NProgress.done();
  },
  fetchUserList: function() {
    $.ajax({
      url: '/users/all',
      method: 'GET',
      dataType: 'JSON',
      beforeSend: function() {
        NProgress.start();
      }
    })
    .done(this.fetchUserListDone)
    .fail(this.fetchUserListFail);
  },
  fetchUserListDone: function(data, textStatus, jqXHR) {
    this.setState({
      getUsersValue: data
    });
    NProgress.done();
  },
  fetchUserListFail: function(xhr, status, err) {
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
      url: '/users/' + e.target.dataset.id + '?_token=' + $('input[name="_token"]').val(),
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
    this.fetchUserList();
    NProgress.done();
  },
  fetchRemoveFail: function(xhr, status, err) {
    console.log(err);
    NProgress.done();
  },
  handleEditClick: function(e) {
    $.ajax({
      url: '/users/' + e.target.dataset.id + '/edit',
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
      getUserValue: data
    });
    NProgress.done();
  },
  fetchEditFail: function(xhr, status, err) {
    console.log(err);
    NProgress.done();
  },
  componentDidMount: function() {
    this.fetchUserList();
  },
  resetForm: function() {
    if (!_.isEmpty(this.state.getUserValue)) {
      $('.js-user-form-edit')[0].reset();
    } else {
      $('.js-user-form-add')[0].reset();
    }

    $('.error-message').remove();
  },
  render: function() {
    return(
      <div className='container'>
        <UserForm
          handleSubmitClick={this.handleSubmitClick}
          handleFilenameChange={this.handleFilenameChange}
          getErrorsValue={this.state.getErrorsValue}
          getUserValue={this.state.getUserValue}
          handleUpdateClick={this.handleUpdateClick} />
        <UserList
          getUsersValue={this.state.getUsersValue}
          handleRemoveClick={this.handleRemoveClick}
          handleEditClick={this.handleEditClick} />
      </div>
    );
  }
});

ReactDOM.render(<User />, document.getElementById('js-user-content'));