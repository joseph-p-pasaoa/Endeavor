import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import FirstAndLastNameInputs from '../LoginSignup/FirstAndLastNameInputs';
import EmailPassword from '../LoginSignup/EmailPassword';
import ProfileTabs from './ProfileTabs';
import PasswordUpdate from './PasswordUpdate';
import FileUpload from './FileUpload';
import SignupVolunteerSubForm from '../LoginSignup/SignupVolunteerSubForm';


export default function VolunteerProfile(props) {
    const {
        loggedUser,
        email,
        password,
        firstName,
        lastName,
        newPassword,
        confirmPassword,
        company,
        title,
        volunteerSkills,
        skills,
        mentor,
        officeHours,
        techMockInterview,
        behavioralMockInterview,
        professionalSkillsCoach,
        hostSiteVisit,
        industrySpeaker,
        setFeedback,
        setFirstName,
        setLastName,
        setEmail,
        setCompany,
        setTitle,
        setVolunteerSkills,
        setMentor,
        setOfficeHours,
        setTechMockInterview,
        setBehavioralMockInterview,
        setProfessionalSkillsCoach,
        setHostSiteVisit,
        setIndustrySpeaker
    } = props;

    const [ bio, setBio ] = useState(loggedUser.v_bio);
    const [ linkedIn, setLinkedIn ] = useState(loggedUser.v_linkedin);
    const [ picFile, setPicFile ] = useState(null);

    const {pathname} = useLocation();
    const pathName = pathname.split('/');

    const loadFields = useCallback(() => {
            setFirstName(loggedUser.v_first_name);
            setLastName(loggedUser.v_last_name);
            setEmail(loggedUser.v_email);
            setCompany(loggedUser.company);
            setTitle(loggedUser.title);
            setMentor(loggedUser.mentoring);
            setOfficeHours(loggedUser.office_hours);
            setTechMockInterview(loggedUser.tech_mock_interview);
            setBehavioralMockInterview(loggedUser.behavioral_mock_interview);
            setProfessionalSkillsCoach(loggedUser.professional_skills_coach);
            setHostSiteVisit(loggedUser.hosting_site_visit);
            setIndustrySpeaker(loggedUser.industry_speaker);
        }, [
            loggedUser,
            setFirstName,
            setLastName,
            setEmail,
            setCompany,
            setTitle,
            setMentor,
            setOfficeHours,
            setTechMockInterview,
            setBehavioralMockInterview,
            setProfessionalSkillsCoach,
            setHostSiteVisit,
            setIndustrySpeaker
    ]);
    useEffect(loadFields, []);

    const getVolunteerSkills = () => {
        axios.get(`api/volunteers/skills/${loggedUser.v_id}`)
            .then(res => setVolunteerSkills(res.data.payload.skills_list))
            .catch(err => setFeedback(err))
        ;
    }
    useEffect(getVolunteerSkills, [loggedUser]);


    const handleUpdateInfo = async (e) => {
        e.preventDefault();

        try {
            if (email && password && firstName && lastName && company && title) {
                let profile = null;
                
                if (picFile) {
                    profile = new FormData();
                    profile.append('email', email);
                    profile.append('password', password);
                    profile.append('firstName', firstName);
                    profile.append('lastName', lastName);
                    profile.append('company', company);
                    profile.append('title', title);
                    profile.append('skills', volunteerSkills);
                    profile.append('bio', bio);
                    profile.append('linkedIn', linkedIn);
                    profile.append('mentor', mentor);
                    profile.append('officeHours', officeHours);
                    profile.append('techMockInterview', techMockInterview);
                    profile.append('behavioralMockInterview', behavioralMockInterview);
                    profile.append('professionalSkillsCoach', professionalSkillsCoach);
                    profile.append('hostSiteVisit', hostSiteVisit);
                    profile.append('industrySpeaker', industrySpeaker);
                    profile.append('picture', picFile);
                } else {
                    profile = {
                        email,
                        password,
                        firstName,
                        lastName,
                        company,
                        title,
                        skills: volunteerSkills,
                        bio,
                        linkedIn,
                        mentor,
                        officeHours,
                        techMockInterview,
                        behavioralMockInterview,
                        professionalSkillsCoach,
                        hostSiteVisit,
                        industrySpeaker,
                        picture: picFile
                    };
                }

                const { data } = await axios.put(`/api/auth/${loggedUser.v_id}`, profile);
                props.settleUser(data.payload);
                props.setPassword('');
                props.setFeedback({message: 'Profile updated successfully'});
            } else {
                props.setFeedback({message: 'email, password, first and last name, company, and title fields are required'});
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

                            <SignupVolunteerSubForm 
                                setFeedback={props.setFeedback} 
                                company={company}
                                setCompany={props.setCompany}
                                title={title}
                                setTitle={props.setTitle}
                                volunteerSkills={volunteerSkills}
                                setVolunteerSkills={props.setVolunteerSkills}
                                skills={skills}
                                mentor={mentor}
                                setMentor={props.setMentor}
                                officeHours={officeHours}
                                setOfficeHours={props.setOfficeHours}
                                techMockInterview={techMockInterview}
                                setTechMockInterview={props.setTechMockInterview}
                                behavioralMockInterview={behavioralMockInterview}
                                setBehavioralMockInterview={props.setBehavioralMockInterview}
                                professionalSkillsCoach={professionalSkillsCoach}
                                setProfessionalSkillsCoach={props.setProfessionalSkillsCoach}
                                hostSiteVisit={hostSiteVisit}
                                setHostSiteVisit={props.setHostSiteVisit}
                                industrySpeaker={industrySpeaker}
                                setIndustrySpeaker={props.setIndustrySpeaker}
                            />

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

                            <FileUpload imageLink={loggedUser.v_picture} setPicFile={setPicFile}/>

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