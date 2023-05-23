import React from "react";

type Props = {
  children: React.ReactNode;
};
const Layout = ({ children }: Props) => {
  return (
    <>
      <main>{children}</main>
      <footer className="fixed bottom-0 left-0 w-full text-center shadow-[0_0_10px_0px_#0004] py-3 bg-base-100">
        Warp Anomaly Powered
      </footer>
    </>
  );
};

export default Layout;
