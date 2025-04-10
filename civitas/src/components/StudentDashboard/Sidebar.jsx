function SidebarItem({ data }) {
  return (
    <li
      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-200/70 transition-colors duration-200 cursor-pointer group"
    >
      {/* Avatar: image or letter */}
      {data.avatarImg ? (
        <img
          src={data.avatarImg}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
        />
      ) : (
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shadow-md ${data.avatarColor}`}
        >
          {data.title?.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Title and Section */}
      <div className="flex flex-col truncate">
        <span className="font-medium text-sm text-gray-900 truncate group-hover:underline">
          {data.title}
        </span>
        <span className="text-xs text-gray-500 truncate">
          {data.section}
        </span>
      </div>
    </li>
  );
}

export default SidebarItem;
