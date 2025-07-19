import { useEffect } from "react";
import { getAllRentDetailsOwnerView } from "../../features/rentDetailOwner/rentDetailOwnerSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { PageLoading, RentDetailComponent, Footer } from "../../components";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const AllRentDetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allRentDetails, isLoading } = useSelector(
    (state) => state.rentDetailOwner
  );

  useEffect(() => {
    dispatch(getAllRentDetailsOwnerView());
  }, [dispatch]);

  if (isLoading) return <PageLoading />;

  if (allRentDetails?.length === 0)
    return (
      <div className="flex flex-col items-center h-screen mt-12 gap-4">
        <h1 className="text-center">No rent details found</h1>
        <Button
          variant="contained"
          onClick={() => navigate("/owner/rentDetail/create")}
          sx={{ backgroundColor: '#223981', color: '#fff', fontWeight: 600, borderRadius: 2, px: 3, py: 1.5, '&:hover': { backgroundColor: '#1a2a5c' } }}
          startIcon={<AddCircleOutlineIcon />}
        >
          Create Rent Detail
        </Button>
      </div>
    );

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-[90vh] bg-slate-100 py-8">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 px-8 py-10 relative">
          {/* Create Button */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h1 className="text-3xl font-extrabold mb-4 md:mb-0" style={{ color: '#223981', letterSpacing: 1 }}>Rent Details</h1>
            <Button
              variant="contained"
              onClick={() => navigate("/owner/rentDetail/create")}
              sx={{ backgroundColor: '#223981', color: '#fff', fontWeight: 600, borderRadius: 2, px: 3, py: 1.5, '&:hover': { backgroundColor: '#1a2a5c' } }}
              startIcon={<AddCircleOutlineIcon />}
            >
              Create Rent Detail
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allRentDetails?.map((rentDetail) => (
              <RentDetailComponent key={rentDetail._id} {...rentDetail} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AllRentDetailPage;
