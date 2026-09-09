import { FiSettings, FiLogOut } from "react-icons/fi";

const UserMenuModal = ({ onClose, onLogout, userMenuRef }) => {
  return (
    <div ref={userMenuRef} className="absolute bottom-20 left-4 z-50 w-52">
      <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
        {/* Profile Settings */}
        <button
          onClick={onClose}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
        >
          <FiSettings size={17} />
          Profile Settings
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-800 transition hover:bg-red-50"
        >
          <FiLogOut size={17} className="text-red-800" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserMenuModal;
