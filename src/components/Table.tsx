import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  dob: string;
  salary: string;
  joiningDate: string;
  relievingDate: string;
  contact: string;
  status: string;
  _id: string;
}

const Table = ({
  setIsModalVisible,
  refetch,
  setRefetch,
  setEmployeeId,
  setMode,
}: {
  setIsModalVisible: (isModalVisible: boolean) => void;
  refetch: boolean;
  setRefetch: (refetch: boolean) => void;
  setEmployeeId: (employeeId: string) => void;
  setMode: (mode: "create" | "edit") => void;
}) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/employees`
        );
        setEmployees(response.data.DATA);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [refetch]);

  const handleEditEmployee = (id: string) => {
    setEmployeeId(id);
    setIsModalVisible(true);
    setMode("edit");
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/employee/${id}`
      );

      if (response.data.STATUS === "SUCCESS") {
        toast.success(response.data.MESSAGE);

        setRefetch(!refetch);
      } else {
        toast.error(response.data.MESSAGE);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return employees && employees.length >= 1 ? (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              Name
            </th>
            <th scope="col" className="p-4">
              DOB
            </th>
            <th scope="col" className="p-4">
              Salary
            </th>
            <th scope="col" className="p-4">
              Joining Date
            </th>
            <th scope="col" className="p-4">
              Relieving Date
            </th>
            <th scope="col" className="p-4">
              Contact
            </th>
            <th scope="col" className="p-4">
              Status
            </th>
            <th scope="col" className="p-4">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee: FormData) => {
            return (
              <tr
                key={employee._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="p-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {employee.name}
                </th>
                <td className="p-4">
                  {dayjs(employee.dob).format("DD-MMMM-YYYY")}
                </td>
                <td className="p-4">{employee.salary}</td>
                <td className="p-4">
                  {dayjs(employee.joiningDate).format("DD-MMMM-YYYY")}
                </td>
                <td className="p-4">
                  {dayjs(employee.relievingDate).format("DD-MMMM-YYYY")}
                </td>
                <td className="p-4">{employee.contact}</td>
                <td className="p-4">{employee.status}</td>
                <td className="p-4 text-right flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEditEmployee(employee._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteEmployee(employee._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="red"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <p>No Employees to show.</p>
  );
};

export default Table;
