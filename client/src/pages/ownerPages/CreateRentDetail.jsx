import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createRentDetail,
  clearAlert,
} from "../../features/rentDetailOwner/rentDetailOwnerSlice";
import { getOwnerAllContracts } from "../../features/ownerUser/ownerUserSlice";
import { AlertToast, ConfirmModal, PageLoading } from "../../components";
import { Button, CircularProgress, TextField, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import createRentImage from "../../assets/images/createRentImage.svg";
import { calculateAddedDate } from "../../utils/valueFormatter";

const CreateRentDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { success, isProcessing, alertFlag, alertMsg, alertType } = useSelector(
    (state) => state.rentDetailOwner
  );

  const { allContracts, isLoading } = useSelector((state) => state.ownerUser);

  const [contractForm, setContractFrom] = useState({
    tenant: "",
    realEstate: "",
    rentAmount: "",
    paymentPlan: "",
    startDate: "",
    endDate: "",
    tenantName: "",
  });

  useEffect(() => {
    dispatch(getOwnerAllContracts());
  }, [dispatch]);

  useEffect(() => {
    if (contractForm.realEstate) {
      const selectedContract = allContracts?.find(
        (contract) => contract.realEstate._id === contractForm.realEstate
      );

      if (
        selectedContract?.tenant?._id &&
        /^[a-f\d]{24}$/i.test(selectedContract.tenant._id)
      ) {
        setContractFrom((prev) => ({
          ...prev,
          tenant: selectedContract.tenant._id,
          rentAmount: selectedContract.rentAmount,
          startDate: selectedContract.startDate,
          paymentPlan: selectedContract.paymentPlan,
          endDate: calculateAddedDate(
            selectedContract.paymentPlan,
            selectedContract.startDate
          ),
          tenantName: `${selectedContract.tenant.firstName} ${selectedContract.tenant.lastName}`,
        }));
      } else {
        setContractFrom((prev) => ({
          ...prev,
          tenant: "",
          tenantName: "Invalid tenant",
        }));
      }
    }
  }, [contractForm.realEstate, allContracts]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/owner/rentDetail");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleChange = useCallback(
    (e) => {
      setContractFrom((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleAlertClose = useCallback((event, reason) => {
    if (reason !== "clickaway") dispatch(clearAlert());
  }, [dispatch]);

  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const [formData, setFormData] = useState({});
  const handleConfirmation = (e) => {
    e.preventDefault();

    if (!contractForm.tenant || !/^[a-f\d]{24}$/i.test(contractForm.tenant)) {
      alert("Invalid tenant ID. Please reselect a valid contract.");
      return;
    }

    if (!contractForm.endDate) {
      alert("Please enter a valid end date.");
      return;
    }

    setFormData({
      tenant: contractForm.tenant,
      realEstate: contractForm.realEstate,
      monthlyRent: contractForm.rentAmount,
      paymentPlan: contractForm.paymentPlan,
      contractTerms: "Rent is payable on or before the 5th of every month.",
      status: "Pending",
      startDate: contractForm.startDate,
      endDate: contractForm.endDate,
    });

    handleModalOpen();
  };
  
  const handleCreateRentDetail = useCallback(() => {
    const finalEndDate = contractForm.endDate || calculateAddedDate(contractForm.paymentPlan, contractForm.startDate);
  
    const finalFormData = {
      tenant: contractForm.tenant,
      realEstate: contractForm.realEstate,
      monthlyRent: contractForm.rentAmount,
      paymentPlan: contractForm.paymentPlan,
      contractTerms: "Rent is payable on or before the 5th of every month.",
      status: "Pending",
      startDate: contractForm.startDate,
      endDate: finalEndDate,
    };
  
    dispatch(createRentDetail(finalFormData));
    handleModalClose();
  }, [dispatch, contractForm, handleModalClose]);
  
  return (
    <main className="flex flex-col items-center justify-center min-h-[90vh] bg-slate-100 py-8">
      <div className="w-full max-w-3xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Illustration (right on desktop, top on mobile) */}
        <div className="hidden md:flex flex-col justify-center items-center bg-[#223981] p-8 w-1/2">
          <img src={createRentImage} alt="Rent Illustration" className="w-64 h-64 object-contain" />
        </div>
        <div className="flex-1 flex flex-col justify-center p-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: '#223981', letterSpacing: 1 }}>Create Rent Detail</h1>
            <p className="text-gray-500 text-sm">Fill in the form below to create the rent detail</p>
          </div>
          <form onSubmit={handleConfirmation}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <h5 className="text-gray-700 mb-3 font-semibold flex items-center gap-1">
                  <HomeWorkRoundedIcon fontSize="small" /> Select Your Eligible Real Estate
                </h5>
                <TextField
                  select
                  required
                  label="Eligible Real Estate"
                  value={contractForm.realEstate}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                  name="realEstate"
                  color="primary"
                >
                  {allContracts?.map((contract) => (
                    <MenuItem key={contract._id} value={contract.realEstate._id}>
                      {contract.realEstate.title}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div>
                <h5 className="text-gray-700 mb-3 font-semibold flex items-center gap-1">
                  <InfoRoundedIcon fontSize="small" /> Contract Details
                </h5>
                <div className="flex flex-col gap-4">
                  <TextField
                    label="Tenant"
                    value={contractForm.tenantName}
                    color="primary"
                    sx={{ width: "100%" }}
                    disabled
                  />
                  <TextField
                    label="Contract Start Date"
                    value={contractForm.startDate}
                    name="startDate"
                    color="primary"
                    sx={{ width: "100%" }}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                  <TextField
                    label="Payment Plan"
                    value={contractForm.paymentPlan}
                    name="paymentPlan"
                    color="primary"
                    sx={{ width: "100%" }}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                  <TextField
                    label="Rent Amount"
                    value={contractForm.rentAmount}
                    name="rentAmount"
                    color="primary"
                    sx={{ width: "100%" }}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                  <TextField
                    label="End Date"
                    value={contractForm.endDate}
                    name="endDate"
                    color="primary"
                    sx={{ width: "100%" }}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="text-center mt-6 mb-2">
              <Button
                disabled={isProcessing}
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#223981',
                  color: 'white',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  py: 1.5,
                  px: 6,
                  '&:hover': {
                    backgroundColor: '#1a2a5c',
                  },
                }}
                startIcon={<BorderColorRoundedIcon />}
              >
                {isProcessing ? (
                  <CircularProgress size={26} sx={{ color: "#fff" }} />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <AlertToast alertFlag={alertFlag} alertMsg={alertMsg} alertType={alertType} handleClose={handleAlertClose} />
      <ConfirmModal open={open} handleModalClose={handleModalClose}>
        <h3 className="text-center">Create Rent Detail</h3>
        <p className="text-center my-4">Are you sure you want to create this rent detail? You won't be able to undo this action.</p>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <Button onClick={handleModalClose} color="error">Close</Button>
          <Button onClick={handleCreateRentDetail} color="success" variant="contained">Confirm</Button>
        </div>
      </ConfirmModal>
    </main>
  );
};

export default CreateRentDetail;