import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { app } from "../firebase";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { headingS } from "../styles";

const fireStore = getFirestore(app);
const DetailForm = () => {
  const phoneRegExp = "/^[0-9]{12}$/";
  const aadReg = "^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$";
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(6, "Username must be at least 6 characters")
      .max(20, "Username must not exceed 20 characters"),
    mobile: Yup.string().matches(/^[6-9]\d{9}$/, {
      message: "Please enter valid number.",
      excludeEmptyString: false,
    }),
    age: Yup.mixed().test(
      "date-or-age",
      "Invalid date or age",
      function (value) {
        if (
          typeof value === "string" &&
          /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)
        ) {
          // validate date string in "DD/MM/YYYY" format
          return Yup.date().isValidSync(value, { format: "DD/MM/YYYY" });
        } else if (
          typeof value === "string" &&
          parseInt(value) > 0 &&
          parseInt(value) < 100
        ) {
          // validate positive integer as age in years
          return true;
        } else {
          return false;
        }
      }
    ),
    gender: Yup.mixed().test(
      "male-or-female",
      "Please select gender",
      function (value) {
        return typeof (value === "string") && value !== "" ? true : false;
      }
    ),
    IdType: Yup.string()
      .oneOf(["Aadhar", "PAN"])
      .required("Please select an ID type"),
    govtidnumber: Yup.string()
      .test(
        "is-alphanumeric-or-numeric",
        "Invalid ID number",
        (value, { parent }) => {
          // Check if the selected ID type is PAN and the value is alphanumeric
          if (
            parent.IdType === "PAN" &&
            /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)
          ) {
            return true;
          }
          // Check if the selected ID type is Aadhar and the value is only numeric
          if (parent.IdType === "Aadhar" && /^[0-9]\d{11}$/.test(value)) {
            return true;
          }
          return false;
        }
      )
      .required("Please enter your ID number"),
    emergcontact: Yup.string().matches(/^[6-9]\d{9}$/, {
      message: "Please enter valid number.",
      excludeEmptyString: false,
    }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    const formData = JSON.stringify(data);
    const d = await addDoc(collection(fireStore, "patientData"), {
      ...data,
    });
    if (d.id != "") {
      alert("Data saved successfully");
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="personalDetails">
          <h4 style={headingS}>Personal Details</h4>
          <div className="flex ">
            <div className="flex flex-col w-2/5">
              <label className="flex justify-start">
                <span className="w-1/5">
                  Name<span className="text-red-500">*</span>
                </span>
                <div className=" form-group w-3/4">
                  <input
                    name="username"
                    type="text"
                    placeholder="Enter name"
                    {...register("username")}
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.username?.message}
                  </div>
                </div>
              </label>
              <label className="flex  mt-2 justify-start">
                <span className="w-1/5">Mobile</span>
                <div className=" form-group ">
                  <input
                    name="mobile"
                    type="text"
                    placeholder="Enter mobile"
                    {...register("mobile")}
                    className={`form-control ${
                      errors.mobile ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.mobile?.message}
                  </div>
                </div>
              </label>
            </div>
            <div className="flex flex-wrap ml-4 w-3/5">
              <label className="flex justify-start w-3/5">
                <span className="">
                  Date of Birth or Age<span className="text-red-500">*</span>
                </span>
                <div className="ml-4 form-group w-full">
                  <input
                    name="age"
                    type="text"
                    placeholder="DD/MM/YYYY or Age in Years"
                    {...register("age")}
                    className={`form-control ${errors.age ? "is-invalid" : ""}`}
                  />
                  <div className="invalid-feedback">{errors.age?.message}</div>
                </div>
              </label>
              <label className="flex pl-4 justify-start">
                <span className="">
                  Sex<span className="text-red-500">*</span>
                </span>
                <select
                  {...register("gender")}
                  onChange={(e) => e.target.value}
                  name="gender"
                  className={`ml-4 w-48 border-1 border-gray-300 rounded-lg ${
                    errors.gender ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>

              <label className="flex  justify-start w-full">
                <span className="">Govt Issued ID</span>
                <select
                  {...register("IdType")}
                  name="IdType"
                  onChange={(e) => e.target.value}
                  className={`ml-4 w-48 border-1 border-gray-300 rounded-lg ${
                    errors.IdType ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <option value="">ID Type</option>
                  <option value="Aadhar">Aadhar</option>
                  <option value="PAN">PAN</option>
                </select>
                <div className="invalid-feedback">{errors.IdType?.message}</div>
                <div className="form-group ml-4 w-2/5">
                  <input
                    name="govtidnumber"
                    type="text"
                    placeholder="Enter Govt ID"
                    {...register("govtidnumber")}
                    className={`form-control ${
                      errors.govtidnumber ? "is-invalid" : ""
                    }`}
                  />

                  <div className="invalid-feedback">
                    {errors.govtidnumber?.message}
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="contactDetails mt-2">
          <h4 style={headingS}>Contact Details</h4>
          <div className="flex">
            <label className="flex  justify-start ">
              <span className="">Guardian Details</span>
              <select
                {...register("guardianLabel")}
                onChange={(e) => e.target.value}
                className="ml-4 w-48 border-1 border-gray-300 rounded-lg"
              >
                <option value="">Enter Label</option>
                <option value="Father">Father</option>
              </select>
              <div className="form-group ml-4">
                <input
                  name="guardian"
                  type="text"
                  placeholder="Enter Guardian Name"
                  {...register("guardianName")}
                  className="form-control"
                />
              </div>
            </label>
            <label className="flex justify-start pl-4">
              <span className="">Email</span>
              <div className="ml-4 form-group ">
                <input
                  name="email"
                  type="text"
                  placeholder="Enter Email"
                  {...register("email")}
                  className="form-control"
                />
              </div>
            </label>
            <label className="flex pl-4 justify-start">
              <span className="">Emergency Contact Number</span>
              <div className="ml-4 form-group ">
                <input
                  name="emergcontact"
                  type="text"
                  placeholder="Enter Emergency No"
                  {...register("emergcontact")}
                  className={`form-control ${
                    errors.emergcontact ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.emergcontact?.message}
                </div>
              </div>
            </label>
          </div>
        </div>
        <div className="contactDetails mt-2">
          <h4 style={headingS}>Address Details</h4>
          <div className="flex ">
            <div className="flex flex-col w-2/5 justify-start">
              <label className="flex ">
                <span className="w-1/5">Address</span>
                <div className=" form-group w-4/5">
                  <input
                    name="address"
                    type="text"
                    placeholder="Enter Address"
                    {...register("address")}
                    className="form-control"
                  />
                </div>
              </label>
              <label className="flex  mt-2 justify-start">
                <span className="w-1/5">Country</span>
                <div className="form-group">
                  <input
                    name="country"
                    type="text"
                    placeholder="Enter Country"
                    {...register("country")}
                    className="form-control"
                  />
                </div>
              </label>
            </div>
            <div className="flex flex-wrap w-3/5">
              <label className="flex w-1/2 justify-start">
                <span className="pl-4">State</span>
                <select
                  {...register("state")}
                  onChange={(e) => e.target.value}
                  className="ml-4 w-60 border-1 border-gray-300 rounded-lg"
                >
                  <option value="">Enter State</option>
                  <option value="Haryana">Haryana</option>
                </select>
              </label>
              <label className="flex ml-4 justify-start">
                <span className="">CIty</span>
                <select
                  {...register("city")}
                  onChange={(e) => e.target.value}
                  className="ml-4 w-48 border-1 border-gray-300 rounded-lg"
                >
                  <option value="">Enter City/Town Village</option>
                  <option value="Palwal">Palwal</option>
                </select>
              </label>
              <label className="flex mt-2 justify-start">
                <span className="">Pincode</span>
                <div className="ml-4 form-group w-3/4">
                  <input
                    name="pincode"
                    type="text"
                    placeholder="Enter Pincode"
                    {...register("pincode")}
                    className="form-control"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="contactDetails mt-2">
          <h4 style={headingS}>Other Details</h4>
          <div className="flex flex-wrap">
            <label className="flex justify-start w-1/4">
              <span className="w-2/5">Occupation</span>
              <div className="form-group w-4/5">
                <input
                  name="occupation"
                  type="text"
                  placeholder="Enter Occupation"
                  {...register("occupation")}
                  className="form-control"
                />
              </div>
            </label>

            <label className="flex w-1/4 pl-4">
              <span className="w-1/4">Religion</span>
              <select
                {...register("religion")}
                onChange={(e) => e.target.value}
                className="ml-4 w-60 border-1 border-gray-300 rounded-lg"
              >
                <option value="">Enter Religion</option>
                <option value="HIndu">Hindu</option>
              </select>
            </label>

            <label className="flex w-1/4 pl-4 justify-start">
              <span className="">Marital Status</span>
              <select
                {...register("maritalStatus")}
                onChange={(e) => e.target.value}
                className="ml-4 w-44 border-1 border-gray-300 rounded-lg"
              >
                <option value="">Enter Marital Status</option>
                <option value="Married">Married</option>
                <option value="Unmarried">Unmarried</option>
              </select>
            </label>
            <label className="flex w-1/4 pl-4 justify-start">
              <span className="">Blood Group</span>
              <select
                {...register("bloodGroup")}
                onChange={(e) => e.target.value}
                className="ml-4 w-32 border-1 border-gray-300 rounded-lg"
              >
                <option value="">Group</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </label>

            <label className="flex  mt-2 w-1/4 justify-start">
              <span className="">Nationality</span>
              <div className=" ml-4 form-group w-1/2">
                <input
                  name="nationality"
                  type="text"
                  placeholder="Enter Nationality"
                  {...register("nationality")}
                  className="form-control"
                />
              </div>
            </label>
          </div>
        </div>

        <div className="form-group w-full flex justify-end">
          <button
            type="button"
            className="p-3 border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white rounded-lg"
            onClick={() => reset()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="p-3 bg-green-600 text-white border-green-600 hover:bg-green-700 rounded-lg ml-4"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default DetailForm;
