import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }) {
  const [count, setCount] = useState(0); //count request dang chay
  const show = () => setCount((c) => c + 1);
  const hide = () => setCount((c) => Math.max(c - 1, 0));
  return (
    <LoadingContext.Provider value={{ show, hide, loading: count > 0 }}>
      {children}
    </LoadingContext.Provider>
  );
}
export default LoadingContext;
