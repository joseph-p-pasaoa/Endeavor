import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import FirstAndLastNameInputs from '../LoginSignup/FirstAndLastNameInputs';
import LoginInputs from '../LoginSignup/LoginInputs';
import ProfileTabs from './ProfileTabs';
import PasswordUpdate from './PasswordUpdate';
import FileUpload from './FileUpload';
import Spinner from '../Spinner';

export default function AdminProfile(props) {
    const {
        loggedUser,
        email,
        setEmail,
        password,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        newPassword,
        confirmPassword,
    } = props;

    const {pathname} = useLocation();
    const pathName = pathname.split('/');

    const [ picFile, setPicFile ] = useState(null);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        setFirstName(loggedUser.a_first_name);
        setLastName(loggedUser.a_last_name);
        setEmail(loggedUser.a_email);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedUser]);

    const handleUpdateInfo = async (e) => {
        e.preventDefault();

        try {
            if (email && password && firstName && lastName) {
                let profile = null;
                
                if (picFile) {
                    profile = new FormData();
                    profile.append('email', email);
                    profile.append('password', password);
                    profile.append('firstName', firstName);
                    profile.append('lastName', lastName);
                    profile.append('picture', picFile);
                } else {
                    profile = {
                        email,
                        password,
                        firstName,
                        lastName
                    }
                }

                setLoading(true);
                const { data } = await axios.put(`/api/auth/${loggedUser.a_id}`, profile);
                props.settleUser(data.payload);
                setLoading(false);
                props.setPassword('');
                props.setFeedback({message: 'Profile updated successfully'});
            } else {
                setLoading(false);
                props.setFeedback({message: 'All fields are required'});
            }

        } catch (err) {
            setLoading(false);
            props.setFeedback(err);
        }
    }

    if (loading) {
        return <Spinner/>
    }

    return (
        <>
            {
                pathName[2] && pathName[2].toLowerCase() === 'password' 
                ?   <>
                        <ProfileTabs profileTab='' passwordTab='active'/>
                        <form className='mt-4' onSubmit={props.handleUpdatePassword}>
                            <div className="g1InputCol col-12 col-sm-6 d-flex flex-column">
                                <PasswordUpdate
                                    password={password}
                                    setPassword={props.setPassword}
                                    newPassword={newPassword}
                                    setNewPassword={props.setNewPassword}
                                    confirmPassword={confirmPassword}
                                    setConfirmPassword={props.setConfirmPassword}
                                />
                                <button type='submit' className='btn btn-primary mt-3'>Update Password</button>
                            </div>
                        </form>
                    </>

                :   <>
                        <ProfileTabs profileTab='active' passwordTab=''/>
                        <form className='mt-4' onSubmit={handleUpdateInfo}>
                            <div className='col-11 d-flex justify-content-between mx-auto mb-3 px-1'>
                                <button type='submit' className='btn btn-primary'>Update Profile</button>
                                <button className='btn btn-danger' onClick={props.deleteAccount}>Delete Account</button>
                            </div>

                            <div className="row">
                                <div className="g1InputCol col-12 col-sm-6">
                                    <FirstAndLastNameInputs
                                        firstName={firstName}
                                        setFirstName={props.setFirstName}
                                        lastName={lastName}
                                        setLastName={props.setLastName}
                                    />
                                </div>

                                <div className="g1InputCol col-12 col-sm-6">
                                    <LoginInputs
                                        email={email}
                                        setEmail={props.setEmail}
                                        password={password}
                                        setPassword={props.setPassword}
                                        formType='login'
                                    />
                                </div>
                            </div>
                            
                            <hr className='my-4 w-25 mx-auto' />
                            <div className="row mt-4">
                                <FileUpload imageLink={loggedUser.a_picture} setPicFile={setPicFile} />
                            </div>

                        </form>
                    </>
            }

        </>
    )
}