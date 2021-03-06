import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import Spinner from './Spinner';
import UIModule from './UIModule';
import EventCard from './EventCard';

export default function EventRender(props) {
    const { eventId } = useParams();
    const history = useHistory();

    const { loggedUser, setFeedback } = props;
    
    const [ singleEvent, setSingleEvent ] = useState({ volunteers_list: [] });
    const [ eventObj, setEventObj ] = useState({ volunteersList: [], acceptedVolunteers: []});

    const [ volunteersList, setVolunteersList ] = useState([]);
    const [ loggedVolunteerPartOfEvent, setLoggedVolunteerPartOfEvent ] = useState(false);
    const [ loggedVolunteerRequestAccepted, setLoggedVolunteerRequestAccepted ] = useState(false);
    const [ acceptedVolunteers, setAcceptedVolunteers] = useState([]);
    const [ reload, SetReload ] = useState(false);
    const [ loading, setLoading ] = useState(true);


    const getEvent = (id, isMounted) => {
        axios.get(`/api/events/event/${id}`)
            .then(response => {
                if (isMounted) {
                    setSingleEvent(response.data.payload);
                    setLoading(false);
                }
            })
            .catch (err => {
                if (isMounted && err.response && err.response.status === 404) {
                    history.push('/404');
                } else if (isMounted) {
                    setFeedback(err)
                }
            });
    }
    useEffect(() => {
        let isMounted = true;
        if (!isNaN(parseInt(eventId)) && parseInt(eventId).toString().length === eventId.length) {
            getEvent(eventId, isMounted);
        } else {
            history.push('/404');
        }

        // Cleanup
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId, reload]);
    

    const mapVolunteersList = () => {
        let found = false;
        let accepted = false;
        const accVolunteers = [];
        const volList = [];

        for (let volunteer of singleEvent.volunteers_list) {
            if (volunteer && volunteer.volunteerId) {
                volList.push(volunteer);
                if (loggedUser && loggedUser.v_id && loggedUser.v_id === volunteer.volunteerId) { 
                    found = true;
                    if (volunteer.confirmedToEvent) {
                        accepted = true
                    }
                }
                if (volunteer.confirmedToEvent) {
                    accVolunteers.push(volunteer.volunteerId);
                }
            }
        }
        volList.sort((a, b) => a.volunteerId - b.volunteerId);

        setLoggedVolunteerPartOfEvent(found);
        setLoggedVolunteerRequestAccepted(accepted);
        setAcceptedVolunteers(accVolunteers);
        setVolunteersList(volList);
    }
    useEffect(mapVolunteersList, [loggedUser, singleEvent]);


    useEffect(() => {
        const eventDataObj = Object.assign({}, singleEvent, {
            volunteersList,
            loggedVolunteerPartOfEvent,
            loggedVolunteerRequestAccepted,
            acceptedVolunteers
        });
        setEventObj(eventDataObj);
    }, [
        acceptedVolunteers,
        singleEvent,
        loggedVolunteerPartOfEvent,
        loggedVolunteerRequestAccepted,
        volunteersList
    ]);


    if (loading) {
        return <Spinner/>
    }

    return (
        <>
            <UIModule className='g1EventProfile nurseryCanvas' titleColor="" titleRegular=''>
                <div className='modal-header'>
                    <h4 className='font-weight-bold'>{eventObj.topic}</h4>
                </div>

                <EventCard
                    loggedUser={loggedUser}
                    event={eventObj}
                    setFeedback={setFeedback}
                    reloadParent={reload}
                    setReloadParent={SetReload}
                />
            </UIModule>
        </>
    )
}
