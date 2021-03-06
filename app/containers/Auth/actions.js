/*
 *
 * Auth actions
 *
 */

import {
  LOGIN_FAIL,
  LOGIN_REQ,
  LOGIN_SUCCESS,
  REGISTER_REQ,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  VERIFICATION_REQUEST,
  VERIFICATION_REQUEST_SUCCESS,
  VERIFICATION_REQUEST_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_REQUEST_SUCCESS,
  FORGOT_PASSWORD_REQUEST_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_REQUEST_SUCCESS,
  RESET_PASSWORD_REQUEST_FAIL,
} from './constants';

export function loginReq(data) {
  return {
    type: LOGIN_REQ,
    data,
  };
}

export function loginSuccess() {
  return {
    type: LOGIN_SUCCESS,
  };
}

export function loginFail(error) {
  return {
    type: LOGIN_FAIL,
    error,
  };
}

export function registerReq(data) {
  return {
    type: REGISTER_REQ,
    data,
  };
}

export function registerSuccess() {
  return {
    type: REGISTER_SUCCESS,
  };
}

export function registerFail(error) {
  return {
    type: REGISTER_FAIL,
    error,
  };
}

export function verificationRequest(code) {
  return {
    type: VERIFICATION_REQUEST,
    code,
  };
}

export function verificationRequestSuccess() {
  return {
    type: VERIFICATION_REQUEST_SUCCESS,
  };
}

export function verificationRequestFail(error) {
  return {
    type: VERIFICATION_REQUEST_FAIL,
    error,
  };
}

export function forgotPasswordRequest(email) {
  return {
    type: FORGOT_PASSWORD_REQUEST,
    email,
  };
}

export function forgotPasswordRequestSuccess() {
  return {
    type: FORGOT_PASSWORD_REQUEST_SUCCESS,
  };
}

export function forgotPasswordRequestFail(error) {
  return {
    type: FORGOT_PASSWORD_REQUEST_FAIL,
    error,
  };
}

export function resetPasswordRequest(data) {
  return {
    type: RESET_PASSWORD_REQUEST,
    data,
  };
}

export function resetPasswordRequestSuccess() {
  return {
    type: RESET_PASSWORD_REQUEST_SUCCESS,
  };
}

export function resetPasswordRequestFail(error) {
  return {
    type: RESET_PASSWORD_REQUEST_FAIL,
    error,
  };
}
