import api from '../api';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const RoleBased = () => {
  
  const { email, role } = useSelector((state) => state.auth);
  const [details, setDetails] = useState(null);
    const navigate = useNavigate();
  const navigateToFileUpload = () => {
    navigate('/fileupload');
  }
  useEffect(() => {
    if (email) fetchUserRole();
  }, [email]);

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
      <h2>Welcome, {role}!</h2>
      {role === 'user' && <div>
        <h5>Manager options</h5>
        
        <button onClick={navigateToFileUpload}>file upload</button>      
      </div>}
      {role === 'guest' && <div>Developer options</div>}
      {details && <p>{JSON.stringify(details)}</p>}
    </div>
  );
};
 
export default RoleBased;