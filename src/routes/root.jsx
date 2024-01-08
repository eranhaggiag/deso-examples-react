import { configure } from "deso-protocol";
import { useContext } from "react";
import { DeSoIdentityContext } from "react-deso-protocol";
import { Outlet } from "react-router-dom";
import { Nav } from "../components/nav";

configure({
  spendingLimitOptions: {
    CreatorCoinOperationLimitMap: {
      "" :{
        "any" : 10000
      }
      
    },
    GlobalDESOLimit: 10000000000, // 0.01 DESO
    TransactionCountLimitMap: {
      SUBMIT_POST: "UNLIMITED",
      CREATOR_COIN: "UNLIMITED",
    },
    },
  },
);

export const Root = () => {
  const { isLoading } = useContext(DeSoIdentityContext);

  return (
    <>
      <Nav />
      <div role="main" className="main-content">
        {isLoading ? <div>Loading...</div> : <Outlet />}
      </div>
    </>
  );
};
