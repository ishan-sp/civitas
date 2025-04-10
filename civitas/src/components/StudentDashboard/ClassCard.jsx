import { FaEllipsisV } from "react-icons/fa";
import { FaFolderOpen, FaRegImage } from "react-icons/fa6";

export default function ClassCard({ data }) {
  const avatarLetter = data.title?.charAt(0).toUpperCase() || "?";

  return (
    <div className="w-[360px] h-[400px] bg-white/60 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out relative overflow-hidden">
      
      {/* Top Banner */}
      <div className={`h-32 relative px-6 py-5 ${data.bannerColor} text-white rounded-b-xl`}>
        <div className="flex justify-between items-start">
          <div className="pr-14">
            <h2 className="font-bold text-xl tracking-tight leading-tight">
              {data.title}
            </h2>
            <p className="text-sm opacity-90 italic">{data.section}</p>
          </div>
          <FaEllipsisV className="text-white text-sm cursor-pointer hover:rotate-90 transition-transform duration-300" />
        </div>

        {/* Avatar */}
        {data.avatarImg ? (
          <img
            src={data.avatarImg}
            alt="Avatar"
            className="absolute bottom-[-30px] right-6 w-[64px] h-[64px] rounded-xl border-4 border-white object-cover shadow-lg"
          />
        ) : (
          <div
            className={`absolute bottom-[-30px] right-6 w-[64px] h-[64px] rounded-xl border-4 border-white shadow-lg flex items-center justify-center text-white text-xl font-bold ${data.avatarColor}`}
          >
            {avatarLetter}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-12 pb-4 px-6 text-gray-800">
        <p className="text-sm font-semibold tracking-wide">
          Instructor: <span className="font-medium">{data.teacher}</span>
        </p>
      </div>

      {/* Divider */}
      <hr className="mx-6 border-gray-300" />

      {/* Footer Icons */}
      <div className="px-6 py-4 flex justify-between items-center text-gray-500">
        <span className="text-xs text-gray-400 italic">Resources</span>
        <div className="flex gap-5 text-lg">
          <FaRegImage className="cursor-pointer hover:text-indigo-600 transition-colors" />
          <FaFolderOpen className="cursor-pointer hover:text-indigo-600 transition-colors" />
        </div>
      </div>
    </div>
  );
}
