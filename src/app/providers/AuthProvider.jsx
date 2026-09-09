import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../../lib/supabase";
import { setAuth, clearAuth } from "../../store/slices/authSlice";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        dispatch(
          setAuth({
            user: data.session.user,
            session: data.session,
          })
        );
      }
    };

    getInitialSession();
  }, [dispatch]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        dispatch(
          setAuth({
            user: session.user,
            session: session,
          })
        );
      } else {
        dispatch(clearAuth());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return children;
};

export default AuthProvider;