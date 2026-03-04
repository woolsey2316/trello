import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthRedirect = () => {
  const navigate = useNavigate();
  const [userId] = useState<string | null>(() => localStorage.getItem('userId'));

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [navigate, userId]);

  return userId;
};

export default useAuthRedirect;
