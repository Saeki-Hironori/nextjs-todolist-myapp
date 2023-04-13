import React from "react";

import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import FilledInput from "@mui/material/FilledInput";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputEmail = (props: Props) => {
  const { value, onChange } = props;

  return (
    <FormControl sx={{ my: 2, width: "100%" }} variant="filled">
      <InputLabel htmlFor="filled-adornment-email">Email</InputLabel>
      <FilledInput
        id="filled-adornment-email"
        type="email"
        required
        fullWidth
        value={value}
        onChange={onChange}
        endAdornment={<InputAdornment position="end"></InputAdornment>}
        style={{ width: "auto" }}
      />
    </FormControl>
  );
};

export default InputEmail;
