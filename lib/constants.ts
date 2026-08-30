export const PROJECT_TYPES = [
  { value: 'highway', label: 'Highway' },
  { value: 'railway', label: 'Railway' },
  { value: 'irrigation', label: 'Irrigation' },
  { value: 'industrial', label: 'Industrial Corridor' },
  { value: 'urban', label: 'Urban Development' },
  { value: 'renewable', label: 'Renewable Energy' },
  { value: 'other', label: 'Other Infrastructure' },
];

export const PROJECT_STATUS = [
  { value: 'proposal', label: 'Proposal', color: 'bg-blue-100 text-blue-800' },
  { value: 'scrutiny', label: 'Under Scrutiny', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'land_acquisition', label: 'Land Acquisition', color: 'bg-purple-100 text-purple-800' },
  { value: 'possession', label: 'Possession', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'rr', label: 'R&R Implementation', color: 'bg-orange-100 text-orange-800' },
  { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800' },
];

export const ACQUISITION_STATUS = [
  { value: 'identified', label: 'Identified' },
  { value: 'surveyed', label: 'Surveyed' },
  { value: 'offered', label: 'Offered' },
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'agreed', label: 'Agreed' },
  { value: 'acquired', label: 'Acquired' },
  { value: 'possessed', label: 'Possessed' },
];

export const LAND_USE_TYPES = [
  { value: 'agricultural', label: 'Agricultural' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'forest', label: 'Forest' },
  { value: 'water_body', label: 'Water Body' },
];

export const DOCUMENT_TYPES = [
  { value: 'survey_report', label: 'Survey Report' },
  { value: 'land_deed', label: 'Land Deed' },
  { value: 'compensation_offer', label: 'Compensation Offer' },
  { value: 'rrplan', label: 'R&R Plan' },
  { value: 'possession_certificate', label: 'Possession Certificate' },
  { value: 'affidavit', label: 'Affidavit' },
  { value: 'authority_letter', label: 'Authority Letter' },
  { value: 'other', label: 'Other' },
];

export const WORKFLOW_STAGES = [
  { step: 1, name: 'Proposal', description: 'Project proposal submission' },
  { step: 2, name: 'Digital Scrutiny', description: 'Document verification and scrutiny' },
  { step: 3, name: 'Verification', description: 'Field verification and survey' },
  { step: 4, name: 'Approval', description: 'Project approval' },
  { step: 5, name: 'Land Acquisition', description: 'Land acquisition process' },
  { step: 6, name: 'Possession', description: 'Taking possession of land' },
  { step: 7, name: 'R&R', description: 'Rehabilitation & Resettlement' },
  { step: 8, name: 'Completed', description: 'Project completed' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
];
