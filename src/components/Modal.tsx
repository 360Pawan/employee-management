import axios from "axios";
import dayjs from "dayjs";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { formState } from "../config/initial";
import { FormData } from "../config/types";

const Modal = ({
  isModalVisible,
  setIsModalVisible,
  refetch,
  setRefetch,
  employeeId,
  mode,
  setMode,
}: {
  isModalVisible: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
  refetch: boolean;
  setRefetch: (refetch: boolean) => void;
  employeeId: string;
  mode: "create" | "edit";
  setMode: (mode: "create" | "edit") => void;
}) => {
  const [formData, setFormData] = useState<FormData>(formState);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!employeeId || mode === "create") {
      setFormErrors({});
      setFormData(formState);
      return;
    }
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/employee/${employeeId}`
        );
        setFormData(response.data.DATA);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployee();
  }, [employeeId, mode]);

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "string" && !value.trim()) {
        errors[key as keyof FormData] = `${key} cannot be empty`;
      }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contact)) {
      errors.contact = "Invalid email format";
    }

    const salaryNumber = parseFloat(formData.salary);
    if (isNaN(salaryNumber) || salaryNumber < 1) {
      errors.salary = "Salary must be a number and cannot be less than 1";
    }

    const dobDate = new Date(formData.dob);
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 1);

    if (dobDate >= eighteenYearsAgo) {
      errors.dob = "Date of Birth must be at least 1 years.";
    }

    const joiningDate = new Date(formData.joiningDate);
    const relievingDate = new Date(formData.relievingDate);

    if (joiningDate >= relievingDate) {
      errors.joiningDate = "Joining date must be before relieving date";
      errors.relievingDate = "Relieving date must be after joining date";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        let response;

        if (mode === "create") {
          response = await axios.post(
            `${import.meta.env.VITE_API_URL}/employee`,
            formData
          );
        } else if (mode === "edit" && employeeId) {
          response = await axios.put(
            `${import.meta.env.VITE_API_URL}/employee/${employeeId}`,
            formData
          );
        }

        setIsLoading(false);

        if (response && response.data.STATUS === "SUCCESS") {
          toast.success(response.data.MESSAGE);

          setIsModalVisible(false);
          setFormData(formState);
          setRefetch(!refetch);
          setMode("create");
        } else {
          response && toast.error(response.data.MESSAGE);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error creating employee:", error);
      }
    }
  };

  const handleModalClose = (e: React.SyntheticEvent) => {
    e.stopPropagation();

    setIsModalVisible(false);
    setMode("create");
    setFormData(formState);
    setFormErrors({});
  };

  return (
    <div
      id="authentication-modal"
      tabIndex={-1}
      aria-hidden={isModalVisible ? false : true}
      className={`${
        isModalVisible ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
    >
      <div
        className={`${
          isModalVisible ? "" : "hidden"
        } fixed inset-0 z-10 bg-blue-100`}
        onClick={handleModalClose}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-full max-w-xl max-h-full z-20">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add employee details
            </h3>
            <button
              type="button"
              className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="authentication-modal"
              onClick={handleModalClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5">
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <p className="text-red-500 text-xs mt-2">
                  {formErrors.name ? formErrors.name : null}
                </p>
              </div>
              <div>
                <label
                  htmlFor="dob"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="dd/mm/yyyy"
                  value={
                    mode === "create"
                      ? formData.dob
                      : dayjs(formData.dob).format("YYYY-MM-DD")
                  }
                  onChange={handleInputChange}
                />
                <p className="text-red-500 text-xs mt-2">
                  {formErrors.dob ? formErrors.dob : null}
                </p>
              </div>
              <div>
                <label
                  htmlFor="salary"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  id="salary"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="000000"
                  value={formData.salary}
                  onChange={handleInputChange}
                />
                <p className="text-red-500 text-xs mt-2">
                  {formErrors.salary ? formErrors.salary : null}
                </p>
              </div>
              <div>
                <label
                  htmlFor="joiningDate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Joining Date
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  id="joiningDate"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="dd/mm/yyyy"
                  value={
                    mode === "create"
                      ? formData.joiningDate
                      : dayjs(formData.joiningDate).format("YYYY-MM-DD")
                  }
                  onChange={handleInputChange}
                />
                <p className="text-red-500 text-xs mt-2">
                  {formErrors.joiningDate ? formErrors.joiningDate : null}
                </p>
              </div>
              <div>
                <label
                  htmlFor="dob"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Relieving Date
                </label>
                <input
                  type="date"
                  name="relievingDate"
                  id="relievingDate"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="dd/mm/yyyy"
                  value={
                    mode === "create"
                      ? formData.relievingDate
                      : dayjs(formData.relievingDate).format("YYYY-MM-DD")
                  }
                  onChange={handleInputChange}
                />
                <p className="text-red-500 text-xs mt-2">
                  {formErrors.relievingDate ? formErrors.relievingDate : null}
                </p>
              </div>
              <div>
                <label
                  htmlFor="dob"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Contact (email)
                </label>
                <input
                  type="email"
                  name="contact"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="email@email.com"
                  value={formData.contact}
                  onChange={handleInputChange}
                />
                <p className="text-red-500 text-xs mt-2">
                  {formErrors.contact ? formErrors.contact : null}
                </p>
              </div>
              <div>
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                  Status
                </h3>
                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                    <div className="flex items-center ps-3">
                      <input
                        id="active"
                        type="radio"
                        name="status"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 dark:bg-gray-600 dark:border-gray-500 rou"
                        value="active"
                        checked={formData.status === "active"}
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="active"
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Active
                      </label>
                    </div>
                  </li>
                  <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                    <div className="flex items-center ps-3">
                      <input
                        id="inactive"
                        type="radio"
                        name="status"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 dark:bg-gray-600 dark:border-gray-500"
                        value="inactive"
                        checked={formData.status === "inactive"}
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="inactive"
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Inactive
                      </label>
                    </div>
                  </li>
                </ul>
                <p className="text-red-500 text-xs mt-2">
                  {formErrors.status ? formErrors.status : null}
                </p>
              </div>
              {isLoading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Submit Details
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
