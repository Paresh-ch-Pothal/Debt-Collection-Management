import { useEffect } from "react";
import { Toast } from "flowbite-react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

interface CustomToastProps {
  success: boolean;
  message: string;
  onClose: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({ success, message, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500); // 2.5 sec

    return () => clearTimeout(timer);
  }, [navigate, onClose]);

  return (
    <div className="fixed top-5 right-5 z-50">
      <Toast className={success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          {success ? (
            <HiCheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <HiXCircle className="h-6 w-6 text-red-600" />
          )}
        </div>
        <div className="ml-3 text-sm font-normal">{message}</div>
      </Toast>
    </div>
  );
};

export default CustomToast;
