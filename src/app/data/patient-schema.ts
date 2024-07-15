export const patientDataTabs: {
  dataKey: string;
  displayValue: string;
}[] = [
  { dataKey: 'medicalHistory', displayValue: 'Medical History' },
  { dataKey: 'currentMedications', displayValue: 'Current Medications' },
  { dataKey: 'appointments', displayValue: 'Appointments' },
  { dataKey: 'prescriptions', displayValue: 'Prescriptions' },
  { dataKey: 'vitals', displayValue: 'Vitals' },
  { dataKey: 'insuranceInfo', displayValue: 'Insurance Information' },
  { dataKey: 'emergencyContacts', displayValue: 'Emergency Contacts' },
];

export const patientDataTranslation: {
  dataKey: string;
  displayValue: string;
}[] = [
  { dataKey: 'personalInfo', displayValue: 'Personal Information' },
  { dataKey: 'contactInfo', displayValue: 'Contact Information' },
  { dataKey: 'medicalHistory', displayValue: 'Medical History' },
  { dataKey: 'currentMedications', displayValue: 'Current Medications' },
  { dataKey: 'appointments', displayValue: 'Appointments' },
  { dataKey: 'prescriptions', displayValue: 'Prescriptions' },
  { dataKey: 'vitals', displayValue: 'Vitals' },
  { dataKey: 'insuranceInfo', displayValue: 'Insurance Information' },
  { dataKey: 'emergencyContacts', displayValue: 'Emergency Contacts' },
  { dataKey: 'firstName', displayValue: 'First Name' },
  { dataKey: 'lastName', displayValue: 'Last Name' },
  { dataKey: 'dob', displayValue: 'Date Of Birth' },
  { dataKey: 'gender', displayValue: 'Gender' },
  { dataKey: 'email', displayValue: 'Email' },
  { dataKey: 'phone', displayValue: 'Phone' },
  { dataKey: 'address', displayValue: 'Address' },
  { dataKey: 'profilePicture', displayValue: 'Profile Picture' },
  { dataKey: 'condition', displayValue: 'Condition' },
  { dataKey: 'diagnosisDate', displayValue: 'Diagnosis Date' },
  { dataKey: 'notes', displayValue: 'Notes' },
  { dataKey: 'name', displayValue: 'Name' },
  { dataKey: 'dosage', displayValue: 'Dosage' },
  { dataKey: 'frequency', displayValue: 'Frequency' },
  { dataKey: 'startDate', displayValue: 'Start Date' },
  { dataKey: 'date', displayValue: 'Date' },
  { dataKey: 'time', displayValue: 'Time' },
  { dataKey: 'doctor', displayValue: 'Doctor' },
  { dataKey: 'reason', displayValue: 'Reason' },
  { dataKey: 'medication', displayValue: 'Medication' },
  { dataKey: 'datePrescribed', displayValue: 'Date Prescribed' },
  { dataKey: 'prescribingDoctor', displayValue: 'Prescribing Doctor' },
  { dataKey: 'bloodPressure', displayValue: 'Blood Pressure' },
  { dataKey: 'heartRate', displayValue: 'Heart Rate' },
  { dataKey: 'temperature', displayValue: 'Temperature' },
  { dataKey: 'policyNumber', displayValue: 'Policy Number' },
  { dataKey: 'validUntil', displayValue: 'Valid Until' },
  { dataKey: 'relation', displayValue: 'Relation' },
];

export function getDisplayName(schemaKey: string): string {
  const schemaItem = patientDataTranslation.find(
    (item) => item.dataKey === schemaKey
  );
  return schemaItem ? schemaItem.displayValue : schemaKey;
}
