const db = require('../config/db');

const getUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  const user = rows[0];
  if (user && user.role === 'doctor') {
    const [detailsRows] = await db.query('SELECT * FROM doctor_details WHERE user_id = ?', [id]);
    const details = detailsRows[0];
    if (details) {
      return {
        ...user,
        ...details,
        specialty: details.specialization,
        qualification: details.qualification,
        experience: details.experience_years,
        hospital: details.hospital_name,
        bio: details.bio,
        fee: details.consultation_fee,
        requirePaymentUpfront: details.require_payment_upfront === 1
      };
    }
  }
  return user;
};

const updateUser = async (id, data) => {
  const [currentUserRows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  const currentUser = currentUserRows[0];
  if (!currentUser) throw new Error('User not found');

  const name = data.name !== undefined ? data.name : currentUser.name;
  const age = data.age !== undefined ? data.age : currentUser.age;
  const blood_group = data.blood_group !== undefined ? data.blood_group : currentUser.blood_group;
  const emergency_contact = data.emergency_contact !== undefined ? data.emergency_contact : currentUser.emergency_contact;
  const avatar_url = data.avatar_url !== undefined ? data.avatar_url : (data.image !== undefined ? data.image : currentUser.avatar_url);

  await db.query(
    'UPDATE users SET name=?, age=?, blood_group=?, emergency_contact=?, avatar_url=? WHERE id=?',
    [name, age, blood_group, emergency_contact, avatar_url, id]
  );

  const role = data.role || currentUser.role;
  if (role === 'doctor') {
    const [existingRows] = await db.query('SELECT * FROM doctor_details WHERE user_id = ?', [id]);
    const existing = existingRows[0];

    const specialization = data.specialization !== undefined ? data.specialization : (data.specialty !== undefined ? data.specialty : (existing?.specialization || ''));
    const qualification = data.qualification !== undefined ? data.qualification : (existing?.qualification || '');
    const experience_years = data.experience_years !== undefined ? data.experience_years : (data.experience !== undefined ? data.experience : (existing?.experience_years || 0));
    const hospital_name = data.hospital_name !== undefined ? data.hospital_name : (data.hospital !== undefined ? data.hospital : (existing?.hospital_name || ''));
    const bio = data.bio !== undefined ? data.bio : (existing?.bio || '');
    const consultation_fee = data.consultation_fee !== undefined ? data.consultation_fee : (data.fee !== undefined ? data.fee : (existing?.consultation_fee || 850));
    
    let require_payment_upfront = 1;
    if (data.require_payment_upfront !== undefined) {
      require_payment_upfront = data.require_payment_upfront ? 1 : 0;
    } else if (data.requirePaymentUpfront !== undefined) {
      require_payment_upfront = data.requirePaymentUpfront ? 1 : 0;
    } else if (existing?.require_payment_upfront !== undefined) {
      require_payment_upfront = existing.require_payment_upfront;
    }

    if (existing) {
      await db.query(
        'UPDATE doctor_details SET specialization=?, qualification=?, experience_years=?, hospital_name=?, bio=?, consultation_fee=?, require_payment_upfront=? WHERE user_id=?',
        [specialization, qualification, experience_years, hospital_name, bio, consultation_fee, require_payment_upfront, id]
      );
    } else {
      await db.query(
        'INSERT INTO doctor_details (user_id, specialization, qualification, experience_years, hospital_name, bio, consultation_fee, require_payment_upfront) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, specialization, qualification, experience_years, hospital_name, bio, consultation_fee, require_payment_upfront]
      );
    }
  }
  return getUserById(id);
};

module.exports = { getUserById, updateUser };
