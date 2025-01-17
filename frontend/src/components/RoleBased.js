import api from '../api';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleBased = () => {
  const { email, role } = useSelector((state) => state.auth);
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      fetchUserRole();
    }
  }, [email]);

  useEffect(() => {
    if (role === 'user') {
      navigate('/roleuser');
    } else if (role === 'guest') {
      navigate('/guest');
    }
  }, [role, navigate]);  // Runs whenever role changes

  const fetchUserRole = async () => {
    try {
      const response = await api.get(`/role/${email}/`);
      const data = response.data;
      setDetails(data.details);
    } catch (error) {
      alert('Failed to fetch role');
    }
  };

  return (
    <div>
    </div>
  );
};

export default RoleBased;