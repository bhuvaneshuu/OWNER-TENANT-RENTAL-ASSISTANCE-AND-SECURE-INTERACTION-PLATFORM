import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSavedRealEstate } from "../../features/realEstateTenant/realEstateTenantSlice";
import { PageLoading, RealEstateCard, Footer } from "../../components";

const SavedRealEstate = () => {
  const { allRealEstate, isLoading } = useSelector(
    (store) => store.realEstateTenant
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSavedRealEstate());
  }, [dispatch]);

  if (isLoading) return <PageLoading />;

  if (allRealEstate?.length === 0)
    return (
      <h1 className="text-center mt-8 mb-6 font-heading">
        No Real Estate Saved
      </h1>
    );

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white pb-10 mb-12 mt-8">
        <h3 className="my-10 font-heading font-extrabold text-3xl text-left text-[#223981] drop-shadow-lg ml-10">
          Saved Properties
        </h3>
        <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl p-8 flex flex-wrap gap-8 justify-start animate-fadein-scale mx-auto">
          {allRealEstate?.map((item) => {
            return <RealEstateCard key={item._id} {...item} />;
          })}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SavedRealEstate;
