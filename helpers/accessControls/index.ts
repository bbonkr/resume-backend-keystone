import { BaseListTypeInfo } from "@keystone-6/core/types";
import { Session } from "../../types/Session";
import { UserData } from "../../types/UserData";
import { BaseAccessArgs } from "@keystone-6/core/dist/declarations/src/types/config/access-control";

const isAdmin = ({ session }: { session: Session }) =>
  session?.data.isAdmin ?? false;

const isUser = ({ session, item }: { session: Session; item: UserData }) =>
  session?.data.id == item.id;

const isAuthorized = ({ session }: { session: Session }) =>
  Boolean(session?.data?.id);

const filterMyInfo = ({ session }: { session: Session }) => {
  if (session?.data.isAdmin) {
    return true;
  }

  if (session?.data?.id) {
    return {
      id: {
        equals: session?.data.id,
      },
    };
  }

  return false;
};

const filterOwnedItems = ({ session }: { session: Session }) => {
  if (session?.data?.isAdmin) {
    return true;
  }

  if (session?.data?.id) {
    return {
      owner: {
        id: {
          equals: session?.data.id,
        },
      },
    };
  }

  return false;
};

const filterByOwner = ({ session }: { session: Session }) => {
  if (session?.data?.isAdmin ?? true) {
    return true;
  }
  if (session?.data?.id) {
    return {
      owner: {
        id: {
          equals: session.data.id,
        },
      },
    };
  }

  return false;
};

const filterByAuthor = ({ session }: { session: Session }) => {
  if (session?.data?.isAdmin ?? true) {
    return true;
  }
  if (session) {
    return {
      author: {
        id: {
          equals: session.data?.id,
        },
      },
    };
  }

  return false;
};

const accessControls = {
  isAdmin,
  isAuthorized,
  filterMyInfo,
  filterOwnedItems,
  filterByOwner,
  filterByAuthor,
};

export default accessControls;
