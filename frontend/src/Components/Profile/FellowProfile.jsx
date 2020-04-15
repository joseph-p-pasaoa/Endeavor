import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import FirstAndLastNameInputs from '../LoginSignup/FirstAndLastNameInputs';
import EmailPassword from '../LoginSignup/EmailPassword';
import ProfileTabs from './ProfileTabs';
import PasswordUpdate from './PasswordUpdate';
import FileUpload from './FileUpload';


export default function FellowProfile(props) {
    const {
        loggedUser,
        email,
        password,
        firstName,
        lastName,
        newPassword,
        cohortId,
        confirmPassword,
        setFirstName,
        setLastName,
        setEmail,
        setCohortId,
        setFeedback
    } = props;

    const [ wantMentor, setWantMentor ] = useState(loggedUser.want_mentor);
    const [ cohortsList, setCohortsList ] = useState([]);
    const [ bio, setBio ] = useState(loggedUser.f_bio);
    const [ linkedIn, setLinkedIn ] = useState(loggedUser.f_linkedin);
    const [ github, setGithub ] = useState(loggedUser.f_github);
    const [ picFile, setPicFile ] = useState(null);

    const {pathname} = useLocation();
    const pathName = pathname.split('/');

    const loadFields = useCallback(() => {
        setFirstName(loggedUser.f_first_name);
        setLastName(loggedUser.f_last_name);
        setEmail(loggedUser.f_email);
        setCohortId(loggedUser.cohort_id);
    }, [ setFirstName, setLastName, setEmail, setCohortId, loggedUser ]);
    useEffect(loadFields, []);

    const getCohortsList = useCallback(() => {
        axios.get(`api/cohorts`)
            .then(res => setCohortsList(res.data.payload))
            .catch(err => setFeedback(err))
        ;
    }, [setFeedback]);
    useEffect(getCohortsList, []);

    const handleUpdateInfo = async (e) => {
        e.preventDefault();

        try {
            if (email && password && firstName && lastName && cohortId) {
                let profile = null;
                
                if (picFile) {
                    profile = new FormData();
                    profile.append('email', email);
                    profile.append('password', password);
                    profile.append('firstName', firstName);
                    profile.append('lastName', lastName);
                    profile.append('cohortId', cohortId);
                    profile.append('bio', bio);
                    profile.append('linkedIn', linkedIn);
                    profile.append('github', github);
                    profile.append('mentor', wantMentor);
                    profile.append('picture', picFile);
                } else {
                    profile = {
                        email,
                        password,
                        firstName,
                        lastName,
                        cohortId,
                        bio,
                        linkedIn,
                        github,
                        mentor: wantMentor,
                        picture: picFile
                    }
                }

                const { data } = await axios.put(`/api/auth/${loggedUser.f_id}`, profile);
                props.settleUser(data.payload);
                props.setPassword('');
                props.setFeedback({message: 'Profile updated successfully'});

            } else {
                props.setFeedback({message: 'email, password, cohort, first and last name fields are required'});
            }

        } catch (err) {
            props.setFeedback(err);
        }
    }
    
    return (
        <>
            {
                pathName[2] && pathName[2].toLowerCase() === 'password' 
                ?   <>
                        <ProfileTabs profileTab='' passwordTab='active'/>
                        <form className='form-row mt-3' onSubmit={props.handleUpdatePassword}>
                            <PasswordUpdate 
                                password={password}
                                setPassword={props.setPassword}
                                newPassword={newPassword}
                                setNewPassword={props.setNewPassword}
                                confirmPassword={confirmPassword}
                                setConfirmPassword={props.setConfirmPassword}
                            />

                            <button type='submit' className='btn btn-primary'>Update</button>
                        </form>
                    </>

                :   <>
                        <ProfileTabs profileTab='active' passwordTab=''/>
                        <form className='form-row mt-3' onSubmit={handleUpdateInfo}>
                            <FirstAndLastNameInputs 
                                firstName={firstName}
                                setFirstName={props.setFirstName}
                                lastName={lastName}
                                setLastName={props.setLastName}
                            />

                            <EmailPassword 
                                email={email}
                                setEmail={props.setEmail}
                                password={password}
                                setPassword={props.setPassword}
                            />

                            <div className='col-sm-6'>
                                <select className='mb-2' onChange={e => props.setCohortId(e.target.value)} value={cohortId}>
                                    <option value={0}> -- Cohort --</option>
                                    {cohortsList.map(cohort => <option key={cohort.cohort_id+cohort.cohort} value={cohort.cohort_id}>{cohort.cohort}</option>)}
                                </select>
                            </div>

                            <div className='col-sm-6 row'>
                                <span className='col-9'>Do you want to have a mentor?</span>
                                <span className='col-3 px-1'>
                                    <label className='switch'>
                                        <input type='checkbox' checked={wantMentor} onChange={e => setWantMentor(e.target.checked)}/>
                                        <span className='slider round'></span>
                                    </label>
                                </span>
                            </div>

                            <div className='col-sm-12'>
                                <textarea 
                                    className='form-control mb-2' 
                                    placeholder='Enter bio' 
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                />
                            </div>

                            <div className='col-sm-6'>
                                <input 
                                    className='form-control mb-2' 
                                    type='text' 
                                    placeholder='LinkedIn link ' 
                                    value={linkedIn}
                                    onChange={e => setLinkedIn(e.target.value)}
                                />
                            </div>

                            <div className='col-sm-6'>
                                <input 
                                    className='form-control mb-2' 
                                    type='text' 
                                    placeholder='Github link ' 
                                    value={github}
                                    onChange={e => setGithub(e.target.value)}
                                />
                            </div>

                            <FileUpload imageLink={loggedUser.f_picture} setPicFile={setPicFile}/>

                            <div className='col-sm-6'>
                                <button type='submit' className='btn btn-primary mr-5'>Update</button>
                            </div>
                        </form>

                        <br />
                        <button className='btn btn-danger' onClick={props.deleteAccount}>Delete Account</button>
                    </>
            }

        </>
    )
}