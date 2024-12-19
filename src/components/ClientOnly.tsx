import type React from "react";
import { useEffect, useState } from "react";

type ClientOnlyProps = {
  children: React.ReactNode;
};

const ClientOnly = ({ children }: ClientOnlyProps) => {
  const [client, setClient] = useState(false);
  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) return null;

  return { children };
};

export default ClientOnly;
