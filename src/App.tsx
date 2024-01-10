import { useState } from "react";
import Modal from "./components/Modal";
import Table from "./components/Table";

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [mode, setMode] = useState<"create" | "edit">("create");

  const handleAddEmployee = () => {
    setIsModalVisible(true);
    setMode("create");
  };

  return (
    <main className="container py-10 mx-auto flex min-h-screen justify-start items-center flex-col gap-5">
      <div className="w-full flex gap-5 justify-between items-start">
        <div className="">
          <h1 className="text-2xl font-medium">Employee management system</h1>
          <h3 className="text-lg">Employee list</h3>
        </div>
        <button
          type="button"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={handleAddEmployee}
        >
          Add Employee
        </button>
      </div>
      <Table
        setIsModalVisible={setIsModalVisible}
        refetch={refetch}
        setRefetch={setRefetch}
        setEmployeeId={setEmployeeId}
        setMode={setMode}
      />
      <Modal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        refetch={refetch}
        setRefetch={setRefetch}
        employeeId={employeeId}
        mode={mode}
        setMode={setMode}

      />
    </main>
  );
}

export default App;
