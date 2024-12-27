import ButtonIcon from "../../ui/ButtonIcon.jsx";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import { useLogout } from "./useLogout.js";

function LogoutForm() {
  const { logout, isLoading } = useLogout();

  return (
    <ButtonIcon disabled={isLoading} onClick={logout}>
      {!isLoading ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
    </ButtonIcon>
  );
}

export default LogoutForm;
