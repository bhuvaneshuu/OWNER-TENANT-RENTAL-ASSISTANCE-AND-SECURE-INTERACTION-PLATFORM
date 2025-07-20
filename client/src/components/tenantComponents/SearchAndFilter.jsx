import { Box, TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem, Button, Divider } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const SearchAndFilter = ({
  handleSearchSubmit,
  handleValueChange,
  clearFilter,
  search,
  category,
  lowerLimit,
  upperLimit,
}) => {
  const categories = [
    "all",
    "House",
    "Apartment",
    "Room",
    "Shop Space",
    "Office Space",
  ];
  return (
    <form onSubmit={handleSearchSubmit}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          my: 6,
        }}
      >
        <TextField
          name="search"
          type="text"
          placeholder="Enter an address, neighborhood, city, or ZIP code"
          variant="outlined"
          value={search}
          onChange={handleValueChange}
          fullWidth
          sx={{
            maxWidth: 600,
            background: "#fff",
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
              fontSize: 20,
              paddingRight: 0,
            },
            '& input': {
              padding: '18px 20px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e0e0e0',
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" type="submit" sx={{ mr: 1 }}>
                  <SearchRoundedIcon sx={{ fontSize: 28 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Divider sx={{ maxWidth: 600, mx: "auto", mb: 0.5 }} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          flexWrap: { xs: "wrap", sm: "nowrap" },
          width: "100%",
          maxWidth: 600,
          mx: "auto",
          mb: 2,
          mt: 0,
          pt: 0,
          p: 1.5,
          background: "#f5faff",
          borderRadius: 3,
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            name="category"
            value={category}
            label="Category"
            onChange={handleValueChange}
          >
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box component="span" sx={{ fontWeight: 500, fontSize: 14 }}>Price</Box>
          <TextField
            type="number"
            name="lowerLimit"
            size="small"
            value={lowerLimit}
            onChange={handleValueChange}
            inputProps={{ min: 0 }}
            sx={{ width: 70 }}
            placeholder="Min"
          />
          <Box component="span" sx={{ fontSize: 14 }}>to</Box>
          <TextField
            type="number"
            name="upperLimit"
            size="small"
            value={upperLimit}
            onChange={handleValueChange}
            inputProps={{ min: 0 }}
            sx={{ width: 70 }}
            placeholder="Max"
          />
        </Box>
        <Button
          size="small"
          variant="contained"
          type="submit"
          sx={{
            background: "#1976d2",
            color: "#fff",
            minWidth: 80,
            '&:hover': { background: '#115293' },
          }}
        >
          Apply
        </Button>
        <Button
          variant="outlined"
          onClick={clearFilter}
          size="small"
          sx={{
            minWidth: 80,
            color: "#1976d2",
            borderColor: "#1976d2",
            '&:hover': {
              borderColor: '#115293',
              color: '#115293',
              background: '#e3f2fd',
            },
          }}
        >
          Clear
        </Button>
      </Box>
    </form>
  );
};

export default SearchAndFilter;
