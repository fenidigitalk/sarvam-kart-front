"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store, AppDispatch, RootState } from "./store";
import React, { useEffect } from "react";
import { fetchCurrentUser } from "./slices/authSlice";
import { useCart } from "@/context/cartContext";

function AuthInit({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { setCurrentUser } = useCart();

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    if (user) {
      setCurrentUser({ name: user.fullName || "User", email: user.phone + "@sarvam.in" });
    }
  }, [user, setCurrentUser]);

  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthInit>{children}</AuthInit>
    </Provider>
  );
}
