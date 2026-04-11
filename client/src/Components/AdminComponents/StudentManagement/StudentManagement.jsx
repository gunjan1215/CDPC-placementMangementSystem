import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { TextField, Typography, Dialog, DialogContent, Button, Box, Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import StatusButton from "./StatusButton";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    width: "1000px",
    height: "500px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  textField: {
    width: "100%",
  },
  textArea: {
    width: "100%",
    flexGrow: 1,
    padding: "10px",
    fontFamily: "Nunito",
    fontSize: "16px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  customToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: "10px",
    "& .MuiButton-root": {
      border: "none",
    },
    "& .MuiButton-startIcon": {
      marginRight: "8px",
    },
  },
  customHeader: {
    backgroundColor: "#ebeae8",
    fontWeight: "bold",
    fontSize: "14px",
  },
}));

export default function StudentManagement({ onChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState({});
  const classes = useStyles();
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);

  const columns = [
    { field: "serialNumber", headerName: "Serial No", width: 80 },
    {
      field: "profilephoto",
      headerName: "Photo",
      width: 70,
      renderCell: (params) => (
        <Avatar 
          src={params.row.profilephoto ? `http://localhost:5000/uploads/${params.row.profilephoto}` : ""} 
          alt="User"
        />
      ),
    },
    { field: "firstname", headerName: "First Name", width: 140 },
    { field: "lastname", headerName: "Last Name", width: 100 },
    { field: "department", headerName: "Department", width: 165 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "mobno", headerName: "Mobile No", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <StatusButton
          status={params.row.status}
          onChange={(status) => handleStatusChange(params.row.email, status)}
        />
      ),
    },
    { field: "mcaaggregateCGPA", headerName: "MCA CGPA", width: 120 },
    { field: "activearrears", headerName: "Arrears", width: 100 },
    { field: "technicalskills", headerName: "Skills", width: 180 },
    {
      field: "resume",
      headerName: "Resume",
      width: 130,
      renderCell: (params) => (
        params.row.resume ? (
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => window.open(`http://localhost:5000/uploads/${params.row.resume}`, "_blank")}
          >
            View
          </Button>
        ) : (
          <Typography variant="caption" color="textSecondary">Not Uploaded</Typography>
        )
      ),
    },
  ];

  const fetchDepartmentName = async (departmentId) => {
    if (!departmentId) return "Not Assigned";
    try {
      const response = await axios.get(`http://localhost:5000/get-department-name/${departmentId}`);
      return response.data.departmentName;
    } catch (error) {
      console.error(`Error fetching department:`, error);
      return "N/A";
    }
  };

  const fetchUserAndCombineData = async () => {
    try {
      setLoading(true);
      
      const [personalRes, educationRes, skillsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/get-personal-details"),
        axios.get("http://localhost:5000/get-education-details"),
        axios.get("http://localhost:5000/get-skills-details"),
        axios.get("http://localhost:5000/get-students/get-students")
      ]);

      // 1. Convert responses to Arrays (handling null/undefined)
      const personalData = Array.isArray(personalRes.data) ? personalRes.data : [];
      const educationData = Array.isArray(educationRes.data) ? educationRes.data : [];
      const skillsData = Array.isArray(skillsRes.data) ? skillsRes.data : [];
      const studentBaseData = Array.isArray(usersRes.data) ? usersRes.data : [];

      // 2. Combine the data using Email as the key
      const combinedData = studentBaseData.map((user, index) => {
        // Find matching records in other collections
        const userEdu = educationData.find((ed) => ed.email === user.email) || {};
        const userSkill = skillsData.find((sk) => sk.email === user.email) || {};
        const userPers = personalData.find((ps) => ps.email === user.email) || {};
        
        return {
          // IMPORTANT: DataGrid MUST have a unique 'id' field
          id: user._id || user.email || `row-${index}`, 
          ...user,
          serialNumber: index + 1,
          ...userEdu,
          ...userPers,
          ...userSkill,
          // Ensure names don't disappear if personalData is missing
          firstname: userPers.firstname || user.firstname || "N/A",
          lastname: userPers.lastname || user.lastname || "N/A",
        };
      });

      // 3. Update the state
      setUsers(combinedData);
      console.log("Combined Data for Table:", combinedData); // Check your console!

    } catch (error) {
      console.error("Error merging student data:", error);
      setUsers([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndCombineData();
  }, []);

  const handleStatusChange = async (email, newStatus) => {
    try {
      await axios.post("http://localhost:5000/update-student-status/update-student-status", {
        email,
        newStatus,
      });
      fetchUserAndCombineData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleInputChange = (event) => {
    setFilter({
      ...filter,
      [event.target.name]: event.target.value,
    });
  };

  const filteredData = users.filter((userObj) => {
    return Object.keys(filter).every((key) => {
      const filterValue = (filter[key] || "").toLowerCase();
      if (!filterValue) return true;

      if (["tenthpercentage", "twelthpercentage", "ugpercentage", "activearrears", "mcaaggregateCGPA"].includes(key)) {
        const numericVal = Number(userObj[key] || 0);
        const filterNum = Number(filterValue);
        if (isNaN(filterNum)) return true;
        return numericVal >= filterNum;
      }

      return (userObj[key] || "").toString().toLowerCase().includes(filterValue);
    });
  });

  const handleSendNotification = async () => {
    try {
      await axios.post("http://localhost:5000/send-notification/send-notification", {
        email: selectedEmails,
        subject,
        message,
      });
      setSendDialogOpen(false);
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const CustomToolbar = () => (
    <GridToolbarContainer className={classes.customToolbar}>
      <GridToolbar />
      <Box>
        <Button variant="outlined" sx={{ mr: 1 }} onClick={() => setFilterDialogOpen(true)} startIcon={<FilterListIcon />}>
          Filters
        </Button>
        <Button variant="outlined" onClick={() => setSendDialogOpen(true)} startIcon={<NotificationsIcon />}>
          Notify
        </Button>
      </Box>
    </GridToolbarContainer>
  );

  return (
    <div className="my-5 mx-5">
      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)}>
        <DialogContent className={classes.dialogContent}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>FILTERS</Typography>
          <TextField onChange={handleInputChange} name="firstname" label="First Name" fullWidth sx={{ mb: 2 }} />
          <TextField onChange={handleInputChange} name="department" label="Department" fullWidth sx={{ mb: 2 }} />
          <TextField onChange={handleInputChange} name="activearrears" label="Min Active Arrears" type="number" fullWidth sx={{ mb: 2 }} />
          <TextField onChange={handleInputChange} name="mcaaggregateCGPA" label="Min MCA CGPA" type="number" fullWidth sx={{ mb: 2 }} />
          <Button onClick={() => setFilterDialogOpen(false)} variant="contained" fullWidth>Apply Filters</Button>
        </DialogContent>
      </Dialog>

      <Dialog maxWidth="md" fullWidth open={sendDialogOpen} onClose={() => setSendDialogOpen(false)}>
        <DialogContent>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>SEND NOTIFICATION</Typography>
          <TextField label="Subject" fullWidth value={subject} onChange={(e) => setSubject(e.target.value)} sx={{ mb: 2 }} />
          <TextareaAutosize className={classes.textArea} minRows={6} placeholder="Message body..." value={message} onChange={(e) => setMessage(e.target.value)} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setSendDialogOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" onClick={handleSendNotification}>Send</Button>
          </Box>
        </DialogContent>
      </Dialog>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <Typography variant="h6">Loading student records...</Typography>
        </Box>
      ) : (
        <DataGrid
          rows={filteredData}
          columns={columns.map((col) => ({ ...col, headerClassName: classes.customHeader }))}
          getRowId={(row) => row.id}
          pageSize={rowsPerPage}
          onPageSizeChange={(newSize) => setRowsPerPage(newSize)}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) => setSelectedEmails(newSelection)}
          components={{ Toolbar: CustomToolbar }}
          autoHeight
          sx={{ backgroundColor: "white", fontFamily: "Nunito", boxShadow: 2 }}
        />
      )}
    </div>
  );
}