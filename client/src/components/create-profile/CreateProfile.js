import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import { createProfile } from '../../actions/profileActions';

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: '',
      company: '',
      website: '',
      location: '',
      status: '',
      skills: '',
      githubusername: '',
      bio: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      youtube: '',
      instagram: '',
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors:
          typeof nextProps.errors === 'object'
            ? nextProps.errors
            : { global: nextProps.errors }
      });
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const profileData = { ...this.state };
    delete profileData.errors;
    delete profileData.displaySocialInputs;

    this.props.createProfile(profileData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { errors, displaySocialInputs } = this.state;

    const options = [
      { label: '* Select Professional Status', value: 0 },
      { label: 'Developer', value: 'Developer' },
      { label: 'Junior Developer', value: 'Junior Developer' },
      { label: 'Senior Developer', value: 'Senior Developer' },
      { label: 'Manager', value: 'Manager' },
      { label: 'Student or Learning', value: 'Student or Learning' },
      { label: 'Instructor or Teacher', value: 'Instructor or Teacher' },
      { label: 'Intern', value: 'Intern' },
      { label: 'Other', value: 'Other' }
    ];

    let socialInputs;
    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup name="twitter" icon="fab fa-twitter" value={this.state.twitter} onChange={this.onChange} error={errors.twitter} placeholder="Twitter Profile URL" />
          <InputGroup name="facebook" icon="fab fa-facebook" value={this.state.facebook} onChange={this.onChange} error={errors.facebook} placeholder="Facebook Page URL" />
          <InputGroup name="linkedin" icon="fab fa-linkedin" value={this.state.linkedin} onChange={this.onChange} error={errors.linkedin} placeholder="Linkedin Profile URL" />
          <InputGroup name="youtube" icon="fab fa-youtube" value={this.state.youtube} onChange={this.onChange} error={errors.youtube} placeholder="YouTube Channel URL" />
          <InputGroup name="instagram" icon="fab fa-instagram" value={this.state.instagram} onChange={this.onChange} error={errors.instagram} placeholder="Instagram Page URL" />
        </div>
      );
    }

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create Your Profile</h1>
              <p className="lead text-center">Let's get some information to make your profile stand out</p>
              <small className="d-block pb-3">* = required fields</small>

              {errors.global && <div className="alert alert-danger">{errors.global}</div>}

              <form onSubmit={this.onSubmit}>
                <TextFieldGroup placeholder="* Profile Handle" name="handle" value={this.state.handle} onChange={this.onChange} error={errors.handle} info="Unique handle for your profile URL." />
                <SelectListGroup placeholder="Status" name="status" value={this.state.status} onChange={this.onChange} options={options} error={errors.status} info="Where you are in your career" />
                <TextFieldGroup placeholder="Company" name="company" value={this.state.company} onChange={this.onChange} error={errors.company} />
                <TextFieldGroup placeholder="Website" name="website" value={this.state.website} onChange={this.onChange} error={errors.website} />
                <TextFieldGroup placeholder="Location" name="location" value={this.state.location} onChange={this.onChange} error={errors.location} />
                <TextFieldGroup placeholder="* Skills" name="skills" value={this.state.skills} onChange={this.onChange} error={errors.skills} info="Comma separated values (e.g. HTML,CSS,JS)" />
                <TextFieldGroup placeholder="Github Username" name="githubusername" value={this.state.githubusername} onChange={this.onChange} error={errors.githubusername} />
                <TextAreaFieldGroup placeholder="Short Bio" name="bio" value={this.state.bio} onChange={this.onChange} error={errors.bio} />

                <div className="mb-3">
                  <button type="button" onClick={() => this.setState(prev => ({ displaySocialInputs: !prev.displaySocialInputs }))} className="btn btn-light">
                    Add Social Network Links
                  </button>
                  <span className="text-muted ml-2">Optional</span>
                </div>

                {socialInputs}

                <input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateToProps, { createProfile })(withRouter(CreateProfile));
