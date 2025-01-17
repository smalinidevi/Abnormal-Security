import api from '../api';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FetchName = () => {
  const { email, role } = useSelector((state) => state.auth);
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      fetchUserRole();
    }
  }, [email]);
// Runs whenever role changes

  const fetchUserRole = async () => {
    try {
      const response = await api.get(`/fetch-name/${email}/`);
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

export default FetchName;