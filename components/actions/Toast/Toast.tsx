import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Toast() {
  return (
    <ToastContainer
      position="top-right"
      transition={Slide}
      autoClose={10000}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}
