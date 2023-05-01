import * as React from "react";
import Link from "next/link";

const MyLogo = () => {
  return (
    <Link href="/">
      <h3>Resume Management</h3>
    </Link>
  );
};

export const components = {
  Logo: MyLogo,
};
