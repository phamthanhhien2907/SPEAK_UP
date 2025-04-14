import { CreateUserModal } from "../modals/user-modal/create-user-modal";
import { DeleteUserModal } from "../modals/user-modal/delete-user-modal";
import { EditUserModal } from "../modals/user-modal/edit-user-modal";

const ModalProvider = () => {
  return (
    <>
      <CreateUserModal />
      <EditUserModal />
      <DeleteUserModal />
    </>
  );
};

export default ModalProvider;
