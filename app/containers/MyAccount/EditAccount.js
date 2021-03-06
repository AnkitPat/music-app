import {yupResolver} from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, {memo} from 'react';
import {Button, Card, Col, Form, Image} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {createStructuredSelector} from 'reselect';
import * as Yup from 'yup';
import Select from 'react-select';
import ButtonLoader from '../../components/ButtonLoader';
import {useInjectReducer} from '../../utils/injectReducer';
import {useInjectSaga} from '../../utils/injectSaga';
import {getGenres} from '../Album/actions';
import albumReducer from '../Album/reducer';
import albumSaga from '../Album/saga';
import {makeSelectGenres} from '../Album/selectors';
import {
  makeSelectInfluencerDetails,
  makeSelectUserDetails,
} from '../App/selectors';
import {getSocialChannelsRequest} from '../Influencer/actions';
import influencerReducer from '../Influencer/reducer';
import influencerSaga from '../Influencer/saga';
import {
  updateRegularUser,
  updateUserDetailsAction,
  fetchUsersCountriesAction,
} from './actions';
import EditInfluencerAccount from './EditInfluencerAccount';
import styles from './index.styles';
import accountReducer from './reducer';
import accountSaga from './saga';
import {
  makeSelectUpdateProcessing,
  makeSelectUserCountries,
} from './selectors';
import PaperCard from '../../components/PaperCard';
import '../../components/InputPhone/index.scss';
import {useHistory} from "react-router-dom";

