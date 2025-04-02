import axiosConfig from "../axios";
export const apiGetAllUser = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "GET",
        url: "/users",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiGetUserById = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "GET",
        url: "/users/getUserById/" + id,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiDeleteUserById = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "DELETE",
        url: "/users/delete/" + id,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiGetCurrent = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "GET",
        url: "/users/get-current",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiGetMyDeposit = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "GET",
        url: "/users/myDeposit",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiGetAllDeposit = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "GET",
        url: "/users/deposit",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiUpdatedUser = (id, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "PUT",
        url: "/users/update/" + id,
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiCreateUser = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "POST",
        url: "/users/create/",
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiUpdateMaxWithdrawLimit = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "POST",
        url: "/users/updateMaxWithdrawLimit",
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiUpdatedDesposit = (id, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "PUT",
        url: "/users/update/desposit/" + id,
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiUpdatedWithDrawAndDeposit = (id, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "PUT",
        url: "/users/updateMoney/" + id,
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiUpdatedStatus = (WithDraw, userId, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "PUT",
        url: `/users/updateStatus/${WithDraw}/${userId}`,
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
