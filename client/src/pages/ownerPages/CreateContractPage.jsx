import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAllContacts,
  createContract,
  clearAlert,
} from "../../features/ownerUser/ownerUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, AlertToast, ConfirmModal } from "../../components";
import { Button, CircularProgress, TextField, MenuItem } from "@mui/material";
import moment from "moment";
import contractImage from "../../assets/images/createContract.svg";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";

const CreateContractPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { realEstateId, title, price, slug } = location?.state; // state is passed from the previous page

  const { contacts, isProcessing, success, alertFlag, alertMsg, alertType } =
    useSelector((state) => state.ownerUser);

  useEffect(() => {
    dispatch(getAllContacts({ name: "" }));
  }, [dispatch]);

  const [contractForm, setContractFrom] = useState({
    tenant: "",
    realEstate: realEstateId,
    rentAmount: price,
    paymentPlan: "",
  });

  const [date, setDate] = useState(null);

  const handleChange = useCallback(
    (e) => {
      setContractFrom({ ...contractForm, [e.target.name]: e.target.value });
    },
    [contractForm]
  );

  const paymentPlans = [
    "Monthly",
    "Every 2 Months",
    "Every 3 Months",
    "Every 6 Months",
    "Every 12 Months",
  ];

  // Redirect to detail page of the property after successful contract creation
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/owner/real-estate/${slug}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, slug]);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  //modal
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const [formData, setFormData] = useState({});
  const handleConfirmation = (e) => {
    e.preventDefault();
    const { tenant, realEstate, rentAmount, paymentPlan } = contractForm;
    setFormData({
      tenant,
      realEstate,
      rentAmount,
      paymentPlan,
      startDate: moment(date).format("YYYY-MM").concat("-01"),
    });

    handleModalOpen();
  };

  const handleCreateContract = useCallback(() => {
    dispatch(createContract({ formData }));
    handleModalClose();
  }, [dispatch, formData, handleModalClose]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[90vh] bg-slate-100 py-8">
      <div className="w-full max-w-3xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Illustration (right on desktop, top on mobile) */}
        <div className="hidden md:flex flex-col justify-center items-center bg-[#223981] p-8 w-1/2">
          <img src={contractImage} alt="Contract Illustration" className="w-64 h-64 object-contain" />
        </div>
        <div className="flex-1 flex flex-col justify-center p-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: '#223981', letterSpacing: 1 }}>Create Contract</h1>
            <p className="text-gray-500 text-sm">Fill in the form below to create a contract</p>
          </div>
          <div className="mb-4 flex items-center justify-center gap-2">
            <h5 className="font-semibold">Real Estate Title:</h5>
            <h5 className="ml-2 text-[#223981] font-bold">{title}</h5>
          </div>
          <form id="form" onSubmit={handleConfirmation}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <TextField
                select
                required
                label="Tenant User"
                value={contractForm.tenant}
                onChange={handleChange}
                sx={{ width: "100%" }}
                name="tenant"
                color="primary"
              >
                {contacts?.map((user) => (
                  <MenuItem key={user._id} value={user._id} className="">
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
              </TextField>
              <DatePicker
                label="Contract Start Date"
                value={date}
                views={["year", "month"]}
                handleChange={useCallback(
                  (date) => {
                    setDate(date);
                  },
                  [setDate]
                )}
              />
              <TextField
                select
                required
                label="Payment Plan"
                value={contractForm.paymentPlan}
                onChange={handleChange}
                sx={{ width: "100%" }}
                name="paymentPlan"
                color="primary"
              >
                {paymentPlans.map((option, index) => (
                  <MenuItem key={index} value={option} className="">
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Rent Amount"
                value={contractForm.rentAmount}
                name="rentAmount"
                color="primary"
                sx={{ width: "100%" }}
                disabled
              />
            </div>
            <div className="text-center mt-6 mb-2">
              <Button
                disabled={isProcessing || (alertFlag && alertType === "success")}
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
        <h3 className="text-center">Confirm Contract?</h3>
        <p className="text-center my-4">Are you sure you want to create this contract? Once the contract is created, you will not be able to edit it. You can only delete it. The tenant will be notified of the contract creation.</p>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <Button onClick={handleModalClose} color="error">Close</Button>
          <Button onClick={handleCreateContract} color="success" variant="contained">Confirm</Button>
        </div>
      </ConfirmModal>
    </main>
  );
};

export default CreateContractPage;