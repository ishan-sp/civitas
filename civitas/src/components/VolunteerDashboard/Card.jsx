import { Link } from "react-router-dom";
import {
  Globe,
  MapPin,
  Users,
  Info,
  User,
  Link2,
} from "lucide-react";

export default function Card({ ngo = {} }) {
  const {
    ngoName,
    regionsOfOperation,
    missionStatement,
    primaryContact,
    contactRole,
    website,
    instagram,
    facebook,
    linkedin,
    youtube,
    typeOfNGO,
  } = ngo;

  const socials = {
    instagram,
    facebook,
    linkedin,
    youtube,
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 max-w-md flex flex-col justify-between hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="mb-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-800">{ngoName}</h2>
          <span className="text-sm text-yellow-600 font-semibold bg-yellow-100 px-2 py-1 rounded-lg">
            {typeOfNGO}
          </span>
        </div>

        <div className="flex items-center text-gray-600 mt-1 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          {regionsOfOperation}
        </div>
      </div>

      {/* Mission */}
      <div className="mb-4">
        <h3 className="text-sm text-gray-700 font-medium mb-1 flex items-center">
          <Info className="w-4 h-4 mr-1" />
          Mission
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">{missionStatement}</p>
      </div>

      {/* Contact Info */}
      <div className="mb-4 text-sm text-gray-700">
        <div className="flex items-center mb-1">
          <User className="w-4 h-4 mr-2" />
          <span className="font-medium">{primaryContact}</span> &mdash;{" "}
          <span className="ml-1 text-gray-500">{contactRole}</span>
        </div>

        {/* Website */}
        {website && (
          <div className="flex items-center mt-1">
            <Globe className="w-4 h-4 mr-2 text-blue-500" />
            <a
              href={website}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Website
            </a>
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="flex gap-3 mb-4">
        {Object.entries(socials).map(
          ([platform, link]) =>
            link && (
              <a
                key={platform}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition"
              >
                <Link2 className="w-4 h-4" />
              </a>
            )
        )}
      </div>

      {/* Association Link */}
      <Link
        to="/associate"
        state={{ ngo }}
        className="w-full text-center bg-yellow-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
      >
        Associate with this NGO
      </Link>
    </div>
  );
}
