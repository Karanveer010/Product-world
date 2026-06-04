import { signOutSuccess } from "../redux/slices/userDataSlice";
import { clearCart } from "../redux/slices/cartSlice";

export const handleSignOut = (dispatch: any): void => {
  try {
    
    dispatch(signOutSuccess());
    dispatch(clearCart());
  } catch (error) {
    
  }
};
