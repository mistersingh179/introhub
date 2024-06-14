import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const useUrlToTriggerOpen = (
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  openingParamName: string,
  openingParamValue: string,
) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (
      openingParamValue &&
      searchParams.get(openingParamName) === openingParamValue
    ) {
      console.log("in useUrlToTriggerOpen, setting open to true");
      setOpen(true);
      const params = new URLSearchParams(searchParams);
      params.delete(openingParamName);
      console.log("in useUrlToTriggerOpen, replacing url with param gone from url");
      replace(`${pathName}?${params.toString()}`);
      console.log("in useUrlToTriggerOpen, replaced url");
    }
  }, [searchParams, openingParamName, openingParamValue, setOpen, replace]);
};

export default useUrlToTriggerOpen;
