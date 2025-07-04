import axios from "axios";
import { Navigate, useNavigate } from "react-router";
import { toast } from "react-toastify";

export const handleError = (error: any) => {
    const navigate = useNavigate();
    
  if (axios.isAxiosError(error)) {
    var err = error.response;
    if (Array.isArray(err)) {
      for (let val of err?.data.errors) {
        toast.warning(val.description);
      }
    } else if (Array.isArray(err?.data)) {
        for (let e of err?.data!) {
          toast.warning(e.description);
        }
    } else if (err?.data) {
      toast.warning(err.data);
    } else if (err?.status === 401) {
      toast.warning("Please Login");
      navigate("/login", { replace: true });
    } 
    else if (err?.status === 400) {
        toast.warning("Please Login");
        navigate("/login", { replace: true });
      }
    else if (err) {
      toast.warning(err?.data);
    }
  }
};