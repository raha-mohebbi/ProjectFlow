import { MdOutlineLightMode } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-2">

      <div className="flex items-center gap-6">
        <p className="text-lg font-semibold">Projects</p>

        <div className="relative">
          <IoIosSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search everything..."
            className="w-72 rounded-lg border border-gray-200 py-1 pl-10 pr-4 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button>
          <MdOutlineLightMode size={22} />
        </button>

        <button>
          <IoNotificationsOutline size={22} />
        </button>

        <button className="rounded-lg bg-black px-4 py-1 text-white">
          + New Task
        </button>
      </div>

    </nav>
  );
};

export default Navbar;