const EditAccount = ({
                       userDetails,
                       influencerProfile,
                       genres,
                       getSocialChannelList,
                       updateUserDetails,
                       updateProcessing,
                       getGenreList,
                       regularUserUpdate,
                       fetchUsersCountries,
                       countries,
                     }) => {
  useInjectReducer({key: 'influencer', reducer: influencerReducer});
  useInjectSaga({key: 'influencer', saga: influencerSaga});

  useInjectSaga({key: 'album', saga: albumSaga});
  useInjectReducer({key: 'album', reducer: albumReducer});
  useInjectSaga({key: 'account', saga: accountSaga});
  useInjectReducer({key: 'account', reducer: accountReducer});
  const [data, setData] = React.useState({});
  const [coverPhoto, setCoverPhoto] = React.useState({});

  let history = useHistory()

  React.useEffect(() => {
    getGenreList();
    getSocialChannelList();
    fetchUsersCountries();
  }, []);

  function handleFileChange(event) {
    const {target} = event;
    const {files} = target;

    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = event1 => {
        setData(event1.target.result);
      };

      reader.readAsDataURL(files[0]);
    }
  }

  function handleCoverFileChange(event) {
    const {target} = event;
    const {files} = target;

    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = event1 => {
        setCoverPhoto(event1.target.result);
      };

      reader.readAsDataURL(files[0]);
    }
  }

  const isInfluencer =
    (userDetails &&
      userDetails.roleId === 1 &&
      userDetails.influencerId !== undefined) ||
    false;

  const validationSchema = Yup.object().shape((userDetails && userDetails.roleId === 2) ? {
    name: Yup.string()
      .required('Name is required')
      .test(
        'space',
        'Name is required',
        val => val.trim().toString().length > 0,
      )
      .test(
        'min',
        'Name must have 5 characters atleast',
        val => val.trim().toString().length > 4,
      )
      .test(
        'max',
        'Name should have atmost 50 characters',
        val => val.trim().toString().length < 51,
      ),
    phone: Yup.string()
      .required('Phone is required')
      .min(10, 'Phone number should contain minimum 10 digits')
      .max(15, 'Phone number should contain atmost 15 digits'),
    publicPhone: Yup.string().matches(/^[0-9\- ]{10,15}$/, {
      message: 'Phone number should be atleast 10 and atmost 15 digits',
      excludeEmptyString: true,
    }),
    publicEmail: Yup.string().email('Email is invalid'),
    managementEmail: Yup.string().email('Email is invalid'),
    bookingEmail: Yup.string().email('Email is invalid'),
    facebook: Yup.string().url('Invalid Url address'),
    twitter: Yup.string().url('Invalid Url address'),
    instagram: Yup.string().url('Invalid Url address'),
    youtube: Yup.string().url('Invalid Url address'),
  } : {
    name: Yup.string()
      .required('Name is required')
      .test(
        'space',
        'Name is required',
        val => val.trim().toString().length > 0,
      )
      .test(
        'min',
        'Name must have 5 characters atleast',
        val => val.trim().toString().length > 4,
      )
      .test(
        'max',
        'Name should have atmost 50 characters',
        val => val.trim().toString().length < 51,
      ),
    phone: Yup.string()
      .required('Phone is required')
      .min(10, 'Phone number should contain minimum 10 digits')
      .max(15, 'Phone number should contain atmost 15 digits'),
  });

  const {register, handleSubmit, errors, reset, control, getValues} = useForm(
    {
      resolver: yupResolver(validationSchema),
    },
  );

  const onSubmit = submitData => {
    if (userDetails.roleId === 1) {
      regularUserUpdate(
        {...submitData, profilePhoto: data},
        Object.keys(data).length > 0,
      );
    } else {
      updateUserDetails(
        {
          ...submitData,
          profilePhoto: data,
          countryId: (submitData.countryId && submitData.countryId.id) || '',
          coverPhotoLocal: coverPhoto,
        },
        Object.keys(data).length > 0,
        Object.keys(coverPhoto).length > 0,
      );
    }

    // const updatedUserDetails = {
    //   ...userDetails,
    //   ...submitData,
    //   profilePhoto: data,
    //   coverPhotoLocal: coverPhoto
    // };
    // updateUserDetails(updatedUserDetails, Object.keys(data).length > 0, Object.keys(coverPhoto).length > 0);
  };

  React.useEffect(() => {
    const tempFullGenre = [];
    influencerProfile &&
    Object.keys(influencerProfile).length > 0 &&
    influencerProfile.influencerGenres.map(generToSearch => {
      const index = genres.findIndex(
        genre => genre.id === generToSearch.genreId,
      );
      if (index !== -1) tempFullGenre.push(genres[index]);
      return true;
    });
    reset({
      ...userDetails.artistInformation,
      countryId: userDetails.artistInformation
        ? userDetails.artistInformation.country
        : null,
      ...userDetails,
      ...prepareData(influencerProfile),
      genres: tempFullGenre,
    });
  }, [userDetails && influencerProfile]);
  const customStyles = {
    option: provided => ({
      ...provided,
      color: 'black',
    }),
    control: provided => ({
      ...provided,
      color: 'black',
      backgroundColor: '#020f1f',
    }),
    singleValue: provided => ({
      ...provided,
      color: 'white',
    }),
    menu: provided => ({...provided, zIndex: 9999}),
  };
  const prepareData = influencerProfileInner => {
    if (
      influencerProfileInner &&
      Object.keys(influencerProfileInner).length === 0
    )
      return {};
    let dataInner = {...influencerProfileInner};
    delete dataInner.name;

    influencerProfileInner.influencerServices.map(service => {
      dataInner = {
        ...dataInner,
        [service.socialChannels.title]: {
          price: service.price,
          followers: service.followers,
          link: service.link,
        },
      };
      return true;
    });

    return dataInner;
  };

  const cancelSubmit = () => {
    history.push("/myaccount")
  }

  return (
    <PaperCard title="Edit Account">
      <div className="row">
        <div className="col-md-8">
          <div className="card bg-dark">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridDiscription">
                    <label htmlFor="name">Name</label>
                    <input
                      name="name"
                      placeholder="Name"
                      className={`form-control ${
                        errors.name ? 'is-invalid' : ''
                      }`}
                      ref={register}
                    />
                    <div className="invalid-feedback">
                      {errors.name && errors.name.message}
                    </div>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridDiscription">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="number"
                      name="phone"
                      placeholder="Phone"
                      className={` phone_field form-control ${
                        errors.phone ? 'is-invalid' : ''
                      }`}
                      ref={register}
                      onKeyDown={(event) => {
                        if (event.key == "." || event.key === "-"|| event.key === "e") {
                          event.preventDefault();
                        }
                      }}

                    />
                    <div className="invalid-feedback">
                      {errors.phone && errors.phone.message}
                    </div>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridDiscription">
                    <div style={styles.imageContainer}>
                      {(userDetails && userDetails.avatar) ||
                      Object.keys(data).length !== 0 ? (
                        <Image
                          width={120}
                          height={120}
                          src={
                            Object.keys(data).length === 0
                              ? userDetails
                                ? userDetails.avatar
                                : ''
                              : data
                          }
                          roundedCircle
                        />
                      ) : (
                        <></>
                      )}
                      <label htmlFor="fileImage">Upload Avatar</label>
                      <input
                        id="fileImage"
                        accept="image/*"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </div>
                  </Form.Group>
                </Form.Row>
                {userDetails.roleId === 2 && (
                  <>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridDiscription">
                        <label htmlFor="biography">Biography</label>
                        <textarea
                          name="biography"
                          placeholder="Biography"
                          className={`form-control ${
                            errors.biography ? 'is-invalid' : ''
                          }`}
                          ref={register}
                        />
                        <div className="invalid-feedback">
                          {errors.biography && errors.biography.message}
                        </div>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridDiscription">
                        <label htmlFor="publicPhone">Public Phone</label>
                        <input
                          name="publicPhone"
                          //   type="number"
                          placeholder="Public Phone"
                          className={`form-control ${
                            errors.publicPhone ? 'is-invalid' : ''
                          }`}
                          ref={register}
                        />
                        <div className="invalid-feedback">
                          {errors.publicPhone && errors.publicPhone.message}
                        </div>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridDiscription">
                        <div style={styles.imageContainer}>
                          {(userDetails &&
                            userDetails.artistInformation &&
                            userDetails.artistInformation.coverPhoto) ||
                          Object.keys(coverPhoto).length !== 0 ? (
                            <Image
                              width={120}
                              height={120}
                              src={
                                Object.keys(coverPhoto).length === 0
                                  ? userDetails.artistInformation
                                    ? userDetails.artistInformation.coverPhoto
                                    : ''
                                  : coverPhoto
                              }
                              roundedCircle
                            />
                          ) : (
                            <></>
                          )}
                          <label htmlFor="fileImageCoverPhoto">
                            Upload cover photo
                          </label>
                          <input
                            id="fileImageCoverPhoto"
                            accept="image/*"
                            type="file"
                            onChange={handleCoverFileChange}
                          />
                        </div>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridDiscription">
                        <label htmlFor="publicEmail">Public Email</label>
                        <input
                          name="publicEmail"
                          placeholder="Public Email"
                          className={`form-control ${
                            errors.publicEmail ? 'is-invalid' : ''
                          }`}
                          ref={register}
                        />
                        <div className="invalid-feedback">
                          {errors.publicEmail && errors.publicEmail.message}
                        </div>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridDiscription">
                        <label htmlFor="managementEmail">Management Email</label>
                        <input
                          name="managementEmail"
                          placeholder="Management Email"
                          className={`form-control ${
                            errors.managementEmail ? 'is-invalid' : ''
                          }`}
                          ref={register}
                        />
                        <div className="invalid-feedback">
                          {errors.managementEmail &&
                          errors.managementEmail.message}
                        </div>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridDiscription">
                        <label htmlFor="bookingEmail">Booking Email</label>
                        <input
                          name="bookingEmail"
                          placeholder="Booking Email"
                          className={`form-control ${
                            errors.bookingEmail ? 'is-invalid' : ''
                          }`}
                          ref={register}
                        />
                        <div className="invalid-feedback">
                          {errors.bookingEmail && errors.bookingEmail.message}
                        </div>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridDiscription">
                        <label htmlFor="recordLabelManager">
                          Record label manager
                        </label>
                        <input
                          name="recordLabelManager"
                          placeholder="Record Label manager"
                          className={`form-control ${
                            errors.recordLabelManager ? 'is-invalid' : ''
                          }`}
                          ref={register}
                        />
                        <div className="invalid-feedback">
                          {errors.recordLabelManager &&
                          errors.recordLabelManager.message}
                        </div>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridDescription">
                        <label htmlFor="facebook">Facebook</label>
                        <input
                          name="facebook"
                          placeholder="Facebook"
                          className={`form-control ${
                            errors.facebook ? 'is-invalid' : ''
                          }`}
                          ref={register}
                        />
                        <div className="invalid-feedback">
                          {errors.facebook && errors.facebook.message}
                        </div>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridDescription">
                        <label htmlFor="twitter">Twitter</label>
                        <input
                          name="twitter"
                          placeholder="Twitter"
                          className={`form-control ${
                            errors.twitter ? 'is-invalid' : ''
                          }`}
                          ref={register}
                        />
                        <div className="invalid-feedback">
                          {errors.twitter && errors.twitter.message}
                        </div>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridDescription">
                        <label htmlFor="instagram">Instagram</label>
                        <input
                          name="instagram"
                          placeholder="Instagram"
                          className={`form-control ${
                            errors.instagram ? 'is-invalid' : ''
                          }`}
                          ref={register}
                        />
                        <div className="invalid-feedback">
                          {errors.instagram && errors.instagram.message}
                        </div>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridDescription">
                        <label htmlFor="youtube">Youtube</label>
                        <input
                          name="youtube"
                          placeholder="Youtube"
                          className={`form-control ${
                            errors.youtube ? 'is-invalid' : ''
                          }`}
                          ref={register}
                        />
                        <div className="invalid-feedback">
                          {errors.youtube && errors.youtube.message}
                        </div>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridDiscription">
                        <label htmlFor="location">Location</label>
                        <Controller
                          name="countryId"
                          styles={customStyles}
                          control={control}
                          isMulti={false}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          options={countries}
                          defaultValue=""
                          as={Select}
                        />
                        <div className="invalid-feedback">
                          {errors.countryId && errors.countryId.message}
                        </div>
                      </Form.Group>
                    </Form.Row>
                  </>
                )}
                {updateProcessing ? (
                  <ButtonLoader/>
                ) : (
                  <Button type="submit" variant="success">
                    Submit
                  </Button>
                )}
                <Button variant="danger" type="button" className="ml-3" onClick={cancelSubmit}>
                  Cancel
                </Button>
              </form>
            </div>
          </div>
          {isInfluencer && (
            <div className="mt-3">
              <EditInfluencerAccount/>
            </div>
          )}
        </div>
      </div>
    </PaperCard>
  );
};

