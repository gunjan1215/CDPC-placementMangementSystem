import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const columns = [
  { field: "serialNumber", headerName: "Serial No", width: 80 },
  { field: "firstname", headerName: "First Name", width: 120 },
  { field: "lastname", headerName: "Last Name", width: 120 },
  { field: "department", headerName: "Department", width: 220 },
  { field: "gender", headerName: "Gender", width: 100 },
  { field: "email", headerName: "Email", width: 220 },
  { field: "mobno", headerName: "Mobile No", width: 150 },
];

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);

  // 1. Improved Department Fetch Function
  const fetchDepartmentName = async (departmentId) => {
    // If ID is null, undefined, or empty string, return N/A immediately
    if (!departmentId || departmentId === "undefined") return "Not Assigned";
    
    try {
      const response = await axios.get(`http://localhost:5000/get-department-name/${departmentId}`);
      return response.data.departmentName || "Not Assigned";
    } catch (error) {
      console.error(`Error fetching department name for ID ${departmentId}:`, error);
      return "Not Assigned"; 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/get-teachers");
        
        // Ensure response.data is an array
        const rawData = Array.isArray(response.data) ? response.data : [];

        const teacherDataPromises = rawData.map(async (teacher, index) => {
          // We wrap this in a sub-try-catch so one bad teacher record doesn't hide the whole list
          let deptName = "Not Assigned";
          try {
            deptName = await fetchDepartmentName(teacher.departmentId);
          } catch (e) {
            console.error("Mapping error for teacher:", teacher.email);
          }

          return {
            ...teacher,
            // DataGrid MUST have a unique 'id' field. Use _id from MongoDB or index
            id: teacher._id || `temp-id-${index}`, 
            serialNumber: index + 1,
            department: deptName,
          };
        });

        const resolvedTeacherData = await Promise.all(teacherDataPromises);
        setTeachers(resolvedTeacherData);
      } catch (error) {
        console.error("Error fetching teachers list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "70vh", 
      marginTop: "80px",
      padding: "20px"
    }}>
      <div style={{ height: 600, width: "95%" }}>
        <DataGrid
          rows={teachers}
          columns={columns}
          loading={loading}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20, 50]}
          pagination
          checkboxSelection
          disableSelectionOnClick
          components={{
            Toolbar: GridToolbar,
          }}
          sx={{
            backgroundColor: 'white',
            boxShadow: 3,
            borderRadius: '10px',
            border: '1px solid #e0e0e0',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
            },
          }}
        />
      </div>
    </div>
  );
}