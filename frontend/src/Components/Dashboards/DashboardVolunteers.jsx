/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// import VolunteerPreviewCard from './VolunteerPreviewCard';
import EventPreviewCard from '../EventPreviewCard';
import EventsCard from '../EventCard';

const Dashboard = (props) => {
    const { setFeedback, loggedUser } = props;
    const [eventsList, setEventsList] = useState([]);
    const [showEvent, setShowEvent] = useState(false);
    const [showVolunteeredTime, setShowVolunteeredTime] = useState(0);
    const [showPastEvents, setShowPastEvents] = useState('')
    const [targetEvent, setTargetEvent] = useState({});
    const [reload, setReload] = useState(false);


    useEffect(() => {
        const getEvents = async () => {
            try {
                const { data } = await axios.get(`/api/events/upcoming/volunteer/${props.loggedUser.v_id}`);
                let first3 = [];
                for (let i = 0; i < 3; i++) {
                    if (data.payload[i]) {
                        first3.push(data.payload[i])
                    }
                }
                setEventsList(first3);
            } catch (err) {
                setFeedback(err)
            }
        }

        const getAllVolunteeredTime = async () => {
            try {
                const { data } = await axios.get(`/api/time/hours/${props.loggedUser.v_id}`);
                console.log(data.payload.sum)
                setShowVolunteeredTime(data.payload.sum)
                setShowPastEvents(0)
            } catch (err) {
                setFeedback(err)
            }
        }

        getEvents();
        getAllVolunteeredTime();
    }, [reload]);

    const displayEvent = (event) => {
        setTargetEvent(event);
        setShowEvent(true);
    }

    const hideEvent = () => {
        setTargetEvent({});
        setShowEvent(false);
    }



    return (
        <>
            <h3>Upcoming Events:</h3>
            {
                eventsList.map(event => <EventPreviewCard
                    key={event.event_id + event.event_end + event.event_start}
                    event={event}
                    displayEvent={displayEvent}
                    loggedUser={props.loggedUser}
                    setTargetEvent={setTargetEvent}
                />)
            }

            {
                showEvent
                    ? <div className='lightBox'>
                        <div className='text-right m-2'>
                            <button className='btn-sm btn-danger' onClick={hideEvent}>X</button>
                        </div>
                        <EventsCard
                            loggedUser={loggedUser}
                            event={targetEvent}
                            setFeedback={setFeedback}
                            reload={reload}
                            setReload={setReload}

                        />
                    </div>
                    : null
            }

            <h3>Personal Stats</h3>
            <p>
                You've got {showVolunteeredTime} volunteer hours!
            </p>

            {
                showPastEvents < 1
                    ? <p>You haven't participated in any events yet.</p>
                    : showPastEvents > 1
                        ? <p>So far, you've participated in {showPastEvents} events.</p>
                        : <p>So far, you've participated in {showPastEvents} event.</p>
            }
        </>
    
    )
}

export default Dashboard;