// 西医智能诊疗 - 健康档案模块（复用TCM病人数据+独立西医记录）
let wmCurrentPatientId = localStorage.getItem('wm_current_patient') || '';

function getWmCurrentPatient() {
  if (wmCurrentPatientId) {
    const patients = typeof getTcmPatients==='function' ? getTcmPatients() : [];
    return patients.find(p => p.id === wmCurrentPatientId) || null;
  }
  return typeof getTcmCurrentPatient==='function' ? getTcmCurrentPatient() : null;
}

function setWmCurrentPatient(id) {
  wmCurrentPatientId = id;
  localStorage.setItem('wm_current_patient', id);
}

function getWmRecords(patientId) {
  return JSON.parse(localStorage.getItem('wm_records_' + patientId) || '[]');
}

function addWmRecord(patientId, record) {
  const records = getWmRecords(patientId);
  record.id = 'wr_' + Date.now().toString(36);
  record.date = record.date || new Date().toISOString().slice(0,10);
  records.unshift(record);
  localStorage.setItem('wm_records_' + patientId, JSON.stringify(records));
  return record;
}

function getWmPatientExt(patientId) {
  return JSON.parse(localStorage.getItem('wm_ext_' + patientId) || '{}');
}

function saveWmPatientExt(patientId, ext) {
  localStorage.setItem('wm_ext_' + patientId, JSON.stringify(ext));
}