EditAccount.propTypes = {
  getGenreList: PropTypes.func,
  userDetails: PropTypes.any,
  influencerProfile: PropTypes.any,
  genres: PropTypes.array,
  updateUserDetails: PropTypes.func,
  updateProcessing: PropTypes.bool,
  getSocialChannelList: PropTypes.func,
  fetchUsersCountries: PropTypes.func,
  countries: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  userDetails: makeSelectUserDetails(),
  influencerProfile: makeSelectInfluencerDetails(),
  genres: makeSelectGenres(),
  updateProcessing: makeSelectUpdateProcessing(),
  countries: makeSelectUserCountries(),
});

function mapDispatchToProps(dispatch) {
  return {
    getGenreList: () => dispatch(getGenres()),
    getSocialChannelList: () => dispatch(getSocialChannelsRequest()),
    updateUserDetails: (data, isProfilePhotoUpdated, isCoverPhotoUpdated) =>
      dispatch(
        updateUserDetailsAction(
          data,
          isProfilePhotoUpdated,
          isCoverPhotoUpdated,
        ),
      ),
    regularUserUpdate: (data, isProfilePhotoUpdated) =>
      dispatch(updateRegularUser(data, isProfilePhotoUpdated)),
    fetchUsersCountries: () => dispatch(fetchUsersCountriesAction()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(EditAccount);
