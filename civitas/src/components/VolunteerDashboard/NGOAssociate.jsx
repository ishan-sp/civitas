import React from "react";

const NGOAssociate = ({ ngo }) => {
  if (!ngo) return <div className="text-center text-yellow-400">No NGO selected</div>;

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
    <div className="bg-[#1a1a1a] text-yellow-100 p-8 rounded-xl max-w-6xl mx-auto shadow-lg border border-yellow-800">
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">{ngoName}</h1>
      <p className="text-yellow-300 italic mb-6">{missionStatement}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div className="space-y-2">
          <p><span className="font-semibold text-yellow-300">Registration #:</span> {registrationNumber}</p>
          <p><span className="font-semibold text-yellow-300">Regions:</span> {regionsOfOperation?.join(", ")}</p>
          <p><span className="font-semibold text-yellow-300">Website:</span> <a href={website} className="text-yellow-400 underline" target="_blank" rel="noopener noreferrer">{website}</a></p>
          <p><span className="font-semibold text-yellow-300">Type:</span> {typeOfNGO}</p>
          <p><span className="font-semibold text-yellow-300">Funding:</span> {fundingDetails}</p>
        </div>

        <div className="space-y-2">
          <p><span className="font-semibold text-yellow-300">Primary Contact:</span> {primaryContact} ({contactRole})</p>
          <p><span className="font-semibold text-yellow-300">Email:</span> {email}</p>
          <p><span className="font-semibold text-yellow-300">Phone:</span> {phone}</p>
          <p><span className="font-semibold text-yellow-300">Alternate Contact:</span> {alternateContact || "—"}</p>
          <p><span className="font-semibold text-yellow-300">Address:</span> {address}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-2">Programs & Impact</h2>
        <p><strong>Details:</strong> {programDetails}</p>
        <p className="mt-2"><strong>Description:</strong> {programDescription}</p>
        <p className="mt-2"><strong>Impact Metrics:</strong> {impactMetrics || "—"}</p>
        <p className="mt-2"><strong>Volunteers:</strong> {volunteerCount || "—"}</p>
        <p className="mt-2"><strong>Volunteer Roles:</strong> {volunteerRoles || "—"}</p>
      </div>

      {socialMediaLinks.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2">Social Media</h2>
          <ul className="list-disc pl-5">
            {socialMediaLinks.map(({ label, value }) => (
              <li key={label}>
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline">{label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {documentLinks.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentLinks.map(({ label, value }, index) => (
              <div key={index} className="bg-[#2a2a2a] border border-yellow-600 p-4 rounded-lg shadow-inner">
                <h3 className="text-lg font-medium mb-2 text-yellow-300">{label}</h3>
                <div className="h-[400px] bg-black">
                  <iframe
                    src={`${value}#toolbar=0`}
                    title={label}
                    width="100%"
                    height="100%"
                    className="rounded"
                    onError={() => console.log("PDF failed to load.")}
                  />
                </div>
                <a href={value} target="_blank" rel="noopener noreferrer" className="block mt-2 text-yellow-400 underline text-sm">Open in new tab</a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-end mt-10">
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded shadow-md font-semibold">
          Confirm Association
        </button>
        <button className="bg-[#333] hover:bg-[#444] text-yellow-200 px-6 py-2 rounded shadow-md font-semibold">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NGOAssociate;
