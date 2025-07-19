import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPersonalRealEstate } from "../../features/realEstateOwner/realEstateOwnerSlice";
import { Footer, RealEstateCard } from "../../components";
import { Button, Pagination, CircularProgress } from "@mui/material";

const Homepage = () => {
  const dispatch = useDispatch();

  const { allRealEstate, isLoading, numberOfPages } = useSelector(
    (store) => store.realEstateOwner
  );

  // state to store page number
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getPersonalRealEstate({ page }));
  }, [dispatch, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (allRealEstate?.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-[#223981] via-blue-200 to-slate-100 py-12">
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-12 max-w-xl w-full flex flex-col items-center">
          <h4 className="mb-4 text-2xl font-bold text-[#223981]">You have not posted any properties</h4>
        </div>
      </div>
    );
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-[#223981] via-blue-200 to-slate-100 py-12">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-slate-200 px-8 py-10 flex flex-col items-center">
          <div className="flex flex-col items-center mb-8">
            <h3 className="text-3xl md:text-4xl font-extrabold mb-2 text-[#223981] tracking-wide flex items-center gap-2">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8 text-[#223981]' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10l9-7 9 7v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z' /></svg>
              Your {allRealEstate?.length > 1 ? "Properties" : "Property"}
            </h3>
            <p className="text-gray-500 text-base mb-2">Manage your properties with ease and style.</p>
          </div>
          {isLoading ? (
            <div className="flex justify-center mt-12 h-64 mx-auto">
              <CircularProgress size={80} />
            </div>
          ) : (
            <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {allRealEstate?.map((item) => {
                return <RealEstateCard key={item._id} {...item} fromOwnerUser />;
              })}
            </main>
          )}
          <Pagination
            count={numberOfPages || 1}
            page={page}
            onChange={handlePageChange}
            color="secondary"
            className="flex justify-center mt-10"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#223981',
                fontWeight: 600,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: '#223981',
                  color: '#fff',
                },
              },
            }}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
