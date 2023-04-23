import axios from "axios";
import { toast } from "react-toastify";

export const register = async (inputValues: any) => {
  await axios
    .post("/api/accounts/register", inputValues)
    .then((res: any) => {
      console.log(res);
      toast.success(`${res?.message}`);
    })
    .catch((err: any) => {
      console.log(err);
    });
};
