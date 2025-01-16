import { toast, ToastPosition } from "react-toastify";

// Common configuration for all toast types
const toastConfig = {
  position: "top-right" as ToastPosition, // Explicitly set type
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Toast functions
export const showToast = (
  type: "success" | "error" | "info" | "warning",
  message: string,
  config = {}
) => {
  toast[type](message, { ...toastConfig, ...config });
};
