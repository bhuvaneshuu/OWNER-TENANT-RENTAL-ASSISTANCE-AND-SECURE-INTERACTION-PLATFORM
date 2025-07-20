import { useEffect, useState } from "react";
import { getAllContacts } from "../../features/tenantUser/tenantUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { Footer, ContactsCard } from "../../components";
import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const AllContacts = () => {
  const dispatch = useDispatch();
  const { contacts, isLoading } = useSelector((state) => state.tenantUser);

  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(getAllContacts({ name: "" }));
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setName(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(getAllContacts({ name }));
  };

  return (
    <>
      <main className="min-h-screen bg-[#f4f7fa] py-10 px-4">
        <h3 className="font-heading font-extrabold text-2xl text-[#223981] mb-6 ml-2">Contacts</h3>
        <form onSubmit={handleSearchSubmit} className="mb-6 max-w-lg ml-2">
          <FormControl color="tertiary" sx={{ width: "100%" }} variant="outlined">
            <OutlinedInput
              color="tertiary"
              name="search"
              type="text"
              size="small"
              placeholder="Search"
              value={name}
              onChange={handleSearchChange}
              sx={{
                background: "#f4f7fa",
                borderRadius: 999,
                px: 2,
                boxShadow: 'none',
                border: 'none',
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton edge="end" type="submit">
                    <SearchRoundedIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </form>
        <div className="flex flex-col gap-3 max-w-2xl ml-2">
          {isLoading ? (
            <div className="flex justify-center mt-12 h-96">
              <CircularProgress size={"4rem"} />
            </div>
          ) : (
            <>
              {contacts?.length === 0 ? (
                <h3 className="text-left mt-8 mb-6 text-gray-400">Contact not found</h3>
              ) : (
                <>
                  {contacts?.map((user) => {
                    return <ContactsCard key={user._id} {...user} tenant />;
                  })}
                </>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AllContacts;