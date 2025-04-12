import React from "react";
import { Link } from "react-router-dom";

const NGOAssociate = ({ ngo }) => {
  if (!ngo)
    return (
      <div className="text-center text-gray-600 text-xl font-medium py-10">
        No NGO selected
      </div>
    );

  const {
    ngoName,
    registrationNumber,
    regionsOfOperation,
    website,
    instagram,
    facebook,
    youtube,
    linkedin,
    missionStatement,
    programDetails,
    primaryContact,
    contactRole,
    email,
    phone,
    address,
    alternateContact,
    registrationCertificate,
    proofOfAddress,
    taxExemptionCertificate,
    panTanDetails,
    auditReport,
    impactMetrics,
    volunteerCount,
    volunteerRoles,
    programDescription,
    fundingDetails,
    typeOfNGO,
  } = ngo;

  const socialMediaLinks = [
    { label: "Instagram", value: instagram },
    { label: "Facebook", value: facebook },
    { label: "YouTube", value: youtube },
    { label: "LinkedIn", value: linkedin },
  ].filter((link) => link.value);

  const documentLinks = [
    { label: "Registration Certificate", value: registrationCertificate },
    { label: "Proof of Address", value: proofOfAddress },
    { label: "Tax Exemption Certificate", value: taxExemptionCertificate },
    { label: "PAN/TAN Details", value: panTanDetails },
    { label: "Audit Report", value: auditReport },
  ].filter((doc) => doc.value);

  return (
    <div className="bg-white text-gray-800 p-10 rounded-2xl max-w-4xl mx-auto shadow-xl border border-gray-200 space-y-8">
      <header>
        <h1 className="text-5xl font-bold text-gray-900 mb-3">{ngoName}</h1>
        <p className="text-xl text-gray-600 italic">{missionStatement}</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
        <div className="space-y-3">
          <p><span className="font-semibold">Registration #:</span> {registrationNumber}</p>
          <p><span className="font-semibold">Regions:</span> {regionsOfOperation?.join(", ")}</p>
          <p><span className="font-semibold">Website:</span>{" "}
            <a href={website} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{website}</a>
          </p>
          <p><span className="font-semibold">Type:</span> {typeOfNGO}</p>
          <p><span className="font-semibold">Funding:</span> {fundingDetails}</p>
        </div>

        <div className="space-y-3">
          <p><span className="font-semibold">Primary Contact:</span> {primaryContact} ({contactRole})</p>
          <p><span className="font-semibold">Email:</span> {email}</p>
          <p><span className="font-semibold">Phone:</span> {phone}</p>
          <p><span className="font-semibold">Alternate Contact:</span> {alternateContact || "—"}</p>
          <p><span className="font-semibold">Address:</span> {address}</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Programs & Impact</h2>
        <div className="space-y-2 text-lg">
          <p><strong>Details:</strong> {programDetails}</p>
          <p><strong>Description:</strong> {programDescription}</p>
          <p><strong>Impact Metrics:</strong> {impactMetrics || "—"}</p>
          <p><strong>Volunteers:</strong> {volunteerCount || "—"}</p>
          <p><strong>Volunteer Roles:</strong> {volunteerRoles || "—"}</p>
        </div>
      </section>

      {socialMediaLinks.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-2">Social Media</h2>
          <ul className="list-disc list-inside text-lg space-y-1">
            {socialMediaLinks.map(({ label, value }) => (
              <li key={label}>
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {documentLinks.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentLinks.map(({ label, value }, index) => (
              <div key={index} className="border border-gray-300 rounded-xl overflow-hidden shadow-sm bg-gray-50 p-4">
                <h3 className="text-lg font-medium mb-2">{label}</h3>
                <div className="h-[400px] bg-white border rounded">
                  <iframe
                    src={`${value}#toolbar=0`}
                    title={label}
                    width="100%"
                    height="100%"
                    className="rounded"
                    onError={() => console.log("PDF failed to load.")}
                  />
                </div>
                <a href={value} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-600 underline text-sm">
                  Open in new tab
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="flex gap-4 justify-end mt-10">
        <button className="bg-yellow-400 hover:bg-blue-700 text-black px-6 py-3 rounded-lg shadow font-semibold">
          Apply (Auto application)
        </button>
        <Link to="/dashboard/vol" className="bg-black hover:bg-gray-300 text-white px-6 py-3 rounded-lg shadow font-semibold text-center">
          Cancel
        </Link>
      </footer>
    </div>
  );
};

export default NGOAssociate;
