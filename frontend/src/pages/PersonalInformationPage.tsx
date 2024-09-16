import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useParams } from 'react-router-dom';
import '../styles/PersonalInformation.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Header } from './Header';
import { Footer } from './Footer';
import { Footer2 } from './Footer2';
import { AxiosError } from 'axios';

const PersonalInformation: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [oldName, setOldName] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [oldUSername, setOldUsername] = useState<string>('');
  const [newUsername, setNewUsername] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [oldSurname, setOldSurname] = useState<string>('');
  const [newSurname, setNewSurname] = useState<string>('');
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const [fieldToUpdate, setFieldToUpdate] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [deleted, setDeleted] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`http://localhost:8080/api/users/accountInformation/${userId}`);
        const userData = response.data;
        setName(userData.name);
        setSurname(userData.surname);
        setUsername(userData.username);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          navigate('/login');
        } else {
          alert('Error fetching user data. Please try again.');
        }
      }
    };

    if (!deleted) {
      fetchData();
    }
  }, [userId, navigate, deleted]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get('scrollTo');
    if (scrollTo) {
      const targetSection = document.getElementById(scrollTo);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.search]);

  const handleScrollToSection = (sectionId: string) => {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      window.history.pushState(null, '', `?scrollTo=${sectionId}`);
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
      alert('User ID is not found.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete your account?');
    if (confirmDelete) {
      try {
        const password = prompt('Please enter your password to confirm deletion:');
        if (!password) {
          alert('Password is required to delete the account.');
          return;
        }
        setDeleted(true);
        await axios.delete(`http://localhost:8080/api/users/deleteAccount/${userId}`, {
          data: { password },
        });
        sessionStorage.removeItem('userId');
        console.log('User ID cleared from session storage');
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error deleting account:', axiosError);
        alert('Error deleting account. Please try again.');
      }
    }
  };

  const openConfirmationModal = (field: string) => {
    setFieldToUpdate(field);
    setConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setFieldToUpdate('');
    setConfirmationModal(false);
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (oldName === '' || oldName !== name || newName === '' || newName === oldName) {
      alert('Please enter your current name correctly and provide a different new name.');
      return;
    }
    openConfirmationModal('name');
  };

  const handleUpdateSurname = async (e: React.FormEvent) => {
    e.preventDefault();
    if (oldSurname === '') {
      alert('Please enter your current surname.');
      return;
    } else if (oldSurname !== surname) {
      alert('Your current surname does not match the provided surname.');
      return;
    } else if (newSurname === '' || newSurname === oldSurname) {
      alert('Please provide a different new surname.');
      return;
    }
    openConfirmationModal('surname');
  };

  const handleUpdateUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername === '' || oldUSername === '' || oldUSername !== username) {
      setUsernameError('Please enter your current username correctly and provide a new username.');
      return;
    }
    openConfirmationModal('username');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPassword === '') {
      window.alert('Please enter your old password.');
      return;
    } else if (newPassword === '') {
      window.alert('Please enter a new password.');
      return;
    } else if (newPassword.length < 6) {
      window.alert('Please enter a new password with at least 6 characters.');
      return;
    } else if (oldPassword === newPassword) {
      window.alert('New password is same as old password');
      return;
    }

    const confirmedNewPassword = window.prompt('Please confirm your new password:');

    if (confirmedNewPassword !== newPassword) {
      window.alert('Confirmed password does not match the new password. Please try again.');
      return;
    }

    openConfirmationModal('password');
  };

  const confirmUpdateField = async () => {
    try {
      switch (fieldToUpdate) {
        case 'name':
          if (newName === '' || newName === oldName) {
            setUsernameError('Please enter a new name.');
            return;
          }
          await axios.put(`http://localhost:8080/api/users/updateName/${userId}`, {
            name: newName,
            surname: oldSurname,
            username: oldUSername
          });
          setUsernameError('');
          setName(newName);
          setOldName('');
          setNewName('');
          break;

        case 'username':
          await axios.put(`http://localhost:8080/api/users/updateUsername/${userId}`, {
            name: newName,
            surname: oldSurname,
            username: newUsername
          });
          setUsernameError('');
          setUsername(newUsername);
          setOldUsername('');
          setNewUsername('');
          break;

        case 'password':
          await axios.put(`http://localhost:8080/api/users/changePassword/${userId}`, {
            currentPassword: oldPassword,
            newPassword: newPassword
          });
          setUsernameError('');
          setOldPassword('');
          setNewPassword('');
          break;

        case 'surname':
          if (newSurname === '' || newSurname === oldSurname) {
            setUsernameError('Please enter a new surname.');
            return;
          }
          await axios.put(`http://localhost:8080/api/users/updateSurname/${userId}`, {
            name: newName,
            surname: newSurname,
            username: oldUSername
          });
          setUsernameError('');
          setSurname(newSurname);
          setOldSurname('');
          setNewSurname('');
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(`Error updating ${fieldToUpdate}:`, error);
      setUsernameError(`Error updating ${fieldToUpdate}. Please try again.`);
    } finally {
      setConfirmationModal(false);
    }
  };

  return (
    <div className="personal-information">
      <Header bgColor='#f5f5f5'></Header>
      <div className='aboutYouDiv' style={{ paddingTop: '2em', textAlign: 'left', marginLeft: '2.1em', width: '88.5%', paddingBottom: '3em' }}>Personal Information
        <div className='buttonsi'>
          <div className='personalInformationDiv' onClick={() => handleScrollToSection('setName')}>Name</div>
          <div className='personalInformationDiv' onClick={() => handleScrollToSection('setSurname')}>Surname</div>
          <div className='personalInformationDiv' onClick={() => handleScrollToSection('setUsername')}>Username</div>
          <div className='personalInformationDiv' onClick={() => handleScrollToSection('setPassword')}>Password</div>
          <div className='personalInformationDiv' onClick={() => handleScrollToSection('deleteAccount')}>Delete Account</div>
        </div>
      </div>
      <div className='formDiv' style={{ marginLeft: '7em', marginBottom: '5em', marginTop: '2em', borderBottom: '1px solid #dee2e6', width: '88.5%' }}>
        <div className='aboutYouDiv' style={{ paddingTop: '0.5em', marginLeft: '-5em' }}>Change Name</div>
        <div className='formDiv2'>
          <div className="footer2-feedback">
            <form className="footer2-feedback-form" style={{ marginRight: '-5.7em' }}>
              <div className="input-pair">
                <div className="input-field" id='setName'>
                  <input
                    className='txt1'
                    type="text"
                    placeholder="Enter your current name"
                    value={oldName}
                    onChange={(e) => setOldName(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <input
                    className='txt1'
                    type="text"
                    placeholder="Enter your new name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="divni1"
                onClick={handleUpdateName} style={{ marginRight: '-5.7em' }}
              >
                Apply Changes
              </button>
            </form>
          </div>
        </div>
        {confirmationModal && (
          <div className="modal-overlay">
            <div className="modal">
              <p>{`Are you sure you want to apply changes to ${fieldToUpdate}?: `}</p>
              <button onClick={confirmUpdateField}>Yes</button>
              <button onClick={closeConfirmationModal}>No</button>
            </div>
          </div>
        )}
      </div>
      <div className='formDiv' style={{ paddingTop: '10em', marginLeft: '7em', borderBottom: '1px solid #dee2e6', width: '88.5%' }}>
        <div className='aboutYouDiv' style={{ paddingTop: '0.5em', marginLeft: '-3.4em' }}>Change Surname</div>
        <div className='formDiv2'>
          <div className="footer2-feedback">
            <form className="footer2-feedback-form" style={{ marginRight: '-5.7em' }}>
              <div className="input-pair">
                <div className="input-field" id='setSurname'>
                  <input
                    className='txt1'
                    type="text"
                    placeholder="Enter your current surname"
                    value={oldSurname}
                    onChange={(e) => setOldSurname(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <input
                    className='txt1'
                    type="text"
                    placeholder="Enter your new surname"
                    value={newSurname}
                    onChange={(e) => setNewSurname(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="divni1"
                onClick={handleUpdateSurname} style={{ marginRight: '-5.7em' }}
              >
                Apply Changes
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className='formDiv' style={{ paddingTop: '10em', marginLeft: '8em', borderBottom: '1px solid #dee2e6', width: '88.5%'}}>
        <div className='aboutYouDiv' style={{ paddingTop: '0.5em', marginLeft: '-3.2em' }}>Change Username</div>
        <div className='formDiv2'>
          <div className="footer2-feedback">
            <form className="footer2-feedback-form" style={{ marginRight: '-5.7em' }}>
              <div className="input-pair">
                <div className="input-field" id='setUsername'>
                  <input
                    className='txt1'
                    type="text"
                    placeholder="Enter your current username"
                    value={oldUSername}
                    onChange={(e) => setOldUsername(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <input
                    className='txt1'
                    type="text"
                    placeholder="Enter your new username"
                    value={newUsername}
                    onChange={(e) => {
                      setNewUsername(e.target.value);
                      setUsernameError('');
                    }}
                  />
                </div>
              </div>
              <p>
                <strong>{usernameError}</strong>
              </p>
              <button
                className="divni1"
                onClick={handleUpdateUsername} style={{ marginRight: '-5.7em' }}
              >
                Apply Changes
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className='formDiv' style={{ paddingTop: '10em', marginLeft: '8em' , borderBottom: '1px solid #dee2e6', width: '88.5%'}}>
        <div className='aboutYouDiv' style={{ paddingTop: '0.5em', marginLeft: '-3.5em' }}>Change Password</div>
        <div className='formDiv2'>
          <div className="footer2-feedback">
            <form className="footer2-feedback-form" style={{ marginRight: '-5.7em' }}>
              <div className="input-pair">
                <div className="input-field" id='setPassword'>
                  <input
                    className='txt2'
                    type="password"
                    placeholder="Enter your old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <input
                    className='txt2'
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="divni1"
                onClick={handleUpdatePassword} style={{ marginRight: '-5.7em' }}
              >
                Apply Changes
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className='formDiv' style={{ paddingTop: '10em', marginLeft: '-11.5em' }}>
        <div className='aboutYouDiv' style={{ paddingTop: '1em', marginLeft: '-2.2em' }}>Delete account</div>
        <div className='formDiv2'>
          <div className="footer2-feedback">
            <form className="footer2-feedback-form">
              <div className="input-pair">
                <div className="input-field">
                </div>
                <div className="input-field" id='deleteAccount'>
                </div>
              </div>
              <button className="divni1" onClick={handleDeleteAccount} style={{ marginRight: '1em', marginLeft: '-10em' }}>
                Delete Account
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer2 bgColor='#f5f5f5'></Footer2>
      <Footer bgColor='#f5f5f5'></Footer>
    </div>
  );
};

export default PersonalInformation;